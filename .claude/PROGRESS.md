# FlagForge — Progress Log

Newest entries on top. Format and rules: see `CLAUDE.md` §5.

## 2026-10-30 — Created `dev` + mock mode  (branch: dev)
- Done: `dev` branched from `main` and pushed. Mock backend in `src/services/mock/` (data.ts, handlers.ts), hooked in `api.ts` `request()`; `AuthContext` auto-signs in mock admin. `npm run dev:mock` + `.env.mock`.
- Decisions: mocks opt-in via `VITE_USE_MOCKS` so `npm run dev`/prod stay on the real API; mock chunk is absent from prod build. Scenarios `?mock=empty|error|slow`.
- Git policy updated: Claude may commit/push/merge on `dev` + feature branches; never touches `main`.
- Open (pre-existing lint): `AuthContext.tsx` exports `useAuth` hook alongside component (react-refresh rule) → move hook to own file; `FlagDetailPage.tsx:54` missing `fetchFlag` dep.
- Next: full layout redesign — design tokens in `@theme` + shared `src/components/ui/` first.

## 2026-10-30 — Added CLAUDE.md + progress log  (branch: main → moved to dev)
- Done: `CLAUDE.md` (git rules, role split, project map, UI standards, token/memory rules) and this file.
