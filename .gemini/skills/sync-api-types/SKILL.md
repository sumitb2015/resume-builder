---
name: sync-api-types
description: Ensures type safety and synchronization between the frontend API client and backend services/middleware. Use when there are discrepancies in API request/response payloads or when adding new fields to database schemas.
---

# sync-api-types

A workflow for auditing and synchronizing TypeScript types across the frontend/backend boundary.

## Workflow

1.  **Identify Schema Changes**: Check backend models/services (`server/src/services/`) for any new fields or logic.
2.  **Update Shared Types**: Modify `client/src/shared/types.ts` (or equivalent) to reflect backend changes.
3.  **Audit Middleware**: Check `server/src/middleware/auth.middleware.ts` to ensure it correctly populates request context (e.g., `req.user`).
4.  **Fix Frontend Usage**: Identify any downstream build errors caused by the change and update the API client (`client/src/lib/api.ts`).
5.  **Validation**: Run a full build of both client and server to confirm type synchronization.

## Guidelines

- **Shared Constants**: Use `client/src/shared/constants.ts` for values shared between frontend and backend (e.g., pricing plans, status codes).
- **Type Guarding**: Implement robust type checks in the backend middleware to prevent runtime errors.
- **Null Safety**: Always account for optional fields (`?`) when syncing types between the DB and the UI.
