# FlagForge — Progress Log

Newest entries on top. Format and rules: see `CLAUDE.md` §5.

## 2026-10-30 — Landing page  (branch: feat/landing-page → dev)
- Done: public landing at `/` (`src/pages/LandingPage.tsx`, sections in `src/components/landing/`). Dashboard moved to `/app/*` (all links updated). Shared UI: `components/ui/{Button,Switch,Logo,icons}.tsx`; hooks `hooks/useInView.ts` (useInView, useScrollProgress).
- Design system: tokens in `src/index.css` `@theme` — canvas #f4f4f1, ink, muted, lime/ember/cobalt/rose/mint accents; font Geist + Geist Mono (Google Fonts in index.html); `display` utility for headlines (two-tone: ink line + `text-muted` line); `.reveal` scroll-in animation; reduced-motion respected.
- Reference: `claude_video_asset/` (gitignored) — "Pallet Ross" art-marketplace concept; patterns adapted: card fan hero, @tag bubbles, scroll-fill statement, bento, carousel, tilted pricing, lime marquee, avatar arc CTA.
- Decisions: no new npm deps (CSS + IntersectionObserver only). Visual QA via playwright-core + system Edge in scratchpad (not a project dep).
- Open: customer logos are fictional placeholders (LogoStrip.tsx); SDK snippet/package names, pricing and footer links (#) are placeholders; Docs link has no target yet. Next: redesign dashboard (`/app`) + login/register in the same design language.

## 2026-10-30 — Created `dev` + mock mode  (branch: dev)
- Done: `dev` branched from `main` and pushed. Mock backend in `src/services/mock/` (data.ts, handlers.ts), hooked in `api.ts` `request()`; `AuthContext` auto-signs in mock admin. `npm run dev:mock` + `.env.mock`.
- Decisions: mocks opt-in via `VITE_USE_MOCKS` so `npm run dev`/prod stay on the real API; mock chunk is absent from prod build. Scenarios `?mock=empty|error|slow`.
- Git policy updated: Claude may commit/push/merge on `dev` + feature branches; never touches `main`.
- Open (pre-existing lint): `AuthContext.tsx` exports `useAuth` hook alongside component (react-refresh rule) → move hook to own file; `FlagDetailPage.tsx:54` missing `fetchFlag` dep.
- Next: full layout redesign — design tokens in `@theme` + shared `src/components/ui/` first.

## 2026-10-30 — Added CLAUDE.md + progress log  (branch: main → moved to dev)
- Done: `CLAUDE.md` (git rules, role split, project map, UI standards, token/memory rules) and this file.
