import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResumeBuilder from './components/ResumeBuilder';
import AtsCheckerPage from './components/AtsCheckerPage';
import JobTailorPage from './components/JobTailorPage';
import ModeSelectModal from './components/ModeSelectModal';
import UpgradeModal from './components/UpgradeModal';
import SavedResumesPanel from './components/SavedResumesPanel';
import PagedPreview from './components/PagedPreview';
import StylePanel from './components/StylePanel';
import ExportPreview from './components/ExportPreview';
import { templates } from './templates';
import type { Resume, TemplateConfig, ImprovementSuggestions } from './shared/types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider, usePlan } from './contexts/PlanContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import type { Feature } from './contexts/PlanContext';
import { useSavedResumes } from './hooks/useSavedResumes';
import { legacyMarkdownToHtml } from './lib/htmlUtils';
import './index.css';
import {
  Zap, Palette, Check, ChevronLeft, ChevronRight, FileText, LogOut, Crown, Shield,
  Save, FolderOpen, Sun, Moon, Award, Lock,
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

// Maps a feature to the minimum plan required
const FEATURE_REQUIRED_PLAN: Record<Feature, 'pro' | 'ultimate'> = {
  'enhance-mode': 'pro',
  'linkedin-mode': 'ultimate',
  'job-tailor': 'ultimate',
  'extra-templates': 'pro',
  'dynamic-ats': 'pro',
  'ai-summary': 'pro',
  'ai-bullets': 'pro',
  'skills-finder': 'pro',
  'style-colors': 'pro',
};

const FEATURE_LABELS: Record<Feature, string> = {
  'enhance-mode': 'Resume Import',
  'linkedin-mode': 'LinkedIn Import',
  'job-tailor': 'Job Tailoring',
  'extra-templates': 'Premium Templates',
  'dynamic-ats': 'Dynamic ATS Score',
  'ai-summary': 'AI Summary Writer',
  'ai-bullets': 'AI Bullet Writer',
  'skills-finder': 'Skills Finder',
  'style-colors': 'Style Customization',
};

// Plan badge config
const PLAN_BADGE: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  basic: { label: 'Basic', color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: <Shield size={11} /> },
  pro: { label: 'Pro', color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: <Zap size={11} /> },
  ultimate: { label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: <Crown size={11} /> },
};

// Plan-select page shown on first login
const PLAN_OPTIONS = [
  {
    id: 'basic' as const,
    name: 'Basic',
    price: '₹199',
    period: '14 days',
    tagline: 'Try the essentials',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    features: ['3 professional templates', 'Live preview & editor', 'PDF export (1/day)', 'ATS score (template)', 'AI bullets (3/day)'],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '₹499',
    period: 'mo',
    tagline: 'Core AI writing tools',
    color: '#818CF8',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    features: ['All 15 templates', 'Dynamic ATS + JD matching', 'Unlimited AI bullets', 'AI summary writer', 'Skills finder', 'Color customization'],
  },
  {
    id: 'ultimate' as const,
    name: 'Ultimate',
    price: '₹699',
    period: 'mo',
    tagline: 'Pro + advanced AI workflows',
    color: '#C084FC',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
    features: ['Everything in Pro', 'Job tailoring (full rewrite)', 'Resume import PDF/DOCX', 'LinkedIn profile import', 'Diff review before/after', 'Priority PDF generation'],
  },
];

function PlanBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { plan, setPlan } = usePlan();
  if (!plan) return null;
  const badge = PLAN_BADGE[plan];
  const isSmall = size === 'sm';
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        title="Click to change plan"
        onClick={() => {
          const order: ('basic' | 'pro' | 'ultimate')[] = ['basic', 'pro', 'ultimate'];
          const next = order[(order.indexOf(plan) + 1) % order.length];
          setPlan(next);
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: isSmall ? '3px 8px' : '4px 10px',
          borderRadius: '100px',
          background: badge.bg,
          border: `1px solid ${badge.color}40`,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'opacity 0.15s',
        }}
      >
        <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon}</span>
        <span style={{ fontSize: isSmall ? '10px' : '11px', fontWeight: 700, color: badge.color, letterSpacing: '0.03em' }}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}

