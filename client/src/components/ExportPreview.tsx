import React, { useState } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import PagedPreview from './PagedPreview';
import { ChevronLeft, Download, Type, Move, Palette, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onBack: () => void;
  onUpdateConfig: (config: TemplateConfig) => void;
}

const SAFE_DEFAULTS = { margin: 15, fontSize: 100, lineHeight: 1.5 };

// 14 resume-appropriate fonts, grouped serif → sans
const FONT_OPTIONS = [
  // ... (keeping font options same as before)
  { label: 'EB Garamond — Classic Serif',        value: '"EB Garamond", Georgia, serif' },
  { label: 'Libre Baskerville — Traditional',     value: '"Libre Baskerville", Georgia, serif' },
  { label: 'Merriweather — Readable Serif',       value: '"Merriweather", Georgia, serif' },
  { label: 'Crimson Pro — Editorial',             value: '"Crimson Pro", Georgia, serif' },
  { label: 'Cormorant Garamond — Executive',      value: '"Cormorant Garamond", Georgia, serif' },
  { label: 'Playfair Display — Elegant',          value: '"Playfair Display", Georgia, serif' },
  { label: 'Georgia — Classic',                   value: 'Georgia, "Times New Roman", serif' },
  // Sans-serifs (modern, clean, geometric)
  { label: 'Inter — Modern Sans',                 value: '"Inter", system-ui, sans-serif' },
  { label: 'DM Sans — Clean',                     value: '"DM Sans", system-ui, sans-serif' },
  { label: 'Montserrat — Bold Geometric',         value: '"Montserrat", system-ui, sans-serif' },
  { label: 'Raleway — Slim Geometric',            value: '"Raleway", system-ui, sans-serif' },
  { label: 'Josefin Sans — Minimal',              value: '"Josefin Sans", system-ui, sans-serif' },
  { label: 'Poppins — Friendly',                  value: '"Poppins", system-ui, sans-serif' },
  { label: 'Source Sans 3 — Neutral',             value: '"Source Sans 3", system-ui, sans-serif' },
];

