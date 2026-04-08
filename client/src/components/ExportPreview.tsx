import React, { useState } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import PagedPreview from './PagedPreview';
import { ChevronLeft, Download, Type, Move, Maximize, Palette, Layout } from 'lucide-react';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onBack: () => void;
  onUpdateConfig: (config: TemplateConfig) => void;
}

const ExportPreview: React.FC<Props> = ({ resume, config, onBack, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'fonts' | 'colors'>('layout');

  const updateSettings = (key: string, value: any) => {
    onUpdateConfig({
      ...config,
      settings: {
        ...(config.settings || { margin: 15, padding: 18, fontSize: 100 }),
        [key]: value
      }
    });
  };

  const updateColor = (key: keyof typeof config.colors, value: string) => {
    onUpdateConfig({
      ...config,
      colors: {
        ...config.colors,
        [key]: value
      }
    });
  };

  const currentSettings = config.settings || { margin: 15, padding: 18, fontSize: 100 };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="preview-page-container" style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      height: '100vh',
      backgroundColor: 'var(--color-ui-bg)',
      color: 'var(--color-ui-text)'
    }}>
      {/* Left Sidebar Settings */}
      <aside style={{
        backgroundColor: 'var(--color-ui-surface)',
        borderRight: '1px solid var(--color-ui-border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onBack}
            className="btn-ghost"
            style={{ padding: '8px' }}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Preview & Style</h1>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', padding: '12px', gap: '4px' }}>
          <button 
            onClick={() => setActiveTab('layout')}
            className={`preview-tab ${activeTab === 'layout' ? 'active' : ''}`}
          >
            <Move size={14} /> Layout
          </button>
          <button 
            onClick={() => setActiveTab('fonts')}
            className={`preview-tab ${activeTab === 'fonts' ? 'active' : ''}`}
          >
            <Type size={14} /> Type
          </button>
          <button 
            onClick={() => setActiveTab('colors')}
            className={`preview-tab ${activeTab === 'colors' ? 'active' : ''}`}
          >
            <Palette size={14} /> Color
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {activeTab === 'layout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SettingGroup label="Margins" value={`${currentSettings.margin}mm`}>
                <input 
                  type="range" min="5" max="30" step="1"
                  value={currentSettings.margin}
                  onChange={(e) => updateSettings('margin', parseInt(e.target.value))}
                  className="preview-slider"
                />
              </SettingGroup>
              
              <SettingGroup label="Internal Padding" value={`${currentSettings.padding}mm`}>
                <input 
                  type="range" min="5" max="40" step="1"
                  value={currentSettings.padding}
                  onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                  className="preview-slider"
                />
              </SettingGroup>

              <SettingGroup label="Page Break Optimization">
                <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginBottom: '10px' }}>
                  Adjust settings to avoid awkward splits in your experience entries.
                </p>
              </SettingGroup>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SettingGroup label="Global Font Size" value={`${currentSettings.fontSize}%`}>
                <input 
                  type="range" min="80" max="120" step="1"
                  value={currentSettings.fontSize}
                  onChange={(e) => updateSettings('fontSize', parseInt(e.target.value))}
                  className="preview-slider"
                />
              </SettingGroup>

              <SettingGroup label="Heading Font">
                <select 
                  className="field-input"
                  value={config.fonts.heading}
                  onChange={(e) => onUpdateConfig({ ...config, fonts: { ...config.fonts, heading: e.target.value }})}
                >
                  <option value='"Inter", system-ui, sans-serif'>Inter (Modern)</option>
                  <option value='"EB Garamond", Georgia, serif'>EB Garamond (Elegant)</option>
                  <option value='"Poppins", system-ui, sans-serif'>Poppins (Geometric)</option>
                  <option value='"DM Sans", system-ui, sans-serif'>DM Sans (Clean)</option>
                  <option value='"Cormorant Garamond", Georgia, serif'>Cormorant (Executive)</option>
                  <option value='Georgia, "Times New Roman", serif'>Classic Serif</option>
                </select>
              </SettingGroup>

              <SettingGroup label="Body Font">
                <select 
                  className="field-input"
                  value={config.fonts.body}
                  onChange={(e) => onUpdateConfig({ ...config, fonts: { ...config.fonts, body: e.target.value }})}
                >
                  <option value='"Inter", system-ui, sans-serif'>Inter</option>
                  <option value='"EB Garamond", Georgia, serif'>EB Garamond</option>
                  <option value='"Poppins", system-ui, sans-serif'>Poppins</option>
                  <option value='"DM Sans", system-ui, sans-serif'>DM Sans</option>
                  <option value='system-ui, sans-serif'>System UI</option>
                </select>
              </SettingGroup>
            </div>
          )}

          {activeTab === 'colors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <SettingGroup label="Primary Color">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={config.colors.primary}
                    onChange={(e) => updateColor('primary', e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                  />
                  <input 
                    type="text" 
                    className="field-input" 
                    value={config.colors.primary} 
                    onChange={(e) => updateColor('primary', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </SettingGroup>

              <SettingGroup label="Accent Color">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={config.colors.accent}
                    onChange={(e) => updateColor('accent', e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                  />
                  <input 
                    type="text" 
                    className="field-input" 
                    value={config.colors.accent} 
                    onChange={(e) => updateColor('accent', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </SettingGroup>

              <SettingGroup label="Background Color">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={config.colors.background}
                    onChange={(e) => updateColor('background', e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                  />
                  <input 
                    type="text" 
                    className="field-input" 
                    value={config.colors.background} 
                    onChange={(e) => updateColor('background', e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
              </SettingGroup>

              {config.colors.sidebar && (
                 <SettingGroup label="Sidebar Color">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                        type="color" 
                        value={config.colors.sidebar}
                        onChange={(e) => updateColor('sidebar', e.target.value)}
                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                    <input 
                        type="text" 
                        className="field-input" 
                        value={config.colors.sidebar} 
                        onChange={(e) => updateColor('sidebar', e.target.value)}
                        style={{ flex: 1 }}
                    />
                    </div>
                </SettingGroup>
              )}
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--color-ui-border)' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '14px', gap: '10px' }}
            onClick={handlePrint}
          >
            <Download size={18} /> Download PDF
          </button>
        </div>
      </aside>

      {/* Right Preview Area */}
      <main style={{ 
        backgroundColor: 'var(--color-ui-preview-bg)', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px'
      }}>
        <div className="preview-scaler" style={{ transform: 'scale(0.95)' }}>
            <PagedPreview resume={resume} config={config} />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .preview-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-ui-text-muted);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .preview-tab:hover {
          color: var(--color-ui-text);
          background: rgba(255,255,255,0.05);
        }
        .preview-tab.active {
          color: white;
          background: var(--color-ui-accent);
        }
        .preview-slider {
          width: 100%;
          height: 6px;
          background: var(--color-ui-border);
          border-radius: 5px;
          outline: none;
          appearance: none;
        }
        .preview-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: var(--color-ui-accent);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}} />
    </div>
  );
};

const SettingGroup: React.FC<{ label: string; value?: string; children?: React.ReactNode }> = ({ label, value, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label className="field-label" style={{ marginBottom: 0 }}>{label}</label>
      {value && <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-accent)' }}>{value}</span>}
    </div>
    {children}
  </div>
);

export default ExportPreview;
