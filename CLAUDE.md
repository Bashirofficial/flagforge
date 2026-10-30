# FlagForge — Claude Instructions

FlagForge is a feature-flag management app. **This repo is the frontend only.**
Claude's job: build and improve the frontend UI. For the backend, Claude only **advises** when asked.

---

## 1. Git Rules — NON-NEGOTIABLE

**`main` is the user's branch. `dev` (and feature branches off it) is Claude's working area.**

**Always allowed (read-only, any branch):**
`git status`, `git diff`, `git log`, `git show`, `git branch` (list), `git blame`, `git ls-files`, `git remote -v`, `git fetch`

**Allowed on `dev` and feature branches only:**
- `git switch dev`, `git switch -c <feature>` (branched **from `dev`**), `git add`, `git commit`
- `git pull origin dev`, `git push origin dev`, `git push -u origin <feature>`
- `git merge <feature>` **into `dev`** — always check `git branch --show-current` is `dev` first
- Deleting a local feature branch after it is merged into `dev`

**Forbidden — never, no exceptions, even if asked mid-task:**
- Any write to `main`: commit, merge into, push to, rebase, reset, or delete `main` / `origin/main`
- Merging `dev` → `main`, or opening/merging a PR targeting `main` (`gh pr create --base main`, `gh pr merge`) — the user does this
- `git push --force` / `--force-with-lease` on any branch, `git reset --hard` on pushed commits, rewriting pushed history
- `--no-verify`, `--no-gpg-sign`, or any hook bypass
- `git clean -fd`, `git stash drop/clear`, or anything that throws away uncommitted user work

**Workflow:**
1. Before any git write, run `git branch --show-current`. If it is `main`, **stop** — switch to `dev` (stash nothing; ask if the tree is dirty).
2. New task → `git switch dev && git pull origin dev` → `git switch -c <type>/<short-name>` (e.g. `feat/new-sidebar`).
3. Small, focused commits in Conventional style: `feat:`, `fix:`, `refactor:`, `style:`, `chore:`, `docs:`.
4. Task done + `npm run lint` and `npm run build` pass → merge feature into `dev` → `git push origin dev`.
5. Promotion `dev` → `main` is **only** done by the user.
6. On merge conflicts: resolve only if trivial and clearly correct; otherwise stop and show the conflict.

---

## 2. Role Split

### Frontend — Claude builds
- Write, edit and refactor code in `src/`.
- Goal: production-grade, modern UI — consistent, accessible, responsive.

### Backend — Claude guides only
- Do **not** create or edit backend code. It is not in this repo.
- When asked, give best-practice guidance: API design (REST naming, status codes, pagination, error shape), auth (JWT expiry/refresh, hashing), validation, DB indexing, security (OWASP, CORS, rate limits), and testing.
- Keep advice concrete: short snippets + why. State assumptions about the backend stack instead of guessing silently.
- If a frontend task needs a backend change (new endpoint/field), describe the exact contract (method, path, request/response JSON), add it to `api.ts` + a mock handler so the UI can be built, and log the contract under "Next / Open" in `.claude/PROGRESS.md` so the backend gets it.

---

## 3. Project Map

**Stack:** React 19 · TypeScript 5.9 · Vite 7 · Tailwind CSS v4 (`@tailwindcss/vite`) · react-router-dom 7 · ESLint 9

| Path | Purpose |
|---|---|
| `src/main.tsx`, `src/App.tsx` | Entry + routes |
| `src/pages/` | Login, Register, Home, Flags, FlagDetail, CreateFlag, ApiKeys, AuditLogs |
| `src/components/` | `DashboardLayout`, `ProtectedRoute` |
| `src/contexts/AuthContext.tsx` | Auth state + token |
| `src/services/api.ts` | Single `ApiService` class — **all** HTTP goes through here |
| `vite.config.ts` | Dev server :3000, proxies `/api` → `localhost:8000` |
| `vercel.json` | SPA rewrite for deploy |

**API base:** `VITE_API_BASE_URL` env var, fallback `/api/v1`.

**Commands:** `npm run dev` (real backend) · `npm run dev:mock` (no backend) · `npm run build` (runs `tsc -b`) · `npm run lint` · `npm run preview`

