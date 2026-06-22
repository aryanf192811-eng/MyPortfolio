# Module 14 — Configuration

## Purpose

Understand every configuration file in the project — Vite, TypeScript, and package.json — what each option means, and why it's set the way it is.

---

## Why It Exists

Configuration files are the scaffolding of a project. Misconfiguring TypeScript's `moduleResolution`, forgetting a Vite plugin, or using the wrong `target` in tsconfig can cause hours of debugging. Understanding configuration means understanding why the project builds and runs.

---

## Files Involved

| File | Purpose |
|---|---|
| [`vite.config.ts`](../vite.config.ts) | Build tool + dev server configuration |
| [`tsconfig.json`](../tsconfig.json) | TypeScript project references |
| [`tsconfig.app.json`](../tsconfig.app.json) | App source TypeScript config |
| [`tsconfig.node.json`](../tsconfig.node.json) | Node.js (Vite config) TypeScript config |
| [`package.json`](../package.json) | Dependencies + npm scripts |
| [`src/vite-env.d.ts`](../src/vite-env.d.ts) | Vite-specific TypeScript types |

---

## Dependency Map

```
vite.config.ts
  ├── @vitejs/plugin-react      → JSX transform, HMR, React Refresh
  └── @tailwindcss/vite         → Tailwind CSS compilation (v4 plugin mode)

tsconfig.json (project references)
  ├── tsconfig.app.json          → for src/** files
  └── tsconfig.node.json         → for vite.config.ts

package.json
  ├── dependencies (runtime)
  │     ├── react@19, react-dom@19
  │     ├── framer-motion@12
  │     ├── three@0.175
  │     ├── react-type-animation@3
  │     ├── lucide-react@0.511
  │     └── @emailjs/browser@4
  └── devDependencies (build only)
        ├── @vitejs/plugin-react@4.5
        ├── @tailwindcss/vite@4.1
        ├── tailwindcss@4.1
        ├── typescript@5.8
        ├── @types/react@19, @types/react-dom@19
        ├── @types/three@0.175
        └── vite@6.3
```

---

## Deep Code Walkthrough

### `vite.config.ts` — Full Explanation

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),  // Tailwind CSS v4 — processes @import "tailwindcss" in index.css
    react(),        // React: JSX transform, HMR, Fast Refresh
  ],
  build: {
    chunkSizeWarningLimit: 800,  // warn if any chunk exceeds 800KB (default: 500KB)
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three':  ['three'],
        },
      },
    },
  },
})
```

**`plugins` order matters:** `tailwindcss()` before `react()` ensures CSS is processed before React's JSX transform. Reversing would cause issues with CSS module resolution.

**`@tailwindcss/vite` vs. PostCSS:** Tailwind v4 supports a Vite plugin mode (faster than PostCSS in Vite builds). The `@import "tailwindcss"` directive in `index.css` is the v4 way of enabling Tailwind — no `tailwind.config.js` needed.

**`chunkSizeWarningLimit: 800`:** Three.js (~1MB unminified, ~350KB gzipped) would trigger Vite's default 500KB warning. Raising to 800KB suppresses false-positive warnings for a known-large vendor.

**No `base` config:** The app is served from the root `/`. If deploying to a subdirectory (e.g., `https://example.com/portfolio/`), you'd add `base: '/portfolio/'`.

**No `server` config:** Defaults to `http://localhost:5173`. No proxy needed (no API to proxy).

