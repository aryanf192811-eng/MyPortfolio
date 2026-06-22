# Module 15 — Deployment

## Purpose

Understand how this portfolio goes from source code to a live URL — the build process, what `dist/` contains, and where/how it can be deployed.

---

## Why It Exists

A portfolio that only runs locally is useless. Understanding deployment means understanding the full lifecycle: `npm run dev` → `npm run build` → deploy to CDN → live URL.

---

## Files Involved

| File | Deployment Role |
|---|---|
| [`vite.config.ts`](../vite.config.ts) | Build configuration — chunk splitting, output |
| [`package.json`](../package.json) | `build` and `preview` scripts |
| [`dist/`](../dist/) | Build output — what actually gets deployed |
| [`public/`](../public/) | Static assets copied verbatim to `dist/` |
| [`index.html`](../index.html) | Template for the output HTML |

---

## Runtime Execution Flow

### Build Process

```
npm run build
  └── tsc -b                          ← TypeScript type-check (fail fast on errors)
        └── Success → vite build
              ├── Processes index.html
              ├── Resolves all imports starting from src/main.tsx
              ├── Compiles TypeScript/JSX via esbuild (fast)
              ├── Processes index.css via Tailwind CSS plugin
              ├── Applies Rollup for bundling + tree-shaking
              ├── Applies manualChunks splitting (React, Motion, Three.js)
              ├── Minifies JavaScript + CSS
              ├── Generates content-hash filenames
              └── Copies public/ contents to dist/
```

### What `dist/` Contains

```
dist/
├── index.html                         ← HTML with injected script/link tags
├── favicon.png                        ← From public/
├── aryan_resume.pdf                   ← From public/
└── assets/
    ├── index-[hash].css               ← All CSS, minified
    ├── index-[hash].js                ← Application code
    ├── vendor-react-[hash].js         ← React + ReactDOM
    ├── vendor-motion-[hash].js        ← Framer Motion
    └── vendor-three-[hash].js         ← Three.js
```

The `[hash]` in filenames is a content hash (e.g., `index-B2a3f9c.js`). This enables **cache busting**: when the file changes, its hash changes, breaking the browser cache. Files that don't change keep their old hash and stay cached.

### Deployment Options

**Option 1: Netlify (Recommended)**
```
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: npm run build
4. Publish directory: dist
5. Auto-deploys on every push to main
```

Netlify handles: CDN distribution, HTTPS, preview deployments per branch, environment variables.

**Option 2: Vercel**
```
1. Push to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Vercel detects build command automatically
5. Auto-deploys on every push
```

**Option 3: GitHub Pages**
```
npm run build
# Copy dist/ contents to gh-pages branch
# OR use the gh-pages npm package
```

GitHub Pages limitation: no server-side redirects. For this SPA with no routing, this is fine.

**Option 4: Manual (any static host)**
```
npm run build
# Upload dist/ contents via FTP or rsync to any web server
```

Since `dist/` is purely static files, any web server (Nginx, Apache, S3, Cloudflare Pages) can serve it.

---

## Data Flow

```
Source (src/)
  → Build process strips TypeScript, compiles JSX, bundles, minifies
  → dist/ (pure HTML + CSS + JavaScript)
  → Uploaded to CDN edge nodes globally
  → Browser requests any URL → CDN serves from nearest edge
  → Browser parses HTML → requests chunk files → React boots
```

---

## Deep Code Walkthrough

### Content-Hash Filename Strategy

When you run `npm run build`:
```
First build:  index-B2a3f9c.js, vendor-react-f1a2b3c.js
Second build (after changing App.tsx): index-D4e5f6a.js, vendor-react-f1a2b3c.js (same!)
```

`vendor-react` hasn't changed, so it keeps its hash. The browser's cached version is still valid. Only `index` changed, so only that file gets re-downloaded. This is why chunking vendor libraries is a performance win.

### The SPA Serving Problem

This portfolio has **no server-side routing**, but there's still a potential issue with direct URL access. If a user visits `https://portfolio.com/#about`, the browser:
1. Requests `/` from the server
2. Server returns `index.html`
3. Browser boots React
4. Browser sees `#about` in the URL and scrolls to `#about`

This works correctly for hash-based navigation because `/#about` requests `/` from the server.

If the portfolio used React Router with paths like `/projects`, a direct visit to `/projects` would request that path from the server. A static file server would return 404 because there's no `/projects/index.html`. You'd need a redirect rule: `/* → /index.html`.

**Current portfolio: no redirect rules needed** because all navigation is hash-based.

### `vite preview` — Production Testing

```
npm run build && npm run preview
# → http://localhost:4173
```

`vite preview` serves `dist/` using a minimal HTTP server. It's closer to production than `npm run dev` (which serves source files with HMR). Use it to test:
- Bundle size in devtools Network tab
- Production-only behaviors
- That the build didn't break anything

### The `public/` Folder in Deployment

Files in `public/` are copied verbatim to `dist/`:
- `public/favicon.png` → `dist/favicon.png`
- `public/aryan_resume.pdf` → `dist/aryan_resume.pdf`

References in HTML:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

References in code:
```typescript
export const RESUME_URL = '/aryan_resume.pdf'  // absolute path from root
```

Both work because the CDN/server serves them from the root. This is different from `src/` assets (processed by Vite, given content-hash names) vs. `public/` assets (served as-is, referenced by their original path).

---

## Senior Engineer Perspective

**Static site deployment is the right choice here.** No servers to maintain, no runtime costs (most platforms have generous free tiers for static sites), auto-scaling (CDN handles traffic spikes), and global distribution (edge nodes near visitors). The only operational concern: updating the email service keys if they expire.

**The two-step build (`tsc -b && vite build`) prevents shipping broken TypeScript.** Many teams ship TypeScript errors to production because their build scripts don't run `tsc`. The `&&` operator ensures the TypeScript check gates the bundle step.

**Content-hash filenames enable aggressive caching.** Vendor chunks can be cached for 1 year with `Cache-Control: max-age=31536000, immutable`. When library versions update, the hash changes and old caches are automatically invalidated.

**Missing: a CI/CD pipeline.** There's no `.github/workflows/` directory — no automated testing, linting, or build verification on pull requests. For a solo portfolio this is fine, but adding a GitHub Actions workflow to run `npm run build` on every push would catch regressions early.

---

## Hands-On Exercises

1. **Build and inspect:** Run `npm run build`. List all files in `dist/assets/`. Which is largest? Use `npm run preview` to verify the build works.
2. **Simulate Netlify:** Install `netlify-cli`: `npm install -g netlify-cli`. Run `netlify dev` in the project root. Compare the experience to `npm run dev`.
3. **Add a GitHub Actions workflow:** Create `.github/workflows/build.yml`. On push to `main`, run `npm ci && npm run build`. This catches build failures before they reach production.
4. **Test cache behavior:** Build twice without changing any files. Compare the hash values in `dist/assets/` filenames. Are they the same? They should be — Vite's builds are deterministic.

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTTP caching (`Cache-Control`) | Why content hashes matter |
| CDN (Content Delivery Network) | How static files are distributed globally |
| SPA serving on static hosts | Why `/* → /index.html` redirects sometimes needed |
| `npm run build` output | What Rollup produces |
| `public/` vs `src/assets/` | Different processing by Vite |