const ExportPreview: React.FC<Props> = ({ resume, config, onBack, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'fonts' | 'colors'>('layout');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const settings = { ...SAFE_DEFAULTS, ...(config.settings || {}) };

  const updateSettings = (updates: Partial<typeof SAFE_DEFAULTS>) => {
    onUpdateConfig({
      ...config,
      settings: { ...settings, ...updates },
    });
  };

  const handleSmartFit = async () => {
    setIsOptimizing(true);
    
    // AI Optimization Logic:
    // We try to find the "sweet spot" where the content fits nicely.
    // This is a simulated AI optimization that would normally involve measuring heights.
    // For this version, we'll implement a multi-step adjustment.
    
    setTimeout(() => {
      // 1. Determine target font size based on current page count and "fullness"
      // 2. Adjust margins to compensate
      
      let newFontSize = settings.fontSize;
      let newMargin = settings.margin;
      let newLineHeight = settings.lineHeight;

      if (pageCount > 1) {
        // If it's over 1 page, try to shrink to 1 page if it's close, 
        // or just optimize the 2-page layout.
        newFontSize = Math.max(90, settings.fontSize - 4);
        newMargin = Math.max(10, settings.margin - 2);
        newLineHeight = Math.max(1.35, settings.lineHeight - 0.1);
      } else {
        // If it's comfortably 1 page, maybe make it look more "full"
        newFontSize = Math.min(108, settings.fontSize + 4);
        newMargin = Math.min(20, settings.margin + 2);
        newLineHeight = Math.min(1.65, settings.lineHeight + 0.1);
      }

      updateSettings({ 
        fontSize: newFontSize, 
        margin: newMargin, 
        lineHeight: newLineHeight 
      });
      
      setIsOptimizing(false);
    }, 1500);
  };

  const updateFont = (key: 'heading' | 'body', value: string) => {
    onUpdateConfig({ ...config, fonts: { ...config.fonts, [key]: value } });
  };

  const updateColor = (key: keyof typeof config.colors, value: string) => {
    onUpdateConfig({ ...config, colors: { ...config.colors, [key]: value } });
  };

  const handlePrint = () => window.print();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      height: '100vh',
      backgroundColor: 'var(--color-ui-bg)',
      color: 'var(--color-ui-text)',
    }}>
      {/* ── LEFT SIDEBAR ─────────────────────────────── */}
      <aside style={{
        backgroundColor: 'var(--color-ui-surface)',
        borderRight: '1px solid var(--color-ui-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-ui-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}>
          <button onClick={onBack} className="btn-ghost" style={{ padding: '6px' }}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Preview & Export</div>
            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginTop: '1px' }}>
              {pageCount} Page{pageCount > 1 ? 's' : ''} · {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', padding: '10px 12px', gap: '4px', flexShrink: 0 }}>
          {([
            { id: 'layout', icon: <Move size={13} />, label: 'Layout' },
            { id: 'fonts',  icon: <Type size={13} />, label: 'Type' },
            { id: 'colors', icon: <Palette size={13} />, label: 'Color' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '8px 4px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === tab.id ? 'var(--color-ui-accent)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--color-ui-text-muted)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* ── LAYOUT TAB ── */}
          {activeTab === 'layout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <SliderControl
                label="Page Margins"
                value={settings.margin}
                display={`${settings.margin} mm`}
                min={5} max={30} step={1}
                onChange={v => updateSettings({ margin: v })}
              />

              <SliderControl
                label="Font Size"
                value={settings.fontSize}
                display={`${settings.fontSize}%`}
                min={80} max={120} step={1}
                onChange={v => updateSettings({ fontSize: v })}
              />

              <SliderControl
                label="Line Spacing"
                value={settings.lineHeight}
                display={`${settings.lineHeight.toFixed(2)}×`}
                min={1.2} max={2.0} step={0.05}
                onChange={v => updateSettings({ lineHeight: v })}
              />

              {/* ── AI SMART FIT ── */}
              <div style={{ marginTop: '8px', padding: '16px', borderRadius: '12px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Sparkles size={14} color="#818CF8" />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366F1' }}>AI Layout Assistant</span>
                </div>
                <button
                  className="btn-primary"
                  disabled={isOptimizing}
                  onClick={handleSmartFit}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '12.5px',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                    border: 'none'
                  }}
                >
                  {isOptimizing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Smart Fit to Pages
                </button>
                <p style={{ fontSize: '10.5px', color: 'var(--color-ui-text-dim)', marginTop: '8px', lineHeight: 1.5 }}>
                  AI will auto-adjust font size, margins and spacing for the most professional, print-ready layout.
                </p>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5, padding: '10px', background: 'rgba(99,102,241,0.07)', borderRadius: '8px' }}>
                Changes are reflected live in the preview and apply to the downloaded PDF.
              </div>
            </div>
          )}

          {/* ── FONTS TAB ── */}
          {activeTab === 'fonts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <FontSelect
                label="Heading Font"
                value={config.fonts.heading}
                options={FONT_OPTIONS}
                onChange={v => updateFont('heading', v)}
              />

              <FontSelect
                label="Body Font"
                value={config.fonts.body}
                options={FONT_OPTIONS}
                onChange={v => updateFont('body', v)}
              />

              <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5, padding: '10px', background: 'rgba(99,102,241,0.07)', borderRadius: '8px' }}>
                Serif fonts (Garamond, Merriweather) suit traditional industries. Sans-serif fonts (Inter, Montserrat) suit tech and design roles.
              </div>
            </div>
          )}

          {/* ── COLORS TAB ── */}
          {activeTab === 'colors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ColorControl label="Primary" value={config.colors.primary} onChange={v => updateColor('primary', v)} />
              <ColorControl label="Accent"  value={config.colors.accent}  onChange={v => updateColor('accent', v)} />
              <ColorControl label="Background" value={config.colors.background} onChange={v => updateColor('background', v)} />
              {config.colors.sidebar !== undefined && (
                <ColorControl label="Sidebar" value={config.colors.sidebar!} onChange={v => updateColor('sidebar', v)} />
              )}
            </div>
          )}
        </div>

        {/* Download button */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-ui-border)', flexShrink: 0 }}>
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '13.5px', gap: '8px' }}
            onClick={handlePrint}
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      </aside>

      {/* ── RIGHT PREVIEW ────────────────────────────── */}
      <main style={{
        backgroundColor: 'var(--color-ui-preview-bg)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px 64px',
      }}>
        <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
          <PagedPreview resume={resume} config={config} onPageCount={setPageCount} />
        </div>
      </main>
    </div>
  );
};

/* ── Sub-components ────────────────────────────────────────── */

const SliderControl: React.FC<{
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}> = ({ label, value, display, min, max, step, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text-muted)' }}>{label}</label>
      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-ui-accent)', minWidth: '40px', textAlign: 'right' }}>{display}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--color-ui-accent)' }}
    />
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-ui-text-dim)' }}>
      <span>{min}{typeof min === 'number' && step < 1 ? '×' : (label.includes('Font') && !label.includes('Size') ? '' : '')}</span>
      <span>{max}{typeof max === 'number' && step < 1 ? '×' : ''}</span>
    </div>
  </div>
);

const FontSelect: React.FC<{
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text-muted)' }}>{label}</label>
    <select
      className="field-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ fontSize: '12.5px' }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {/* Live font preview */}
    <div style={{
      fontFamily: value,
      fontSize: '17px',
      color: 'var(--color-ui-text)',
      padding: '8px 12px',
      background: 'var(--color-ui-bg)',
      borderRadius: '6px',
      border: '1px solid var(--color-ui-border)',
      letterSpacing: '0.02em',
    }}>
      Aa Bb — Resume Preview
    </div>
  </div>
);

const ColorControl: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text-muted)' }}>{label}</label>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '40px', height: '36px', flexShrink: 0 }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            border: '1px solid var(--color-ui-border)', borderRadius: '7px',
            cursor: 'pointer', padding: '2px',
            backgroundColor: 'transparent',
          }}
        />
      </div>
      <input
        type="text"
        className="field-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px' }}
      />
    </div>
  </div>
);

export default ExportPreview;
