---
name: clean-ts-imports
description: Automatically identifies and fixes common TypeScript build errors related to missing or unused imports and variables in React/TypeScript projects. Use when the project fails to build due to 'cannot find name' or 'is defined but never used' errors.
---

# clean-ts-imports

A specialized workflow for resolving repetitive TypeScript import and lint errors that block the build process.

## Workflow

1.  **Identify Failures**: Run the build command (e.g., `npm run build` or `tsc`) to gather all current TypeScript errors.
2.  **Analyze Errors**:
    *   **Unused Imports**: Look for errors like `'X' is defined but never used` or `unused-imports/no-unused-imports`.
    *   **Missing Imports**: Look for errors like `Cannot find name 'X'`.
3.  **Automatic Correction**:
    *   For **Unused Imports**: Systematically remove the identified lines or variables from the import block.
    *   For **Missing Imports**:
        *   If it's a standard React hook (`useState`, `useEffect`, `useCallback`), add `import { ... } from 'react';`.
        *   If it's a common UI component (e.g., from `components/ui/`), check the existing `components.json` or project structure to find the correct path and add the import.
4.  **Verification**: Re-run the build command after each batch of fixes to ensure no new errors were introduced and the previous ones are resolved.

## Heuristics

- **Surgical Edits**: Use the `replace` tool to modify only the import blocks at the top of the file.
- **Batching**: Resolve all errors in a single file before moving to the next one to minimize context switching and turn usage.
- **Common React Imports**:
  - `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext` -> `from 'react'`
  - `Link`, `useNavigate`, `useParams`, `useLocation` -> `from 'react-router-dom'`
- **Project Specifics**:
  - UI Components: Look in `client/src/components/ui/`
  - Contexts: Look in `client/src/contexts/`
  - Hooks: Look in `client/src/hooks/`