function PlanSelectPage({ onSelected }: { onSelected: () => void }) {
  const { setPlan } = usePlan();

  const handleSelect = (planId: 'basic' | 'pro' | 'ultimate') => {
    setPlan(planId);
    onSelected();
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-ui-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
          Bespoke<span style={{ color: '#818CF8' }}>CV</span>
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '10px' }}>
          Choose your plan
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
          Select a plan to get started. You can upgrade anytime.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '900px', width: '100%' }}>
        {PLAN_OPTIONS.map((plan, i) => (
          <div
            key={plan.id}
            style={{
              borderRadius: '16px', padding: '28px 24px',
              border: i === 1 ? `1px solid ${plan.color}50` : '1px solid var(--color-ui-border)',
              background: i === 1 ? `linear-gradient(135deg, ${plan.color}12, ${plan.color}06)` : 'var(--color-ui-surface)',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}
          >
            {i === 1 && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                padding: '4px 14px', borderRadius: '100px',
                background: plan.gradient,
                fontSize: '10.5px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap',
              }}>
                Most Popular
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginBottom: '16px' }}>{plan.tagline}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>₹</span>
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em' }}>
                  {plan.price.replace('₹', '')}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>/{plan.period}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '24px' }}>
              {plan.features.map((f, fi) => (
                <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Check size={13} color={plan.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelect(plan.id)}
              style={{
                width: '100%', padding: '11px', borderRadius: '9px',
                background: i === 1 ? plan.gradient : 'transparent',
                border: i === 1 ? 'none' : `1px solid ${plan.color}50`,
                color: i === 1 ? 'white' : plan.color,
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
            >
              Start with {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Migrate legacy plain text / markdown strings to HTML on resume load */
function migrateResume(resume: Resume): Resume {
  return {
    ...resume,
    personal: { ...resume.personal, summary: legacyMarkdownToHtml(resume.personal.summary) },
    experience: resume.experience.map(exp => ({ ...exp, bullets: exp.bullets.map(legacyMarkdownToHtml) })),
    projects: resume.projects.map(p => ({ ...p, description: legacyMarkdownToHtml(p.description) })),
  };
}

/** Helper component for print portal */
const PrintPortal = ({ resume, config, pageCount }: { resume: Resume; config: TemplateConfig; pageCount: number }) => {
  const portalNode = document.getElementById('print-portal');
  if (!portalNode) return null;

  return createPortal(
    <div className="print-mode">
      <PagedPreview resume={resume} config={config} forcePageCount={pageCount} />
    </div>,
    portalNode
  );
};

function AppContent() {
  const { currentUser, loading, signOut } = useAuth();
  const { plan, maxResumes, canAccess } = usePlan();
  const { savedResumes, canSaveMore, saveResume, renameResume, deleteResume } = useSavedResumes();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<'landing' | 'login' | 'plan-select' | 'mode-select' | 'builder' | 'preview' | 'ats-checker' | 'job-tailor'>('landing');
  const initialResumeRef = useRef<Resume | null>(null);
  
  useEffect(() => {
    if (view === 'builder' && !initialResumeRef.current) {
      initialResumeRef.current = JSON.parse(JSON.stringify(resume));
    }
    if (view !== 'builder') initialResumeRef.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [formExpanded, setFormExpanded] = useState(false);
  const [resume, setResume] = useState<Resume>(initialResume);
  const [improvements, setImprovements] = useState<ImprovementSuggestions | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateConfig>({ ...templates[1]! });
  const [zoom, setZoom] = useState(0.75);
  const [pageCount, setPageCount] = useState(1);
  const [upgradePrompt, setUpgradePrompt] = useState<{ requiredPlan: 'pro' | 'ultimate'; featureLabel: string } | null>(null);

  // Saved resume state
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [saveNameValue, setSaveNameValue] = useState('');
  const [savedToast, setSavedToast] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // ── UNDO/REDO ─────────────────────────────────────────────
  const historyRef = useRef<Resume[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoingRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = (r: Resume) => {
    if (isUndoingRef.current) return;
    // Truncate redo branch
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(r)));
    if (historyRef.current.length > 40) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    isUndoingRef.current = true;
    setResume(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    isUndoingRef.current = true;
    setResume(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault(); undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault(); redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrap setResume to also push to undo history
  const setResumeWithHistory = (r: Resume | ((prev: Resume) => Resume)) => {
    setResume(prev => {
      const next = typeof r === 'function' ? r(prev) : r;
      pushHistory(next);
      return next;
    });
  };

  // ── AUTO-SAVE ──────────────────────────────────────────────
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (view !== 'builder') return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem('bespokecv_autosave', JSON.stringify({ resume, templateId: activeTemplate.id, savedAt: new Date().toISOString() }));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      } catch {
        setAutoSaveStatus('idle');
      }
    }, 1500);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume, view]);

  const showUpgrade = (feature: Feature) => {
    setUpgradePrompt({
      requiredPlan: FEATURE_REQUIRED_PLAN[feature],
      featureLabel: FEATURE_LABELS[feature],
    });
  };

  const handleGoAtsChecker = () => {
    if (!canAccess('dynamic-ats')) { showUpgrade('dynamic-ats'); return; }
    setView('ats-checker');
  };

  const handleGoJobTailor = () => {
    if (!canAccess('job-tailor')) { showUpgrade('job-tailor'); return; }
    setView('job-tailor');
  };

  const showSavedToast = () => {
    setSavedToast(true);
    setLastSavedAt(new Date());
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleSave = () => {
    if (currentResumeId) {
      saveResume(savedResumes.find(r => r.id === currentResumeId)?.name ?? 'My Resume', resume, activeTemplate, currentResumeId);
      showSavedToast();
    } else {
      setSaveNameValue(resume.personal.name ? `${resume.personal.name.split(' ')[0]}'s Resume` : 'My Resume');
      setSavePrompt(true);
    }
  };

  const handleSaveConfirm = () => {
    const name = saveNameValue.trim() || 'My Resume';
    if (!canSaveMore) {
      setUpgradePrompt({ requiredPlan: plan === 'basic' ? 'pro' : 'ultimate', featureLabel: `Save more resumes` });
      setSavePrompt(false);
      return;
    }
    const id = saveResume(name, resume, activeTemplate);
    if (id) {
      setCurrentResumeId(id);
      showSavedToast();
    }
    setSavePrompt(false);
  };

  const handleLoadResume = (saved: any) => {
    setResume(migrateResume(saved.resumeData));
    const tpl = templates.find(t => t.id === saved.templateId);
    if (tpl) setActiveTemplate({ ...tpl });
    setCurrentResumeId(saved.id);
    setShowSavedPanel(false);
    setImprovements(null);
  };

  const handleNewResume = () => {
    setResume(initialResume);
    setActiveTemplate({ ...templates[1]! });
    setCurrentResumeId(null);
    setImprovements(null);
    setShowSavedPanel(false);
  };

  const handleColorChange = (palette: any) => {
    setActiveTemplate(prev => ({
      ...prev,
      colors: { ...prev.colors, primary: palette.primary, accent: palette.accent },
    }));
  };

  const handleModeSelect = (_mode: any, prefilledResume?: Resume, suggestions?: ImprovementSuggestions) => {
    if (prefilledResume) setResume(migrateResume(prefilledResume));
    if (suggestions) setImprovements(suggestions);
    setView('builder');
  };

  const handleLogout = async () => {
    await signOut();
    setView('landing');
    setResume(initialResume);
    setImprovements(null);
  };

  const handleStart = () => {
    if (!currentUser) { setView('login'); return; }
    if (!plan) { setView('plan-select'); return; }
    setView('mode-select');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--color-ui-border)', borderTopColor: '#6366F1', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  const formWidth = formExpanded ? '48%' : '40%';

  const mainContent = (() => {
    if (view === 'landing') return <LandingPage onStart={handleStart} />;
    
    if (view === 'login') {
      return (
        <LoginPage onLoginSuccess={() => {
          setTimeout(() => {
            const uid = currentUser?.uid;
            const storedPlan = uid ? localStorage.getItem(`bespokecv_plan_${uid}`) : null;
            setView(storedPlan ? 'mode-select' : 'plan-select');
          }, 100);
        }} />
      );
    }

    if (view === 'plan-select') return <PlanSelectPage onSelected={() => setView('mode-select')} />;

    if (view === 'mode-select') {
      return (
        <>
          <ModeSelectModal onSelect={handleModeSelect} onBack={() => setView('landing')} onUpgradeNeeded={showUpgrade} />
          {upgradePrompt && <UpgradeModal requiredPlan={upgradePrompt.requiredPlan} featureLabel={upgradePrompt.featureLabel} onClose={() => setUpgradePrompt(null)} />}
        </>
      );
    }

    if (view === 'preview') {
      return <ExportPreview resume={resume} config={activeTemplate} onBack={() => setView('builder')} onUpdateConfig={setActiveTemplate} onUpdateResume={setResume} pageCount={pageCount} onPageCount={setPageCount} />;
    }

    const isToolView = view === 'builder' || view === 'ats-checker' || view === 'job-tailor';
    const atsLocked = !canAccess('dynamic-ats');
    const tailorLocked = !canAccess('job-tailor');

    const topBar = isToolView ? (
      <header className="top-bar no-print" style={{ position: 'relative' }}>
        {/* Left: logo + plan badge + (builder only) template button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} onClick={() => setView('landing')}>
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>Bespoke<span style={{ color: '#818CF8' }}>CV</span></span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />
          <PlanBadge size="sm" />
          {view === 'builder' && (
            <>
              <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />
              <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }} onClick={() => setRightPanelOpen(true)}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.primary }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.accent }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{activeTemplate.name}</span>
                <ChevronRight size={11} style={{ opacity: 0.5 }} />
              </button>
            </>
          )}
        </div>

        {/* Center: navigation tabs */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '2px',
          background: 'var(--color-ui-surface)',
          borderRadius: '10px', padding: '3px',
          border: '1px solid var(--color-ui-border)',
        }}>
          {([
            { id: 'builder' as const, label: 'Builder', Icon: FileText, locked: false },
            { id: 'ats-checker' as const, label: 'ATS Check', Icon: Award, locked: atsLocked, plan: 'Pro' },
            { id: 'job-tailor' as const, label: 'Job Tailor', Icon: Zap, locked: tailorLocked, plan: 'Ultimate' },
          ] as const).map(tab => {
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                title={tab.locked ? `Requires ${(tab as any).plan} plan` : undefined}
                onClick={() => {
                  if (tab.id === 'builder') setView('builder');
                  else if (tab.id === 'ats-checker') handleGoAtsChecker();
                  else handleGoJobTailor();
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 13px', borderRadius: '7px',
                  background: isActive ? 'var(--color-ui-accent)' : 'transparent',
                  color: isActive ? '#fff' : tab.locked ? 'var(--color-ui-text-muted)' : 'var(--color-ui-text-muted)',
                  border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.15s',
                  opacity: tab.locked && !isActive ? 0.7 : 1,
                }}
              >
                <tab.Icon size={12} />
                {tab.label}
                {tab.locked && <Lock size={9} style={{ marginLeft: '1px', opacity: 0.6 }} />}
              </button>
            );
          })}
        </div>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-ghost" style={{ padding: '7px 10px' }} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
          {view === 'builder' && (
            <>
              {/* Undo / Redo */}
              <button
                className="btn-ghost"
                style={{ padding: '7px 9px', opacity: canUndo ? 1 : 0.35 }}
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M3 13C4.5 7.5 10 4 16 5.5A9 9 0 0 1 21 13"/></svg>
              </button>
              <button
                className="btn-ghost"
                style={{ padding: '7px 9px', opacity: canRedo ? 1 : 0.35 }}
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M21 13C19.5 7.5 14 4 8 5.5A9 9 0 0 0 3 13"/></svg>
              </button>
              <div style={{ width: '1px', height: '18px', background: 'var(--color-ui-border)' }} />
              <button className={rightPanelOpen ? 'btn-primary' : 'btn-secondary'} style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }} onClick={() => setRightPanelOpen(v => !v)}><Palette size={13} /> Style</button>
              <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }} onClick={() => setShowSavedPanel(true)}>
                <FolderOpen size={13} /> My Resumes
                {savedResumes.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ui-accent)', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{savedResumes.length}</span>}
              </button>
              {/* Auto-save indicator */}
              {autoSaveStatus === 'saving' && (
                <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="spin" style={{ display: 'inline-block', width: '10px', height: '10px', border: '1.5px solid var(--color-ui-border)', borderTopColor: 'var(--color-ui-accent)', borderRadius: '50%' }} />
                  Saving…
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ✓ Auto-saved
                </span>
              )}
              {lastSavedAt && autoSaveStatus === 'idle' && (
                <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  Saved · {lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }} onClick={handleSave}><Save size={13} /> Save</button>
              <button className="btn-primary" style={{ gap: '6px', fontSize: '13px' }} onClick={() => {
                setActiveTemplate(t => ({ ...t, settings: t.settings ?? { margin: 15, fontSize: 100, lineHeight: 1.5 } }));
                setView('preview');
              }}><FileText size={14} /> Preview</button>
            </>
          )}
          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: view === 'builder' ? '0' : '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>{(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}</div>
              <button className="btn-ghost" style={{ padding: '4px' }} onClick={handleLogout}><LogOut size={14} /></button>
            </div>
          )}
        </div>
      </header>
    ) : null;

    if (view === 'ats-checker') {
      return (
        <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>
          {topBar}
          <AtsCheckerPage resume={resume} onBack={() => setView('builder')} onUpgradeNeeded={showUpgrade} />
        </div>
      );
    }

    if (view === 'job-tailor') {
      return (
        <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>
          {topBar}
          <JobTailorPage
            resume={resume}
            onApplyChanges={(updated) => { setResume(updated); setView('builder'); }}
            onBack={() => setView('builder')}
            onUpgradeNeeded={showUpgrade}
          />
        </div>
      );
    }

    return (
      <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>
        {topBar}

        <div style={{ display: 'flex', overflow: 'hidden', height: '100%' }}>
          <div style={{ width: formWidth, flexShrink: 0, transition: 'width 0.25s', position: 'relative', height: '100%', overflow: 'hidden' }} className="no-print">
            <ResumeBuilder resume={resume} onChange={setResumeWithHistory} improvements={improvements} onDismissImprovements={() => setImprovements(null)} onUpgradeNeeded={showUpgrade} />
            <button onClick={() => setFormExpanded(v => !v)} style={{ position: 'absolute', top: '50%', right: '-11px', transform: 'translateY(-50%)', width: '22px', height: '44px', borderRadius: '0 8px 8px 0', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderLeft: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ui-text-muted)', zIndex: 10 }}>{formExpanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}</button>
          </div>

          <main className="preview-viewport" style={{ flex: 1, minWidth: 0 }}>
            {/* Preview toolbar */}
            <div className="no-print" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              {/* Left: template info + ATS score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
                  {activeTemplate.name}
                </span>
                <div style={{ width: '1px', height: '12px', background: 'var(--color-ui-border)' }} />
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '100px',
                  ...(activeTemplate.atsScore >= 85
                    ? { background: 'rgba(63,185,80,0.15)', color: 'var(--color-success)', border: '1px solid rgba(63,185,80,0.3)' }
                    : activeTemplate.atsScore >= 70
                    ? { background: 'rgba(210,153,34,0.15)', color: 'var(--color-warning)', border: '1px solid rgba(210,153,34,0.3)' }
                    : { background: 'rgba(248,81,73,0.15)', color: 'var(--color-danger)', border: '1px solid rgba(248,81,73,0.3)' }),
                }}>
                  {activeTemplate.atsScore >= 85 ? '✓' : activeTemplate.atsScore >= 70 ? '⚠' : '✗'} ATS {activeTemplate.atsScore}%
                </span>
                <div style={{ width: '1px', height: '12px', background: 'var(--color-ui-border)' }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: pageCount > 1 ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)', fontWeight: pageCount > 1 ? 700 : 500 }}>
                  <FileText size={11} /> A4 · {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                </span>
              </div>

              {/* Right: zoom controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 6px', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '8px' }}>
                <button className="btn-ghost" style={{ padding: '3px 6px', borderRadius: '5px', fontSize: '13px', lineHeight: 1 }} onClick={() => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(1)))} title="Zoom out">−</button>
                <button onClick={() => setZoom(0.75)} style={{ minWidth: '46px', textAlign: 'center', fontSize: '11.5px', fontWeight: 700, color: 'var(--color-ui-accent)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }} title="Reset to 75%">
                  {Math.round(zoom * 100)}%
                </button>
                <button className="btn-ghost" style={{ padding: '3px 6px', borderRadius: '5px', fontSize: '13px', lineHeight: 1 }} onClick={() => setZoom(z => Math.min(1.5, +(z + 0.1).toFixed(1)))} title="Zoom in">+</button>
                <div style={{ width: '1px', height: '14px', background: 'var(--color-ui-border)', margin: '0 2px' }} />
                {[50, 75, 100].map(v => (
                  <button
                    key={v}
                    onClick={() => setZoom(v / 100)}
                    style={{
                      padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      background: Math.round(zoom * 100) === v ? 'rgba(99,102,241,0.2)' : 'transparent',
                      color: Math.round(zoom * 100) === v ? 'var(--color-ui-accent)' : 'var(--color-ui-text-dim)',
                      transition: 'all 0.12s',
                    }}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-scaler" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
              <PagedPreview resume={resume} config={activeTemplate} onPageCount={setPageCount} />
            </div>
          </main>

          <div style={{ width: rightPanelOpen ? '300px' : '0', flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s' }} className="no-print">
            {rightPanelOpen && <StylePanel templates={templates} activeTemplate={activeTemplate} onTemplateChange={setActiveTemplate} onColorChange={handleColorChange} onClose={() => setRightPanelOpen(false)} zoom={zoom} onZoomChange={setZoom} onUpgradeNeeded={showUpgrade} />}
          </div>
        </div>
      </div>
    );
  })();

  return (
    <>
      {mainContent}
      {showSavedPanel && <SavedResumesPanel savedResumes={savedResumes} currentResumeId={currentResumeId} maxResumes={maxResumes} onLoad={handleLoadResume} onDelete={deleteResume} onRename={renameResume} onNewResume={handleNewResume} onClose={() => setShowSavedPanel(false)} onUpgradeNeeded={() => {}} />}
      {savePrompt && (
        <div className="modal-overlay no-print" onClick={e => e.target === e.currentTarget && setSavePrompt(false)}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Save Resume</h3>
            <input autoFocus className="field-input" value={saveNameValue} onChange={e => setSaveNameValue(e.target.value)} placeholder="Resume name" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn-secondary" onClick={() => setSavePrompt(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveConfirm}>Save</button>
            </div>
          </div>
        </div>
      )}
      {savedToast && <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: 'var(--color-success)', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>Resume saved</div>}
      {upgradePrompt && <UpgradeModal requiredPlan={upgradePrompt.requiredPlan} featureLabel={upgradePrompt.featureLabel} onClose={() => setUpgradePrompt(null)} />}
      <PrintPortal resume={resume} config={activeTemplate} pageCount={pageCount} />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlanProvider>
          <AppContent />
        </PlanProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
