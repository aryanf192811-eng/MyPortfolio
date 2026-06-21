/**
 * EmailJS configuration.
 * 1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
 * 2. Create an Email Service (Gmail, Outlook, etc.)
 * 3. Create an Email Template — use these variables:
 *    {{from_name}}, {{from_email}}, {{message}}, {{to_name}}
 * 4. Go to Account > API Keys to get your Public Key
 * 5. Replace the placeholder strings below with your real IDs.
 */
export const EMAILJS = {
  SERVICE_ID: 'YOUR_SERVICE_ID',
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
} as const

// Resume opens in new tab; user can Ctrl+P → Save as PDF
export const RESUME_URL = '/resume.html'
