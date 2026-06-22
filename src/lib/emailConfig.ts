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
  SERVICE_ID:  'service_psr3ozk',
  TEMPLATE_ID: 'template_2ww8rzu',
  PUBLIC_KEY:  'cR95UBD-JZtUbI8jy',
} as const

// Resume opens in new tab; user can Ctrl+P → Save as PDF
export const RESUME_URL = '/resume.html'
