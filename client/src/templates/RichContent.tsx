import React from 'react';

interface Props {
  html: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Renders rich text HTML produced by Tiptap or legacy markdown conversion.
 * Safe to use with dangerouslySetInnerHTML: content is exclusively generated
 * by Tiptap (controlled tag set) or plainTextToHtml() — never raw user HTML.
 */
const RichContent: React.FC<Props> = ({ html, style, className }) => {
  if (!html) return null;
  // If plain text (no tags), wrap in a paragraph for consistent rendering
  const content = html.includes('<') ? html : `<p>${html}</p>`;
  return (
    <div
      className={`rich-content${className ? ` ${className}` : ''}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichContent;
