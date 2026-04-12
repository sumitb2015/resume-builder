# System Upgrades & Architecture Roadmap

This document outlines the major architectural upgrades, technical debt, and recommended improvements for the Resume Tailor application.

## 1. Security & Infrastructure

### 1.1 Server-Side Authentication Hardening (Critical)
**Issue:** Current backend routes (e.g., `/api/user/sync`, `/api/user/me/:uid`) rely on client-provided `uid` without server-side verification. This presents an Insecure Direct Object Reference (IDOR) vulnerability.
**Upgrade:**
- Implement Firebase Admin authentication middleware across all user-related and AI-related routes.
- Verify the `Authorization: Bearer <token>` header on the server side to ensure the requesting user is who they claim to be.

### 1.2 Scalable PDF Generation
**Issue:** The current Puppeteer implementation in `server/src/routes/export.routes.ts` manually manages the browser lifecycle, restarting it after 50 requests. This is brittle and doesn't scale well for high-concurrency environments.
**Upgrade:**
- Move PDF generation to a dedicated background worker queue (e.g., **BullMQ**) or a serverless function (e.g., AWS Lambda or Google Cloud Functions).
- Implement a worker pool or use a service like Browserless.io to handle browser instances more reliably.

## 2. Frontend Architecture (DX & UX)

### 2.1 Dismantling the "God Component"
**Issue:** `client/src/App.tsx` is over 1,200 lines long, managing everything from state and routing to complex feature flows like the AI Writer and Job Tailor.
**Upgrade:**
- Refactor `App.tsx` by breaking it into feature-specific layouts and smaller, reusable components.
- Standardize the communication between these components using props or a dedicated state management library.

### 2.2 Implementing Proper Routing
**Issue:** The app currently uses a state-based `view` variable (`landing`, `mode-select`, `builder`) which breaks the browser's back button and makes deep linking impossible.
**Upgrade:**
- Migrate to **React Router**.
- Define routes for the landing page, mode selection, the main builder, and other key features like `cover-letter` and `interview-prep`.

### 2.3 Global State Management
**Issue:** The massive `Resume` object and undo/redo logic are managed via App-level `useState`, leading to significant prop-drilling.
**Upgrade:**
- Adopt a state management library like **Zustand** or Redux.
- Store the `Resume` object and selected `TemplateConfig` in a global store.
- Implement more robust undo/redo logic within the store.

## 3. Developer Experience (DX) & Tooling

### 3.1 Automated Testing
**Issue:** There is currently no test runner configured, making the application prone to regressions during refactoring.
**Upgrade:**
- Set up **Vitest** and **React Testing Library** for frontend component and unit testing.
- Implement integration tests for critical backend services (e.g., `ai.service.ts` and `parse.service.ts`).

### 3.2 Monorepo Tooling
**Issue:** Frontend and backend are managed separately, requiring two terminal windows and manual coordination.
**Upgrade:**
- Add a root `package.json` with **npm workspaces**, **Yarn Workspaces**, or **Turborepo**.
- Enable single-command execution for development (`npm run dev`) and builds across both the client and server.
