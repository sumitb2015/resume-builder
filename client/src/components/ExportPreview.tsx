import React, { useState, useRef } from 'react';
import { useIsMobile, useWindowWidth } from '../hooks/useIsMobile';
import type { Resume, TemplateConfig } from '../shared/types';
import PagedPreview from './PagedPreview';
import TemplateRenderer from '../templates/TemplateRenderer';
import toast from 'react-hot-toast';
import { api, parseQuotaError } from '../lib/api';
import { buildPdfHtml } from '../lib/buildPdfHtml';
import { Download, Type, Move, Palette, Sparkles, Loader2, Undo2, Redo2, FileText as FileTextIcon } from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import QuotaWarningModal from './QuotaWarningModal';
import UsagePill from './UsagePill';
import { Button } from './ui/button';

// Resume Fonts - loaded only when Export view is active
import "@fontsource/playfair-display";
import "@fontsource/playfair-display/700.css";
import "@fontsource/eb-garamond";
import "@fontsource/eb-garamond/700.css";
import "@fontsource/dm-sans";
import "@fontsource/dm-sans/700.css";
import "@fontsource/poppins";
import "@fontsource/poppins/700.css";
import "@fontsource/cormorant-garamond";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/lato";
import "@fontsource/lato/700.css";
import "@fontsource/merriweather";
import "@fontsource/merriweather/700.css";
import "@fontsource/libre-baskerville";
import "@fontsource/libre-baskerville/700.css";
import "@fontsource/montserrat";
import "@fontsource/montserrat/700.css";
import "@fontsource/raleway";
import "@fontsource/raleway/700.css";
import "@fontsource/josefin-sans";
import "@fontsource/josefin-sans/700.css";
import "@fontsource/crimson-pro";
import "@fontsource/crimson-pro/700.css";
import "@fontsource/source-sans-3";
import "@fontsource/source-sans-3/700.css";

import { FONT_OPTIONS } from '../shared/constants';
import { FontSelect } from './FontSelect';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onUpdateConfig: (config: TemplateConfig) => void;
  onUpdateResume: (resume: Resume) => void;
  pageCount: number;
  onPageCount: (n: number) => void;
}

const SAFE_DEFAULTS = { margin: 15, fontSize: 100, lineHeight: 1.5 };

interface HistoryItem {
  resume: Resume;
  config: TemplateConfig;
}

