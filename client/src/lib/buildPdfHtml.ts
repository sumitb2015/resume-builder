/**
 * Builds a self-contained HTML document suitable for Puppeteer PDF rendering.
 *
 * The document includes:
 *  - All Google Fonts used by templates (same URL as index.html)
 *  - The minimal CSS needed for template CSS classes (rich-content, no-break, etc.)
 *  - The raw innerHTML captured from the hidden TemplateRenderer div
 *  - Body padding that matches the margin slider value so content width is identical
 *    to the screen preview
 */

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Josefin+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+3:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap';

// CSS classes used by templates that are defined in index.css (not inline styles).
// TemplateRenderer already injects a <style> block for font-scale / line-height;
// the rules below cover everything else the templates depend on.
const TEMPLATE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    background: white;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
    width: 210mm;
  }

  /* resume-paper: reset box-shadow and overflow for PDF output */
  .resume-paper {
    background: white;
    width: 100%;
    box-shadow: none !important;
    overflow: visible !important;
  }

  /* Rich text content rendered via RichContent component */
  .resume-paper .rich-content p { margin: 0; }
  .resume-paper .rich-content p + p { margin-top: 2px; }
  .resume-paper .rich-content ul,
  .resume-paper .rich-content ol { margin: 0; padding-left: 16px; }
  .resume-paper .rich-content li { margin: 0; }
  .resume-paper .rich-content { display: block; }
  .resume-paper .rich-content strong { font-weight: 700; }
  .resume-paper .rich-content em { font-style: italic; }
  .resume-paper .rich-content u { text-decoration: underline; }
  .resume-paper .rich-content s { text-decoration: line-through; }

  /* Page break hints — Chromium honours these during PDF generation */
  .resume-paper h2, .resume-paper h3 { break-after: avoid; page-break-after: avoid; }
  .resume-paper section { break-inside: auto; page-break-inside: auto; }
  .resume-paper .no-break { break-inside: avoid; page-break-inside: avoid; }
`;

export function buildPdfHtml(templateHtml: string, marginMm: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <style>
    @page { margin: ${marginMm}mm; }
    ${TEMPLATE_CSS}
  </style>
</head>
<body style="margin:0;padding:0;">
  ${templateHtml}
</body>
</html>`;
}
