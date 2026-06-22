# Dependency Graphs

> Visual representations of how files, components, data, APIs, and state relate to each other in the `aryan-portfolio` codebase.

---

## Component Graph

Full component tree with all render relationships.

```mermaid
graph TD
    HTML["index.html"] --> MAIN["main.tsx"]
    MAIN --> APP["App.tsx"]

    APP --> TP["ThemeProvider\nThemeContext.tsx"]
    APP --> DT["DynamicTitle\nApp.tsx (internal)"]
    APP --> CE["CursorEffect.tsx"]
    APP --> CP["CommandPalette.tsx"]
    APP --> NAV["Nav.tsx"]
    APP --> HERO["Hero.tsx"]
    APP --> SKILLS["Skills.tsx"]
    APP --> EXP["Experience.tsx"]
    APP --> PROJ["Projects.tsx"]
    APP --> CONT["Contact.tsx"]
    APP --> FOOT["Footer.tsx"]
    APP --> STT["ScrollToTop.tsx"]

    NAV --> NL["NavLogo.tsx"]

    HERO --> HC["HeroCanvas.tsx"]
    HERO --> DI["DeveloperIllustration\nHero.tsx (internal)"]

    SKILLS --> TI["TechIcon.tsx"]

    EXP --> AC["AchievementCard\nExperience.tsx (internal)"]
    EXP --> PP["PrinciplesPanel\nExperience.tsx (internal)"]

    PROJ --> PV["ProjectVisual\nProjects.tsx (internal)"]
    PROJ --> PC["ProjectCard\nProjects.tsx (internal)"]
    PROJ --> PVS["ProjectVisuals.tsx"]

    PVS --> BCV["BCartVisual"]
    PVS --> EFV["ExamForgeVisual"]
    PVS --> TLV["TraveloopVisual"]

    CONT --> CL["CopyableLink\nContact.tsx (internal)"]

    style TP fill:#2a1a4e,stroke:#a855f7,color:#fff
    style CE fill:#1a2a2a,stroke:#22c55e,color:#fff
    style CP fill:#1a1a2a,stroke:#3b82f6,color:#fff
    style HC fill:#2a1a1a,stroke:#ef4444,color:#fff
```

---

## Data Flow Graph

Where data originates and how it reaches the UI.

```mermaid
graph LR
    LS["localStorage\n(MANUAL_KEY, THEME_KEY)"] -->|read on init| TC["ThemeContext"]
    TIME["new Date().getHours()"] -->|getTimeBasedTheme()| TC

    TC -->|theme, isDark, toggle| NAV["Nav"]
    TC -->|isDark| HC["HeroCanvas"]
    TC -->|isDark| DI["DeveloperIllustration"]
    TC -->|isDark| CE["CursorEffect"]
    TC -->|isDark| NL["NavLogo"]

    NAV -->|toggle()| TC

    EC["emailConfig.ts\nEMAILJS, RESUME_URL"] -->|RESUME_URL| NAV
    EC -->|RESUME_URL| HERO["Hero"]
    EC -->|RESUME_URL| CP["CommandPalette"]
    EC -->|EMAILJS.*| CONT["Contact"]

    TC_D["TECH_COLORS\ntechColors.ts"] -->|getTechColor()| SKILLS["Skills"]
    TC_D -->|getTechColor()| PROJ["Projects"]

    PROJ_D["PROJECTS array\nProjects.tsx"] -->|props| PC["ProjectCard"]
    PC -->|project.stack| TC_D
    PC -->|project.title| VM["VISUAL_MAP"]
    VM -->|JSX| PVS["ProjectVisuals"]

    CMD["COMMANDS array\nCommandPalette.tsx"] -->|filtered| CPR["Palette results"]

    EMAILJS["EmailJS API\napi.emailjs.com"] -->|success/error| CONT
    CONT -->|setStatus| SUI["Status UI"]
```

---

## Feature Graph

Feature groupings and their file ownership.

