---
name: add-resume-template
description: Specialized workflow for adding a new resume template to the application. Use when the user wants to create a new visual style or layout for resumes.
---

# add-resume-template

A systematic workflow for implementing and registering a new resume template in the project.

## Workflow

1.  **Analyze Template Requirements**: Understand the desired layout (single-column, two-column, grid, etc.), color scheme, and typography.
2.  **Create Template Component**:
    *   Create a new file `client/src/templates/[TemplateName]Template.tsx`.
    *   Use the standard template signature: `React.FC<{ resume: Resume; config: TemplateConfig }>`.
    *   Utilize `RichContent` for HTML-enabled sections (summary, experience bullets).
    *   Implement responsive styles using inline styles or Tailwind classes (though inline styles are preferred for PDF consistency).
3.  **Register Template Configuration**:
    *   Open `client/src/templates/index.ts`.
    *   Add a new `TemplateConfig` object to the `templates` array with a unique `id`, `name`, and default `colors`/`fonts`.
4.  **Register Template for Rendering**:
    *   Open `client/src/templates/TemplateRenderer.tsx`.
    *   Add the new template to the `templates` object using `React.lazy(() => import('./[TemplateName]Template'))`.
5.  **Validation**:
    *   Verify the template appears in the template selection UI.
    *   Check for any TypeScript errors in the new file or registrations.

## Heuristics

- **Consistent Structure**: Refer to existing templates like `ClassicTemplate.tsx` or `ModernTemplate.tsx` for section rendering logic.
- **Font Imports**: Use `@fontsource` packages for typography within the template file.
- **PDF Compatibility**: Keep layouts simple and avoid complex CSS that might not translate well to PDF (use the `resume-paper` class).
- **Modification Highlighting**: Use `config.modifiedFields?.includes(...)` to highlight AI-modified text if required.
- **Section Safety**: Always check if a section exists (e.g., `experience.length > 0`) before rendering it to avoid empty spaces.
