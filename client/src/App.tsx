import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResumeBuilder from './components/ResumeBuilder';
import ModeSelectModal from './components/ModeSelectModal';
import UpgradeModal from './components/UpgradeModal';
import SavedResumesPanel from './components/SavedResumesPanel';
import PagedPreview from './components/PagedPreview';
import TemplateRenderer from './templates/TemplateRenderer';
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
  Download, Zap, X, Sparkles, Palette,
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
          // cycle through plans for demo — in prod this opens payment
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
      {/* Logo */}
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
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Start with {plan.name}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>
        Demo mode — payment integration coming soon. All plans activate instantly.
      </p>
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

function AppContent() {
  const { currentUser, loading, signOut } = useAuth();
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
  const [savePrompt, setSavePrompt] = useState(false);  // name dialog for first save
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

  // Called when user clicks Save button
  const handleSave = () => {
    if (currentResumeId) {
      // Already saved once — just update silently
      saveResume(
        savedResumes.find(r => r.id === currentResumeId)?.name ?? 'My Resume',
        resume,
        activeTemplate,
        currentResumeId,
      );
      showSavedToast();
    } else {
      // First save — ask for a name
      setSaveNameValue(resume.personal.name ? `${resume.personal.name.split(' ')[0]}'s Resume` : 'My Resume');
      setSavePrompt(true);
    }
  };

  const handleSaveConfirm = () => {
    const name = saveNameValue.trim() || 'My Resume';
    if (!canSaveMore) {
      // At limit — show upgrade
      setUpgradePrompt({
        requiredPlan: plan === 'basic' ? 'pro' : 'ultimate',
        featureLabel: `Save more than ${maxResumes} resume${maxResumes === 1 ? '' : 's'}`,
      });
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

  const handleLoadResume = (saved: import('./hooks/useSavedResumes').SavedResume) => {
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

  const handleColorChange = (palette: typeof colorPalettes[0]) => {
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
      alert('AI unavailable. Make sure the server is running with OPENAI_API_KEY set.');
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
      if (bulletIndex !== undefined) {
        setAppliedBullets(prev => new Set(prev).add(bulletIndex));
      }
    }
  };

  const addKeywordAsSkill = (keyword: string) => {
    const already = resume.skills.some(s => s.name.toLowerCase() === keyword.toLowerCase());
    if (!already) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, { id: crypto.randomUUID(), name: keyword, level: 75 }] }));
    }
    setAddedKeywords(prev => new Set(prev).add(keyword));
  };

  const handleAcceptAll = () => {
    if (!tailorResult) return;
    setResume(prev => {
      let updated = { ...prev };
      // Apply summary
      if (tailorResult.suggestedSummary) {
        updated = { ...updated, personal: { ...updated.personal, summary: plainTextToHtml(tailorResult.suggestedSummary) } };
      }
      // Apply all bullet rewrites
      tailorResult.rewrittenBullets.forEach(b => {
        updated = {
          ...updated,
          experience: updated.experience.map(exp => ({
            ...exp,
            bullets: exp.bullets.map(bullet => stripHtml(bullet) === b.original ? plainTextToHtml(b.suggested) : bullet),
          })),
        };
      });
      // Add all missing keywords as skills (skip duplicates)
      const existingNames = new Set(updated.skills.map(s => s.name.toLowerCase()));
      const newSkills = tailorResult.missingKeywords
        .filter(k => !existingNames.has(k.toLowerCase()))
        .map(k => ({ id: crypto.randomUUID(), name: k, level: 75 }));
      if (newSkills.length > 0) {
        updated = { ...updated, skills: [...updated.skills, ...newSkills] };
      }
      return updated;
    });
    // Mark everything as applied
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
      alert('AI unavailable. Make sure the server is running with OPENAI_API_KEY set.');
    } finally {
      setAtsLoading(false);
    }
  };

  const handleAtsTailor = async () => {
    if (!atsResult || !atsJd.trim()) return;
    setAtsTailorLoading(true);
    try {
      const result = await api.atsTailor(resume, atsJd, atsResult);
      // Pre-populate the tailor modal with these results and open it
      setJd(atsJd);
      setTailorResult(result);
      setAppliedBullets(new Set());
      setAppliedSummary(false);
      setAddedKeywords(new Set());
      setActiveModal('tailor');
    } catch {
      alert('AI unavailable. Make sure the server is running with OPENAI_API_KEY set.');
    } finally {
      setAtsTailorLoading(false);
    }
  };

  const openAtsModal = () => {
    if (!canAccess('dynamic-ats')) { showUpgrade('dynamic-ats'); return; }
    setActiveModal('ats');
    setAtsResult(null);
  };

  const handleExportPdf = () => window.print();

  const handleModeSelect = (
    _mode: 'manual' | 'enhance' | 'linkedin',
    prefilledResume?: Resume,
    suggestions?: ImprovementSuggestions
  ) => {
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

  // Navigate to builder entry — check auth + plan
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

  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (view === 'login') {
    return (
      <LoginPage onLoginSuccess={() => {
        // plan check happens via usePlan which reads localStorage for the new uid
        // We need to check after auth resolves — use a slight defer
        setTimeout(() => {
          const uid = currentUser?.uid;
          const storedPlan = uid ? localStorage.getItem(`bespokecv_plan_${uid}`) : null;
          setView(storedPlan ? 'mode-select' : 'plan-select');
        }, 100);
      }} />
    );
  }

  if (view === 'plan-select') {
    return <PlanSelectPage onSelected={() => setView('mode-select')} />;
  }

  if (view === 'mode-select') {
    return (
      <>
        <ModeSelectModal
          onSelect={handleModeSelect}
          onBack={() => setView('landing')}
          onUpgradeNeeded={showUpgrade}
        />
        {upgradePrompt && (
          <UpgradeModal
            requiredPlan={upgradePrompt.requiredPlan}
            featureLabel={upgradePrompt.featureLabel}
            onClose={() => setUpgradePrompt(null)}
          />
        )}
      </>
    );
  }

  if (view === 'preview') {
    return (
      <ExportPreview 
        resume={resume} 
        config={activeTemplate} 
        onBack={() => setView('builder')}
        onUpdateConfig={setActiveTemplate}
      />
    );
  }

  const formWidth = formExpanded ? '48%' : '40%';

  return (
    <div className="app-grid" style={{ background: 'var(--color-ui-bg)' }}>

      {/* ── TOP BAR ─────────────────────────────────── */}
      <header className="top-bar no-print">
        {/* Left: Logo + active template badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {/* Plan badge */}
          <PlanBadge size="sm" />

          <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />

          {/* Active template info */}
          <button
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}
            onClick={() => setRightPanelOpen(true)}
            title="Change template"
          >
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.primary }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: activeTemplate.colors.accent }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{activeTemplate.name}</span>
            <ChevronRight size={11} style={{ opacity: 0.5 }} />
          </button>
        </div>

        {/* Right: Style toggle + Save + Export + User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-secondary"
            style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }}
            onClick={() => setActiveModal('diff')}
            title="View all changes this session"
          >
            <GitCompare size={13} />
            Changes
            {initialResumeRef.current && JSON.stringify(initialResumeRef.current) !== JSON.stringify(resume) && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8' }} />
            )}
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '7px 10px' }}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className={rightPanelOpen ? 'btn-primary' : 'btn-secondary'}
            style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }}
            onClick={() => setRightPanelOpen(v => !v)}
          >
            <Palette size={13} />
            Style
          </button>

          {/* My Resumes */}
          <button
            className="btn-secondary"
            style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px', position: 'relative' }}
            onClick={() => setShowSavedPanel(true)}
            title="My saved resumes"
          >
            <FolderOpen size={13} />
            My Resumes
            {savedResumes.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--color-ui-accent)', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {savedResumes.length}
              </span>
            )}
          </button>

          {/* Save */}
          <button
            className="btn-secondary"
            style={{ gap: '6px', fontSize: '12.5px', padding: '7px 14px' }}
            onClick={handleSave}
            title={currentResumeId ? 'Save changes' : 'Save resume'}
          >
            <Save size={13} />
            {currentResumeId ? 'Save' : 'Save'}
          </button>

          <button className="btn-primary" style={{ gap: '6px', fontSize: '13px' }} onClick={() => setView('preview')}>
            <FileText size={14} />
            Preview
          </button>

          {currentUser && (
            <>
              <div style={{ width: '1px', height: '20px', background: 'var(--color-ui-border)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName ?? 'User'}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--color-ui-border)' }}
                  />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>
                    {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ui-text)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.displayName ?? currentUser.email}
                </span>
                <button className="btn-ghost" style={{ padding: '4px', borderRadius: '6px' }} title="Sign out" onClick={handleLogout}>
                  <LogOut size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── MAIN SPLIT (3-column flex) ───────────────── */}
      <div style={{ display: 'flex', overflow: 'hidden', height: '100%' }}>

        {/* Left: Form panel (expandable) */}
        <div style={{ width: formWidth, flexShrink: 0, transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)', position: 'relative', height: '100%', overflow: 'hidden' }} className="no-print">
          <ResumeBuilder
            resume={resume}
            onChange={setResume}
            onTailor={openTailorModal}
            onAtsScore={openAtsModal}
            improvements={improvements}
            onDismissImprovements={() => setImprovements(null)}
            onUpgradeNeeded={showUpgrade}
          />
          {/* Expand handle */}
          <button
            onClick={() => setFormExpanded(v => !v)}
            title={formExpanded ? 'Collapse panel' : 'Expand panel'}
            style={{
              position: 'absolute', top: '50%', right: '-11px', transform: 'translateY(-50%)',
              width: '22px', height: '44px', borderRadius: '0 8px 8px 0',
              background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
              borderLeft: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--color-ui-text-muted)', zIndex: 10,
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ui-text)'; e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ui-text-muted)'; e.currentTarget.style.background = 'var(--color-ui-surface)'; }}
          >
            {formExpanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </button>
        </div>

        {/* Center: Preview */}
        <main className="preview-viewport" style={{ flex: 1, minWidth: 0 }}>
          {/* Preview toolbar */}
          <div className="no-print" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            {/* Left: template info */}
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

        {/* Right: Style panel (collapsible) */}
        <div style={{ width: rightPanelOpen ? '300px' : '0', flexShrink: 0, overflow: 'hidden', transition: 'width 0.25s cubic-bezier(0.16,1,0.3,1)' }} className="no-print">
          {rightPanelOpen && (
            <StylePanel
              templates={templates}
              activeTemplate={activeTemplate}
              onTemplateChange={setActiveTemplate}
              onColorChange={handleColorChange}
              onClose={() => setRightPanelOpen(false)}
              zoom={zoom}
              onZoomChange={setZoom}
              onUpgradeNeeded={showUpgrade}
            />
          )}
        </div>
      </div>

      {/* ── JOB TAILOR MODAL ─────────────────────────── */}
      {activeModal === 'tailor' && (
        <div className="modal-overlay no-print" onClick={e => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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

            <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
              {!tailorResult ? (
                <div>
                  {/* Input mode tabs */}
                  <div style={{ display: 'flex', gap: '0', marginBottom: '14px', background: 'var(--color-ui-bg)', borderRadius: '8px', padding: '3px', border: '1px solid var(--color-ui-border)' }}>
                    <button
                      onClick={() => setTailorInputMode('text')}
                      style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: tailorInputMode === 'text' ? 'var(--color-ui-surface)' : 'transparent', color: tailorInputMode === 'text' ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)' }}
                    >
                      Paste Text
                    </button>
                    <button
                      onClick={() => setTailorInputMode('url')}
                      style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: tailorInputMode === 'url' ? 'var(--color-ui-surface)' : 'transparent', color: tailorInputMode === 'url' ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)' }}
                    >
                      <Link size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                      From URL
                    </button>
                  </div>

                  {tailorInputMode === 'url' ? (
                    <div>
                      <label className="field-label">Job Posting URL</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          className="field-input"
                          type="url"
                          value={jobUrl}
                          onChange={e => { setJobUrl(e.target.value); setUrlFetchError(''); }}
                          placeholder="https://jobs.example.com/posting/123"
                          style={{ flex: 1, fontSize: '13px' }}
                          onKeyDown={e => e.key === 'Enter' && handleFetchJobUrl()}
                        />
                        <button className="btn-primary" style={{ fontSize: '12px', padding: '0 16px', flexShrink: 0 }} onClick={handleFetchJobUrl} disabled={urlFetchLoading || !jobUrl.trim()}>
                          {urlFetchLoading ? <Loader2 size={14} className="spin" /> : 'Fetch'}
                        </button>
                      </div>
                      {urlFetchError && (
                        <div style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '8px' }}>
                          <p style={{ fontSize: '12px', color: '#F87171', marginBottom: '6px' }}>{urlFetchError}</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>
                            Tip: Switch to "Paste Text" and copy-paste the job description directly from the page.
                          </p>
                        </div>
                      )}
                      {jd && (
                        <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', fontSize: '12px', color: '#4ADE80' }}>
                          <Check size={12} style={{ display: 'inline', marginRight: '5px' }} />
                          Job description fetched ({jd.length} chars) — ready to analyze
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="field-label">Job Description</label>
                      <textarea className="field-textarea" rows={10} value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." style={{ fontSize: '13px' }} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {tailorResult.missingKeywords.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px' }}>Missing Keywords</div>
                      <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginBottom: '10px' }}>Click a keyword to add it to your Skills section.</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {tailorResult.missingKeywords.map(k => (
                          addedKeywords.has(k) ? (
                            <span key={k} style={{ padding: '5px 12px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '100px', fontSize: '12px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={11} /> {k}
                            </span>
                          ) : (
                            <button key={k} onClick={() => addKeywordAsSkill(k)} style={{ padding: '5px 12px', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.25)', borderRadius: '100px', fontSize: '12px', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,81,73,0.18)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.5)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,81,73,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.25)'; }}
                            >
                              <Plus size={11} /> {k}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  {tailorResult.rewrittenBullets.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '12px' }}>Suggested Bullet Rewrites</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {tailorResult.rewrittenBullets.map((b, i) => (
                          <div key={i} style={{ padding: '14px', background: 'var(--color-ui-bg)', borderRadius: '10px', border: `1px solid ${appliedBullets.has(i) ? 'rgba(74,222,128,0.3)' : 'var(--color-ui-border)'}` }}>
                            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Before</div>
                            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, marginBottom: '10px' }}>{b.original}</p>
                            <div style={{ fontSize: '11px', color: '#4ADE80', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>After</div>
                            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text)', lineHeight: 1.6, marginBottom: '12px' }}>{b.suggested}</p>
                            {appliedBullets.has(i) ? (
                              <button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 14px', color: '#4ADE80', borderColor: 'rgba(74,222,128,0.3)', cursor: 'default' }} disabled>
                                <Check size={12} /> Applied
                              </button>
                            ) : (
                              <button className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => applyTailorSuggestion('bullet', b.suggested, b.original, i)}>
                                <Check size={12} /> Apply
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {tailorResult.suggestedSummary && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px' }}>Tailored Summary</div>
                      <div style={{ padding: '14px', background: 'var(--color-ui-bg)', borderRadius: '10px', border: `1px solid ${appliedSummary ? 'rgba(74,222,128,0.3)' : 'var(--color-ui-border)'}` }}>
                        <p style={{ fontSize: '13px', color: 'var(--color-ui-text)', lineHeight: 1.7, marginBottom: '12px' }}>{tailorResult.suggestedSummary}</p>
                        {appliedSummary ? (
                          <button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 14px', color: '#4ADE80', borderColor: 'rgba(74,222,128,0.3)', cursor: 'default' }} disabled>
                            <Check size={12} /> Applied
                          </button>
                        ) : (
                          <button className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }} onClick={() => applyTailorSuggestion('summary', tailorResult.suggestedSummary)}>
                            <Check size={12} /> Apply Summary
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
              {tailorResult ? (
                <>
                  <button className="btn-secondary" onClick={() => { setTailorResult(null); setAppliedBullets(new Set()); setAppliedSummary(false); setAddedKeywords(new Set()); }}>Try Again</button>
                  <button
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', gap: '6px' }}
                    onClick={handleAcceptAll}
                    disabled={
                      appliedSummary &&
                      tailorResult.rewrittenBullets.every((_, i) => appliedBullets.has(i)) &&
                      tailorResult.missingKeywords.every(k => addedKeywords.has(k))
                    }
                  >
                    <Check size={14} /> Accept All
                  </button>
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
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>ATS Compatibility Score</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>Check how well your resume matches a job description</p>
              </div>
              <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setActiveModal(null)}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
              {!atsResult ? (
                <div>
                  <label className="field-label">Job Description</label>
                  <textarea className="field-textarea" rows={9} value={atsJd} onChange={e => setAtsJd(e.target.value)} placeholder="Paste the job description to analyze your match..." style={{ fontSize: '13px' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${atsResult.score >= 80 ? '#4ADE80' : atsResult.score >= 60 ? '#F59E0B' : '#F87171'} ${atsResult.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`, boxShadow: '0 0 30px rgba(0,0,0,0.3)' }}>
                      <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--color-ui-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)' }}>{atsResult.score}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 600 }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 700, color: atsResult.score >= 80 ? '#4ADE80' : atsResult.score >= 60 ? '#F59E0B' : '#F87171' }}>
                      {atsResult.score >= 80 ? '✓ Strong Match' : atsResult.score >= 60 ? '⚠ Moderate Match' : '✗ Needs Work'}
                    </div>
                  </div>
                  {atsResult.feedback && (
                    <div style={{ padding: '14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Feedback</div>
                      <p style={{ fontSize: '13px', color: 'var(--color-ui-text)', lineHeight: 1.65 }}>{atsResult.feedback}</p>
                    </div>
                  )}
                  {atsResult.missingKeywords.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} color="#F87171" /> Missing Keywords
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsResult.missingKeywords.map(k => (
                          <span key={k} style={{ padding: '4px 10px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)', borderRadius: '100px', fontSize: '12px', color: '#F87171' }}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {atsResult.weakSections.length > 0 && (
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>Sections to Improve</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {atsResult.weakSections.map(s => (
                          <span key={s} style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '100px', fontSize: '12px', color: '#F59E0B' }}>{s}</span>
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
                  <button className="btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
                  <button
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', gap: '6px' }}
                    onClick={handleAtsTailor}
                    disabled={atsTailorLoading}
                  >
                    {atsTailorLoading
                      ? <><Loader2 size={14} className="spin" /> Generating Fixes…</>
                      : <><Sparkles size={14} /> Fix with AI</>}
                  </button>
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

      {/* ── DIFF / CHANGES MODAL ─────────────────────── */}
      {activeModal === 'diff' && (() => {
        const before = initialResumeRef.current;
        if (!before) return (
          <div className="modal-overlay no-print" onClick={() => setActiveModal(null)}>
            <div className="modal-content" style={{ maxWidth: '560px', padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-ui-text-muted)' }}>No baseline captured yet. Start editing to track changes.</p>
              <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        );

        // ── Compute diff ─────────────────────────────
        const personalKeys = ['name', 'title', 'email', 'phone', 'location', 'linkedin', 'website', 'summary'] as const;
        const personalLabels: Record<typeof personalKeys[number], string> = { name: 'Name', title: 'Title', email: 'Email', phone: 'Phone', location: 'Location', linkedin: 'LinkedIn', website: 'Website', summary: 'Summary' };
        const changedPersonal = personalKeys.filter(k => (before.personal[k] ?? '') !== (resume.personal[k] ?? ''));

        const expChanges = resume.experience.flatMap(exp => {
          const prev = before.experience.find(e => e.id === exp.id);
          if (!prev) return [{ label: `${exp.role} @ ${exp.company}`, isNew: true, items: [] as { type: 'add'|'del'|'changed'; before: string; after: string }[] }];
          const items: { type: 'add'|'del'|'changed'; before: string; after: string }[] = [];
          if (prev.role !== exp.role || prev.company !== exp.company) items.push({ type: 'changed', before: `${prev.role} @ ${prev.company}`, after: `${exp.role} @ ${exp.company}` });
          const prevSet = new Set(prev.bullets);
          const currSet = new Set(exp.bullets);
          prev.bullets.forEach(b => { if (!currSet.has(b)) items.push({ type: 'del', before: b, after: '' }); });
          exp.bullets.forEach(b => { if (!prevSet.has(b)) items.push({ type: 'add', before: '', after: b }); });
          if (items.length === 0) return [];
          return [{ label: `${exp.role} @ ${exp.company}`, isNew: false, items }];
        });
        const removedExp = before.experience.filter(e => !resume.experience.find(r => r.id === e.id))
          .map(e => ({ label: `${e.role} @ ${e.company}`, isNew: false, isRemoved: true, items: [] as { type: 'add'|'del'|'changed'; before: string; after: string }[] }));

        const prevSkillNames = new Set(before.skills.map(s => s.name));
        const currSkillNames = new Set(resume.skills.map(s => s.name));
        const addedSkills = resume.skills.filter(s => !prevSkillNames.has(s.name));
        const removedSkills = before.skills.filter(s => !currSkillNames.has(s.name));

        const allExpChanges = [...expChanges, ...removedExp];
        const hasAnything = changedPersonal.length > 0 || allExpChanges.length > 0 || addedSkills.length > 0 || removedSkills.length > 0;

        const sectionStyle = { marginBottom: '24px' };
        const sectionTitle = { fontSize: '11px', fontWeight: 700, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '10px' };
        const rowStyle = { padding: '10px 12px', borderRadius: '8px', marginBottom: '6px' };

        return (
          <div className="modal-overlay no-print" onClick={e => e.target === e.currentTarget && setActiveModal(null)}>
            <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
                    <GitCompare size={16} style={{ display: 'inline', marginRight: '8px', color: '#818CF8' }} />
                    Session Changes
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>
                    All changes since you opened this session.{' '}
                    <span style={{ color: '#4ADE80' }}>Green = added</span>, <span style={{ color: '#F87171', textDecoration: 'line-through' }}>red = removed</span>.
                  </p>
                </div>
                <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setActiveModal(null)}><X size={18} /></button>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
                {!hasAnything ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-ui-text-muted)' }}>
                    <GitCompare size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontSize: '14px' }}>No changes yet this session.</p>
                  </div>
                ) : (
                  <>
                    {/* Personal */}
                    {changedPersonal.length > 0 && (
                      <div style={sectionStyle}>
                        <div style={sectionTitle}>Personal Info</div>
                        {changedPersonal.map(k => (
                          <div key={k} style={{ ...rowStyle, background: 'var(--color-ui-bg)', border: '1px solid var(--color-ui-border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', fontWeight: 600, marginBottom: '6px' }}>{personalLabels[k]}</div>
                            <DiffText before={before.personal[k] ?? ''} after={resume.personal[k] ?? ''} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience */}
                    {allExpChanges.length > 0 && (
                      <div style={sectionStyle}>
                        <div style={sectionTitle}>Experience</div>
                        {allExpChanges.map((ec, i) => (
                          <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {(ec as any).isRemoved
                                ? <><span style={{ color: '#F87171' }}><Minus size={11} /></span> <span style={{ textDecoration: 'line-through', color: '#F87171' }}>{ec.label}</span></>
                                : ec.isNew
                                ? <><span style={{ color: '#4ADE80' }}><Plus size={11} /></span> <span style={{ color: '#4ADE80' }}>{ec.label}</span></>
                                : ec.label}
                            </div>
                            {ec.items.map((item, j) => (
                              <div key={j} style={{ ...rowStyle, background: item.type === 'add' ? 'rgba(74,222,128,0.06)' : item.type === 'del' ? 'rgba(248,113,113,0.06)' : 'var(--color-ui-bg)', border: `1px solid ${item.type === 'add' ? 'rgba(74,222,128,0.2)' : item.type === 'del' ? 'rgba(248,113,113,0.2)' : 'var(--color-ui-border)'}`, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                {item.type === 'add' && <Plus size={12} style={{ color: '#4ADE80', flexShrink: 0, marginTop: '3px' }} />}
                                {item.type === 'del' && <Minus size={12} style={{ color: '#F87171', flexShrink: 0, marginTop: '3px' }} />}
                                {item.type === 'changed' && <GitCompare size={12} style={{ color: '#818CF8', flexShrink: 0, marginTop: '3px' }} />}
                                <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                                  {item.type === 'add' && <span style={{ color: '#4ADE80' }}>{item.after}</span>}
                                  {item.type === 'del' && <span style={{ color: '#F87171', textDecoration: 'line-through' }}>{item.before}</span>}
                                  {item.type === 'changed' && <DiffText before={item.before} after={item.after} />}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {(addedSkills.length > 0 || removedSkills.length > 0) && (
                      <div style={sectionStyle}>
                        <div style={sectionTitle}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {addedSkills.map(s => (
                            <span key={s.id} style={{ padding: '4px 10px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '100px', fontSize: '12px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Plus size={10} /> {s.name}
                            </span>
                          ))}
                          {removedSkills.map(s => (
                            <span key={s.id} style={{ padding: '4px 10px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '100px', fontSize: '12px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'line-through' }}>
                              <Minus size={10} /> {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                <button className="btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── UPGRADE MODAL ────────────────────────────── */}
      {upgradePrompt && (
        <UpgradeModal
          requiredPlan={upgradePrompt.requiredPlan}
          featureLabel={upgradePrompt.featureLabel}
          onClose={() => setUpgradePrompt(null)}
        />
      )}

      {/* ── SAVED RESUMES PANEL ─────────────────────── */}
      {showSavedPanel && (
        <SavedResumesPanel
          savedResumes={savedResumes}
          currentResumeId={currentResumeId}
          maxResumes={maxResumes}
          onLoad={handleLoadResume}
          onDelete={deleteResume}
          onRename={renameResume}
          onNewResume={handleNewResume}
          onClose={() => setShowSavedPanel(false)}
          onUpgradeNeeded={() => setUpgradePrompt({
            requiredPlan: plan === 'basic' ? 'pro' : 'ultimate',
            featureLabel: `Save more than ${maxResumes} resume${maxResumes === 1 ? '' : 's'}`,
          })}
        />
      )}

      {/* ── SAVE NAME PROMPT ─────────────────────────── */}
      {savePrompt && (
        <div className="modal-overlay no-print" onClick={e => { if (e.target === e.currentTarget) setSavePrompt(false); }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div style={{ padding: '24px 24px 20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px' }}>
                <Save size={15} style={{ display: 'inline', marginRight: '8px', color: '#818CF8' }} />
                Save Resume
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginBottom: '20px' }}>
                Give this resume a name so you can find it later.
              </p>
              <input
                autoFocus
                className="field-input"
                value={saveNameValue}
                onChange={e => setSaveNameValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveConfirm(); if (e.key === 'Escape') setSavePrompt(false); }}
                placeholder="e.g. Software Engineer @ Google"
                style={{ fontSize: '14px', marginBottom: '8px' }}
              />
              {!canSaveMore && (
                <p style={{ fontSize: '12px', color: '#F87171', marginBottom: '4px' }}>
                  You've reached the {maxResumes}-resume limit on your {plan} plan. Upgrade to save more.
                </p>
              )}
            </div>
            <div style={{ padding: '0 24px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setSavePrompt(false)}>Cancel</button>
              <button className="btn-primary" style={{ gap: '6px' }} onClick={handleSaveConfirm}>
                <Save size={13} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAVED TOAST ──────────────────────────────── */}
      {savedToast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9998,
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 18px', borderRadius: '10px',
          background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <Check size={14} color="#4ADE80" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#4ADE80' }}>Resume saved</span>
        </div>
      )}

      {/* Print portal */}
      {createPortal(
        <TemplateRenderer resume={resume} config={activeTemplate} />,
        document.getElementById('print-portal')!
      )}
    </div>
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
