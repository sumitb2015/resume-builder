import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import LandingPage from './components/LandingPage';
import ResumeBuilder from './components/ResumeBuilder';
import ModeSelectModal from './components/ModeSelectModal';
import PagedPreview from './components/PagedPreview';
import TemplateRenderer from './templates/TemplateRenderer';
import { templates, colorPalettes } from './templates';
import { api } from './lib/api';
import type { Resume, TemplateConfig, ImprovementSuggestions } from './shared/types';
import './index.css';
import {
  Download, ZoomIn, ZoomOut, Zap, X, Sparkles,
  ChevronDown, Loader2, Check, AlertCircle, ChevronLeft, ChevronRight, FileText
} from 'lucide-react';

const initialResume: Resume = {
  personal: {
    name: 'ALEX MORGAN',
    title: 'Senior Product Designer',
    email: 'alex@morgan.dev',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    website: 'alexmorgan.design',
    summary: 'Multi-disciplinary designer with 10+ years crafting digital products used by millions. Expert in UX/UI design, design systems, and product strategy with a track record of improving user retention and engagement.',
  },
  experience: [
    {
      id: '1',
      company: 'Stripe',
      role: 'Lead Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Led redesign of the core payments dashboard, increasing user task completion by 42%.',
        'Built and maintained a comprehensive design system adopted by 80+ engineers across 6 teams.',
        'Mentored 4 junior designers and established design critique culture used company-wide.',
      ],
    },
    {
      id: '2',
      company: 'Airbnb',
      role: 'Senior UX Designer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      isCurrent: false,
      bullets: [
        'Redesigned the host onboarding flow, reducing drop-off rate by 28% and increasing listings by 15K/month.',
        'Collaborated with data science to create A/B testing framework for design decisions.',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Carnegie Mellon University',
      degree: 'M.Des.',
      field: 'Interaction Design',
      startDate: 'Aug 2015',
      endDate: 'May 2017',
      gpa: '3.9',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 100 },
    { id: '2', name: 'Product Strategy', level: 90 },
    { id: '3', name: 'Design Systems', level: 95 },
    { id: '4', name: 'User Research', level: 85 },
    { id: '5', name: 'Prototyping', level: 90 },
  ],
  projects: [
    { id: '1', title: 'OpenDesign', description: 'Open-source design system with 200+ components used by 5k+ developers.', url: 'github.com/alexm/opendesign', tech: ['Figma', 'React', 'Storybook'] },
  ],
  certifications: [],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Intermediate' },
  ],
  custom: [],
};

type ModalType = 'tailor' | 'ats' | null;

