import React from 'react';

interface Props {
  html: string;
  style?: React.CSSProperties;
  className?: string;
  isModified?: boolean;
}

/**
 * Renders rich text HTML produced by Tiptap or legacy markdown conversion.
 * Safe to use with dangerouslySetInnerHTML: content is exclusively generated
 * by Tiptap (controlled tag set) or plainTextToHtml() — never raw user HTML.
 */
const RichContent: React.FC<Props> = ({ html, style, className, isModified }) => {
  if (!html) return null;
  // If plain text (no tags), wrap in a paragraph for consistent rendering
  const content = html.includes('<') ? html : `<p>${html}</p>`;
  
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(isModified ? { color: '#10b981', fontWeight: 500 } : {})
  };

  return (
    <div
      className={`rich-content${className ? ` ${className}` : ''}`}
      style={mergedStyle}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichContent;
