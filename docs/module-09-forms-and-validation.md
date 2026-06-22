# Module 09 — Forms & Validation

## Purpose

Understand the contact form's full mechanics: HTML5 native validation, uncontrolled inputs, EmailJS submission, and the status machine that drives the UI.

---

## Why It Exists

The contact form is the only interactive data-entry point in the portfolio. It converts visitor interest into a delivered email — the entire value of the form is the successful delivery of a message. Understanding how it handles valid input, invalid input, network failure, and success is essential to understanding the "business logic" of the contact flow.

---

## Files Involved

| File | Role |
|---|---|
| [`src/components/Contact.tsx`](../src/components/Contact.tsx) | The complete form — UI, validation, submission, feedback |
| [`src/lib/emailConfig.ts`](../src/lib/emailConfig.ts) | EmailJS configuration constants |
| [`src/index.css`](../src/index.css) | `.contact-input` styles (lines 290–304) |

---

## Dependency Map

```
Contact.tsx
  ├── <form ref={formRef} onSubmit={handleSubmit}>
  │     ├── <input name="from_name" required>     ← HTML5 validation
  │     ├── <input name="from_email" type="email" required>  ← browser validates email format
  │     ├── <input name="title" required>
  │     └── <textarea name="message" required>
  │
  ├── handleSubmit (async)
  │     ├── e.preventDefault()
  │     ├── setStatus('sending')
  │     ├── FormData → params object
  │     ├── Promise.all([emailjs.send × 2])
  │     ├── On success: setStatus('success'), form.reset()
  │     └── On error: setStatus('error'), setErrorMessage()
  │
  └── Status UI
        ├── 'idle': "Send Message" button enabled
        ├── 'sending': button disabled, text = "Sending…"
        ├── 'success': button disabled, text = "Sent!", <CheckCircle> shown
        └── 'error': <AlertCircle> shown with error text
```

---

## Runtime Execution Flow

### Validation Phase (browser-native, before JS runs)

```
User clicks "Send Message"
  └── Browser checks all `required` attributes:
        ├── from_name: if empty → browser tooltip "Please fill in this field"
        ├── from_email: if empty OR invalid email format → browser tooltip
        ├── title: if empty → browser tooltip
        └── message: if empty → browser tooltip

If ALL fields valid:
  └── Browser fires form's `submit` event
        └── React's `onSubmit={handleSubmit}` fires
```

No custom validation library is used. The browser handles:
- Required field checking (all inputs have `required`)
- Email format validation (`type="email"` on the email input)

### Submission Phase (JavaScript)

```tsx
// Contact.tsx — handleSubmit
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()               // stop browser default: page reload
  if (!formRef.current) return     // safety: ref must exist

  setStatus('sending')             // → button shows "Sending…", disabled

  // Read form values BEFORE any async operations
  const data = new FormData(formRef.current)
  const params = {
    from_name:  data.get('from_name')  as string,
    from_email: data.get('from_email') as string,
    title:      data.get('title')      as string,
    message:    data.get('message')    as string,
  }

  try {
    await Promise.all([
      emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, params),
      emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.NOTIFY_TEMPLATE_ID, params),
    ])
    setStatus('success')
    setErrorMessage('')
    formRef.current.reset()            // clear all fields
    setTimeout(() => setStatus('idle'), 5000)
  } catch (err: any) {
    console.error('[EmailJS]', err)
    setStatus('error')
    setErrorMessage(err?.text || err?.message || 'Unknown error occurred')
    setTimeout(() => {
      setStatus('idle')
      setErrorMessage('')
    }, 5000)
  }
}
```

---

## Data Flow

```
Form Fields (DOM, uncontrolled)
  └── User types into inputs
        └── No React state updated — DOM manages values
              └── User clicks submit → browser validates required fields
                    └── handleSubmit fires:
                          FormData reads current input values
                            └── params object created
                                  └── emailjs.send(params) × 2
                                        └── Success: form.reset() clears all inputs
                                        └── Error: errorMessage set from error object
```

### The `status` State Machine

```
States: 'idle' | 'sending' | 'success' | 'error'

Transitions:
  idle → sending: form submit, all fields valid
  sending → success: both emailjs.send() resolved
  sending → error: either emailjs.send() rejected
  success → idle: after 5000ms timeout
  error → idle: after 5000ms timeout

Invalid transitions (can't happen):
  idle → success (can't skip sending)
  idle → error (can't fail without trying)
  success → error (can't fail after success)
```

### The `CopyableLink` Sub-component

```tsx
// Contact.tsx — CopyableLink
function CopyableLink({ href, icon, label, copyable }: { 
  href: string
  icon: React.ReactNode
  label: string
  copyable: boolean 
}) {
  const [copied, setCopied] = useState(false)
  
  const copy = (e: React.MouseEvent) => {
    if (!copyable) return
    e.preventDefault()          // prevent navigating to href
    navigator.clipboard.writeText(label).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  
  return (
    <a href={href} onClick={copyable ? copy : undefined}>
      {copied ? 'Copied!' : label}
    </a>
  )
}
```

