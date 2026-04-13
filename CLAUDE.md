# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
# Frontend (port 5173)
cd client && npm run dev
cd client && npm run build
cd client && npm run lint

# Backend (port 3001)
cd server && npm run dev    # tsx watch — restarts on change
cd server && npm start      # single run
```

No test runner configured. Run client and server separately — no monorepo root script.

## Environment

**`server/.env`** (required):
```
OPENAI_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
# Firebase Admin (service account JSON or individual fields)
FIREBASE_PROJECT_ID=...
```

**`client/.env`** (optional, defaults to localhost):
```
VITE_API_URL=https://your-backend.com   # omit in dev — defaults to http://localhost:3001
```

## Architecture

### Routing
Uses **React Router** (`BrowserRouter`). Routes defined in `App.tsx`:
- `/` — LandingPage (public)
- `/login` — LoginPage (public)
- `/hub` — MainMenuPage (protected)
- `/dashboard` — ModeSelectModal (protected)
- `/builder` — ResumeBuilder + live preview (protected)
- `/ai-writer` — AiWriterFlow (protected)
- `/ats`, `/tailor`, `/cover-letter`, `/interview-prep`, `/preview` — tool pages (protected)
- `/plans`, `/checkout` — plan selection & payment (protected)

All protected routes use `<ProtectedRoute>` which redirects to `/login` if unauthenticated.

### State / Contexts
Global state lives in React contexts (not App-level props):
- **`ResumeContext`** — `resume`, `activeTemplate`, `improvements`, undo/redo (40-step), autosave to localStorage keyed by Firebase UID (`bespokecv_draft_<uid>`)
- **`AuthContext`** — Firebase auth (Google OAuth + email/password); server sync on login via `POST /api/user/sync`
- **`PlanContext`** — user plan tier (`free` | `basic` | `pro` | `ultimate`)
- **`ThemeContext`** — dark/light theme

### Resume Data Model
`client/src/shared/types.ts` defines `Resume` — shared by frontend state, AI prompts, templates, and API responses.

### Template System
- 40+ templates in `client/src/templates/`, each accepts `{ resume: Resume, config: TemplateConfig }`
- `TemplateRenderer.tsx` switches on `config.id`; `templates/index.ts` exports the `templates` array
- All templates use inline styles; A4 print via `.resume-paper` in `index.css`
- Print layout: `@page { size: A4; margin: 0 }` — visual margins come from template padding
- Use `breakInside: 'avoid'` on section wrappers to prevent mid-section page breaks

### AI Services (server)
- `ai.service.ts` — bullet gen, summary, ATS score, tailoring, cover letter, interview prep, smart-fit, rephrase, URL scraping
- `parse.service.ts` — resume parsing from PDF/DOCX and LinkedIn text paste
- Both use **`gpt-4o-mini`**. **Never upgrade to `gpt-4o`** — cost preference.
- `parse.service.ts` uses `response_format: { type: 'json_object' }` for structured output

### API Routes
All require Firebase Bearer token (via `auth.middleware.ts`) except `/api/payment/webhook`:
- `POST /api/ai/*` — generate-bullets, generate-summary, tailor-resume, ats-score, ats-tailor, find-skills, smart-fit, rephrase, generate-full-resume, generate-smart-resume, generate-cover-letter, generate-interview-prep
- `POST /api/fetch-job-url` — SSRF-protected URL scrape for job descriptions
- `POST /api/parse/upload` — PDF/DOCX → GPT → `{ resume, improvements }`
- `POST /api/parse/linkedin` — pasted text → GPT → `{ resume }`
- `POST /api/export/pdf` — Puppeteer renders HTML to A4 PDF
- `POST /api/payment/*` — Razorpay order creation, verification, discount validation
- `POST /api/user/sync` — upsert user on login; `GET /api/user/me/:uid`

### Frontend API Client
`client/src/lib/api.ts` — `post<T>()` with 30s timeout, 2 retries on network error, 429 rate-limit message. All endpoints require auth token injected via `getAuthHeaders()`.

### Mode Selection Flow (`/dashboard`)
`ModeSelectModal.tsx` offers three paths into the builder:
1. **Manual** — sample data, go to `/builder`
2. **Enhance** — upload PDF/DOCX → parse → set resume + improvements → `/builder`
3. **LinkedIn** — paste profile text → parse → set resume → `/builder`
4. **AI Writer** — navigates to `/ai-writer` (multi-step wizard, outputs `Resume` + `TemplateConfig`)

Improvements panel renders in `ResumeBuilder.tsx` when `improvements` is non-null; "Apply" swaps matching original text in summary/bullets.
