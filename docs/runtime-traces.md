# Runtime Traces

> Real execution traces through actual code paths in the `aryan-portfolio` codebase.

---

## Trace 01 — Initial Page Load

```
Browser requests http://localhost:5173/

1. Vite dev server responds with index.html
   └── Browser parses HTML
         ├── Fires Google Fonts request (non-blocking)
         └── Encounters <script type="module" src="/src/main.tsx">

2. Browser requests /src/main.tsx → Vite transforms TypeScript → serves ES module

3. main.tsx evaluates:
   ├── import './index.css'
   │     └── Vite injects <style> tag with compiled Tailwind CSS + custom properties
   │           → --bg, --text, --surface etc. now available
   ├── import App from './App.tsx'
   │     └── All component imports cascade:
   │           ThemeContext → Nav → NavLogo → Hero → HeroCanvas →
   │           Skills → TechIcon → Experience → Projects → ProjectVisuals →
   │           Contact → Footer → CursorEffect → CommandPalette → ScrollToTop
   │     └── Contact.tsx module evaluates:
   │           emailjs.init({ publicKey: 'cR95UBD-JZtUbI8jy' })  ← runs ONCE here
   └── createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

4. React renders App():
   └── ThemeProvider renders:
         ├── useState initializer runs:
         │     localStorage.getItem('portfolio-theme-manual') → 'true' or null
         │     if manual → use localStorage.getItem('portfolio-theme')
         │     else → getTimeBasedTheme() → hour >= 6 && < 18 ? 'light' : 'dark'
         │     → theme = 'dark' (current time: 23:07)
         └── Context.Provider wraps children

5. Browser paints first frame (dark theme, no animations yet)

6. useEffects fire (in order):
   ├── ThemeContext: classList.toggle('dark', true) on <html>
   ├── ThemeContext: auto-sync timer aligned to next minute
   ├── App > DynamicTitle: window.blur/focus listeners attached
   ├── CursorEffect: RAF loop started (tick())
   ├── CursorEffect: mousemove + link hover listeners attached
   ├── CommandPalette: keydown listener (Ctrl+K) attached
   ├── Nav: scroll listener attached (passive)
   ├── Hero > HeroCanvas: Three.js WebGL context created, particle RAF started
   ├── Hero > DeveloperIllustration: mousemove listener + avatar RAF started
   └── Hero > DeveloperIllustration: typewriter setTimeout scheduled
```

---

## Trace 02 — User Moves Mouse

```
mousemove event fires at (clientX: 800, clientY: 300)

CursorEffect.tsx:
  └── onMove fires:
        ├── setVisible(true) if first move
        ├── tx = 800, ty = 300
        └── dotRef.current.style.transform = 'translate(796px, 296px)'

Next RAF tick (CursorEffect):
  └── tick():
        ├── rx = lerp(rx, 800, 0.1)  → rx += (800 - rx) * 0.1
        ├── ry = lerp(ry, 300, 0.1)
        └── ringRef.current.style.transform = `translate(${rx-18}px, ${ry-18}px) scale(1)`

Hero DeveloperIllustration:
  └── handleMouse fires:
        ├── normX = (800/1440 - 0.5) * 2 = 0.111
        ├── normY = (300/900 - 0.5) * 2 = -0.333
        ├── targetHead.current.rot = 0.111 * 14 = 1.55
        └── targetPupil: { x: ..., y: ... } calculated from SVG coordinates

Next RAF tick (Hero avatar):
  └── tick():
        ├── currentHead.rot += (1.55 - currentHead.rot) * 0.08
        ├── setHeadState({ rot: 0.12, ty: -0.16 })  ← triggers re-render
        └── setPupil({ x: 0.08, y: -0.12 })

SVG re-renders:
  ├── headRotate = 'rotate(0.12, 180, 126)'
  └── LP = { x: 168.08, y: 79.88 }  ← pupils moved
```

---

## Trace 03 — Theme Toggle Click