```mermaid
graph TD
    subgraph NAVIGATION ["Navigation System"]
        NAV["Nav.tsx"]
        NL["NavLogo.tsx"]
        STT["ScrollToTop.tsx"]
        CP["CommandPalette.tsx"]
    end

    subgraph THEME ["Theme System"]
        TC["ThemeContext.tsx"]
        CSS["index.css\n(CSS custom properties)"]
    end

    subgraph HERO_F ["Hero Section"]
        HERO["Hero.tsx"]
        HC["HeroCanvas.tsx"]
        DI["DeveloperIllustration"]
    end

    subgraph CONTENT ["Content Sections"]
        SKILLS["Skills.tsx"]
        EXP["Experience.tsx"]
        PROJ["Projects.tsx"]
        PVS["ProjectVisuals.tsx"]
    end

    subgraph CONTACT_F ["Contact System"]
        CONT["Contact.tsx"]
        EC["emailConfig.ts"]
        EJS["@emailjs/browser"]
    end

    subgraph UTILITIES ["Utilities"]
        TI["TechIcon.tsx"]
        TC2["techColors.ts"]
        CE["CursorEffect.tsx"]
    end

    THEME --> NAVIGATION
    THEME --> HERO_F
    THEME --> UTILITIES
    EC --> NAVIGATION
    EC --> CONTACT_F
    TC2 --> CONTENT
```

---

## API Graph

All external API communications.

```mermaid
sequenceDiagram
    participant Browser
    participant EmailJS as EmailJS API<br/>(api.emailjs.com)
    participant Gmail as Gmail<br/>(via EmailJS)

    Note over Browser: Contact form submitted
    Browser->>EmailJS: POST /api/v1.1/email/send<br/>{ service_id, template_id: TEMPLATE_ID, params }
    Browser->>EmailJS: POST /api/v1.1/email/send<br/>{ service_id, template_id: NOTIFY_TEMPLATE_ID, params }
    Note over Browser,EmailJS: Both requests fire simultaneously<br/>(Promise.all)
    EmailJS->>Gmail: Send auto-reply to visitor
    EmailJS->>Gmail: Send notification to Aryan
    EmailJS-->>Browser: HTTP 200 { status: 200, text: 'OK' }
    EmailJS-->>Browser: HTTP 200
    Note over Browser: setStatus('success'), form.reset()

    alt Network Error
        EmailJS-->>Browser: Connection refused / timeout
        Note over Browser: setStatus('error')<br/>setTimeout 5s → setStatus('idle')
    end
```

**External Resources (no API — just linked)**

| Resource | URL Pattern | Used By |
|---|---|---|
| Google Fonts | `fonts.googleapis.com/css2?...` | `index.html` (link tag) |
| GitHub | `github.com/aryanf192811-eng/*` | Hero, Contact, Footer links |
| LinkedIn | `linkedin.com/in/ganpati-kumar-686a88358/` | Hero, Contact, Footer links |
| Resume PDF | `/aryan_resume.pdf` (self-hosted) | Nav, Hero, CommandPalette |

---

## State Graph

All state variables and their transitions.

```mermaid
stateDiagram-v2
    [*] --> idle : Contact form mounts

    state idle {
        [*] --> form_ready
        form_ready : Fields empty, button enabled
    }

    idle --> sending : form submit (all fields valid)

    state sending {
        [*] --> request_in_flight
        request_in_flight : Button disabled, "Sending…"
    }

    sending --> success : Promise.all resolves
    sending --> error : Promise.all rejects

    state success {
        [*] --> show_success
        show_success : "Sent!", CheckCircle shown, form cleared
    }

    state error {
        [*] --> show_error
        show_error : "Failed: [message]", AlertCircle shown
    }

    success --> idle : after 5000ms
    error --> idle : after 5000ms
```

```mermaid
stateDiagram-v2
    [*] --> dark_or_light : ThemeProvider init

    state init_decision {
        [*] --> check_manual
        check_manual --> use_saved : manual=true AND saved valid
        check_manual --> use_time : no manual preference
    }

    use_saved --> dark_or_light
    use_time --> dark_or_light

    state dark_or_light {
        dark : Dark theme (hour < 6 or >= 18)
        light : Light theme (hour 6-17)
    }

    dark --> light : toggle() OR auto-sync at 06:00
    light --> dark : toggle() OR auto-sync at 18:00

    note right of dark : classList: 'dark' on html\nCSS: --bg: #0a0a0a
    note right of light : classList: 'light' on html\nCSS: --bg: #f7f7f7
```

