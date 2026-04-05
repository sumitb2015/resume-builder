import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { TemplateConfig } from '../shared/types';
import { colorPalettes } from '../templates';

interface Props {
  templates: TemplateConfig[];
  activeTemplate: TemplateConfig;
  onTemplateChange: (t: TemplateConfig) => void;
  onColorChange: (p: typeof colorPalettes[0]) => void;
  onClose: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export default function StylePanel({ templates, activeTemplate, onTemplateChange, onColorChange, onClose, zoom, onZoomChange }: Props) {
  const [tplOpen, setTplOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(true);

  const categories = ['professional', 'minimal', 'creative'] as const;
  const [activeCat, setActiveCat] = useState<'all' | typeof categories[number]>('all');
  const filtered = activeCat === 'all' ? templates : templates.filter(t => t.category === activeCat);

  return (
    <div style={{
      width: '300px', flexShrink: 0,
      background: 'var(--color-ui-surface)',
      borderLeft: '1px solid var(--color-ui-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', flexShrink: 0,
        borderBottom: '1px solid var(--color-ui-border)',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ui-text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Style
        </span>
        <button className="btn-ghost" style={{ padding: '4px' }} onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>

        {/* ── TEMPLATES ── */}
        <SectionToggle label="Templates" open={tplOpen} onToggle={() => setTplOpen(v => !v)} />
        {tplOpen && (
          <div style={{ padding: '0 12px 16px' }}>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
              {(['all', ...categories] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    border: `1px solid ${activeCat === c ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                    background: activeCat === c ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: activeCat === c ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {filtered.map(t => {
                const isActive = activeTemplate.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onTemplateChange({ ...t })}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      padding: '8px', borderRadius: '10px',
                      border: `2px solid ${isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                      background: isActive ? 'rgba(99,102,241,0.1)' : 'var(--color-ui-bg)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    title={t.name}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '100%', height: '52px', borderRadius: '4px', overflow: 'hidden',
                      background: t.colors.background || '#fff', position: 'relative',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '10px', background: t.colors.primary }} />
                      <div style={{ position: 'absolute', top: '14px', left: '5px', right: '5px', height: '3px', background: t.colors.accent, borderRadius: '2px', opacity: 0.8 }} />
                      <div style={{ position: 'absolute', top: '20px', left: '5px', right: '14px', height: '2px', background: '#ccc', borderRadius: '1px' }} />
                      <div style={{ position: 'absolute', top: '24px', left: '5px', right: '20px', height: '2px', background: '#ccc', borderRadius: '1px' }} />
                      <div style={{ position: 'absolute', top: '30px', left: '5px', right: '10px', height: '2px', background: t.colors.accent, opacity: 0.4, borderRadius: '1px' }} />
                      <div style={{ position: 'absolute', top: '35px', left: '5px', right: '16px', height: '1.5px', background: '#ccc', borderRadius: '1px' }} />
                      <div style={{ position: 'absolute', top: '39px', left: '5px', right: '22px', height: '1.5px', background: '#ccc', borderRadius: '1px' }} />
                    </div>
                    <div style={{
                      fontSize: '10px', fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                      whiteSpace: 'nowrap', letterSpacing: '0.01em', overflow: 'hidden',
                      textOverflow: 'ellipsis', maxWidth: '100%',
                    }}>
                      {t.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.colors.primary }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.colors.accent }} />
                      <span style={{
                        fontSize: '9px', fontWeight: 600, marginLeft: '2px', textTransform: 'capitalize',
                        color: t.atsScore >= 90 ? 'var(--color-success)' : 'var(--color-warning)',
                      }}>
                        ATS {t.atsScore}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COLORS ── */}
        <SectionToggle label="Color Palette" open={colorOpen} onToggle={() => setColorOpen(v => !v)} />
        {colorOpen && (
          <div style={{ padding: '0 12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {colorPalettes.map(p => {
              const isActive = activeTemplate.colors.primary === p.primary && activeTemplate.colors.accent === p.accent;
              return (
                <button
                  key={p.name}
                  onClick={() => onColorChange(p)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '8px',
                    border: `1px solid ${isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: p.primary }} />
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: p.accent }} />
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-ui-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── ZOOM ── */}
        <SectionToggle label="Preview Zoom" open={zoomOpen} onToggle={() => setZoomOpen(v => !v)} />
        {zoomOpen && (
          <div style={{ padding: '0 12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min={40} max={120} step={5}
                value={Math.round(zoom * 100)}
                onChange={e => onZoomChange(parseInt(e.target.value) / 100)}
                style={{ flex: 1, accentColor: 'var(--color-ui-accent)' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ui-accent)', minWidth: '40px', textAlign: 'right' }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[50, 65, 75, 90, 100].map(v => (
                <button
                  key={v}
                  onClick={() => onZoomChange(v / 100)}
                  style={{
                    padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                    border: `1px solid ${Math.round(zoom * 100) === v ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                    background: Math.round(zoom * 100) === v ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: Math.round(zoom * 100) === v ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionToggle({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--color-ui-text-muted)', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}
    >
      {label}
      {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </button>
  );
}