```
User clicks Sun/Moon button in Nav

Nav.tsx button.onClick:
  └── toggle() from useTheme()
        └── ThemeContext.tsx toggle():
              ├── localStorage.setItem('portfolio-theme-manual', 'true')
              └── setTheme(t => t === 'dark' ? 'light' : 'dark')
                    → theme: 'dark' → 'light'

ThemeContext useEffect fires (theme dependency):
  ├── document.documentElement.classList.toggle('light', true)
  ├── document.documentElement.classList.toggle('dark', false)
  └── localStorage.setItem('portfolio-theme', 'light')

CSS cascade updates instantly:
  ├── --bg: #f7f7f7 (was #0a0a0a)
  ├── --text: #0a0a0a (was #ffffff)
  └── All var(--*) consumers repaint

React components re-render (useTheme subscribers):
  ├── Nav: isDark = false → renders Moon icon (was Sun)
  ├── CursorEffect: isDark = false → reruns effect, updates cursor colors
  └── HeroCanvas: isDark = false → reruns effect, tears down Three.js and rebuilds
        ├── cancelAnimationFrame(raf)
        ├── renderer.dispose()
        ├── el.removeChild(renderer.domElement)
        └── [effect body] creates new renderer with light particle colors:
              dotMat.color = 0x909090
              lineMat.color = 0xbbbbbb
```

---

## Trace 04 — Scroll Down to Skills Section

```
User scrolls to scrollY = 700

scroll event fires (passive, handled by Nav.tsx):
  └── onScroll():
        ├── setScrolled(700 > 30) → true (nav gets glass background + blur)
        └── setProgress((700 / (totalScrollHeight - viewportHeight)) * 100)
              → progress ≈ 14%

scroll event (ScrollToTop.tsx):
  └── onScroll():
        └── setVisible(700 > 500) → true
              → <motion.button> animates in (initial: y=16, animate: y=0)

Skills section enters viewport:
  IntersectionObserver fires for Skills ref:
    └── useInView hook: inView → true
          → observer.disconnect() (once:true)

Skills component re-renders:
  └── motion.div: animate = { opacity: 1, y: 0 } (was hidden at { opacity: 0, y: 16 })

Stagger animation starts:
  └── motion.div[variants=containerV]: switches to 'visible'
        └── staggerChildren: 0.055 → each skill card animates with 55ms offset
              Card 0: animates at t=0
              Card 1: animates at t=55ms
              Card 2: animates at t=110ms
              ...
              Card 9: animates at t=495ms
```

---

## Trace 05 — User Opens Command Palette

```
User presses Ctrl+K

CommandPalette.tsx keydown handler:
  └── onKey(e):
        ├── e.metaKey || e.ctrlKey = true, e.key = 'k' → match
        ├── e.preventDefault()  ← stops browser's default Ctrl+K action
        └── setOpen(p => !p)  → open: false → true

React re-renders CommandPalette:
  └── AnimatePresence detects open=true, mounts:
        ├── Backdrop div (opacity 0 → 1, blur 6px)
        └── Palette div (opacity 0, scale 0.96, y -12 → opacity 1, scale 1, y 0)

useEffect [open] fires:
  └── setTimeout(60ms):
        └── inputRef.current.focus()  ← keyboard moves to search input

Initial state:
  └── filtered = COMMANDS (all 9 commands, query is empty)
        ├── Group: Navigate (5 commands)
        └── Group: Actions (4 commands)
```

---

## Trace 06 — User Types in Command Palette

```
User types "bcart"

Input onChange event:
  └── setQuery('bcart')

useEffect [query] fires:
  └── setActive(0)  ← reset highlight to first result

filtered recomputes (inline, no memo):
  └── COMMANDS.filter(c => fuzzy('bcart', c.label + ' ' + c.description + ' ' + c.keywords))

For each command:
  ├── 'nav-about': fuzzy('bcart', 'About Who I am and what I build home hero intro')
  │     → 'about who...'.includes('bcart')? No
  │     → Sequential: b→c→a→r→t? No match
  │     → Result: false
  ├── 'nav-projects': fuzzy('bcart', 'Projects B-Cart, ExamForge, Traveloop bcart examforge traveloop erp')
  │     → 'projects b-cart, examforge...'.includes('bcart')? YES (keywords: 'bcart')
  │     → Result: true
  └── [other commands]: no match

filtered = [{ id: 'nav-projects', group: 'Navigate', label: 'Projects', ... }]
active = 0 (only one result)

Render: one result shown, highlighted
```

---

## Trace 07 — User Executes Command

