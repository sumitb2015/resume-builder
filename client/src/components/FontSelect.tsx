import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface FontOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  options: FontOption[];
  onChange: (value: string) => void;
}

export const FontSelect: React.FC<Props> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} ref={containerRef}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setIsOpen(!isOpen); if (!isOpen) setSearch(''); }}
          type="button"
          className="field-input"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left',
            paddingRight: '10px'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedOption.label}
          </span>
          <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
        </button>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--color-ui-surface)',
            border: '1px solid var(--color-ui-border)',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '8px', 
              borderBottom: '1px solid var(--color-ui-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-ui-bg)'
            }}>
              <Search size={14} style={{ color: 'var(--color-ui-text-dim)' }} />
              <input
                autoFocus
                type="text"
                placeholder="Search fonts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  color: 'var(--color-ui-text)',
                  width: '100%'
                }}
              />
            </div>
            
            <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: opt.value === value ? 'rgba(99,102,241,0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: opt.value === value ? 'var(--color-ui-accent)' : 'var(--color-ui-text)',
                      fontSize: '13px',
                      fontWeight: opt.value === value ? 700 : 500,
                      fontFamily: opt.value,
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
                    onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                    {opt.value === value && <Check size={14} />}
                  </button>
                ))
              ) : (
                <div style={{ padding: '12px', fontSize: '12px', color: 'var(--color-ui-text-dim)', textAlign: 'center' }}>
                  No fonts found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sample preview */}
      <div style={{
        fontFamily: value,
        fontSize: '18px',
        color: 'var(--color-ui-text)',
        padding: '12px',
        background: 'var(--color-ui-bg)',
        borderRadius: '10px',
        border: '1px solid var(--color-ui-border)',
        textAlign: 'center',
        transition: 'font-family 0.2s'
      }}>
        The quick brown fox jumps...
      </div>
    </div>
  );
};
