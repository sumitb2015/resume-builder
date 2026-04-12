import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResumeBuilder from './components/ResumeBuilder';
import AtsCheckerPage from './components/AtsCheckerPage';
import JobTailorPage from './components/JobTailorPage';
import CoverLetterPage from './components/CoverLetterPage';
import InterviewPrepPage from './components/InterviewPrepPage';
import ExpertReviewModal from './components/ExpertReviewModal';
import ModeSelectModal from './components/ModeSelectModal';
import AiWriterFlow from './components/AiWriterFlow';
import BlogPage from './components/landing/BlogPage';
import UpgradeModal from './components/UpgradeModal';
import ProfileModal from './components/ProfileModal';
import SavedResumesPanel from './components/SavedResumesPanel';
import CheckoutPage from './components/CheckoutPage';
import PagedPreview from './components/PagedPreview';
import ErrorBoundary from './components/ErrorBoundary';
import StylePanel from './components/StylePanel';
import ExportPreview from './components/ExportPreview';
import BreadcrumbNav from './components/BreadcrumbNav';
import { templates } from './templates';
import type { Resume, TemplateConfig, ImprovementSuggestions } from './shared/types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider, usePlan } from './contexts/PlanContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { FEATURE_REQUIRED_PLAN, FEATURE_LABELS } from './shared/constants';
import type { Feature, Plan } from './shared/constants';
import { useSavedResumes } from './hooks/useSavedResumes';
import { legacyMarkdownToHtml } from './lib/htmlUtils';
import {
  Zap, Palette, Check, ChevronLeft, ChevronRight, FileText, LogOut, Crown, Shield,
  FolderOpen, Sun, Moon, Award, Lock, HelpCircle, MessageSquare, Menu, ArrowLeft
} from 'lucide-react';

// Initial dummy resume data
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

// Plan badge config
const PLAN_BADGE: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  free: { label: 'Free', color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: <Shield size={11} /> },
  basic: { label: 'Basic', color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: <Shield size={11} /> },
  pro: { label: 'Pro', color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: <Zap size={11} /> },
  ultimate: { label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: <Crown size={11} /> },
};

// Plan-select page shown on first login
const PLAN_OPTIONS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: '₹0',
    period: 'forever',
    tagline: 'Get started for free',
    color: '#94A3B8',
    gradient: 'linear-gradient(135deg, #94A3B8, #64748B)',
    features: ['1 basic template', 'Live preview & editor', 'Resume sharing', 'Basic analytics'],
  },
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
    features: [`All ${templates.length} templates`, 'Dynamic ATS + JD matching', 'Unlimited AI bullets', 'AI summary writer', 'Skills finder', 'Color customization'],
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
  const { plan } = usePlan();
  if (!plan) return null;
  const badge = PLAN_BADGE[plan];
  if (!badge) return null;
  const isSmall = size === 'sm';
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <div
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: isSmall ? '3px 8px' : '4px 10px',
          borderRadius: '100px',
          background: badge.bg,
          border: `1px solid ${badge.color}40`,
          userSelect: 'none',
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