```
User presses Enter (nav-projects is active)

onKeyDown (on the palette div):
  └── e.key === 'Enter' && filtered[0] exists
        └── run(filtered[0])  ← useCallback

run(cmd):
  ├── setFired('nav-projects')  ← item background becomes 'var(--border-2)'
  └── setTimeout(180ms):
        ├── cmd.action():
        │     └── document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
        │           → Browser starts smooth scroll to <section id="projects">
        └── close():
              ├── setOpen(false)  → AnimatePresence runs exit animation
              ├── setQuery('')
              ├── setActive(0)
              └── setFired(null)

Exit animation plays (AnimatePresence):
  ├── Backdrop: opacity 1 → 0
  └── Palette: opacity 1, scale 1, y 0 → opacity 0, scale 0.96, y -8

After animation: elements removed from DOM

Scroll animation completes:
  └── window.scrollY ≈ projects section top
        └── Nav scroll listener: setProgress(newValue)
```

---

## Trace 08 — Contact Form Submission (Success)

```
User fills form: name="Alice", email="alice@example.com", title="Job offer", message="Let's talk"
User clicks "Send Message"

form onSubmit fires:
  └── handleSubmit(e):
        ├── e.preventDefault()
        ├── formRef.current exists → continue
        ├── setStatus('sending')
        │     → UI: button disabled, text = "Sending…"
        │     → All inputs disabled
        ├── const data = new FormData(formRef.current)
        │     → { from_name: 'Alice', from_email: 'alice@example.com', ... }
        └── await Promise.all([
              emailjs.send('service_psr3ozk', 'template_2ww8rzu', params),    // auto-reply
              emailjs.send('service_psr3ozk', 'template_qcz84mn', params),    // notification
            ])

Both POST requests fire simultaneously to api.emailjs.com:
  └── Request headers: Content-Type: application/json
  └── Body: { service_id, template_id, user_id, template_params: { from_name, ... } }

Both resolve (HTTP 200):
  └── Promise.all resolves
        ├── setStatus('success')
        │     → UI: button text = "Sent!", disabled
        │     → <CheckCircle> "Message delivered!" appears with slide-in animation
        ├── setErrorMessage('')
        ├── formRef.current.reset()  → all fields cleared
        └── setTimeout(5000ms):
              └── setStatus('idle')  → UI returns to normal, message disappears
```

---

## Trace 09 — Contact Form Submission (Failure)

```
[Same as Trace 08 until Promise.all]

emailjs.send() → network error (offline)
  → Promise.all rejects

catch block:
  ├── console.error('[EmailJS]', err)  → DevTools console shows error object
  ├── setStatus('error')
  │     → UI: <AlertCircle> appears: "Failed: Network Error"
  ├── setErrorMessage('Network Error')  (from err.message)
  └── setTimeout(5000ms):
        ├── setStatus('idle')
        └── setErrorMessage('')
```

---

## Trace 10 — Email Copy Click

```
User clicks "aryanf192811@gmail.com" in Contact section right panel

CopyableLink component:
  └── onClick fires → copy(e):
        ├── copyable = true → continue
        ├── e.preventDefault()  ← prevents navigating to mailto: href
        └── navigator.clipboard.writeText('aryanf192811@gmail.com')
              └── Promise resolves (clipboard permission granted):
                    ├── setCopied(true)
                    │     → Link text changes to "Copied!"
                    │     → Color changes to #22c55e (green)
                    └── setTimeout(2000ms):
                          └── setCopied(false)  → "Copied!" reverts to email address
```

---

## Trace 11 — Project Card Hover (3D Tilt)

```
User moves mouse over B-Cart project card

ProjectVisual.tsx:
  └── onMouseMove(e):
        ├── el = cardRef.current (the card div)
        ├── r = el.getBoundingClientRect()
        ├── nx = ((e.clientX - r.left) / r.width - 0.5) * 2  → 0.4 (right side)
        ├── ny = ((e.clientY - r.top) / r.height - 0.5) * 2  → -0.2 (upper half)
        └── setTilt({ x: (-0.2) * -10, y: (0.4) * 10 })
              → tilt = { x: 2, y: 4 }

React re-renders ProjectVisual:
  └── div style:
        transform: perspective(900px) rotateX(2deg) rotateY(4deg)
        boxShadow: '0 20px 50px #3b82f622'

BCartVisual (inside card) also reacts:
  └── onMouseEnter fires on parent:
        └── setHovered(true)
              → Lines animate: strokeOpacity pulse + strokeDashoffset movement
              → Floating packet dots appear (animate along relationship lines)
              → Table glows pulse
```

---

## Trace 12 — Resume Download

```
User clicks "Download CV" button in Nav (desktop)

<a href="/aryan_resume.pdf" download="Aryan_Resume.pdf">

Browser behavior:
  └── Requests GET /aryan_resume.pdf
        └── Vite/CDN serves dist/aryan_resume.pdf (from public/)
              → Browser downloads file as "Aryan_Resume.pdf"
              → No JavaScript involved
```

