/** Strip all HTML tags, returning plain text for AI consumption.
 * Accounts for block-level elements by adding newlines to ensure accurate character counting.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  if (!html.includes('<')) return html;
  
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  // Add spaces/newlines for block elements to prevent text merging (e.g., <p>A</p><p>B</p> -> "A\nB")
  const blocks = new Set(['P', 'LI', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'BR']);
  const walk = (node: Node): string => {
    let text = '';
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const isBlock = blocks.has(el.tagName);
      
      for (const child of Array.from(el.childNodes)) {
        text += walk(child);
      }
      
      if (isBlock && !text.endsWith('\n')) {
        text += '\n';
      }
    }
    return text;
  };

  return walk(body).trim();
}

/** Count visible characters (strip tags first) for CharCount */
export function htmlCharCount(html: string): number {
  return stripHtml(html).length;
}

/** Wrap AI plain-text output in a <p> tag, preserving line breaks as <br> */
export function plainTextToHtml(text: string): string {
  if (!text) return '';
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