const ExportPreview: React.FC<Props> = ({ resume, config, onUpdateConfig, onUpdateResume, pageCount, onPageCount }) => {
  const { canAccess, getRemainingUses, incrementLocalUsage } = usePlan();
  const [quotaModal, setQuotaModal] = useState<{ resetAt?: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'layout' | 'fonts' | 'colors'>('layout');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [targetPages, setTargetPages] = useState(1);
  const [userPrompt, setUserPrompt] = useState('');
  const isMobile = useIsMobile();
  const windowWidth = useWindowWidth();
  const [mobileSettingsView, setMobileSettingsView] = useState<'styles' | 'smartfit' | null>(null);

  // Undo/Redo State
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);

  const settings = { ...SAFE_DEFAULTS, ...(config.settings || {}) };

  const handleDownloadTxt = () => {
    const personal = resume.personal;
    let txt = `${personal.name}\n${personal.title}\n${personal.email} | ${personal.phone}\n${personal.location}\n`;
    if (personal.linkedin) txt += `LinkedIn: ${personal.linkedin}\n`;
    if (personal.website) txt += `Website: ${personal.website}\n`;
    txt += `\nSUMMARY\n${personal.summary.replace(/<[^>]*>?/gm, '')}\n`;

    txt += `\nEXPERIENCE\n`;
    resume.experience.forEach(exp => {
      txt += `\n${exp.company} - ${exp.role}\n${exp.startDate} - ${exp.endDate || (exp.isCurrent ? 'Present' : '')}\n`;
      exp.bullets.forEach(b => {
        txt += `- ${b.replace(/<[^>]*>?/gm, '')}\n`;
      });
    });

    txt += `\nEDUCATION\n`;
    resume.education.forEach(edu => {
      txt += `\n${edu.school}\n${edu.degree} in ${edu.field}\n${edu.startDate} - ${edu.endDate}\n`;
    });

    txt += `\nSKILLS\n`;
    txt += resume.skills.map(s => s.name).join(', ') + '\n';

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const filename = (personal.name || 'Resume').replace(/\s+/g, '_') + '.txt';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pushToHistory = (newResume: Resume, newConfig: TemplateConfig) => {
    setPast(prev => [...prev, { resume, config }]);
    setFuture([]); // Clear future on new action
    onUpdateResume(newResume);
    onUpdateConfig(newConfig);
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [{ resume, config }, ...prev]);
    setPast(newPast);
    
    onUpdateResume(previous.resume);
    onUpdateConfig(previous.config);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, { resume, config }]);
    setFuture(newFuture);
    
    onUpdateResume(next.resume);
    onUpdateConfig(next.config);
  };

  const updateSettings = (updates: Partial<typeof SAFE_DEFAULTS>) => {
    const newConfig = {
      ...config,
      settings: { ...settings, ...updates },
      modifiedFields: [], // Clear on manual change
    };
    pushToHistory(resume, newConfig);
  };

  const handleSmartFit = async () => {
    if (getRemainingUses('smartFit') === 0) {
      setQuotaModal({});
      return;
    }
    setIsOptimizing(true);

    try {
      const sanitizedResume = {
        ...resume,
        personal: { ...resume.personal, summary: resume.personal.summary.replace(/<[^>]*>?/gm, '') },
        experience: resume.experience.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(b => b.replace(/<[^>]*>?/gm, ''))
        })),
        projects: resume.projects.map(p => ({
          ...p,
          description: p.description.replace(/<[^>]*>?/gm, '')
        }))
      };

      const result = await api.smartFit(sanitizedResume, config, targetPages, userPrompt);
      
      const newConfig = {
        ...config,
        settings: { ...settings, ...result.suggestedSettings },
        modifiedFields: result.modifiedFields || [],
      };

      const newResume = { ...resume };
      if (result.refactoredResume.personal?.summary) {
        newResume.personal = { ...newResume.personal, summary: result.refactoredResume.personal.summary };
      }
      if (result.refactoredResume.experience) {
        newResume.experience = newResume.experience.map(exp => {
          const refactored = result.refactoredResume.experience?.find((r: any) => r.id === exp.id);
          return refactored ? { ...exp, bullets: refactored.bullets } : exp;
        });
      }
      if (result.refactoredResume.projects) {
        newResume.projects = newResume.projects.map(p => {
          const refactored = result.refactoredResume.projects?.find((r: any) => r.id === p.id);
          return refactored ? { ...p, description: refactored.description } : p;
        });
      }
      
      pushToHistory(newResume, newConfig);
      incrementLocalUsage('smartFit');
      setUserPrompt('');
    } catch (error) {
      const quotaErr = parseQuotaError(error);
      if (quotaErr) {
        setQuotaModal({ resetAt: quotaErr.resetAt });
      } else {
        console.error('Smart Fit error:', error);
        applyHeuristicFit();
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyHeuristicFit = () => {
    let newFontSize = settings.fontSize;
    let newMargin = settings.margin;
    let newLineHeight = settings.lineHeight;

    if (pageCount > 1) {
      newFontSize = Math.max(90, settings.fontSize - 4);
      newMargin = Math.max(10, settings.margin - 2);
      newLineHeight = Math.max(1.35, settings.lineHeight - 0.1);
    } else {
      newFontSize = Math.min(108, settings.fontSize + 4);
      newMargin = Math.min(20, settings.margin + 2);
      newLineHeight = Math.min(1.65, settings.lineHeight + 0.1);
    }

    const newConfig = {
      ...config,
      settings: { fontSize: newFontSize, margin: newMargin, lineHeight: newLineHeight },
      modifiedFields: [],
    };
    pushToHistory(resume, newConfig);
  };

  const updateFont = (key: 'heading' | 'body', value: string) => {
    const newConfig = { ...config, fonts: { ...config.fonts, [key]: value }, modifiedFields: [] };
    pushToHistory(resume, newConfig);
  };

  const updateColor = (key: keyof typeof config.colors, value: string) => {
    const newConfig = { ...config, colors: { ...config.colors, [key]: value }, modifiedFields: [] };
    pushToHistory(resume, newConfig);
  };

  const handlePrint = async () => {
    if (!printRef.current) {
      window.print();
      return;
    }

    setIsDownloading(true);
    try {
      const templateHtml = printRef.current.innerHTML;
      const html = buildPdfHtml(templateHtml, settings.margin);
      const rawName = resume.personal.name || 'Resume';
      const filename = rawName.replace(/[^\w\s\-]/g, '').trim() + '_Resume';

      const blob = await api.exportPdf(html, filename);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed, falling back to window.print():', err);
      setTimeout(() => window.print(), 150);
    } finally {
      setIsDownloading(false);
    }
  };

  const mobileScale = Math.min(0.8, (windowWidth - 32) / 794);

  // Calculate target page options: [1 ... pageCount+1]
  const targetPageOptions = Array.from({ length: Math.max(2, pageCount + 1) }, (_, i) => i + 1);

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      flex: 1,
      height: isMobile ? 'auto' : '100%',
      backgroundColor: 'var(--color-ui-bg)',
      color: 'var(--color-ui-text)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {quotaModal && (
        <QuotaWarningModal feature="smartFit" resetAt={quotaModal.resetAt} onClose={() => setQuotaModal(null)} />
      )}
      {/* ── LEFT CONFIG PANEL ─────────────────────────── */}
      <aside style={{
        width: isMobile ? '100%' : '320px',
        backgroundColor: 'var(--color-ui-surface)',
        borderRight: isMobile ? 'none' : '1px solid var(--color-ui-border)',
        borderBottom: isMobile ? '1px solid var(--color-ui-border)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: isMobile ? 'auto' : 'hidden',
        flexShrink: 0,
        zIndex: 100,
        ...(isMobile ? {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'auto',
          maxHeight: '85vh',
          transform: mobileSettingsView ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          borderTop: '1px solid var(--color-ui-border)',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        } : {})
      }}>
        {/* Mobile handle */}
        {isMobile && (
          <div 
            onClick={() => setMobileSettingsView(null)}
            style={{ width: '100%', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ width: '40px', height: '4px', background: 'var(--color-ui-border)', borderRadius: '2px' }} />
          </div>
        )}

        {/* Tab bar */}
        {(!isMobile || mobileSettingsView === 'styles') && (
          <div style={{ display: 'flex', padding: isMobile ? '0 12px 12px' : '12px', gap: '4px', flexShrink: 0, borderBottom: '1px solid var(--color-ui-border)' }}>
            {([
              { id: 'layout', icon: <Move size={14} />, label: 'Layout' },
              { id: 'fonts',  icon: <Type size={14} />, label: 'Type' },
              { id: 'colors', icon: <Palette size={14} />, label: 'Color' },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '8px',
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
        )}

        {/* Tab content area */}
        <div style={{ 
          flex: isMobile ? '0 1 auto' : 1, 
          overflowY: 'auto', 
          padding: isMobile ? '16px 20px 24px' : '20px' 
        }}>
          
          {/* ── AI SMART FIT ── */}
          {(!isMobile || mobileSettingsView === 'smartfit') && (
            <div style={{ marginBottom: isMobile ? '4px' : '28px', padding: '18px', borderRadius: '14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={15} color="#818CF8" />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6366F1' }}>AI Smart Fit</span>
                </div>
                
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={handleUndo}
                    disabled={past.length === 0}
                    title="Undo change"
                    style={{ 
                      padding: '6px', background: 'transparent', border: 'none', cursor: past.length === 0 ? 'default' : 'pointer',
                      color: past.length === 0 ? 'var(--color-ui-text-dim)' : 'var(--color-ui-text-muted)',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <Undo2 size={15} />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={future.length === 0}
                    title="Redo change"
                    style={{ 
                      padding: '6px', background: 'transparent', border: 'none', cursor: future.length === 0 ? 'default' : 'pointer',
                      color: future.length === 0 ? 'var(--color-ui-text-dim)' : 'var(--color-ui-text-muted)',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <Redo2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ui-text-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Target Pages</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {targetPageOptions.map(p => (
                    <button
                      key={p}
                      onClick={() => setTargetPages(p)}
                      style={{
                        minWidth: '40px', flex: 1, padding: '8px', fontSize: '12.5px', fontWeight: 700, borderRadius: '8px', border: '1px solid var(--color-ui-border)',
                        background: targetPages === p ? 'var(--color-ui-accent)' : 'var(--color-ui-surface)',
                        color: targetPages === p ? 'white' : 'var(--color-ui-text)',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ui-text-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Refinement Instructions</label>
                <textarea
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  placeholder="e.g. 'Shorten bullets to fit', 'Expand to fill space'"
                  className="field-textarea"
                  style={{ fontSize: '12px', minHeight: '60px', background: 'var(--color-ui-bg)' }}
                />
              </div>

              <button
                className="btn-primary"
                disabled={isOptimizing}
                onClick={handleSmartFit}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  gap: '8px',
                  background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
                }}
              >
                {isOptimizing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {isOptimizing ? 'Optimizing...' : 'Apply AI Smart Fit'}
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                <UsagePill feature="smartFit" />
              </div>
            </div>
          )}

          {/* ── TAB SPECIFIC CONTENT ── */}
          {(!isMobile || mobileSettingsView === 'styles') && (
            <>
              {activeTab === 'layout' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                </div>
              )}

              {activeTab === 'fonts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <FontSelect label="Heading Font" value={config.fonts.heading} options={FONT_OPTIONS} onChange={v => updateFont('heading', v)} />
                  <FontSelect label="Body Font" value={config.fonts.body} options={FONT_OPTIONS} onChange={v => updateFont('body', v)} />
                </div>
              )}

              {activeTab === 'colors' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <ColorControl label="Primary Brand Color" value={config.colors.primary} onChange={v => updateColor('primary', v)} />
                  <ColorControl label="Accent / Highlights"  value={config.colors.accent}  onChange={v => updateColor('accent', v)} />
                  <ColorControl label="Page Background" value={config.colors.background} onChange={v => updateColor('background', v)} />
                  {config.colors.sidebar !== undefined && (
                    <ColorControl label="Sidebar Background" value={config.colors.sidebar!} onChange={v => updateColor('sidebar', v)} />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Download action area */}
        {!isMobile && (
          <div style={{ padding: '20px', borderTop: '1px solid var(--color-ui-border)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-ui-bg)' }}>
            {canAccess('download-pdf') ? (
              <Button
                variant="default"
                className="w-full h-12 text-[14px] font-bold gap-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:opacity-90 border-none transition-all"
                onClick={handlePrint}
                disabled={isDownloading}
              >
                {isDownloading
                  ? <><Loader2 size={18} className="animate-spin" /> Preparing PDF…</>
                  : <><Download size={18} /> Export as PDF</>
                }
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button
                  variant="default"
                  className="w-full h-11 text-[13.5px] font-semibold gap-2 bg-[var(--color-ui-accent)] text-white shadow-md active:scale-[0.98] transition-all"
                  onClick={handleDownloadTxt}
                >
                  <FileTextIcon size={16} /> Download Plain Text (.txt)
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 text-[13.5px] font-semibold gap-2 border-dashed border-[var(--color-ui-border)] text-[var(--color-ui-text-muted)] hover:text-[var(--color-ui-text)] hover:bg-[var(--color-ui-surface-2)] active:scale-[0.98] transition-all"
                  onClick={() => toast.error('PDF Export requires a Basic, Pro, or Ultimate plan. Please upgrade to download as PDF.')}
                >
                  <Download size={16} /> Export PDF (Locked)
                </Button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Settings Toggle Overlay */}
      {isMobile && mobileSettingsView !== null && (
        <div 
          onClick={() => setMobileSettingsView(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(2px)' }} 
        />
      )}

      {/* ── CENTER PREVIEW VIEWPORT ─────────────────────── */}
      <main className="preview-viewport export-preview-viewport" style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: isMobile ? '32px 16px 120px' : '40px 20px 80px',
        backgroundColor: 'var(--color-ui-preview-bg)',
        height: isMobile ? 'auto' : '100%',
      }}>
        <div className="preview-scaler" style={{ transform: `scale(${isMobile ? mobileScale : 0.85})`, transformOrigin: 'top center' }}>
          <PagedPreview resume={resume} config={config} onPageCount={onPageCount} forcePageCount={pageCount} />
        </div>
      </main>

      {/* Mobile Actions: Style and Download */}
      {isMobile && (
        <div 
          className="no-print"
          style={{
            position: 'fixed', bottom: '0', left: '0', right: '0',
            display: 'flex', justifyContent: 'center', gap: '12px', padding: '10px 16px 16px',
            zIndex: 80,
            background: 'rgba(var(--color-ui-bg-rgb, 13, 17, 23), 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--color-ui-border)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.2)'
          }}
        >
          <Button
            variant="outline"
            onClick={() => setMobileSettingsView('styles')}
            className="flex-1 max-w-[100px] h-10 rounded-full font-bold gap-2 bg-[var(--color-ui-surface)] border-[var(--color-ui-border)] text-[var(--color-ui-text)] shadow-lg active:scale-95 transition-all"
          >
            <Palette size={16} />
            Style
          </Button>

          <Button
            variant="outline"
            disabled={isOptimizing}
            onClick={() => setMobileSettingsView('smartfit')}
            className="flex-1 max-w-[140px] h-10 rounded-full font-bold gap-2 bg-[var(--color-ui-surface)] border-[var(--color-ui-border)] text-[#6366F1] shadow-lg active:scale-95 transition-all"
          >
            {isOptimizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Smart Fit
          </Button>

          <Button
            variant="default"
            disabled={isDownloading}
            onClick={canAccess('download-pdf') ? handlePrint : handleDownloadTxt}
            className="flex-1 max-w-[160px] h-10 rounded-full font-bold gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white border-none shadow-[0_8px_24px_rgba(99,102,241,0.4)] active:scale-95 transition-all hover:opacity-90"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {canAccess('download-pdf') ? 'Export' : 'TXT'}
          </Button>
        </div>
      )}

      {/* Hidden off-screen render for Puppeteer PDF export */}
      <div
        ref={printRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '210mm',
          pointerEvents: 'none',
          opacity: 0,
          overflow: 'hidden',
        }}
      >
        <TemplateRenderer resume={resume} config={config} />
      </div>
    </div>
  );
};

/* ── UI HELPERS ─────────────────────────────────────────────── */

const SliderControl: React.FC<{
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}> = ({ label, value, display, min, max, step, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-ui-accent)', background: 'var(--color-ui-accent-subtle)', padding: '2px 8px', borderRadius: '6px' }}>{display}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: '100%', accentColor: 'var(--color-ui-accent)', cursor: 'pointer' }}
    />
  </div>
);

const ColorControl: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '44px', height: '40px', flexShrink: 0 }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            border: '1px solid var(--color-ui-border)', borderRadius: '10px',
            cursor: 'pointer', padding: '3px',
            backgroundColor: 'transparent',
          }}
        />
      </div>
      <input
        type="text"
        className="field-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}
      />
    </div>
  </div>
);

export default ExportPreview;