### `tsconfig.app.json` — Full Explanation

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsFiles": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true
  },
  "include": ["src"]
}
```

**Key options explained:**

| Option | Value | Meaning |
|---|---|---|
| `target` | `ES2020` | Output JavaScript uses ES2020 syntax (supported by all modern browsers) |
| `lib` | `["ES2020", "DOM", "DOM.Iterable"]` | TypeScript knows about browser APIs (`window`, `document`, etc.) |
| `module` | `ESNext` | TypeScript emits ES modules (`import`/`export`) |
| `moduleResolution` | `bundler` | Matches Vite's resolver — allows importing `.tsx` files without extension |
| `allowImportingTsFiles` | `true` | Allow importing `.ts`/`.tsx` files (required when `moduleResolution: bundler`) |
| `isolatedModules` | `true` | Each file is compiled independently (enables faster builds with esbuild) |
| `noEmit` | `true` | TypeScript only type-checks — Vite/esbuild handles the actual compilation |
| `jsx` | `react-jsx` | Uses React 17+ automatic JSX transform — no `import React` needed in files |
| `strict` | `true` | Enables all strict checks: `strictNullChecks`, `noImplicitAny`, etc. |
| `noUnusedLocals` | `true` | Error on unused variables |
| `noUnusedParameters` | `true` | Error on unused function parameters |

**`moduleDetection: "force"`:** Forces TypeScript to treat all `.ts` files as modules (even if they have no imports/exports). Prevents global-scope pollution.

**`skipLibCheck: true`:** Skips type checking of `.d.ts` files in `node_modules`. This speeds up compilation significantly. The risk: bugs in type definitions of libraries won't be caught. Acceptable for application code.

### `package.json` Scripts

```json
{
  "scripts": {
    "dev":     "vite",             // start dev server at localhost:5173
    "build":   "tsc -b && vite build",  // typecheck THEN bundle
    "lint":    "eslint .",         // run ESLint
    "preview": "vite preview"      // serve the built dist/ folder
  }
}
```

**`build: "tsc -b && vite build"`** — The `&&` means: run `tsc -b` first, and only if it succeeds (exit code 0), run `vite build`. This means a TypeScript error will **fail the build**, preventing deployment of broken code.

`tsc -b` = TypeScript project build mode (processes `tsconfig.json` project references).

**`preview`** — After building, `vite preview` serves `dist/` at `http://localhost:4173`. Used to test the production build locally before deploying.

### `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```

This single line imports Vite's client-side type definitions:
- `import.meta.env` types (`VITE_*` environment variables, `MODE`, `DEV`, `PROD`)
- `import.meta.hot` types (Hot Module Replacement API)
- Asset import types (`import logoUrl from './logo.svg'` → `string`)

Without this, TypeScript would error on `import.meta.env` usage.

### `package.json` — Module Type

```json
{ "type": "module" }
```

This tells Node.js to treat `.js` files as ES modules by default. This is required for Vite, which is itself an ES module. Without it, `import` statements in `vite.config.ts` would fail when loaded by Node.

---

## Senior Engineer Perspective

**TypeScript strict mode is non-negotiable.** `"strict": true` enables `strictNullChecks` (no implicit null/undefined), `noImplicitAny`, `strictFunctionTypes`, and more. Writing strict TypeScript eliminates entire categories of runtime bugs. The cost: more explicit type annotations required.

**`noEmit: true` is the right approach for Vite projects.** TypeScript's type checker and Vite's bundler are separate tools doing separate jobs. TypeScript type-checks; esbuild compiles. Having TypeScript also emit JavaScript would be redundant and slower.

**The `tsc -b && vite build` two-step.** Many projects skip `tsc -b` in their build script and let TypeScript errors through to production. The `&&` ensures TypeScript errors fail the build. This is correct engineering discipline.

**Missing: ESLint config.** `package.json` has a `lint` script but no ESLint configuration file (`.eslintrc` or `eslint.config.js`) is visible in the root. This is unusual — likely generated by Vite's scaffold and is present but wasn't listed in the directory.

---

## Hands-On Exercises

1. **Break the build intentionally:** Add a TypeScript error: `const x: number = 'hello'` anywhere in `App.tsx`. Run `npm run build`. Does it fail before `vite build` runs? What's the exit code?
2. **Understand the module system:** Remove `"type": "module"` from `package.json`. Run `npm run dev`. What error do you get? Add it back.
3. **Add an environment variable:** Add `VITE_CONTACT_EMAIL=aryanf192811@gmail.com` to a `.env` file. Access it in `emailConfig.ts` as `import.meta.env.VITE_CONTACT_EMAIL`. TypeScript will know the type from `vite-env.d.ts`.
4. **Change the chunk limit:** In `vite.config.ts`, lower `chunkSizeWarningLimit` to `50`. Run `npm run build`. How many chunks exceed 50KB? What does this tell you about bundle composition?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| ES modules vs. CommonJS | `"type": "module"` in package.json |
| TypeScript compiler options | Understanding each option in tsconfig |
| Rollup (Vite's bundler) | `manualChunks` is a Rollup concept |
| npm scripts | How `npm run dev/build/lint/preview` work |
| Vite plugins | How Tailwind and React integrate |
