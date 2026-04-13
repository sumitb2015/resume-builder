import { useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '../hooks/useIsMobile';
import { X, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import type { TemplateConfig, Resume } from '../shared/types';
import { colorPalettes } from '../templates';
import { usePlan } from '../contexts/PlanContext';
import type { Feature } from '../shared/constants';
import { FONT_OPTIONS } from '../shared/constants';
import TemplateRenderer from '../templates/TemplateRenderer';
import { FontSelect } from './FontSelect';

const SAMPLE_RESUME: Resume = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.design',
    summary: 'Results-driven designer with 8+ years crafting intuitive digital experiences. Led design teams at Fortune 500 companies delivering products used by millions.',
  },
  experience: [
    { id: '1', company: 'Stripe', role: 'Senior Product Designer', startDate: 'Jan 2021', endDate: '', isCurrent: true, bullets: ['Led redesign of core payment flow, increasing conversion by 23%', 'Managed team of 4 designers across 3 product lines'] },
    { id: '2', company: 'Airbnb', role: 'Product Designer', startDate: 'Mar 2018', endDate: 'Dec 2020', isCurrent: false, bullets: ['Redesigned host onboarding reducing drop-off by 35%'] },
  ],
  education: [{ id: '1', school: 'Stanford University', degree: 'B.S.', field: 'Computer Science', startDate: '2011', endDate: '2015', gpa: '3.9' }],
  skills: [{ id: '1', name: 'Figma', level: 95 }, { id: '2', name: 'React', level: 75 }, { id: '3', name: 'User Research', level: 88 }],
  projects: [], certifications: [], languages: [], custom: [],
};

// Panel is 300px wide, 12px padding each side = 276px content, 2px border each side = 272px inner
const THUMB_W = 272;
const TEMPLATE_W = 794;
const TEMPLATE_H = 1123;
const THUMB_SCALE = THUMB_W / TEMPLATE_W;
const THUMB_H = Math.round(TEMPLATE_H * THUMB_SCALE);

function TemplateThumbnail({ config }: { config: TemplateConfig }) {
  return (
    <div style={{ width: `${THUMB_W}px`, height: `${THUMB_H}px`, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ width: `${TEMPLATE_W}px`, transformOrigin: 'top left', transform: `scale(${THUMB_SCALE})`, pointerEvents: 'none', userSelect: 'none' }}>
        <TemplateRenderer resume={SAMPLE_RESUME} config={config} />
      </div>
    </div>
  );
}

// First 3 templates (by index in the full templates array) are available on Basic
const FREE_TEMPLATE_COUNT = 3;

