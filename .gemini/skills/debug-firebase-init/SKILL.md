---
name: debug-firebase-init
description: Injects robust logging and error handling into Firebase/external service initialization for deployment diagnostics. Use when facing production issues with service connections, credential parsing, or environment variables.
---

# debug-firebase-init

A workflow for auditing and enhancing the initialization of external services (like Firebase or Razorpay) to provide better production diagnostics.

## Workflow

1.  **Locate Initialization Code**: Identify where the service is initialized (e.g., `server/src/lib/firebase-admin.ts`, `client/src/lib/firebase.ts`).
2.  **Audit Credential Parsing**: Ensure environment variables (like `FIREBASE_SERVICE_ACCOUNT`) are correctly parsed, checking for common issues like newline handling in private keys.
3.  **Enhance Logging**: Add `console.log` or a proper logger to output environmental clues (e.g., "Initializing with project ID: X", "Service account key present: true/false") without leaking secrets.
4.  **Implement Robust Error Handling**: Wrap initialization logic in `try/catch` blocks and provide actionable error messages.
5.  **Verify**: Deploy changes or simulate production environments to confirm diagnostics are sufficient to identify root causes.

## Security Mandate

- **NEVER** log full secrets, API keys, or private keys.
- Only log presence, length, or masked values (e.g., `key.substring(0, 10)...`).
- Use structured logs where possible for easier filtering in production logs.
