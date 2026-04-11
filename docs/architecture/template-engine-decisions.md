# Architectural Decision Record: Template & PDF Engine

## Context
As the "Resume Tailor" application grows, we evaluated the most effective way to build and render resume templates. We specifically compared our current **Inline Styles + Puppeteer** approach against the **Tailwind CSS** and **@react-pdf/renderer** patterns used by other open-source projects like Reactive Resume.

## Decision
We have decided to maintain a **Hybrid Architecture**:
1.  **App UI**: Powered by **Tailwind CSS** (for speed, consistency, and modern design).
2.  **Resume Templates**: Powered by **React + Inline Styles + Standard CSS** (for precision, reliability, and dynamic control).

## Rationale

### 1. Dynamic Customization (The "Slider" Problem)
Resume builders require fine-grained control over layout (e.g., shifting font size by 1% or margins by 1mm). 
- **Inline Styles**: Naturally handle variable values (`fontSize: settings.fontSize + '%'`).
- **Tailwind**: Limited to predefined utility classes. Supporting "infinite" slider values in Tailwind requires complex JIT configurations or falling back to inline styles anyway.

### 2. PDF Export Reliability (WYSIWYG)
Our current engine uses **Puppeteer** to capture HTML and render a PDF.
- **Inline Styles**: Styles are "baked into" the DOM elements. This eliminates the risk of CSS purging, slow stylesheet loading, or selector specificity issues within the headless browser.
- **@react-pdf/renderer**: While efficient for client-side generation, it uses a subset of CSS. Maintaining a template in both standard HTML (for preview) and react-pdf primitives (for download) creates a "Double Maintenance" burden and often leads to visual discrepancies.

### 3. AI & Programmatic Layout (Smart Fit)
The "Smart Fit" feature allows the AI to programmatically adjust the resume to fit a specific page count.
- **Inline Styles**: It is significantly easier for an algorithm to manipulate a JavaScript `style` object than to parse and rebuild long strings of Tailwind utility classes.

### 4. Single Source of Truth
By using standard HTML/CSS for both the **Artboard Preview** and the **PDF Export**, we ensure 100% parity between what the user sees on the screen and what they receive in their inbox.

## Implementation Notes
- **Template Files**: Keep all `.tsx` files in `client/src/templates/` primarily using the `style={{ ... }}` prop.
- **Rich Content**: Use the `RichContent` component to bridge the gap between formatted editor output and template styling.
- **Global UI**: Continue using Tailwind for the editor shell, landing pages, and interactive components to maintain high development velocity.

---
*Date: April 11, 2026*
*Status: Approved*
