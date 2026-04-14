# Design: Legitimacy Improvements — Marketing Claims & Policy Pages

**Date:** 2026-04-14  
**Status:** Approved

---

## Problem Statement

Web analytics flagged two trust/transparency issues:
1. Bold marketing stats (`50K+` resumes created, `98%` ATS pass rate) are unverified and not independently sourced.
2. Terms of Service and Privacy Policy are rendered as JavaScript modals only — search engines cannot crawl or index them, making the site appear less transparent.

---

## Section 1 — Marketing Copy Changes

### StatsSection.tsx

Replace the 4-stat ticker with qualitative positioning pillars. No figures, no unverifiable claims.

| Current | Replacement |
|---|---|
| `50K+` Resumes Created | ATS-Optimized by Design |
| `98%` ATS Pass Rate | AI-Powered Writing |
| `3 min` Avg. time to first draft | Interview-Ready in Minutes |
| `{templates.length}+` Professional Templates | `{templates.length}+` Professional Templates *(keep — real, countable)* |

Each tile gets a short descriptor line beneath (e.g. "Every template built to pass modern applicant tracking systems").

### TestimonialsSection.tsx

Subtitle change only:
- **Before:** "Join 50,000+ professionals who've landed interviews with BespokeCV"  
- **After:** "Trusted by job seekers across India"

Testimonial cards are unchanged — they are presented as user reviews, standard SaaS practice.

---

## Section 2 — Public Policy Pages

### New Routes

Add two public (no auth) routes to `App.tsx`:
- `/terms` → `TermsPage` component
- `/privacy` → `PrivacyPage` component

These render the same legal content already in `TosModal.tsx` but as standalone, server-crawlable pages — no modal wrapper, no auth wall.

### New Components

Two thin page wrappers (can live in `client/src/components/legal/`):
- `TermsPage.tsx` — renders `TosModal` legal content in a simple page layout
- `PrivacyPage.tsx` — renders `PrivacyModal` legal content in a simple page layout

**Page layout:** BespokeCV logo header + "Back to Home" link, legal content centred in a readable column (max 720px width), no sidebar, no auth.

### Footer Changes

In `FooterSection.tsx`, replace the button-click handlers in the Legal column with real anchor tags:
- `onOpenTos` button → `<a href="/terms">`
- `onOpenPrivacy` button → `<a href="/privacy">`

The `onOpenTos` and `onOpenPrivacy` props can be removed from `FooterSection` since they're no longer needed. The `LegalModal` wrapper component stays in case it is reused elsewhere, but `TosModal` and `PrivacyModal` modal exports become unused and can be removed.

### Sitemap

Add `/terms` and `/privacy` to `client/public/sitemap.xml`:
- `changefreq: yearly` — legal pages change rarely
- `priority: 0.3` — not primary destinations
- `lastmod: 2026-04-14`

---

## Files Touched

| File | Change |
|---|---|
| `client/src/components/landing/StatsSection.tsx` | Replace stats data array |
| `client/src/components/landing/TestimonialsSection.tsx` | Update subtitle string |
| `client/src/components/legal/TermsPage.tsx` | **New file** |
| `client/src/components/legal/PrivacyPage.tsx` | **New file** |
| `client/src/App.tsx` | Add `/terms` and `/privacy` routes |
| `client/src/components/landing/FooterSection.tsx` | Replace button handlers with `<a>` links, remove props |
| `client/src/components/landing/TosModal.tsx` | Remove `TosModal` and `PrivacyModal` exports (optional cleanup) |
| `client/public/sitemap.xml` | Add `/terms` and `/privacy` entries |

---

## Out of Scope

- Updating the legal text itself
- Adding `robots.txt`
- Changing testimonial content
