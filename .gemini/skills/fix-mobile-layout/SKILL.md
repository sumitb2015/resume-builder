---
name: fix-mobile-layout
description: Specialized in debugging and standardizing mobile responsive UI issues using Tailwind CSS. Use when reporting layout overlaps, scaling issues, or responsiveness bugs on smaller screens.
---

# fix-mobile-layout

A workflow for auditing and fixing common mobile responsiveness issues in React applications using Tailwind CSS.

## Workflow

1.  **Reproduce/Audit**: Examine the reported layout issue. Identify the specific components and their Tailwind classes (e.g., `sm:`, `md:`, `lg:` prefixes).
2.  **Analyze Stacking and Overflow**:
    *   **Overlaps**: Check `z-index` and `position` (`relative`, `absolute`, `fixed`, `sticky`).
    *   **Clipping**: Check `overflow-hidden` vs `overflow-visible`.
    *   **Scaling**: Check `transform scale` and how it interacts with fixed-width containers.
3.  **Implement Fixes**:
    *   **Sticky Navbars**: Ensure they don't overlap overlays by moving modals outside the sticky container or adjusting `z-index`.
    *   **Centering**: Use Flexbox (`items-center`, `justify-center`) or robust `inline-block` centering for scaled previews.
    *   **Touch Targets**: Ensure buttons have a minimum height/width (e.g., `h-10 w-10`) for mobile accessibility.
4.  **Validate**: Verify the fix on mobile breakpoints.

## Common Patterns

- **Mobile Headers**: Often need `sticky top-0 z-50` and a background to prevent content from bleeding through.
- **Sidebar Overlays**: Should use a portal or be placed high in the DOM tree to avoid being clipped by parent `overflow: hidden`.
- **Responsive Spacing**: Use `p-4 sm:p-6 md:p-8` to adjust padding dynamically.
- **Max Widths**: Ensure `max-w-full` or `w-screen` is used where appropriate to prevent horizontal scrolling on small screens.