---

## Import Graph

Which files import which — the module dependency tree.

```mermaid
graph LR
    MAIN["main.tsx"] --> CSS["index.css"]
    MAIN --> APP["App.tsx"]

    APP --> TC["ThemeContext.tsx"]
    APP --> NAV["Nav.tsx"]
    APP --> HERO["Hero.tsx"]
    APP --> SKILLS["Skills.tsx"]
    APP --> EXP["Experience.tsx"]
    APP --> PROJ["Projects.tsx"]
    APP --> CONT["Contact.tsx"]
    APP --> FOOT["Footer.tsx"]
    APP --> CE["CursorEffect.tsx"]
    APP --> CP["CommandPalette.tsx"]
    APP --> STT["ScrollToTop.tsx"]

    NAV --> TC
    NAV --> EC["emailConfig.ts"]
    NAV --> NL["NavLogo.tsx"]

    HERO --> TC
    HERO --> EC
    HERO --> HC["HeroCanvas.tsx"]

    HC --> TC
    HC --> THREE["three"]

    SKILLS --> TC_LIB["techColors.ts"]
    SKILLS --> TI["TechIcon.tsx"]

    PROJ --> TC_LIB
    PROJ --> PVS["ProjectVisuals.tsx"]

    CONT --> EC
    CONT --> EMAILJS["@emailjs/browser"]

    CE --> TC
    CP --> EC

    style THREE fill:#ef4444,stroke:#ef4444,color:#fff
    style EMAILJS fill:#f59e0b,stroke:#f59e0b,color:#000
```

---

## Reactive Update Graph

When X changes, which components re-render?

```mermaid
graph TD
    TG["toggle() called"] --> THEME["theme state\nThemeContext"]
    THEME --> NAV_R["Nav re-renders\n(isDark → icon change)"]
    THEME --> CE_R["CursorEffect re-renders\n(isDark → cursor colors)"]
    THEME --> HC_R["HeroCanvas re-runs effect\n(isDark → Three.js rebuild)"]
    THEME --> HERO_R["DeveloperIllustration re-renders\n(isDark → SVG colors)"]

    SCROLL["window.scroll"] --> NAV_S["Nav re-renders\n(scrolled, progress)"]
    SCROLL --> STT_S["ScrollToTop re-renders\n(visible)"]

    MM["window.mousemove"] --> CRAF["CursorEffect RAF\n(direct DOM, no re-render)"]
    MM --> HRAF["Hero RAF\n(setHeadState, setPupil)"]
    MM --> HC_MM["HeroCanvas RAF\n(Three.js particles)"]
    MM --> NL_MM["NavLogo\n(setPx, setPy)"]

    INV["IntersectionObserver fires"] --> INVIEW["useInView → true"]
    INVIEW --> SECT_R["Section component re-renders\n(animation starts)"]
```

---

## CSS Token Graph

How the design system's CSS custom properties flow from `:root` to components.

```mermaid
graph TD
    ROOT[":root (dark) / html.light"] -->|--bg| BG["body background\n<section> backgrounds"]
    ROOT -->|--surface| SURF["Card backgrounds\nNav background (glass)\nCommandPalette bg"]
    ROOT -->|--surface-2| SURF2["Hover backgrounds\nCode blocks"]
    ROOT -->|--border| BORD["Card borders\nSection separators"]
    ROOT -->|--border-2| BORD2["Subtle borders\nCTA button borders"]
    ROOT -->|--text| TEXT["Primary text\nHeadings\nButton text (inverted)"]
    ROOT -->|--text-muted| MUTED["Body text\nNav links\nSubtitles"]
    ROOT -->|--text-faint| FAINT["Labels\nCaption text\nMono labels"]
    ROOT -->|--nav-bg| NAV_CSS["Nav glassmorphism\n(rgba + blur)"]
    ROOT -->|--input-bg & --input-border| INPUT["Contact form inputs"]
    ROOT -->|--tag-bg & --tag-text| TAGS[".tech-tag pills"]
    ROOT -->|--card-hover-bg & fg| HOVER["Skill card hover\n(inverts bg/text)"]
```

---

*All graphs derived from actual file import statements, state variables, and CSS declarations.*