interface Props {
  templates: TemplateConfig[];
  activeTemplate: TemplateConfig;
  onTemplateChange: (t: TemplateConfig) => void;
  onColorChange: (p: typeof colorPalettes[0]) => void;
  onFontChange: (key: 'heading' | 'body', value: string) => void;
  onClose: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

export default function StylePanel({ templates, activeTemplate, onTemplateChange, onColorChange, onFontChange, onClose, zoom, onZoomChange, onUpgradeNeeded }: Props) {
  const { canAccess } = usePlan();
  const isMobile = useIsMobile();
  const [tplOpen, setTplOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [fontOpen, setFontOpen] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(true);

  const categories = ['professional', 'minimal', 'creative'] as const;
  const [activeCat, setActiveCat] = useState<'all' | typeof categories[number]>('all');
  const filtered = activeCat === 'all' ? templates : templates.filter(t => t.category === activeCat);

  // IDs of the first FREE_TEMPLATE_COUNT templates (available on Basic)
  const freeTemplateIds = new Set(templates.slice(0, FREE_TEMPLATE_COUNT).map(t => t.id));

  const colorsLocked = !canAccess('style-colors');
  const fontsLocked = !canAccess('style-colors'); // Using same permission for now

  return (
    <div style={{
      width: isMobile ? '100%' : '300px', flexShrink: 0,
      background: 'var(--color-ui-surface)',
      borderLeft: isMobile ? 'none' : '1px solid var(--color-ui-border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: isMobile ? '60px' : '44px', flexShrink: 0,
        borderBottom: '1px solid var(--color-ui-border)',
      }}>
        <span style={{ fontSize: isMobile ? '14px' : '12px', fontWeight: 700, color: 'var(--color-ui-text)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Style
        </span>
        <button 
          className="btn-ghost" 
          style={{ padding: isMobile ? '12px' : '4px', borderRadius: '50%' }} 
          onClick={onClose}
        >
          <X size={isMobile ? 24 : 14} />
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

            {/* Template list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filtered.map(t => {
                const isActive = activeTemplate.id === t.id;
                const isLocked = !freeTemplateIds.has(t.id) && !canAccess('extra-templates');

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (isLocked) { onUpgradeNeeded('extra-templates'); return; }
                      onTemplateChange({ ...t });
                      toast.success(`Template: ${t.name}`);
                    }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0,
                      padding: 0, borderRadius: '10px', textAlign: 'left', overflow: 'hidden',
                      border: `2px solid ${isActive ? 'var(--color-ui-accent)' : isLocked ? 'rgba(168,85,247,0.2)' : 'var(--color-ui-border)'}`,
                      background: isActive ? 'rgba(99,102,241,0.1)' : 'var(--color-ui-bg)',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                      position: 'relative',
                      opacity: isLocked ? 0.7 : 1,
                    }}
                    title={isLocked ? 'Pro plan required' : t.name}
                  >
                    {/* Info row at top */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 10px 6px',
                      borderBottom: '1px solid var(--color-ui-border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.colors.primary, flexShrink: 0 }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.colors.accent, flexShrink: 0 }} />
                        <span style={{
                          fontSize: '11.5px', fontWeight: isActive ? 700 : 600,
                          color: isActive ? 'var(--color-ui-accent)' : isLocked ? 'rgba(192,132,252,0.7)' : 'var(--color-ui-text)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{t.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700,
                          color: t.atsScore >= 90 ? 'var(--color-success)' : 'var(--color-warning)',
                        }}>ATS {t.atsScore}%</span>
                        {isLocked && <Lock size={10} color="#C084FC" />}
                      </div>
                    </div>

                    {/* Full-width thumbnail */}
                    <div style={{ filter: isLocked ? 'grayscale(0.4)' : 'none' }}>
                      <TemplateThumbnail config={t} />
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
          <div style={{ padding: '0 12px 16px' }}>
            {/* Pro gate banner */}
            {colorsLocked && (
              <div
                onClick={() => onUpgradeNeeded('style-colors')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', borderRadius: '8px', marginBottom: '10px',
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(192,132,252,0.25)',
                  cursor: 'pointer',
                }}
              >
                <Lock size={12} color="#C084FC" />
                <span style={{ fontSize: '11.5px', color: '#C084FC', fontWeight: 600 }}>
                  Pro required — click to upgrade
                </span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', opacity: colorsLocked ? 0.45 : 1, pointerEvents: colorsLocked ? 'none' : 'auto' }}>
              {colorPalettes.map(p => {
                const isActive = activeTemplate.colors.primary === p.primary && activeTemplate.colors.accent === p.accent;
                return (
                  <button
                    key={p.name}
                    onClick={() => onColorChange(p)}
                    title={p.name}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      padding: '6px 4px', borderRadius: '8px',
                      border: `1px solid ${isActive ? 'var(--color-ui-accent)' : 'transparent'}`,
                      background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Two-tone circle swatch */}
                    <div style={{ position: 'relative', width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: isActive ? `0 0 0 2px var(--color-ui-accent), 0 0 0 4px rgba(99,102,241,0.2)` : '0 1px 3px rgba(0,0,0,0.3)' }}>
                      <div style={{ position: 'absolute', inset: 0, left: 0, width: '50%', background: p.primary }} />
                      <div style={{ position: 'absolute', inset: 0, left: '50%', width: '50%', background: p.accent }} />
                      {isActive && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                          <span style={{ color: 'white', fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '9px', color: isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)', fontWeight: isActive ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TYPOGRAPHY ── */}
        <SectionToggle label="Typography" open={fontOpen} onToggle={() => setFontOpen(v => !v)} />
        {fontOpen && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {/* Pro gate banner */}
             {fontsLocked && (
              <div
                onClick={() => onUpgradeNeeded('style-colors')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 12px', borderRadius: '8px', marginBottom: '0px',
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(192,132,252,0.25)',
                  cursor: 'pointer',
                }}
              >
                <Lock size={12} color="#C084FC" />
                <span style={{ fontSize: '11.5px', color: '#C084FC', fontWeight: 600 }}>
                  Pro required — click to upgrade
                </span>
              </div>
            )}
            <div style={{ opacity: fontsLocked ? 0.45 : 1, pointerEvents: fontsLocked ? 'none' : 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FontSelect 
                label="Heading Font" 
                value={activeTemplate.fonts.heading} 
                options={FONT_OPTIONS} 
                onChange={v => onFontChange('heading', v)} 
              />
              <FontSelect 
                label="Body Font" 
                value={activeTemplate.fonts.body} 
                options={FONT_OPTIONS} 
                onChange={v => onFontChange('body', v)} 
              />
            </div>
          </div>
        )}

        {/* ── ZOOM ── */}
        <SectionToggle label="Preview Zoom" open={zoomOpen} onToggle={() => setZoomOpen(v => !v)} />
        {zoomOpen && (
          <div style={{ padding: '0 12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="range" min={40} max={120} step={5} value={Math.round(zoom * 100)} onChange={e => onZoomChange(parseInt(e.target.value) / 100)} style={{ flex: 1, accentColor: 'var(--color-ui-accent)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ui-accent)', minWidth: '40px', textAlign: 'right' }}>{Math.round(zoom * 100)}%</span>
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
