import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResumeBuilder from './components/ResumeBuilder';
import ModeSelectModal from './components/ModeSelectModal';
import UpgradeModal from './components/UpgradeModal';
import SavedResumesPanel from './components/SavedResumesPanel';
import PagedPreview from './components/PagedPreview';
import StylePanel from './components/StylePanel';
import ExportPreview from './components/ExportPreview';
import { templates, colorPalettes } from './templates';
import { api } from './lib/api';
import type { Resume, TemplateConfig, ImprovementSuggestions } from './shared/types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlanProvider, usePlan } from './contexts/PlanContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import type { Feature } from './contexts/PlanContext';
import { useSavedResumes } from './hooks/useSavedResumes';
import { stripHtml, plainTextToHtml, legacyMarkdownToHtml } from './lib/htmlUtils';
import './index.css';
import {
  Zap, X, Sparkles, Palette,
  Loader2, Check, AlertCircle, ChevronLeft, ChevronRight, FileText, LogOut, Crown, Shield,
  Save, FolderOpen, Link, GitCompare, Plus, Minus, Sun, Moon,
} from 'lucide-react';

// ── Word-level diff ────────────────────────────────────────────────────────────
type DiffToken = { text: string; type: 'same' | 'add' | 'del' };

function wordDiff(before: string, after: string): DiffToken[] {
  if (before === after) return [{ text: before, type: 'same' }];
  const b = before.split(/\s+/).filter(Boolean);
  const a = after.split(/\s+/).filter(Boolean);
  const dp = Array.from({ length: b.length + 1 }, () => new Array(a.length + 1).fill(0));
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      dp[i][j] = b[i-1] === a[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const tokens: DiffToken[] = [];
  let i = b.length, j = a.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && b[i-1] === a[j-1]) {
      tokens.unshift({ text: b[i-1], type: 'same' }); i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      tokens.unshift({ text: a[j-1], type: 'add' }); j--;
    } else {
      tokens.unshift({ text: b[i-1], type: 'del' }); i--;
    }
  }
  return tokens;
}

function DiffText({ before, after }: { before: string; after: string }) {
  if (!before && !after) return null;
  if (before === after) return <span style={{ fontSize: '13px', color: 'var(--color-ui-text)', lineHeight: 1.7 }}>{after}</span>;
  const tokens = wordDiff(before || '', after || '');
  return (
    <span style={{ fontSize: '13px', lineHeight: 1.7 }}>
      {tokens.map((t, idx) =>
        t.type === 'same' ? <span key={idx}>{t.text} </span>
        : t.type === 'add' ? <mark key={idx} style={{ background: 'rgba(74,222,128,0.25)', color: 'inherit', borderRadius: '3px', padding: '1px 3px' }}>{t.text} </mark>
        : <del key={idx} style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', borderRadius: '3px', padding: '1px 3px' }}>{t.text} </del>
      )}
    </span>
  );
}

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

type ModalType = 'tailor' | 'ats' | 'diff' | null;

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

