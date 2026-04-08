/** Strip all HTML tags, returning plain text for AI consumption */
export function stripHtml(html: string): string {
  if (!html) return '';
  if (!html.includes('<')) return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
}

/** Count visible characters (strip tags first) for CharCount */
export function htmlCharCount(html: string): number {
  return stripHtml(html).length;
}

/** Wrap AI plain-text output in a <p> tag, preserving line breaks as <br> */
export function plainTextToHtml(text: string): string {
  if (!text) return '';
  // If already HTML, return as-is
  if (text.includes('<')) return text;
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const withBreaks = escaped.replace(/\n/g, '<br>');
  return `<p>${withBreaks}</p>`;
}

/**
 * Convert legacy markdown-like strings to minimal HTML.
 * Handles: **text** → <strong>, *text* → <em>, • bullet lines → <ul><li>
 * Idempotent: returns unchanged if string already contains HTML tags.
 */
export function legacyMarkdownToHtml(value: string): string {
  if (!value) return '';
  // Already HTML
  if (value.includes('<')) return value;
  // Check if it has any markdown patterns worth converting
  const hasMarkdown = /\*\*|\*|^• /m.test(value);
  if (!hasMarkdown) {
    // Plain text — wrap in <p> preserving line breaks
    return plainTextToHtml(value);
  }

  // Split into lines to handle bullet points
  const lines = value.split('\n');
  let result = '';
  let inBulletList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('• ')) {
      if (!inBulletList) {
        result += '<ul>';
        inBulletList = true;
      }
      const bulletContent = formatInline(trimmed.slice(2));
      result += `<li>${bulletContent}</li>`;
    } else {
      if (inBulletList) {
        result += '</ul>';
        inBulletList = false;
      }
      if (trimmed) {
        result += `<p>${formatInline(trimmed)}</p>`;
      }
    }
  }
  if (inBulletList) result += '</ul>';

  return result;
}

/** Convert inline **bold** and *italic* markdown to HTML */
function formatInline(text: string): string {
  // Bold first (** before *)
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
