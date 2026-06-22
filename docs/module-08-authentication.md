# Module 08 — Authentication

## Purpose

Understand why there is no authentication in this project, what that means architecturally, and where authentication would be needed if the project were extended.

---

## Why It Exists (As a Module)

Authentication is conspicuously absent. That's worth documenting: **the intentional absence of a feature is as much an architectural decision as its presence.**

A portfolio website is a public-read resource. There is nothing to protect. The owner (Aryan) is the only person who "writes" to it — by editing code and deploying.

---

## Files Involved

*None directly.* Authentication does not exist in this codebase.

However, these files are relevant to understanding the security boundary:

| File | Relevance |
|---|---|
| [`src/lib/emailConfig.ts`](../src/lib/emailConfig.ts) | Contains the only "credentials" — EmailJS public key |
| [`src/components/Contact.tsx`](../src/components/Contact.tsx) | The only user-controlled action (sending email) |
| [`public/aryan_resume.pdf`](../public/) | Only "private" resource — accessible to all |

---

## Security Boundary Analysis

### What Anyone Can Do
- Read all content (by design — public portfolio)
- Submit the contact form (send an email to Aryan)
- Download the resume PDF
- View the source code (JavaScript bundles in browser)
- See the EmailJS public key, service ID, and template IDs

### What No One Can Do
- Inject malicious content into the page (static HTML, no user-generated content rendered)
- Access a database (there is no database)
- Execute code server-side (there is no server)
- Access any private resources (there are none)

---

## Why Authentication Would Be Needed If...

### Scenario 1: Admin Dashboard for Content Updates

If Aryan wanted to update projects, experience, or skills through a UI (instead of editing code), he'd need:
- A login page
- A JWT or session cookie
- Protected API routes that validate the token before allowing writes
- A database to store content

### Scenario 2: Email Abuse Prevention

Currently, anyone can submit the contact form. To prevent spam:
- CAPTCHA (reCAPTCHA, hCaptcha) — adds a challenge that bots can't solve
- Rate limiting — reject more than N submissions per IP per hour (requires server)
- Server-side validation — a serverless function that validates before sending email

### Scenario 3: Client Portal

If the portfolio evolved into a service where clients log in to track project status, authentication would be required. This would likely use Supabase Auth (given Aryan's stack preference) or Firebase Authentication.

---

## The EmailJS "Authentication"

The only credential in the codebase is the EmailJS public key:

```typescript
// src/lib/emailConfig.ts
PUBLIC_KEY: 'cR95UBD-JZtUbI8jy',
```

This is **not** authentication in the traditional sense. It's more like a Google Analytics tracking ID — it identifies the account but is designed to be public. The actual email service credentials (the Gmail/Outlook password) are stored in EmailJS's servers and never exposed to the client.

The security model relies on:
1. **Domain restrictions** in the EmailJS dashboard (only your domain can use this key)
2. **EmailJS's server-side rate limiting**
3. **Template validation** (templates control what data can be sent and where)

---

## Senior Engineer Perspective

**Correct decision to omit authentication.** Adding authentication where it isn't needed introduces unnecessary complexity: session management, token refresh, protected routes, redirect logic, logout flows. For a public portfolio, this is all waste.

**The form abuse risk is real but acceptable.** A determined bad actor could spam the contact form by scripting POST requests to EmailJS. The blast radius: Aryan receives annoying emails. The free tier limit (200/month) would be hit faster. This is not a serious security concern for a personal portfolio.

**If this project grew:** The first authentication need would likely be a simple admin route for content management. The cleanest implementation would be Supabase Auth (matching the existing stack). For a personal project, even GitHub OAuth would be fine — "only my GitHub account can access /admin."

---

## Hands-On Exercises

1. **Try to abuse the form:** Write a script (fetch or curl) that submits the contact form without using the browser UI. Does it succeed? What does this tell you about form security?
2. **Plan an authentication feature:** Design (on paper) how you'd add a password-protected `/admin` page where Aryan can update the `PROJECTS` array without editing code. What would the tech stack look like? Database? Auth provider? API?
3. **Research EmailJS domain restrictions:** Log in to EmailJS. Find the domain restrictions setting. How do you limit the public key to only work from `yoursite.com`?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTTP cookies vs. JWT tokens | Foundation of web authentication |
| CORS (Cross-Origin Resource Sharing) | Relevant to EmailJS domain restrictions |
| The difference between authentication and authorization | Auth vs. Authz — conceptually important |