### Mock mode (layout work without a backend)
- `npm run dev:mock` loads `.env.mock` → `VITE_USE_MOCKS=true`.
- `ApiService.request()` routes every call to `src/services/mock/handlers.ts` (in-memory DB seeded from `mock/data.ts`, ~300ms fake latency). Mutations persist until page reload.
- Auth is bypassed: `AuthContext` auto-signs in a mock admin; login/register accept any credentials.
- Test UI states via URL query: `?mock=empty` (empty lists) · `?mock=error` (every request fails) · `?mock=slow` (2s latency).
- When a new endpoint is added to `api.ts`, add its handler in `mock/handlers.ts` in the same change.
- Never import from `services/mock/` outside `api.ts` / `AuthContext.tsx`. Production builds don't set the flag, so mocks never run there.

---

## 4. Frontend Standards

- **TypeScript strict.** No `any`; type API responses in or next to `api.ts`.
- **Tailwind v4 only** for styling. No new CSS frameworks or UI kits without asking. Put design tokens (colors, radius, spacing) in `@theme` in `src/index.css` and reuse them.
- **Reuse before creating.** Extract repeated UI (buttons, inputs, cards, modals, tables, badges) into `src/components/ui/`. Check for an existing component first.
- **API calls** only via `ApiService`. Never call `fetch` directly from pages.
- **Every data view handles** loading, empty, error and success states.
- **Accessibility:** semantic HTML, labels on inputs, keyboard focus visible, ARIA only where needed, color contrast ≥ WCAG AA.
- **Responsive** from 360px up. Test layout at mobile and desktop widths.
- **Dependencies:** ask before adding any npm package; justify size and need.
- **No secrets** in code. Env vars must be prefixed `VITE_` and are public.
- Before reporting a task done: run `npm run lint` and `npm run build`; report real results, including failures.

---

## 5. Token Optimization & Memory — FOLLOW EVERY SESSION

### Read less, read precisely
- Use **Grep / Glob first** to find the code, then **Read only the needed line range**. Do not read whole files "for context".
- **Never re-read** a file already read in this session unless it changed since. Don't re-read after your own Edit — the tool confirms success.
- Use the Project Map above instead of exploring the tree. Don't `ls`/`find` the repo at the start of a task.
- Never read `node_modules/`, `dist/`, `package-lock.json`, or build output.
- Run commands with trimmed output (`| head`, `--stat`, `-q`). Don't dump full logs.

### Write less, write precisely
- Use **Edit** for changes; only use Write for new files or full rewrites.
- Batch independent tool calls in one turn.
- Replies: lead with the result. No restating the request, no narrating steps, no repeating code that was just written. Short bullets > paragraphs.
- Show code only when the user needs to see it (e.g. backend guidance), not to echo edits.

### Don't spawn sub-agents unless the user asks
They start cold and re-read everything — expensive.

### No hallucination
- Never invent file paths, components, props, API endpoints, fields, or package APIs. **Verify in code first** (Grep). If not verifiable, say "unverified" or ask.
- If unsure of a requirement, ask **one** focused question rather than guessing big.
- Report outcomes honestly: if lint/build fails or a step was skipped, say so.

### Don't forget — persistent progress log
`.claude/PROGRESS.md` is the shared memory across sessions.
- **At session start:** read `.claude/PROGRESS.md` (only it — not the whole repo).
- **After each completed task:** append one entry, newest on top, max ~5 lines:
  ```
  ## YYYY-MM-DD — <task title>  (branch: <name>)
  - Done: <what changed, key files>
  - Decisions: <design/tech choices and why>
  - Next / Open: <follow-ups, blockers, backend contracts needed>
  ```
- Keep the file under ~150 lines: when it grows, compress old entries into a short "History" summary at the bottom.
- Record **decisions and conventions** (e.g. "buttons live in `ui/Button.tsx`, variants: primary/secondary/ghost") so they're never re-decided.
- For multi-step tasks, keep a short checklist in the entry and tick items as they finish so work survives a context reset.

### Plan before large changes
For changes touching 3+ files, give a ≤ 6-line plan first and wait for approval. For small changes, just do it.