This component has its own local state (`copied`) and handles a micro-interaction: click to copy email, show "Copied!" for 2 seconds, revert. The email address uses `copyable: true` (click to copy), while GitHub and LinkedIn use `copyable: false` (normal link).

---

## Deep Code Walkthrough

### Uncontrolled vs. Controlled Inputs

```tsx
// CONTROLLED (not used here) — React owns the value
const [name, setName] = useState('')
<input value={name} onChange={e => setName(e.target.value)} />

// UNCONTROLLED (used in Contact.tsx) — DOM owns the value  
const formRef = useRef<HTMLFormElement>(null)
<form ref={formRef}>
  <input name="from_name" required />
</form>
// Values read at submit time via FormData
```

Uncontrolled is simpler for forms that don't need live validation (as you type). The tradeoff: you can't display a "character count" or real-time email format checker without controlled inputs.

### The `disabled` Attribute During Submission

```tsx
<input
  disabled={status === 'sending'}  // inputs disabled while sending
/>

<button
  disabled={status === 'sending' || status === 'success'}  // button disabled during + after
>
  {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent!' : 'Send Message'}
</button>
```

Disabling inputs during submission prevents the user from modifying data while the request is in flight. Disabling on `success` prevents double-submission.

### The `form.reset()` Call

```tsx
formRef.current.reset()
```

`HTMLFormElement.reset()` is a native browser API that resets all form fields to their initial state. For inputs with no `defaultValue`, this means empty. For inputs with `defaultValue`, it resets to that.

This is the cleanest way to clear an uncontrolled form. If inputs were controlled (React state), you'd need to `setState('')` for each field individually.

### Focus Styling via CSS

```css
/* index.css */
.contact-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--input-bg);
  border: 1.5px solid var(--input-border);
  border-radius: 10px;
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;       /* removes default browser focus ring */
  transition: border-color 0.18s;
}
.contact-input:focus { border-color: var(--text-muted); }  /* custom focus indicator */
```

`outline: none` removes the browser's default accessibility focus ring. This is acceptable only because a visible custom focus indicator (`border-color` change) replaces it. Removing `outline` without a replacement violates WCAG accessibility guidelines.

---

## Senior Engineer Perspective

**Native HTML5 validation is underrated.** Browser-native validation (`required`, `type="email"`, `minlength`, `maxlength`, `pattern`) is free, accessible, and works without JavaScript. The browser validates before the `submit` event fires, so your JavaScript never even sees invalid data. This codebase uses it correctly.

**The missing feature: loading state on inputs.** During submission (`status === 'sending'`), inputs are `disabled`. This is correct but the visual feedback is minimal. A spinner, progress indicator, or explicit "sending…" overlay would improve UX on slow connections.

**`err?.text || err?.message || 'Unknown error'`:** The optional chaining (`?.`) handles cases where `err` is not an object. EmailJS errors typically have a `text` property. Standard JavaScript `Error` objects have `message`. The fallback covers unknown error shapes. This is defensive programming.

**No Zod, no react-hook-form, no Yup.** This form is simple enough that a validation library adds no value. Four required fields, one email type check — the browser handles it. Adding a library for this would be over-engineering.

---

## Common Bugs

| Bug | Cause | Fix |
|---|---|---|
| Form submits empty | Browser validation bypassed (e.g., programmatic submit) | Add server-side validation |
| "Sending…" forever | Network error caught but `setStatus('idle')` timeout not hit | Check `catch` block fires correctly |
| Email field allows invalid formats | `type` attribute missing | Ensure `type="email"` on the email input |
| Form doesn't reset after success | `formRef.current` is null when `reset()` called | Check `ref={formRef}` is on `<form>` |
| `copied` never reverts to false | `setTimeout` cleared before it fires (component unmounts) | Add cleanup: `return () => clearTimeout(t)` |

---

## Hands-On Exercises

1. **Trigger each status:** Send the form with DevTools offline (simulate `error`), then online (`success`). Watch the button text change through all states.
2. **Add character count:** Convert the `message` textarea to a controlled input. Add a `useState('')` for the message. Display `{message.length}/500` below the textarea.
3. **Add a honeypot:** Add `<input name="hp" style={{display:'none'}} />`. In `handleSubmit`, check `data.get('hp')` — if not empty, it's a bot. `return` early without sending.
4. **Test clipboard copy:** Click the email address in the Contact section's right panel. Open DevTools → Application → Clipboard (or just paste somewhere). Verify `aryanf192811@gmail.com` was copied.

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTML `required`, `type="email"` | Native form validation |
| `FormData` API | Reading form field values at submit time |
| `useRef<HTMLFormElement>` | Reference to the form DOM element |
| `async/await` with `try/catch` | Async submission + error handling |
| Finite state machines | The `Status` type drives all UI feedback |
