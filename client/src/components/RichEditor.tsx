import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, RemoveFormatting,
} from 'lucide-react';
import { htmlCharCount } from '../lib/htmlUtils';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  minHeight?: number;
  style?: React.CSSProperties;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  minHeight = 80,
  style,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Treat empty editor as empty string
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-prosemirror',
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  // Sync external value changes (e.g. AI text injection) without cursor reset
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || '<p></p>';
    if (current !== incoming && current !== value) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  const toolbarBtn = (
    icon: React.ReactNode,
    onClick: () => void,
    title: string,
    isActive?: boolean,
  ) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{
        padding: '3px 7px',
        borderRadius: '5px',
        border: '1px solid var(--color-ui-border)',
        background: isActive ? 'var(--color-ui-surface-2)' : 'transparent',
        color: isActive ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'var(--color-ui-surface-2)';
          e.currentTarget.style.color = 'var(--color-ui-text)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--color-ui-text-muted)';
        }
      }}
    >
      {icon}
    </button>
  );

  const divider = (
    <div style={{ width: '1px', height: '16px', background: 'var(--color-ui-border)', margin: '0 2px' }} />
  );

  const charLen = htmlCharCount(value);
  const color = maxLength
    ? charLen > maxLength
      ? 'var(--color-danger)'
      : charLen > maxLength * 0.85
        ? 'var(--color-warning)'
        : 'var(--color-ui-text-dim)'
    : undefined;

  return (
    <div style={style}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
        {toolbarBtn(<Bold size={11} />, () => editor?.chain().focus().toggleBold().run(), 'Bold', editor?.isActive('bold'))}
        {toolbarBtn(<Italic size={11} />, () => editor?.chain().focus().toggleItalic().run(), 'Italic', editor?.isActive('italic'))}
        {toolbarBtn(<UnderlineIcon size={11} />, () => editor?.chain().focus().toggleUnderline().run(), 'Underline', editor?.isActive('underline'))}
        {toolbarBtn(<Strikethrough size={11} />, () => editor?.chain().focus().toggleStrike().run(), 'Strikethrough', editor?.isActive('strike'))}
        {divider}
        {toolbarBtn(<List size={11} />, () => editor?.chain().focus().toggleBulletList().run(), 'Bullet List', editor?.isActive('bulletList'))}
        {toolbarBtn(<ListOrdered size={11} />, () => editor?.chain().focus().toggleOrderedList().run(), 'Numbered List', editor?.isActive('orderedList'))}
        {divider}
        {toolbarBtn(<RemoveFormatting size={11} />, () => editor?.chain().focus().clearNodes().unsetAllMarks().run(), 'Clear Formatting')}
      </div>

      {/* Editor area */}
      <div className="rich-editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      {maxLength !== undefined && (
        <div style={{ textAlign: 'right', fontSize: '10.5px', fontWeight: 500, color, marginTop: '4px' }}>
          {charLen} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default RichEditor;