/** Strip HTML from rich text fields before sending to AI services */
function sanitizeResumeForAI(resume: Resume): Resume {
  return {
    ...resume,
    personal: { ...resume.personal, summary: stripHtml(resume.personal.summary) },
    experience: resume.experience.map(exp => ({ ...exp, bullets: exp.bullets.map(stripHtml) })),
    projects: resume.projects.map(p => ({ ...p, description: stripHtml(p.description) })),
  };
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
  const { currentUser, signOut } = useAuth();
  const { plan, canAccess, maxResumes } = usePlan();
  const { savedResumes, canSaveMore, saveResume, deleteResume, renameResume } = useSavedResumes();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<'landing' | 'login' | 'plan-select' | 'mode-select' | 'builder' | 'preview'>('landing');
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
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pageCount, setPageCount] = useState(1);
  const [upgradePrompt, setUpgradePrompt] = useState<{ requiredPlan: 'pro' | 'ultimate'; featureLabel: string } | null>(null);

  // Saved resume state
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [savePrompt, setSavePrompt] = useState(false);
  const [saveNameValue, setSaveNameValue] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  // Tailor modal state
  const [jd, setJd] = useState('');
  const [tailorInputMode, setTailorInputMode] = useState<'text' | 'url'>('text');
  const [jobUrl, setJobUrl] = useState('');
  const [urlFetchLoading, setUrlFetchLoading] = useState(false);
  const [urlFetchError, setUrlFetchError] = useState('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorResult, setTailorResult] = useState<{
    missingKeywords: string[];
    rewrittenBullets: { original: string; suggested: string }[];
    suggestedSummary: string;
  } | null>(null);
  const [appliedBullets, setAppliedBullets] = useState<Set<number>>(new Set());
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [addedKeywords, setAddedKeywords] = useState<Set<string>>(new Set());

  // ATS modal state
  const [atsJd, setAtsJd] = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsTailorLoading, setAtsTailorLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    missingKeywords: string[];
    weakSections: string[];
    feedback: string;
  } | null>(null);

  const showUpgrade = (feature: Feature) => {
    setUpgradePrompt({
      requiredPlan: FEATURE_REQUIRED_PLAN[feature],
      featureLabel: FEATURE_LABELS[feature],
    });
  };

  const showSavedToast = () => {
    setSavedToast(true);
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

  const handleTailor = async () => {
    if (!canAccess('job-tailor')) { showUpgrade('job-tailor'); return; }
    if (!jd.trim()) return;
    setTailorLoading(true);
    setTailorResult(null);
    try {
      const result = await api.tailorResume(sanitizeResumeForAI(resume), jd);
      setTailorResult(result);
    } catch {
      alert('AI unavailable.');
    } finally {
      setTailorLoading(false);
    }
  };

  const openTailorModal = () => {
    if (!canAccess('job-tailor')) { showUpgrade('job-tailor'); return; }
    setActiveModal('tailor');
    setTailorResult(null);
    setJd('');
    setJobUrl('');
    setUrlFetchError('');
    setTailorInputMode('text');
    setAppliedBullets(new Set());
    setAppliedSummary(false);
    setAddedKeywords(new Set());
  };

  const handleFetchJobUrl = async () => {
    if (!jobUrl.trim()) return;
    setUrlFetchLoading(true);
    setUrlFetchError('');
    try {
      const { text } = await api.fetchJobUrl(jobUrl.trim());
      setJd(text);
      setTailorInputMode('text');
    } catch (e: any) {
      setUrlFetchError(e.message || 'Failed to fetch URL');
    } finally {
      setUrlFetchLoading(false);
    }
  };

  const applyTailorSuggestion = (type: 'summary' | 'bullet', value: string, originalBullet?: string, bulletIndex?: number) => {
    if (type === 'summary') {
      setResume(prev => ({ ...prev, personal: { ...prev.personal, summary: plainTextToHtml(value) } }));
      setAppliedSummary(true);
    } else if (type === 'bullet' && originalBullet) {
      setResume(prev => ({
        ...prev,
        experience: prev.experience.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(b => stripHtml(b) === originalBullet ? plainTextToHtml(value) : b),
        })),
      }));
      if (bulletIndex !== undefined) setAppliedBullets(prev => new Set(prev).add(bulletIndex));
    }
  };

  const addKeywordAsSkill = (keyword: string) => {
    const already = resume.skills.some(s => s.name.toLowerCase() === keyword.toLowerCase());
    if (!already) setResume(prev => ({ ...prev, skills: [...prev.skills, { id: crypto.randomUUID(), name: keyword, level: 75 }] }));
    setAddedKeywords(prev => new Set(prev).add(keyword));
  };

  const handleAcceptAll = () => {
    if (!tailorResult) return;
    setResume(prev => {
      let updated = { ...prev };
      if (tailorResult.suggestedSummary) updated.personal.summary = plainTextToHtml(tailorResult.suggestedSummary);
      tailorResult.rewrittenBullets.forEach(b => {
        updated.experience = updated.experience.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(bullet => stripHtml(bullet) === b.original ? plainTextToHtml(b.suggested) : bullet),
        }));
      });
      const existingNames = new Set(updated.skills.map(s => s.name.toLowerCase()));
      const newSkills = tailorResult.missingKeywords
        .filter(k => !existingNames.has(k.toLowerCase()))
        .map(k => ({ id: crypto.randomUUID(), name: k, level: 75 }));
      updated.skills = [...updated.skills, ...newSkills];
      return updated;
    });
    setAppliedSummary(true);
    setAppliedBullets(new Set(tailorResult.rewrittenBullets.map((_, i) => i)));
    setAddedKeywords(new Set(tailorResult.missingKeywords));
  };

  const handleAtsScore = async () => {
    if (!canAccess('dynamic-ats')) { showUpgrade('dynamic-ats'); return; }
    if (!atsJd.trim()) return;
    setAtsLoading(true);
    setAtsResult(null);
    try {
      const result = await api.atsScore(sanitizeResumeForAI(resume), atsJd);
      setAtsResult(result);
    } catch {
      alert('AI unavailable.');
    } finally {
      setAtsLoading(false);
    }
  };

  const handleAtsTailor = async () => {
    if (!atsResult || !atsJd.trim()) return;
    setAtsTailorLoading(true);
    try {
      const result = await api.atsTailor(resume, atsJd, atsResult);
      setJd(atsJd);
      setTailorResult(result);
      setAppliedBullets(new Set());
      setAppliedSummary(false);
      setAddedKeywords(new Set());
      setActiveModal('tailor');
    } catch {
      alert('AI unavailable.');
    } finally {
      setAtsTailorLoading(false);
    }
  };

  const openAtsModal = () => {
    if (!canAccess('dynamic-ats')) { showUpgrade('dynamic-ats'); return; }
    setActiveModal('ats');
    setAtsResult(null);
  };

  const handleModeSelect = (mode: any, prefilledResume?: Resume, suggestions?: ImprovementSuggestions) => {
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

    return (
      <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>
        <header className="top-bar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} onClick={() => setView('landing')}>
              <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={13} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>Bespoke<span style={{ color: '#818CF8' }}>CV</span></span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />
            <PlanBadge size="sm" />
            <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />
            <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }} onClick={() => setRightPanelOpen(true)}>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.primary }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.accent }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{activeTemplate.name}</span>
              <ChevronRight size={11} style={{ opacity: 0.5 }} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }} onClick={() => setActiveModal('diff')}>
              <GitCompare size={13} /> Changes
              {initialResumeRef.current && JSON.stringify(initialResumeRef.current) !== JSON.stringify(resume) && <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8' }} />}
            </button>
            <button className="btn-ghost" style={{ padding: '7px 10px' }} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
            <button className={rightPanelOpen ? 'btn-primary' : 'btn-secondary'} style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }} onClick={() => setRightPanelOpen(v => !v)}><Palette size={13} /> Style</button>
            <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }} onClick={() => setShowSavedPanel(true)}>
              <FolderOpen size={13} /> My Resumes
              {savedResumes.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ui-accent)', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{savedResumes.length}</span>}
            </button>
            <button className="btn-secondary" style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }} onClick={handleSave}><Save size={13} /> Save</button>
            <button className="btn-primary" style={{ gap: '6px', fontSize: '13px' }} onClick={() => {
              setActiveTemplate(t => ({ ...t, settings: t.settings ?? { margin: 15, fontSize: 100, lineHeight: 1.5 } }));
              setView('preview');
            }}><FileText size={14} /> Preview</button>
            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>{(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}</div>
                <button className="btn-ghost" style={{ padding: '4px' }} onClick={handleLogout}><LogOut size={14} /></button>
              </div>
            )}
          </div>
        </header>

        <div style={{ display: 'flex', overflow: 'hidden', height: '100%' }}>
          <div style={{ width: formWidth, flexShrink: 0, transition: 'width 0.25s', position: 'relative', height: '100%', overflow: 'hidden' }} className="no-print">
            <ResumeBuilder resume={resume} onChange={setResume} onTailor={openTailorModal} onAtsScore={openAtsModal} improvements={improvements} onDismissImprovements={() => setImprovements(null)} onUpgradeNeeded={showUpgrade} />
            <button onClick={() => setFormExpanded(v => !v)} style={{ position: 'absolute', top: '50%', right: '-11px', transform: 'translateY(-50%)', width: '22px', height: '44px', borderRadius: '0 8px 8px 0', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderLeft: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ui-text-muted)', zIndex: 10 }}>{formExpanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}</button>
          </div>

          <main className="preview-viewport" style={{ flex: 1, minWidth: 0 }}>
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