function PlanSelectPage({ onSelected, onBack, onCheckout }: { onSelected: () => void; onBack: () => void; onCheckout: (planId: Exclude<Plan, 'free'>) => void }) {
  const { setPlan } = usePlan();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (planId: 'free' | 'basic' | 'pro' | 'ultimate') => {
    if (planId === 'free') {
      setPlan('free');
      onSelected();
    } else {
      onCheckout(planId);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-ui-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '80px 20px 40px' : '40px 24px',
    }}>
      <div style={{ 
        position: 'fixed', 
        top: isMobile ? '16px' : '24px', 
        left: isMobile ? '16px' : '24px',
        zIndex: 100
      }}>
        <BreadcrumbNav view="plan-select" onNavigate={(v) => { if (v === 'landing') onBack(); }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '32px' : '48px' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--color-ui-text)' }}>
          Bespoke<span style={{ color: '#818CF8' }}>CV</span>
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '40px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '10px' }}>
          Choose your plan
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
          Select a plan to get started. You can upgrade anytime.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', 
        gap: '16px', 
        maxWidth: '1100px', 
        width: '100%' 
      }}>
        {PLAN_OPTIONS.map((plan, i) => (
          <div
            key={plan.id}
            style={{
              borderRadius: '16px', padding: '28px 24px',
              border: i === 2 ? `1px solid ${plan.color}50` : '1px solid var(--color-ui-border)',
              background: i === 2 ? `linear-gradient(135deg, ${plan.color}12, ${plan.color}06)` : 'var(--color-ui-surface)',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}
          >
            {i === 2 && (
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
                background: i === 2 ? plan.gradient : 'transparent',
                border: i === 2 ? 'none' : `1px solid ${plan.color}50`,
                color: i === 2 ? 'white' : plan.color,
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

  const [view, setView] = useState<'landing' | 'login' | 'plan-select' | 'mode-select' | 'builder' | 'preview' | 'ats-checker' | 'job-tailor' | 'cover-letter' | 'interview-prep' | 'ai-writer' | 'blog' | 'checkout'>('landing');
  const [checkoutPlan, setCheckoutPlan] = useState<Exclude<Plan, 'free'>>('pro');
  const [checkoutAnnual, setCheckoutAnnual] = useState(false);
  const initialResumeRef = useRef<Resume | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (view === 'builder' && !initialResumeRef.current) {
      initialResumeRef.current = JSON.parse(JSON.stringify(resume));
    }
    if (view !== 'builder') initialResumeRef.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const [rightPanelOpen, setRightPanelOpen] = useState(!isMobile);
  const [formExpanded, setFormExpanded] = useState(false);
  const [resume, setResume] = useState<Resume>(initialResume);
  const [improvements, setImprovements] = useState<ImprovementSuggestions | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateConfig>({ ...templates[1]! });
  const [zoom, setZoom] = useState(isMobile ? 0.4 : 0.75);
  const [pageCount, setPageCount] = useState(1);
  const [upgradePrompt, setUpgradePrompt] = useState<{ requiredPlan: Plan; featureLabel: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showExpertReview, setShowExpertReview] = useState(false);

  // Saved resume state
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [saveNameValue, setSaveNameValue] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  // ── UNDO/REDO ─────────────────────────────────────────────
  const historyRef = useRef<Resume[]>([]);
  const historyIndexRef = useRef(-1);
  const isUndoingRef = useRef(false);

  const pushHistory = (r: Resume) => {
    if (isUndoingRef.current) return;
    // Truncate redo branch
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(JSON.parse(JSON.stringify(r)));
    if (historyRef.current.length > 40) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    isUndoingRef.current = true;
    setResume(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    isUndoingRef.current = true;
    setResume(JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]!)));
    isUndoingRef.current = false;
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
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem('bespokecv_autosave', JSON.stringify({ resume, templateId: activeTemplate.id, savedAt: new Date().toISOString() }));
      } catch {
        // Ignore
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
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleSaveConfirm = () => {
    const name = saveNameValue.trim() || 'My Resume';
    if (!canSaveMore) {
      const nextPlan = (plan === 'free' || plan === 'basic') ? 'pro' : 'ultimate';
      setUpgradePrompt({ requiredPlan: nextPlan, featureLabel: `Save more resumes` });
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

  const handleModeSelect = (mode: any, prefilledResume?: Resume, suggestions?: ImprovementSuggestions) => {
    if (mode === 'ai-writer') {
      setView('ai-writer');
      return;
    }
    if (prefilledResume) setResume(migrateResume(prefilledResume));
    if (suggestions) setImprovements(suggestions);
    setView('builder');
  };

  const handleLogout = async () => {
    setShowProfile(false);
    await signOut();
    setView('landing');
    setResume(initialResume);
    setImprovements(null);
  };

  const handleStart = () => {
    if (!currentUser) { setView('login'); return; }
    setView('mode-select');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--color-ui-border)', borderTopColor: '#6366F1', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  const formWidth = isMobile ? '100%' : (formExpanded ? '48%' : '40%');

  const mainContent = (() => {
    if (view === 'landing') return (
      <LandingPage 
        onStart={handleStart} 
        onOpenBlog={() => setView('blog')} 
        onCheckout={(p, a) => { setCheckoutPlan(p); setCheckoutAnnual(a); setView('checkout'); }}
      />
    );
    if (view === 'blog') return <BlogPage onBack={() => setView('landing')} onStart={handleStart} />;
    
    if (view === 'login') {
      return (
        <LoginPage 
          onLoginSuccess={() => {
            setTimeout(() => {
              setView('mode-select');
            }, 100);
          }}
          onBack={() => setView('landing')} 
        />
      );
    }

    if (view === 'plan-select') return (
      <PlanSelectPage 
        onSelected={() => setView('mode-select')} 
        onBack={() => setView('landing')} 
        onCheckout={(p) => { setCheckoutPlan(p); setCheckoutAnnual(false); setView('checkout'); }}
      />
    );

    if (view === 'checkout') {
      return (
        <CheckoutPage
          planTier={checkoutPlan}
          isAnnual={checkoutAnnual}
          onBack={() => setView('plan-select')}
          onSuccess={() => setView('mode-select')}
        />
      );
    }

    if (view === 'mode-select') {
      return (
        <>
          <ModeSelectModal onSelect={handleModeSelect} onBack={() => setView('landing')} onUpgradeNeeded={showUpgrade} />
          {upgradePrompt && <UpgradeModal requiredPlan={upgradePrompt.requiredPlan as any} featureLabel={upgradePrompt.featureLabel} onClose={() => setUpgradePrompt(null)} onUpgrade={(p) => { setCheckoutPlan(p); setCheckoutAnnual(false); setView('checkout'); }} />}
        </>
      );
    }

    if (view === 'ai-writer') {
      return (
        <AiWriterFlow 
          onComplete={(generatedResume, selectedTemplate) => {
            setResume(generatedResume);
            setActiveTemplate(selectedTemplate);
            setView('builder');
          }}
          onBack={() => setView('mode-select')} 
        />
      );
    }

    const isToolView = ['builder', 'ats-checker', 'job-tailor', 'cover-letter', 'interview-prep', 'preview'].includes(view);
    const atsLocked = !canAccess('dynamic-ats');
    const tailorLocked = !canAccess('job-tailor');
    const coverLetterLocked = !canAccess('cover-letter');
    const interviewLocked = !canAccess('interview-prep');
    const expertLocked = !canAccess('expert-review');

    const sidebar = isToolView ? (
      <aside className={`app-sidebar no-print ${showMobileSidebar ? 'show-mobile' : ''}`} style={isMobile ? { position: 'fixed', left: 0, top: 0, bottom: 0, width: '240px', zIndex: 200 } : {}}>
        <div className="sidebar-logo" onClick={() => { setView('landing'); setShowMobileSidebar(false); }} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo-icon">
            <Zap size={18} color="white" fill="white" />
          </div>
          <span className="sidebar-logo-text" style={isMobile ? { opacity: 1 } : {}}>Bespoke<span style={{ color: '#818CF8' }}>CV</span></span>
        </div>

        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          {[
            { id: 'builder' as const, label: 'Resume Builder', Icon: FileText, locked: false, plan: '' },
            ...(isMobile ? [{ id: 'my-resumes' as const, label: 'My Resumes', Icon: FolderOpen, locked: false, plan: '' }] : []),
            { id: 'ats-checker' as const, label: 'ATS Checker', Icon: Award, locked: atsLocked, plan: 'Pro' },
            { id: 'job-tailor' as const, label: 'Job Tailor', Icon: Zap, locked: tailorLocked, plan: 'Ultimate' },
            { id: 'cover-letter' as const, label: 'Cover Letter', Icon: FileText, locked: coverLetterLocked, plan: 'Pro' },
            { id: 'interview-prep' as const, label: 'Interview Prep', Icon: HelpCircle, locked: interviewLocked, plan: 'Ultimate' },
          ].map(tab => {
            const isActive = view === tab.id;
            return (
              <button
                key={tab.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                title={tab.locked ? `Requires ${tab.plan} plan` : tab.label}
                style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
                onClick={() => {
                  setShowMobileSidebar(false);
                  if (tab.id === 'builder') setView('builder');
                  else if (tab.id === 'my-resumes') setShowSavedPanel(true);
                  else if (tab.id === 'ats-checker') handleGoAtsChecker();
                  else if (tab.id === 'job-tailor') handleGoJobTailor();
                  else if (tab.id === 'cover-letter') {
                    if (coverLetterLocked) showUpgrade('cover-letter');
                    else setView('cover-letter');
                  }
                  else if (tab.id === 'interview-prep') {
                    if (interviewLocked) showUpgrade('interview-prep');
                    else setView('interview-prep');
                  }
                }}
              >
                <div className="sidebar-icon">
                  <tab.Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.locked && <Lock size={10} style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--color-ui-surface)', borderRadius: '50%', padding: '1px' }} />}
                </div>
                <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', paddingBottom: '10px' }}>
          <button 
            className="sidebar-item" 
            style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
            onClick={() => { setShowMobileSidebar(false); if (expertLocked) showUpgrade('expert-review' as any); else setShowExpertReview(true); }}
            title="Expert Review"
          >
            <div className="sidebar-icon"><MessageSquare size={20} /></div>
            <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>Expert Review</span>
          </button>
          <button 
            className="sidebar-item" 
            style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
            onClick={toggleTheme} 
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            <div className="sidebar-icon">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</div>
            <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div style={{ height: '1px', width: '40%', background: 'var(--color-ui-border)', marginTop: '8px', marginBottom: '8px' }} />
          <button 
            className="sidebar-item" 
            style={isMobile ? { width: 'calc(100% - 24px)', justifyContent: 'flex-start' } : {}}
            onClick={handleLogout} 
            title="Sign Out"
          >
            <div className="sidebar-icon"><LogOut size={20} /></div>
            <span className="sidebar-label" style={isMobile ? { opacity: 1 } : {}}>Sign Out</span>
          </button>
        </div>
      </aside>
    ) : null;

    const topBar = isToolView ? (
      <>
        <header className="top-bar no-print" style={{ 
          borderBottom: '1px solid var(--color-ui-border)', 
          background: 'var(--color-ui-bg)',
          height: isMobile ? '52px' : '56px',
          padding: isMobile ? '0 12px' : '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
            {isMobile && (
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setShowMobileSidebar(true)}>
                <Menu size={20} />
              </button>
            )}
            <BreadcrumbNav view={view} onNavigate={setView} />
            {!isMobile && (
              <>
                <div style={{ width: '1px', height: '16px', background: 'var(--color-ui-border)' }} />
                <PlanBadge size="sm" />
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
            {view === 'preview' && (
              <button 
                className="btn-secondary" 
                style={{ gap: '4px', fontSize: isMobile ? '12px' : '13px', padding: isMobile ? '5px 10px' : '8px 16px' }} 
                onClick={() => setView('builder')}
              >
                <ArrowLeft size={14} />
                {isMobile ? 'Edit' : 'Back to Editor'}
              </button>
            )}

            {view === 'builder' && (
              <>
                <button className={rightPanelOpen ? 'btn-primary' : 'btn-secondary'} style={{ gap: '6px', fontSize: '12.5px', padding: isMobile ? '6px' : '7px 14px' }} onClick={() => setRightPanelOpen(v => !v)}>
                  <Palette size={isMobile ? 18 : 14} /> 
                  {isMobile ? '' : 'Style'}
                </button>

                {!isMobile && (
                  <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }} onClick={() => setShowSavedPanel(true)}>
                    <FolderOpen size={14} /> 
                    My Resumes
                    {savedResumes.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ui-accent)', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{savedResumes.length}</span>}
                  </button>
                )}

                <button className="btn-primary" style={{ gap: '6px', fontSize: isMobile ? '12px' : '13px', padding: isMobile ? '6px 12px' : '8px 18px' }} onClick={() => {
                  setActiveTemplate(t => ({ ...t, settings: t.settings ?? { margin: 15, fontSize: 100, lineHeight: 1.5 } }));
                  setView('preview');
                }}>
                  <FileText size={isMobile ? 14 : 15} /> 
                  {isMobile ? 'Preview' : 'Preview & Export'}
                </button>
              </>
            )}

            {currentUser && (
              <div 
                onClick={() => setShowProfile(true)}
                style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'white', cursor: 'pointer' }}
              >
                {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
              </div>
            )}
          </div>
        </header>
      </>
    ) : null;

    if (view === 'preview') {
      return (
        <div className="app-layout-root" style={isMobile ? { height: '100vh', overflow: 'hidden' } : {}}>
          {sidebar}
          <div className="app-main-content" style={isMobile ? { height: '100vh', overflow: 'hidden' } : {}}>
            {topBar}
            <ExportPreview resume={resume} config={activeTemplate} onUpdateConfig={setActiveTemplate} onUpdateResume={setResume} pageCount={pageCount} onPageCount={setPageCount} />
          </div>
        </div>
      );
    }
    if (view === 'ats-checker') {
      return (
        <div className="app-layout-root">
          {sidebar}
          <div className="app-main-content">
            {topBar}
            <AtsCheckerPage resume={resume} onBack={() => setView('builder')} onUpgradeNeeded={showUpgrade} />
          </div>
        </div>
      );
    }

    if (view === 'job-tailor') {
      return (
        <div className="app-layout-root">
          {sidebar}
          <div className="app-main-content">
            {topBar}
            <JobTailorPage
              resume={resume}
              onApplyChanges={(updated) => { setResume(updated); setView('builder'); }}
              onBack={() => setView('builder')}
              onUpgradeNeeded={showUpgrade}
            />
          </div>
        </div>
      );
    }

    if (view === 'cover-letter') {
      return (
        <div className="app-layout-root">
          {sidebar}
          <div className="app-main-content">
            {topBar}
            <CoverLetterPage
              resume={resume}
              onBack={() => setView('builder')}
              onUpgradeNeeded={showUpgrade}
            />
          </div>
        </div>
      );
    }

    if (view === 'interview-prep') {
      return (
        <div className="app-layout-root">
          {sidebar}
          <div className="app-main-content">
            {topBar}
            <InterviewPrepPage
              resume={resume}
              onBack={() => setView('builder')}
              onUpgradeNeeded={showUpgrade}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="app-layout-root" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
        {sidebar}
        <div className="app-main-content">
          {topBar}

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: isMobile ? 'visible' : 'hidden', height: isMobile ? 'auto' : '100%' }}>
            <div style={{ width: formWidth, flexShrink: 0, transition: 'width 0.25s', position: 'relative', height: isMobile ? 'auto' : '100%', overflow: isMobile ? 'visible' : 'hidden' }} className="no-print">

              <ErrorBoundary componentName="ResumeBuilder">
                <ResumeBuilder resume={resume} onChange={setResumeWithHistory} improvements={improvements} onDismissImprovements={() => setImprovements(null)} onUpgradeNeeded={showUpgrade} />
              </ErrorBoundary>
              {!isMobile && <button onClick={() => setFormExpanded(v => !v)} style={{ position: 'absolute', top: '50%', right: '-11px', transform: 'translateY(-50%)', width: '22px', height: '44px', borderRadius: '0 8px 8px 0', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderLeft: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ui-text-muted)', zIndex: 10 }}>{formExpanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}</button>}
            </div>

            {!isMobile && (
              <main className="preview-viewport" style={{ flex: 1, minWidth: 0, padding: isMobile ? '16px 8px' : '32px 24px 64px' }}>
                {/* Preview toolbar */}
                <div className="no-print" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, width: '100%', maxWidth: '1000px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--color-ui-surface)', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {activeTemplate.name}
                      </span>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '8px',
                      ...(activeTemplate.atsScore >= 85
                        ? { background: 'rgba(63,185,80,0.12)', color: 'var(--color-success)', border: '1px solid rgba(63,185,80,0.2)' }
                        : activeTemplate.atsScore >= 70
                        ? { background: 'rgba(210,153,34,0.12)', color: 'var(--color-warning)', border: '1px solid rgba(210,153,34,0.2)' }
                        : { background: 'rgba(248,81,73,0.12)', color: 'var(--color-danger)', border: '1px solid rgba(248,81,73,0.2)' }),
                    }}>
                      <Award size={12} />
                      ATS SCORE: {activeTemplate.atsScore}%
                    </div>
                    {!isMobile && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--color-ui-surface)', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}>
                        <FileText size={12} color="var(--color-ui-text-muted)" />
                        <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 600 }}>
                          A4 · {pageCount} {pageCount === 1 ? 'PAGE' : 'PAGES'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '10px' }}>
                    <button className="btn-ghost" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px', fontSize: '16px' }} onClick={() => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(1)))}>−</button>
                    <button onClick={() => setZoom(isMobile ? 0.4 : 0.75)} style={{ minWidth: '40px', textAlign: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--color-ui-accent)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      {Math.round(zoom * 100)}%
                    </button>
                    <button className="btn-ghost" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '6px', fontSize: '16px' }} onClick={() => setZoom(z => Math.min(1.5, +(z + 0.1).toFixed(1)))}>+</button>
                    {!isMobile && (
                      <>
                        <div style={{ width: '1px', height: '16px', background: 'var(--color-ui-border)', marginLeft: '4px', marginRight: '4px' }} />
                        {[50, 75, 100].map(v => (
                          <button
                            key={v}
                            onClick={() => setZoom(v / 100)}
                            style={{
                              padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                              border: 'none', cursor: 'pointer',
                              background: Math.round(zoom * 100) === v ? 'var(--color-ui-accent-subtle)' : 'transparent',
                              color: Math.round(zoom * 100) === v ? 'var(--color-ui-accent)' : 'var(--color-ui-text-dim)',
                              transition: 'all 0.15s',
                            }}
                          >
                            {v}%
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="preview-scaler" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                  <ErrorBoundary componentName="PagedPreview">
                    <PagedPreview resume={resume} config={activeTemplate} onPageCount={setPageCount} />
                  </ErrorBoundary>
                </div>
              </main>
            )}

            {(!isMobile || rightPanelOpen) && (
              <div style={{ 
                width: rightPanelOpen ? (isMobile ? '100%' : '320px') : '0', 
                flexShrink: 0, 
                overflow: 'hidden', 
                transition: 'width 0.25s',
                ...(isMobile ? { position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 300, background: 'var(--color-ui-bg)' } : {})
              }} className="no-print">
                {rightPanelOpen && <StylePanel templates={templates} activeTemplate={activeTemplate} onTemplateChange={setActiveTemplate} onColorChange={handleColorChange} onClose={() => setRightPanelOpen(false)} zoom={zoom} onZoomChange={setZoom} onUpgradeNeeded={showUpgrade} />}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })();

  return (
    <>
      {mainContent}
      {showMobileSidebar && isMobile && (
        <div 
          className="modal-overlay no-print" 
          style={{ zIndex: 190, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} 
          onClick={() => setShowMobileSidebar(false)} 
        />
      )}
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
      {upgradePrompt && <UpgradeModal requiredPlan={upgradePrompt.requiredPlan as any} featureLabel={upgradePrompt.featureLabel} onClose={() => setUpgradePrompt(null)} onUpgrade={(p) => { setCheckoutPlan(p); setCheckoutAnnual(false); setView('checkout'); }} />}
      {showProfile && <ProfileModal user={currentUser} onClose={() => setShowProfile(false)} onLogout={handleLogout} />}
      {showExpertReview && <ExpertReviewModal userId={currentUser?.uid || ''} resumeId={currentResumeId} resumeData={resume} onClose={() => setShowExpertReview(false)} />}
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