---

## Trace 13 — Mobile Hamburger Menu

```
User on mobile (<768px) taps hamburger button

Nav.tsx hamburger button onClick:
  └── setMenuOpen(p => !p)  → menuOpen: false → true

AnimatePresence detects change:
  └── motion.div mounts with animation:
        initial: { opacity: 0, y: -8 }
        animate: { opacity: 1, y: 0 }
        transition: { duration: 0.2 }

Mobile dropdown renders:
  └── NAV_LINKS mapped to <a> tags with onClick={closeMenu}
  └── Download CV link

User taps "Projects":
  └── <a href="#projects" onClick={closeMenu}>
        ├── closeMenu() fires: setMenuOpen(false)
        │     → AnimatePresence: exit animation (opacity 0, y -8)
        │     → After animation: dropdown removed from DOM
        └── Browser scrolls to #projects (href="#projects")
```

---

## Trace 14 — NavLogo Blink Cycle

```
NavLogo.tsx mounts → schedule() runs:

setTimeout(2200 + random*2800 ms):
  └── setBlink(true)  → eyeRy = 0.35 (closed)
        → Both eye ellipses become rx=3, ry=0.35 (flat lines)
  └── setTimeout(130ms):
        └── setBlink(false)  → eyeRy = 3.2 (open)
              → Eyes return to normal
              └── schedule()  ← schedules next blink (2.2–5s from now)

Pupil tracking (concurrent with blink schedule):
  window.mousemove → onMove():
    ├── r = svgRef.current.getBoundingClientRect()
    ├── cx = r.left + r.width/2, cy = r.top + r.height/2
    ├── dx = e.clientX - cx
    ├── cap = 1.8, s = Math.min(cap, dist)/dist
    ├── setPx((dx * s / r.width) * 14)
    └── setPy((dy * s / r.height) * 14)

SVG renders:
  └── {!blink && <circle cx={12.5 + px*0.3} .../>}  ← pupils hidden during blink
```

---

## Trace 15 — HeroCanvas Three.js Frame

```
Three.js tick() function (called 60 times/second):

for each of 55 particles:
  ├── p = position, v = velocity
  ├── Mouse repulsion:
  │     dx = p.x - mx, dy = p.y - my
  │     d = sqrt(dx² + dy²)
  │     if d < 90: apply force toward away from mouse
  ├── Damping: v.multiplyScalar(0.97)  ← velocity decays 3% per frame
  ├── Move: p.add(v)
  └── Bounce: if out of bounds, reflect velocity

Update dot positions:
  └── posArr[i*3] = p.x, posArr[i*3+1] = p.y
  └── dotGeo.attributes.position.needsUpdate = true

Line detection (O(N²)):
  └── For all 1485 particle pairs:
        if distance < 130: add line vertices to la[]

Update line geometry:
  └── lineGeo.setAttribute('position', new THREE.BufferAttribute(la, 3))

WebGL render:
  └── renderer.render(scene, camera)  ← GPU draws to canvas
```

---

## Trace 16 — Principles Panel Interaction

```
User clicks principle "02 Workflow-Driven Design" in Experience section

PrinciplesPanel.tsx button onClick:
  └── setActive(1)  (was 0 for Schema-First)

React re-renders PrinciplesPanel:
  └── AnimatePresence mode="wait":
        ├── Old panel (principle 0) exits:
        │     motion.div exit: { opacity: 0, x: -12 }
        └── After exit completes, new panel (principle 1) enters:
              motion.div initial: { opacity: 0, x: 18 }
              animate: { opacity: 1, x: 0 }
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }

New panel content:
  ├── Tag: "State Machine" (color: #22c55e)
  ├── Icon: GitBranch (from lucide-react)
  ├── Title: "Workflow-Driven Design"
  ├── Description: "Business processes modelled as explicit, auditable state machines..."
  └── Watermark: "02" in huge faint text (bottom-right)
```

---

## Trace 17 — Page Tab Blur/Focus

```
User switches to another browser tab

window.blur fires:
  └── DynamicTitle (App.tsx):
        document.title = '👋 Come back — Aryan misses you!'

User switches back to portfolio tab

window.focus fires:
  └── DynamicTitle (App.tsx):
        document.title = 'Aryan — Backend Engineer'
```

---

*All traces derived from actual source code execution paths. No invented or generic descriptions.*