function App() {
  const [view, setView] = useState<'landing' | 'mode-select' | 'builder'>('landing');
  const [resume, setResume] = useState<Resume>(initialResume);
  const [improvements, setImprovements] = useState<ImprovementSuggestions | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateConfig>({ ...templates[1]! });
  const [zoom, setZoom] = useState(0.75);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pageCount, setPageCount] = useState(1);

  // Tailor modal state
  const [jd, setJd] = useState('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    missingKeywords: string[];
    rewrittenBullets: { original: string; suggested: string }[];
    suggestedSummary: string;
  } | null>(null);

  // ATS modal state
  const [atsJd, setAtsJd] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    missingKeywords: string[];
    weakSections: string[];
    feedback: string;
  } | null>(null);

  // Color palette
  const [showPalette, setShowPalette] = useState(false);

  // Template strip scroll
  const stripRef = useRef<HTMLDivElement>(null);
  const scrollStrip = (dir: 'left' | 'right') => {
    if (stripRef.current) stripRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const handlePaletteSelect = (palette: typeof colorPalettes[0]) => {
    setActiveTemplate(prev => ({
      ...prev,
      colors: { ...prev.colors, primary: palette.primary, accent: palette.accent },
    }));
    setShowPalette(false);
  };

  const handleTailor = async () => {
    if (!jd.trim()) return;
    setTailorLoading(true);
    setTailorResult(null);
    try {
      const result = await api.tailorResume(resume, jd);
      setTailorResult(result);
    } catch {
      alert('AI unavailable. Make sure the server is running with OPENAI_API_KEY set.');
    } finally {
      setTailorLoading(false);
    }
  };

  const applyTailorSuggestion = (type: 'summary' | 'bullet', value: string, originalBullet?: string) => {
    if (type === 'summary') {
      setResume(prev => ({ ...prev, personal: { ...prev.personal, summary: value } }));
    } else if (type === 'bullet' && originalBullet) {
      setResume(prev => ({
        ...prev,
        experience: prev.experience.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(b => b === originalBullet ? value : b),
        })),
      }));
    }
  };

  const handleAtsScore = async () => {
    if (!atsJd.trim()) return;
    setAtsLoading(true);
    setAtsResult(null);
    try {
      const result = await api.atsScore(resume, atsJd);
      setAtsResult(result);
    } catch {
      alert('AI unavailable. Make sure the server is running with OPENAI_API_KEY set.');
    } finally {
      setAtsLoading(false);
    }
  };

  const handleExportPdf = () => window.print();

  const handleModeSelect = (
    _mode: 'manual' | 'enhance' | 'linkedin',
    prefilledResume?: Resume,
    suggestions?: ImprovementSuggestions
  ) => {
    if (prefilledResume) setResume(prefilledResume);
    if (suggestions) setImprovements(suggestions);
    setView('builder');
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('mode-select')} />;
  }

  if (view === 'mode-select') {
    return <ModeSelectModal onSelect={handleModeSelect} onBack={() => setView('landing')} />;
  }

  return (
    <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <header className="top-bar no-print">
        {/* Left: Logo + Template Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }}
            onClick={() => setView('landing')}
          >
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />

          {/* Template strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              className="btn-ghost"
              style={{ padding: '4px', borderRadius: '6px', flexShrink: 0 }}
              onClick={() => scrollStrip('left')}
            >
              <ChevronLeft size={14} />
            </button>
            <div
              ref={stripRef}
              style={{
                display: 'flex', gap: '6px', overflowX: 'hidden', maxWidth: '420px',
                scrollBehavior: 'smooth', padding: '2px 0',
              }}
            >
              {templates.map(t => {
                const isActive = activeTemplate.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate({ ...t })}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      padding: '6px 10px', borderRadius: '8px', border: `1.5px solid ${isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                      background: isActive ? 'rgba(99,102,241,0.12)' : 'var(--color-ui-bg)',
                      cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0, minWidth: '64px',
                    }}
                    title={t.name}
                  >
                    {/* Mini preview thumbnail */}
                    <div style={{
                      width: '40px', height: '28px', borderRadius: '3px', overflow: 'hidden',
                      background: t.colors.background || '#fff',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative',
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: t.colors.primary, opacity: 0.9 }} />
                      <div style={{ position: 'absolute', top: '10px', left: '3px', right: '3px', height: '2px', background: t.colors.accent, borderRadius: '1px', opacity: 0.7 }} />
                      <div style={{ position: 'absolute', top: '14px', left: '3px', right: '8px', height: '1.5px', background: '#ccc', borderRadius: '1px' }} />
                      <div style={{ position: 'absolute', top: '17px', left: '3px', right: '12px', height: '1.5px', background: '#ccc', borderRadius: '1px' }} />
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                      whiteSpace: 'nowrap', letterSpacing: '0.01em',
                    }}>
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              className="btn-ghost"
              style={{ padding: '4px', borderRadius: '6px', flexShrink: 0 }}
              onClick={() => scrollStrip('right')}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Color palette */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', gap: '6px' }}
              onClick={() => setShowPalette(v => !v)}
            >
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeTemplate.colors.primary }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeTemplate.colors.accent }} />
              </div>
              Color
              <ChevronDown size={11} />
            </button>
            {showPalette && (
              <div style={{
                position: 'absolute', top: '100%', left: '0', marginTop: '6px', zIndex: 200,
                background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
                borderRadius: '12px', padding: '12px', width: '220px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              }}>
                <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Color Palette
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {colorPalettes.map(p => (
                    <button
                      key={p.name}
                      onClick={() => handlePaletteSelect(p)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-ui-border)',
                        background: 'transparent', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-ui-surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: p.primary }} />
                        <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: p.accent }} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-ui-text)', fontWeight: 500 }}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Zoom + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'var(--color-ui-bg)', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}>
            <button className="btn-ghost" style={{ padding: '3px' }} onClick={() => setZoom(z => Math.max(0.4, z - 0.05))}>
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ui-accent)', minWidth: '36px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button className="btn-ghost" style={{ padding: '3px' }} onClick={() => setZoom(z => Math.min(1.2, z + 0.05))}>
              <ZoomIn size={14} />
            </button>
          </div>

          <button className="btn-primary" style={{ gap: '6px', fontSize: '13px' }} onClick={handleExportPdf}>
            <Download size={14} />
            Export PDF
          </button>
        </div>
      </header>

      {/* ── MAIN SPLIT ──────────────────────────────── */}
      <div className="main-split">
        {/* Editor */}
        <aside style={{ height: '100%', overflow: 'hidden' }} className="no-print">
          <ResumeBuilder
            resume={resume}
            onChange={setResume}
            onTailor={() => { setActiveModal('tailor'); setTailorResult(null); }}
            onAtsScore={() => { setActiveModal('ats'); setAtsResult(null); }}
            improvements={improvements}
            onDismissImprovements={() => setImprovements(null)}
          />
        </aside>

        {/* Preview */}
        <main className="preview-viewport">
          {/* Preview toolbar */}
          <div className="no-print" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
                {activeTemplate.name}
              </span>
              <div style={{ width: '1px', height: '12px', background: 'var(--color-ui-border)' }} />
              <span style={{ fontSize: '11px', color: activeTemplate.atsScore >= 90 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                {activeTemplate.atsScore >= 90 ? '✓' : '⚠'} ATS {activeTemplate.atsScore}%
              </span>
              <div style={{ width: '1px', height: '12px', background: 'var(--color-ui-border)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: pageCount > 1 ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)', fontWeight: pageCount > 1 ? 700 : 500 }}>
                <FileText size={11} /> A4 · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['professional', 'minimal', 'creative'] as const).map(cat => (
                <span key={cat} style={{
                  padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: 600,
                  background: activeTemplate.category === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: activeTemplate.category === cat ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                  border: `1px solid ${activeTemplate.category === cat ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  textTransform: 'capitalize',
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="preview-scaler" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            <PagedPreview resume={resume} config={activeTemplate} onPageCount={setPageCount} />
          </div>
        </main>
      </div>

      {/* ── JOB TAILOR MODAL ─────────────────────────── */}
      {activeModal === 'tailor' && (
        <div className="modal-overlay no-print" onClick={e => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
                  <Sparkles size={16} style={{ display: 'inline', marginRight: '8px', color: '#818CF8' }} />
                  Intelligent Job Tailoring
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>Paste a job description to optimize your resume for it</p>
              </div>
              <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
              {!tailorResult ? (
                <div>
                  <label className="field-label">Job Description</label>
                  <textarea
                    className="field-textarea"
                    rows={10}
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                    placeholder="Paste the full job description here..."
                    style={{ fontSize: '13px' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Missing Keywords */}
                  {tailorResult.missingKeywords.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px' }}>
                        Missing Keywords
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {tailorResult.missingKeywords.map(k => (
                          <span key={k} style={{ padding: '4px 10px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: '100px', fontSize: '12px', color: '#F87171' }}>
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bullet Rewrites */}
                  {tailorResult.rewrittenBullets.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '12px' }}>
                        Suggested Bullet Rewrites
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {tailorResult.rewrittenBullets.map((b, i) => (
                          <div key={i} style={{ padding: '14px', background: 'var(--color-ui-bg)', borderRadius: '10px', border: '1px solid var(--color-ui-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              Before
                            </div>
                            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>{b.original}</p>
                            <div style={{ fontSize: '11px', color: '#4ADE80', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              After
                            </div>
                            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text)', lineHeight: 1.6, marginBottom: '12px' }}>{b.suggested}</p>
                            <button
                              className="btn-primary"
                              style={{ fontSize: '12px', padding: '6px 14px' }}
                              onClick={() => applyTailorSuggestion('bullet', b.suggested, b.original)}
                            >
                              <Check size={12} /> Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Summary */}
                  {tailorResult.suggestedSummary && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px' }}>
                        Tailored Summary
                      </div>
                      <div style={{ padding: '14px', background: 'var(--color-ui-bg)', borderRadius: '10px', border: '1px solid var(--color-ui-border)' }}>
                        <p style={{ fontSize: '13px', color: 'var(--color-ui-text)', lineHeight: 1.7, marginBottom: '12px' }}>{tailorResult.suggestedSummary}</p>
                        <button
                          className="btn-primary"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                          onClick={() => applyTailorSuggestion('summary', tailorResult.suggestedSummary)}
                        >
                          <Check size={12} /> Apply Summary
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
              {tailorResult ? (
                <>
                  <button className="btn-secondary" onClick={() => setTailorResult(null)}>Try Again</button>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Done</button>
                </>
              ) : (
                <>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="btn-primary" onClick={handleTailor} disabled={tailorLoading || !jd.trim()}>
                    {tailorLoading ? <><Loader2 size={14} className="spin" /> Analyzing…</> : <><Sparkles size={14} /> Tailor Resume</>}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ATS SCORE MODAL ──────────────────────────── */}
      {activeModal === 'ats' && (
        <div className="modal-overlay no-print" onClick={e => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
                  ATS Compatibility Score
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>Check how well your resume matches a job description</p>
              </div>
              <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
              {!atsResult ? (
                <div>
                  <label className="field-label">Job Description</label>
                  <textarea
                    className="field-textarea"
                    rows={9}
                    value={atsJd}
                    onChange={e => setAtsJd(e.target.value)}
                    placeholder="Paste the job description to analyze your match..."
                    style={{ fontSize: '13px' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Score ring */}
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '120px', height: '120px', borderRadius: '50%',
                      background: `conic-gradient(${atsResult.score >= 80 ? '#4ADE80' : atsResult.score >= 60 ? '#F59E0B' : '#F87171'} ${atsResult.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      boxShadow: '0 0 30px rgba(0,0,0,0.3)',
                    }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--color-ui-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)' }}>{atsResult.score}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 600 }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 700, color: atsResult.score >= 80 ? '#4ADE80' : atsResult.score >= 60 ? '#F59E0B' : '#F87171' }}>
                      {atsResult.score >= 80 ? '✓ Strong Match' : atsResult.score >= 60 ? '⚠ Moderate Match' : '✗ Needs Work'}
                    </div>
                  </div>

                  {/* Feedback */}
                  {atsResult.feedback && (
                    <div style={{ padding: '14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Feedback</div>
                      <p style={{ fontSize: '13px', color: 'var(--color-ui-text)', lineHeight: 1.65 }}>{atsResult.feedback}</p>
                    </div>
                  )}

                  {/* Missing keywords */}
                  {atsResult.missingKeywords.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} color="#F87171" /> Missing Keywords
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsResult.missingKeywords.map(k => (
                          <span key={k} style={{ padding: '4px 10px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: '100px', fontSize: '12px', color: '#F87171' }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weak sections */}
                  {atsResult.weakSections.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
                        Sections to Improve
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsResult.weakSections.map(s => (
                          <span key={s} style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '100px', fontSize: '12px', color: '#F59E0B' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
              {atsResult ? (
                <>
                  <button className="btn-secondary" onClick={() => setAtsResult(null)}>Try Again</button>
                  <button className="btn-secondary" onClick={() => { setActiveModal(null); setActiveModal('tailor'); }}>Tailor Resume</button>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
                </>
              ) : (
                <>
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button className="btn-primary" onClick={handleAtsScore} disabled={atsLoading || !atsJd.trim()}>
                    {atsLoading ? <><Loader2 size={14} className="spin" /> Analyzing…</> : 'Check Score'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Print portal — rendered outside the app shell so print CSS sees it cleanly */}
      {createPortal(
        <TemplateRenderer resume={resume} config={activeTemplate} />,
        document.getElementById('print-portal')!
      )}
    </div>
  );
}

export default App;
