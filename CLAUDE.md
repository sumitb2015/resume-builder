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

No test runner is configured. There is no monorepo root dev script — run client and server separately.

## Environment

Server requires `server/.env`:
```
OPENAI_API_KEY=...
```
(`FIRECRAWL_API_KEY` is no longer needed — LinkedIn import was changed to paste-text.)

## Architecture

### State-based routing (no React Router)
`client/src/App.tsx` owns all top-level state. View transitions are driven by a `view` state variable:
```
'landing' → 'mode-select' → 'builder'
```
The `Resume` object, selected `TemplateConfig`, and `ImprovementSuggestions` all live in App-level `useState` and are passed down as props.

### Resume data model
Defined in `client/src/shared/types.ts`. The `Resume` type is used everywhere — frontend state, AI prompts, template rendering, and API responses all share the exact same shape.

### Template system

- 40+ templates in `client/src/templates/`, each accepting `{ resume: Resume, config: TemplateConfig }`.
- `TemplateRenderer.tsx` switches on `config.id` to pick the right template.
- `templates/index.ts` exports the `templates` array (TemplateConfig definitions) and `colorPalettes`.
- All templates use inline styles. A4 print sizing is handled via the `.resume-paper` CSS class in `index.css`.
- Print layout: `@page { size: A4; margin: 0 }` — zero margin suppresses browser-generated headers/footers. Visual margins come from template padding (single-column: `44px 52px`, two-column headers: `48px`).
- Use `breakInside: 'avoid', pageBreakInside: 'avoid'` on section wrapper divs to prevent mid-section page breaks.

### AI services (server)
- `server/src/services/ai.service.ts` — handles all builder AI features (bullet generation, summary, ATS score, job tailoring, and smart resume generation). Uses **OpenAI (gpt-4o-mini)** and **Firecrawl**.
- `server/src/services/parse.service.ts` — handles resume parsing from uploaded files and LinkedIn text.
- Both use `gpt-4o-mini`. **Never upgrade to gpt-4o** unless explicitly asked — user preference for token cost.
- `parse.service.ts` uses `response_format: { type: 'json_object' }` to get structured Resume output.

### API routes
All routes are in `server/src/index.ts` (AI routes inlined) and `server/src/routes/parse.routes.ts`:
- `POST /api/ai/*` — bullet gen, summary, tailor, ATS score, find-skills
- `POST /api/parse/upload` — multer memoryStorage, pdf-parse or mammoth → GPT → `{ resume, improvements }`
- `POST /api/parse/linkedin` — accepts `{ text }` (pasted LinkedIn profile) → GPT → `{ resume }`
- `POST /api/export/pdf` — puppeteer renders HTML to A4 PDF

### Frontend API client
`client/src/lib/api.ts` — thin wrapper around `fetch`. `post<T>()` helper for JSON, `uploadResume` uses `FormData`. All calls target `http://localhost:3001`.

### Mode selection flow
`ModeSelectModal.tsx` sits between landing and builder. Three paths:
1. **Manual** — goes straight to builder with sample data
2. **Enhance** — upload PDF/DOCX → parse → pre-fill `Resume` + show `ImprovementSuggestions` panel in builder
3. **LinkedIn** — paste profile text → parse → pre-fill `Resume`

The improvements panel is rendered in `ResumeBuilder.tsx` above the section nav when `improvements` prop is non-null. "Apply" matches `original` text against summary or experience bullets and swaps it.
