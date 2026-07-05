/**
 * Build-time prerender entry — used exclusively by vite-prerender-plugin.
 * Called once during `npm run build` to produce the initial static HTML
 * that search crawlers and link-preview scrapers receive before React hydrates.
 *
 * This file is NOT part of the client bundle at runtime.
 * DO NOT import heavy client-only APIs (window, document, canvas, WebGL) at the
 * top level here — only what is safe to run in Node.js.
 */
import { renderToString } from 'react-dom/server'
import { StrictMode } from 'react'
import App from './App'

export async function prerender() {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  )

  return {
    html,
    head: {
      lang: 'en',
    },
  }
}
