# Module 07 — Data Fetching

## Purpose

Understand the only external API call in this project: the EmailJS integration in `Contact.tsx`, including how it's initialized, called, and how errors are handled.

---

## Why It Exists

A portfolio needs a contact form. Instead of building a backend server, this project uses [EmailJS](https://www.emailjs.com) — a client-side email service that lets you send emails directly from JavaScript using your email service provider (Gmail, Outlook, etc.). No backend, no server-side code, no API keys exposed to a database.

This is an elegant solution: the entire portfolio is a static site with no server infrastructure, yet it can send emails.

---

## Files Involved

| File | Role |
|---|---|
| [`src/lib/emailConfig.ts`](../src/lib/emailConfig.ts) | EmailJS credentials + resume URL |
| [`src/components/Contact.tsx`](../src/components/Contact.tsx) | Form UI + EmailJS API calls |
| [`package.json`](../package.json) | `@emailjs/browser` dependency |

---

## Dependency Map

```
Contact.tsx
  ├── import emailjs from '@emailjs/browser'    ← EmailJS SDK
  └── import { EMAILJS } from '../lib/emailConfig'
        ├── EMAILJS.SERVICE_ID   → identifies which email provider to use
        ├── EMAILJS.TEMPLATE_ID  → auto-reply template sent to the visitor
        ├── EMAILJS.NOTIFY_TEMPLATE_ID → notification template sent to Aryan
        └── EMAILJS.PUBLIC_KEY   → authenticates the request to EmailJS servers

emailjs.init() → runs at module evaluation (top-level in Contact.tsx)
emailjs.send() → called inside handleSubmit on form submission
```

---

## Runtime Execution Flow

### Phase 1: SDK Initialization (module load)

```tsx
// Contact.tsx — line 7 — executes when the module is imported
emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY })
```

This runs **once**, at module evaluation time, before any React rendering. It registers the public key with the EmailJS SDK so subsequent `send()` calls don't need to pass it again.

### Phase 2: Form Submission

```
User fills form and clicks "Send Message"
  └── <form onSubmit={handleSubmit}>
        └── e.preventDefault()     ← stops page reload
              └── if (!formRef.current) return   ← safety check
                    └── setStatus('sending')     ← UI: button shows "Sending…"
                          └── Extract form values from FormData:
                                const data = new FormData(formRef.current)
                                const params = {
                                  from_name:  data.get('from_name'),
                                  from_email: data.get('from_email'),
                                  title:      data.get('title'),
                                  message:    data.get('message'),
                                }
                                └── await Promise.all([
                                      emailjs.send(SERVICE_ID, TEMPLATE_ID, params),         // auto-reply to visitor
                                      emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, params),  // notification to Aryan
                                    ])
```

### Phase 3a: Success Path

```
Both emailjs.send() promises resolve
  └── setStatus('success')
        └── UI: button text → "Sent!", disabled
        └── <CheckCircle> message appears with animation
  └── setErrorMessage('')
  └── formRef.current.reset()   ← clears all form inputs
  └── setTimeout 5000ms → setStatus('idle')  ← resets back to normal
```

### Phase 3b: Error Path

```
Either emailjs.send() rejects
  └── catch(err)
        └── console.error('[EmailJS]', err)   ← log to console
        └── setStatus('error')
              └── UI: <AlertCircle> message appears: "Failed: [error text]"
        └── setErrorMessage(err?.text || err?.message || 'Unknown error occurred')
        └── setTimeout 5000ms → setStatus('idle'), setErrorMessage('')
```

---

## Data Flow

```
HTML Form Fields
  name="from_name"  → params.from_name  → EmailJS template variable {{from_name}}
  name="from_email" → params.from_email → EmailJS template variable {{from_email}}
  name="title"      → params.title      → EmailJS template variable {{title}}
  name="message"    → params.message    → EmailJS template variable {{message}}

EmailJS Templates:
  TEMPLATE_ID (template_2ww8rzu):
    → Sent TO: the visitor (auto-reply confirming receipt)
    → Uses {{from_email}} as recipient address

  NOTIFY_TEMPLATE_ID (template_qcz84mn):
    → Sent TO: Aryan's email
    → Contains full message contents so Aryan can respond
```

### Why Two Parallel Sends?

```tsx
await Promise.all([
  emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, params),        // auto-reply
  emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.NOTIFY_TEMPLATE_ID, params), // notification
])
```

`Promise.all` fires **both** sends simultaneously and waits for both to succeed. If either fails, the entire `catch` block runs.

Sequential `await` (one then the other) would be 2x slower. This is correct usage of `Promise.all` for independent parallel operations.

---

## Deep Code Walkthrough

### FormData vs. Controlled Components

The form uses **uncontrolled components** (no `useState` for each field value):

```tsx
// Uncontrolled — no onChange handlers, no state for field values
<input
  className="contact-input"
  type="text"
  name="from_name"        // ← name attribute is how FormData reads values
  placeholder="Your name"
  required
  disabled={status === 'sending'}
/>
```

Values are read using the `FormData` API at submit time:

```tsx
const data = new FormData(formRef.current)
const params = {
  from_name: data.get('from_name') as string,
  // ...
}
```

**Why uncontrolled?** No validation occurs mid-typing — only on submit. The form doesn't need to watch the values in real time. `formRef.current.reset()` clears all fields automatically without clearing state.

**The comment explains the race condition protection:**
```tsx
// Extract form values once to avoid DOM race between parallel sends
```

If `params` was built inside `emailjs.send()` callbacks instead of before `Promise.all`, theoretically the second send could be reading form data that the first send's success handler had already reset. Extracting to `params` first makes this safe.

### The EmailJS Public Key

```typescript
// emailConfig.ts
export const EMAILJS = {
  PUBLIC_KEY: 'cR95UBD-JZtUbI8jy',
  // ...
} as const
```

This key is in the source code and visible to anyone. This is **by design** — EmailJS public keys are intended to be public. They are not secrets. The security model works differently:
- EmailJS server validates requests against allowed origins (configured in EmailJS dashboard)
- The email service credentials (Gmail/Outlook password) are stored securely in EmailJS, not here
- The public key merely identifies your EmailJS account, similar to a Google Analytics ID

---

## Senior Engineer Perspective

**Client-side email services: the tradeoffs.** EmailJS is elegant but has limitations:
1. **Rate limiting** — free tier allows 200 emails/month. A viral portfolio could hit this.
2. **No server-side validation** — `required` fields prevent empty submissions in the browser, but someone can submit via fetch/curl and bypass them.
3. **Key visibility** — the public key and service/template IDs are visible in the bundle. Malicious actors could abuse them to spam the owner's email.
4. **No email persistence** — if EmailJS is down, the message is lost.

For a portfolio, these tradeoffs are acceptable. For a business contact form, you'd want a server-side API route with rate limiting.

**Alternative: a serverless function.** A Netlify Function or Vercel Edge Function could accept the form POST, validate server-side, then call the email provider. The EmailJS IDs would never be in the client bundle. But this requires server infrastructure — more complex.

**`formRef.current.reset()` vs. clearing state.** For uncontrolled components, `formRef.current.reset()` is the correct way to clear the form. If using controlled components (`useState` for each field), you'd `setName('')`, `setEmail('')`, etc. The uncontrolled approach is less code for this use case.

---

## Common Bugs

| Bug | Cause | Diagnosis |
|---|---|---|
| Form submits but no email received | Wrong template/service ID | Check `emailConfig.ts` against EmailJS dashboard |
| Form shows success but email not received | Wrong recipient config in EmailJS template | Check EmailJS template "To" field |
| "Failed: The service is not found" | `SERVICE_ID` is wrong | Verify in EmailJS account → Email Services |
| Contact form hangs in "sending" | Network issue, EmailJS API down | Check network tab for failed request |
| Auto-reply not sent | `TEMPLATE_ID` wrong or template not active | Check EmailJS account → Email Templates |
| Form fields not clearing after success | `formRef.current` is null | Ensure `ref={formRef}` is on `<form>` |

---

## Hands-On Exercises

1. **Read EmailJS docs:** Visit [emailjs.com/docs](https://www.emailjs.com/docs/). Find the `send` API signature. What parameters does it accept? Is the `params` object documented?
2. **Test the error state:** Open DevTools → Network. Block `api.emailjs.com` using the Network blocking feature. Submit the form. Does the error state appear? Does it auto-reset after 5 seconds?
3. **Inspect the network request:** Submit the contact form normally. In DevTools → Network, find the POST request to EmailJS. What headers does it send? What's in the request body?
4. **Add a honeypot field:** Anti-spam technique — add a hidden input field. If it's filled out (bots fill all fields), reject the submission. Where would you add this check? Before or after `setStatus('sending')`?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| `async`/`await` | `handleSubmit` is async |
| `Promise.all` | Two emails sent in parallel |
| `FormData` API | Reading uncontrolled form values |
| `try`/`catch` | Error handling for the API calls |
| Uncontrolled vs. controlled React inputs | The form uses `ref`, not `useState` per field |
