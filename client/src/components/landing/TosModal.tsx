import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props { onClose: () => void; title?: string; children?: React.ReactNode }

export const LegalModal: React.FC<Props> = ({ onClose, title = 'Terms of Service', children }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '720px', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid var(--color-ui-border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ui-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ui-text-muted)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text-muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; e.currentTarget.style.color = 'var(--color-ui-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-ui-border)'; e.currentTarget.style.color = 'var(--color-ui-text-muted)'; }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

