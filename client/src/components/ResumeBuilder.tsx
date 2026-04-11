import React, { useState } from 'react';
import type { Resume, ExperienceEntry, SkillEntry, EducationEntry, ProjectEntry, CertificationEntry, LanguageEntry, ImprovementSuggestions } from '../shared/types';
import { api } from '../lib/api';
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen,
  Award, Globe, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2, Check, X, GripVertical, Lock, FileText, PenLine
} from 'lucide-react';
import { usePlan } from '../contexts/PlanContext';
import type { Feature } from '../shared/constants';
import RichEditor from './RichEditor';
import { stripHtml, plainTextToHtml, htmlCharCount } from '../lib/htmlUtils';

interface Props {
  resume: Resume;
  onChange: (resume: Resume) => void;
  improvements?: ImprovementSuggestions | null;
  onDismissImprovements?: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

type TabId = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';

const TABS: { id: TabId; label: string; icon: React.ElementType; countKey?: keyof Resume }[] = [
  { id: 'personal',       label: 'Personal Info',    icon: User },
  { id: 'experience',     label: 'Experience',        icon: Briefcase,     countKey: 'experience' },
  { id: 'education',      label: 'Education',         icon: GraduationCap, countKey: 'education' },
  { id: 'skills',         label: 'Skills',            icon: Wrench,        countKey: 'skills' },
  { id: 'projects',       label: 'Projects',          icon: FolderOpen,    countKey: 'projects' },
  { id: 'certifications', label: 'Certifications',    icon: Award,         countKey: 'certifications' },
  { id: 'languages',      label: 'Languages',         icon: Globe,         countKey: 'languages' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function reorder<T extends { id: string }>(arr: T[], fromId: string, toId: string): T[] {
  const result = [...arr];
  const from = result.findIndex(x => x.id === fromId);
  const to = result.findIndex(x => x.id === toId);
  if (from === -1 || to === -1 || from === to) return result;
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const CharCount = ({ value, max }: { value: string | number; max: number }) => {
  const len = typeof value === 'number' ? value : htmlCharCount(value);
  const color = len > max ? 'var(--color-danger)' : len > max * 0.85 ? 'var(--color-warning)' : 'var(--color-ui-text-dim)';
  return (
    <div style={{ textAlign: 'right', fontSize: '10.5px', fontWeight: 500, color, marginTop: '4px' }}>
      {len} / {max}
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode; error?: string }> = ({ label, children, error }) => (
  <div>
    <label className="field-label">{label}</label>
    {children}
    {error && <p style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>⚠ {error}</p>}
  </div>
);

const SectionHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-ui-editor-border)' }}>
    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)', letterSpacing: '-0.02em' }}>{title}</h3>
    {children}
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{
    textAlign: 'center', padding: '40px 16px',
    border: '1px dashed var(--color-ui-entry-card-border)', borderRadius: '12px',
    background: 'rgba(99,102,241,0.02)',
  }}>
    <div style={{ marginBottom: '10px', opacity: 0.35, color: 'var(--color-ui-accent)' }}>{icon}</div>
    <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>{text}</p>
    <p style={{ fontSize: '11.5px', color: 'var(--color-ui-text-dim)', marginTop: '6px' }}>Click "+ Add" above to get started</p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const ResumeBuilder: React.FC<Props> = ({ resume, onChange, improvements, onDismissImprovements, onUpgradeNeeded }) => {
  const { canAccess, remainingBullets, incrementBulletUsage } = usePlan();
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [editorTab, setEditorTab] = useState<'builder' | 'suggestions'>('suggestions');

  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());

  // AI state
  const [loadingBullets, setLoadingBullets] = useState<string | null>(null);
  const [bulletSuggestions, setBulletSuggestions] = useState<{ expId: string; bullets: string[] } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryMenuOpen, setSummaryMenuOpen] = useState(false);
  const [summaryPromptOpen, setSummaryPromptOpen] = useState(false);
  const [summaryCustomPrompt, setSummaryCustomPrompt] = useState('');
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState<{ technical: string[]; soft: string[] } | null>(null);
  const [skillJobTitle, setSkillJobTitle] = useState('');

  // Collapsed state for each section's cards
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggleCollapsed = (id: string) => setCollapsed(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  // Drag-and-drop
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDrop = (section: 'experience' | 'education' | 'projects' | 'skills', targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    onChange({ ...resume, [section]: reorder(resume[section] as { id: string }[], dragId, targetId) });
    setDragId(null); setDragOverId(null);
  };

  // Validation — track touched fields
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const touch = (key: string) => setTouched(prev => new Set(prev).add(key));
  const err = (key: string, val: string, msg: string) => touched.has(key) && !val.trim() ? msg : undefined;

  // ── Personal ──────────────────────────────────────────────────────────────
  const up = (field: string, val: string) =>
    onChange({ ...resume, personal: { ...resume.personal, [field]: val } });

  // ── Experience ────────────────────────────────────────────────────────────
  const addExp = () => {
    const e: ExperienceEntry = { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, bullets: [''] };
    onChange({ ...resume, experience: [e, ...resume.experience] });
  };
  const updateExp = (id: string, field: keyof ExperienceEntry, val: any) =>
    onChange({ ...resume, experience: resume.experience.map(e => e.id === id ? { ...e, [field]: val } : e) });
  const removeExp = (id: string) =>
    onChange({ ...resume, experience: resume.experience.filter(e => e.id !== id) });

  // ── Education ─────────────────────────────────────────────────────────────
  const addEdu = () => {
    const e: EducationEntry = { id: crypto.randomUUID(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
    onChange({ ...resume, education: [e, ...resume.education] });
  };
  const updateEdu = (id: string, field: keyof EducationEntry, val: string) =>
    onChange({ ...resume, education: resume.education.map(e => e.id === id ? { ...e, [field]: val } : e) });
  const removeEdu = (id: string) =>
    onChange({ ...resume, education: resume.education.filter(e => e.id !== id) });

  // ── Skills ────────────────────────────────────────────────────────────────
  const addSkill = (name = '') => {
    const s: SkillEntry = { id: crypto.randomUUID(), name, level: 75 };
    onChange({ ...resume, skills: [...resume.skills, s] });
  };
  const updateSkill = (id: string, field: keyof SkillEntry, val: any) =>
    onChange({ ...resume, skills: resume.skills.map(s => s.id === id ? { ...s, [field]: val } : s) });
  const removeSkill = (id: string) =>
    onChange({ ...resume, skills: resume.skills.filter(s => s.id !== id) });

  // ── Projects ──────────────────────────────────────────────────────────────
  const addProject = () => {
    const p: ProjectEntry = { id: crypto.randomUUID(), title: '', description: '', url: '', tech: [] };
    onChange({ ...resume, projects: [p, ...resume.projects] });
  };
  const updateProject = (id: string, field: keyof ProjectEntry, val: any) =>
    onChange({ ...resume, projects: resume.projects.map(p => p.id === id ? { ...p, [field]: val } : p) });
  const removeProject = (id: string) =>
    onChange({ ...resume, projects: resume.projects.filter(p => p.id !== id) });

  // ── Certifications ────────────────────────────────────────────────────────
  const addCert = () => {
    const c: CertificationEntry = { id: crypto.randomUUID(), name: '', issuer: '', date: '', url: '' };
    onChange({ ...resume, certifications: [c, ...resume.certifications] });
  };
  const updateCert = (id: string, field: keyof CertificationEntry, val: string) =>
    onChange({ ...resume, certifications: resume.certifications.map(c => c.id === id ? { ...c, [field]: val } : c) });
  const removeCert = (id: string) =>
    onChange({ ...resume, certifications: resume.certifications.filter(c => c.id !== id) });

  // ── Languages ─────────────────────────────────────────────────────────────
  const addLang = () => {
    const l: LanguageEntry = { id: crypto.randomUUID(), language: '', proficiency: 'Intermediate' };
    onChange({ ...resume, languages: [l, ...resume.languages] });
  };
  const updateLang = (id: string, field: keyof LanguageEntry, val: string) =>
    onChange({ ...resume, languages: resume.languages.map(l => l.id === id ? { ...l, [field]: val } : l) });
  const removeLang = (id: string) =>
    onChange({ ...resume, languages: resume.languages.filter(l => l.id !== id) });

  // ── AI ────────────────────────────────────────────────────────────────────
  const handleAIBullets = async (exp: ExperienceEntry) => {
    if (!exp.role && !exp.company) return;
    if (remainingBullets <= 0) {
      alert('Daily limit reached (3/day on Basic plan). Upgrade to Pro for unlimited AI bullets.');
      return;
    }
    setLoadingBullets(exp.id);
    try {
      const data = await api.generateBullets(exp.role, exp.company, 'Technology');
      setBulletSuggestions({ expId: exp.id, bullets: data.bullets });
      incrementBulletUsage();
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingBullets(null); }
  };

  const applyBullet = (expId: string, bullet: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;
    const htmlBullet = plainTextToHtml(bullet);
    const bullets = exp.bullets[0] === '' ? [htmlBullet] : [...exp.bullets, htmlBullet];
    updateExp(expId, 'bullets', bullets);
    setBulletSuggestions(null);
  };

  const handleFindSkills = async () => {
    if (!canAccess('skills-finder')) { onUpgradeNeeded('skills-finder'); return; }
    if (!skillJobTitle.trim()) return;
    setLoadingSkills(true);
    try {
      const data = await api.findSkills(skillJobTitle);
      setSkillSuggestions(data);
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingSkills(false); }
  };

  const handleGenerateSummary = async (customInstruction?: string) => {
    if (!canAccess('ai-summary')) { onUpgradeNeeded('ai-summary'); return; }
    setLoadingSummary(true);
    setSummaryMenuOpen(false);
    setSummaryPromptOpen(false);
    try {
      const skills = resume.skills.map(s => s.name).filter(Boolean);
      const yoe = resume.experience.length > 0 ? `${resume.experience.length * 2}+` : '1';
      
      let summaryText = '';
      if (customInstruction) {
        const { text } = await api.rephrase(resume.personal.summary, customInstruction);
        summaryText = text;
      } else {
        const data = await api.generateSummary(resume.personal.name, resume.personal.title, yoe, skills);
        summaryText = data.summary;
      }
      
      up('summary', plainTextToHtml(summaryText));
      setSummaryCustomPrompt('');
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingSummary(false); }
  };

  const handleRephraseSummary = async () => {
    if (!canAccess('ai-summary')) { onUpgradeNeeded('ai-summary'); return; }
    if (!resume.personal.summary || stripHtml(resume.personal.summary).trim().length < 10) {
      handleGenerateSummary();
      return;
    }
    setLoadingSummary(true);
    setSummaryMenuOpen(false);
    try {
      const { text } = await api.rephrase(resume.personal.summary);
      up('summary', plainTextToHtml(text));
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingSummary(false); }
  };

  const applyImprovement = (original: string, suggested: string, index: number) => {
    if (stripHtml(resume.personal.summary) === original) {
      onChange({ ...resume, personal: { ...resume.personal, summary: plainTextToHtml(suggested) } });
    } else {
      const updatedExperience = resume.experience.map(exp => ({
        ...exp,
        bullets: exp.bullets.map(b => stripHtml(b) === original ? plainTextToHtml(suggested) : b),
      }));
      onChange({ ...resume, experience: updatedExperience });
    }
    setAppliedSuggestions(prev => new Set(prev).add(index));
  };

  const getCount = (tab: typeof TABS[0]): number => {
    if (!tab.countKey) return 0;
    const val = resume[tab.countKey];
    return Array.isArray(val) ? val.length : 0;
  };

  // Drag card wrapper props
  const dragCardProps = (section: 'experience' | 'education' | 'projects' | 'skills', id: string) => ({
    draggable: true,
    onDragStart: () => setDragId(id),
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOverId(id); },
    onDrop: () => handleDrop(section, id),
    onDragEnd: () => { setDragId(null); setDragOverId(null); },
    style: {
      opacity: dragId === id ? 0.4 : 1,
      outline: dragOverId === id && dragId !== id ? '2px solid var(--color-ui-accent)' : 'none',
      outlineOffset: '2px',
      transition: 'opacity 0.15s, outline 0.1s',
    } as React.CSSProperties,
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="editor-panel">

      {/* ── TOP TAB BAR (only when AI suggestions are present) ── */}
      {improvements && (
        <div style={{
          display: 'flex', alignItems: 'stretch', flexShrink: 0,
          borderBottom: '1px solid var(--color-ui-border)',
          background: 'var(--color-ui-surface)',
        }}>
          {(['builder', 'suggestions'] as const).map(tab => {
            const isActive = editorTab === tab;
            const isBuilder = tab === 'builder';
            const pendingCount = improvements.suggestions.length - appliedSuggestions.size;
            return (
              <button
                key={tab}
                onClick={() => setEditorTab(tab)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '6px', padding: '10px 12px', background: 'transparent', border: 'none',
                  borderBottom: isActive ? '2px solid var(--color-ui-accent)' : '2px solid transparent',
                  color: isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-text-muted)',
                  fontSize: '12px', fontWeight: isActive ? 700 : 500, cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {isBuilder ? <FileText size={13} /> : <Sparkles size={13} />}
                {isBuilder ? 'Resume Editor' : 'AI Suggestions'}
                {!isBuilder && pendingCount > 0 && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: '16px', height: '16px', padding: '0 4px',
                    background: isActive ? 'var(--color-ui-accent)' : 'rgba(99,102,241,0.2)',
                    color: isActive ? 'white' : 'var(--color-ui-accent)',
                    borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                  }}>
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={onDismissImprovements}
            title="Dismiss AI suggestions"
            style={{
              background: 'transparent', border: 'none', borderBottom: '2px solid transparent',
              cursor: 'pointer', color: 'var(--color-ui-text-muted)', padding: '10px 10px',
              display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── AI SUGGESTIONS PANEL ─────────────────────── */}
      {improvements && editorTab === 'suggestions' && (
        <div style={{ overflow: 'auto', flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {improvements.overallFeedback && (
            <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5, marginBottom: '4px', fontStyle: 'italic', padding: '8px 10px', background: 'rgba(99,102,241,0.06)', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.12)' }}>{improvements.overallFeedback}</p>
          )}
          {improvements.suggestions.map((s, i) => {
            const applied = appliedSuggestions.has(i);
            return (
              <div key={i} style={{ padding: '10px 12px', background: 'var(--color-ui-surface)', border: `1px solid ${applied ? 'var(--color-success-border)' : 'var(--color-ui-border)'}`, borderRadius: '8px', transition: 'border-color 0.2s, opacity 0.2s', opacity: applied ? 0.6 : 1 }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>{s.section}</div>
                <p style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5, marginBottom: '5px' }}><span style={{ fontWeight: 600 }}>Before:</span> {s.original}</p>
                <p style={{ fontSize: '11.5px', color: 'var(--color-ui-text)', lineHeight: 1.5, marginBottom: '8px' }}><span style={{ fontWeight: 600, color: 'var(--color-success)' }}>After:</span> {s.suggested}</p>
                {applied ? (
                  <button className="btn-applied" disabled>
                    <Check size={11} /> Applied
                  </button>
                ) : (
                  <button className="btn-primary" style={{ fontSize: '11px', padding: '4px 10px', gap: '4px' }} onClick={() => applyImprovement(s.original, s.suggested, i)}>
                    <Check size={11} /> Apply
                  </button>
                )}
              </div>
            );
          })}
          {appliedSuggestions.size === improvements.suggestions.length && (
            <div style={{ textAlign: 'center', padding: '20px 12px', color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>
              <Check size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              All suggestions applied! Switch to Resume Editor to continue.
            </div>
          )}
        </div>
      )}

      {/* ── SECTION NAV ──────────────────────────────── */}
      <div className="editor-nav" style={{ display: improvements && editorTab === 'suggestions' ? 'none' : undefined }}>
        {TABS.map(({ id, label, icon: Icon, countKey }) => {
          const count = countKey ? getCount({ id, label, icon: Icon, countKey }) : 0;
          return (
            <button key={id} className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <Icon size={15} strokeWidth={activeTab === id ? 2.5 : 2} />
              <span>{label}</span>
              {countKey && count > 0 && <span className="nav-badge">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── SECTION CONTENT ──────────────────────────── */}
      <div className="editor-content" style={{ display: improvements && editorTab === 'suggestions' ? 'none' : undefined }}>

        {/* ── PERSONAL ─────────────────────────────────────────────────────── */}
        {activeTab === 'personal' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SectionHeader title="Personal Info" />

            <Field label="Full Name" error={err('personal.name', resume.personal.name, 'Name is required')}>
              <input
                className="field-input"
                value={resume.personal.name}
                onChange={e => up('name', e.target.value)}
                onBlur={() => touch('personal.name')}
                placeholder="e.g. Jane Smith"
                style={{ borderColor: err('personal.name', resume.personal.name, '') ? 'var(--color-danger)' : undefined }}
              />
            </Field>

            <Field label="Job Title">
              <input className="field-input" value={resume.personal.title} onChange={e => up('title', e.target.value)} placeholder="e.g. Senior Software Engineer" />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Email" error={err('personal.email', resume.personal.email, 'Email is required')}>
                <input
                  className="field-input"
                  value={resume.personal.email}
                  onChange={e => up('email', e.target.value)}
                  onBlur={() => touch('personal.email')}
                  placeholder="you@email.com"
                  style={{ borderColor: err('personal.email', resume.personal.email, '') ? 'var(--color-danger)' : undefined }}
                />
              </Field>
              <Field label="Phone">
                <input className="field-input" value={resume.personal.phone} onChange={e => up('phone', e.target.value)} placeholder="+1 (555) 000" />
              </Field>
            </div>

            <Field label="Location">
              <input className="field-input" value={resume.personal.location} onChange={e => up('location', e.target.value)} placeholder="City, State" />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="LinkedIn">
                <input className="field-input" value={resume.personal.linkedin} onChange={e => up('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
              </Field>
              <Field label="Website">
                <input className="field-input" value={resume.personal.website} onChange={e => up('website', e.target.value)} placeholder="yoursite.com" />
              </Field>
            </div>

            <Field label="Professional Summary">
              <div style={{ position: 'relative' }}>
                <RichEditor
                  value={resume.personal.summary}
                  onChange={v => up('summary', v)}
                  placeholder="Briefly describe your professional background..."
                  maxLength={600}
                  minHeight={120}
                  onAiClick={() => setSummaryMenuOpen(!summaryMenuOpen)}
                  loadingAi={loadingSummary}
                  canAccessAi={canAccess('ai-summary')}
                  aiTitle="AI Writer"
                />
                
                <div style={{ position: 'absolute', top: '35px', right: '0px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', zIndex: 100 }}>
                  {summaryMenuOpen && (
                    <div style={{ 
                      background: 'var(--color-ui-surface)', 
                      border: '1px solid var(--color-ui-border)', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      minWidth: '160px',
                    }}>
                      <button 
                        className="btn-ghost" 
                        style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => handleGenerateSummary()}
                      >
                        <Sparkles size={12} style={{ color: 'var(--color-ui-accent)' }} /> Generate New
                      </button>
                      <button 
                        className="btn-ghost" 
                        style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '12px' }}
                        onClick={handleRephraseSummary}
                      >
                        <Wrench size={12} style={{ color: 'var(--color-ui-accent)' }} /> Rephrase Current
                      </button>
                      <button 
                        className="btn-ghost" 
                        style={{ justifyContent: 'flex-start', padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => { setSummaryPromptOpen(true); setSummaryMenuOpen(false); }}
                      >
                        <PenLine size={12} style={{ color: 'var(--color-ui-accent)' }} /> Provide Prompt
                      </button>
                    </div>
                  )}

                  {summaryPromptOpen && (
                    <div style={{ 
                      background: 'var(--color-ui-surface)', 
                      border: '1px solid var(--color-ui-border)', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      width: '240px',
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-text-muted)' }}>Instructions for AI</div>
                      <textarea 
                        className="field-input"
                        value={summaryCustomPrompt}
                        onChange={e => setSummaryCustomPrompt(e.target.value)}
                        placeholder="e.g. Make it more creative / focus on my leadership skills..."
                        style={{ minHeight: '60px', fontSize: '12px', resize: 'none' }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn-primary" 
                          style={{ flex: 1, fontSize: '11px', padding: '4px' }}
                          onClick={() => handleGenerateSummary(summaryCustomPrompt)}
                          disabled={!summaryCustomPrompt.trim() || loadingSummary}
                        >
                          {loadingSummary ? <Loader2 size={11} className="spin" /> : 'Generate'}
                        </button>
                        <button 
                          className="btn-ghost" 
                          style={{ fontSize: '11px', padding: '4px' }}
                          onClick={() => { setSummaryPromptOpen(false); setSummaryCustomPrompt(''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Field>
          </div>
        )}

        {/* ── EXPERIENCE ───────────────────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Work Experience">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addExp}>
                <Plus size={13} /> Add Experience
              </button>
            </SectionHeader>
            {resume.experience.length === 0 && <EmptyState icon={<Briefcase size={20} />} text="No work experience added yet." />}
            {resume.experience.map(exp => {
              const isCollapsed = collapsed.has(exp.id);
              return (
                <div key={exp.id} className="entry-card" {...dragCardProps('experience', exp.id)}>
                  {/* Card header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '12px', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <GripVertical size={14} style={{ color: 'var(--color-ui-text-dim)', flexShrink: 0, cursor: 'grab' }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exp.role || <span style={{ color: 'var(--color-ui-text-dim)' }}>New Role</span>}
                        </div>
                        {exp.company && <div style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', marginTop: '1px' }}>{exp.company}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => toggleCollapsed(exp.id)}>
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button className="btn-danger" onClick={() => removeExp(exp.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="Company" error={err(`exp.${exp.id}.company`, exp.company, 'Required')}>
                          <input className="field-input" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} onBlur={() => touch(`exp.${exp.id}.company`)} placeholder="Company Inc." style={{ borderColor: err(`exp.${exp.id}.company`, exp.company, '') ? 'var(--color-danger)' : undefined }} />
                        </Field>
                        <Field label="Role" error={err(`exp.${exp.id}.role`, exp.role, 'Required')}>
                          <input className="field-input" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} onBlur={() => touch(`exp.${exp.id}.role`)} placeholder="Software Engineer" style={{ borderColor: err(`exp.${exp.id}.role`, exp.role, '') ? 'var(--color-danger)' : undefined }} />
                        </Field>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="Start Date">
                          <input className="field-input" value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                        </Field>
                        <Field label="End Date">
                          <input className="field-input" value={exp.endDate} onChange={e => updateExp(exp.id, 'endDate', e.target.value)} placeholder="Present" disabled={exp.isCurrent} style={{ opacity: exp.isCurrent ? 0.5 : 1 }} />
                        </Field>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--color-ui-text-muted)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={exp.isCurrent} onChange={e => updateExp(exp.id, 'isCurrent', e.target.checked)} style={{ accentColor: 'var(--color-ui-accent)' }} />
                        Currently working here
                      </label>

                      {/* Bullets */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="field-label" style={{ margin: 0 }}>Bullet Points</label>
                          <button
                            className="btn-ai"
                            onClick={() => handleAIBullets(exp)}
                            disabled={loadingBullets === exp.id || remainingBullets <= 0}
                            title={remainingBullets <= 0 ? 'Daily limit reached — upgrade to Pro' : `AI Bullets${remainingBullets !== Infinity ? ` (${remainingBullets} left today)` : ''}`}
                          >
                            {loadingBullets === exp.id ? <Loader2 size={11} className="spin" /> : remainingBullets <= 0 ? <Lock size={11} /> : <Sparkles size={11} />}
                            {loadingBullets === exp.id ? 'Generating…' : remainingBullets !== Infinity && remainingBullets >= 0 ? `AI Bullets (${remainingBullets})` : '✨ AI Bullets'}
                          </button>
                        </div>
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} style={{ marginBottom: '6px' }}>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <RichEditor
                                value={bullet}
                                onChange={v => { const next = [...exp.bullets]; next[bi] = v; updateExp(exp.id, 'bullets', next); }}
                                placeholder="Achieved X by doing Y, resulting in Z% improvement..."
                                minHeight={56}
                                style={{ flex: 1 }}
                                onAiClick={() => handleAIBullets(exp)}
                                loadingAi={loadingBullets === exp.id}
                                canAccessAi={remainingBullets > 0}
                                aiTitle="Refine"
                              />
                              <button className="btn-danger" onClick={() => updateExp(exp.id, 'bullets', exp.bullets.filter((_, i) => i !== bi))} style={{ alignSelf: 'flex-start', marginTop: '28px' }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <CharCount value={htmlCharCount(bullet)} max={200} />
                          </div>
                        ))}
                        <button
                          className="btn-ghost"
                          style={{ width: '100%', justifyContent: 'center', marginTop: '4px', border: '1px dashed var(--color-ui-border)', borderRadius: '6px', padding: '6px' }}
                          onClick={() => updateExp(exp.id, 'bullets', [...exp.bullets, ''])}
                        >
                          <Plus size={13} /> Add bullet
                        </button>
                      </div>

                      {/* AI bullet suggestions */}
                      {bulletSuggestions?.expId === exp.id && (
                        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#A78BFA', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✨ AI Suggestions — Click to add</div>
                          {bulletSuggestions.bullets.map((b, i) => (
                            <div key={i} onClick={() => applyBullet(exp.id, b)}
                              style={{ fontSize: '12px', lineHeight: 1.6, color: 'var(--color-ui-text)', padding: '8px 10px', marginBottom: '6px', borderRadius: '6px', backgroundColor: 'rgba(99,102,241,0.06)', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                              + {b}
                            </div>
                          ))}
                          <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '11px' }} onClick={() => setBulletSuggestions(null)}>Dismiss</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── EDUCATION ────────────────────────────────────────────────────── */}
        {activeTab === 'education' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Education">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addEdu}>
                <Plus size={13} /> Add Education
              </button>
            </SectionHeader>
            {resume.education.length === 0 && <EmptyState icon={<GraduationCap size={20} />} text="No education added yet." />}
            {resume.education.map(edu => {
              const isCollapsed = collapsed.has(edu.id);
              return (
                <div key={edu.id} className="entry-card" {...dragCardProps('education', edu.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '10px', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <GripVertical size={14} style={{ color: 'var(--color-ui-text-dim)', flexShrink: 0, cursor: 'grab' }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {edu.school || <span style={{ color: 'var(--color-ui-text-dim)' }}>New School</span>}
                        </div>
                        {(edu.degree || edu.field) && <div style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', marginTop: '1px' }}>{[edu.degree, edu.field].filter(Boolean).join(' · ')}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => toggleCollapsed(edu.id)}>
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button className="btn-danger" onClick={() => removeEdu(edu.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Field label="School / University">
                        <input className="field-input" value={edu.school} onChange={e => updateEdu(edu.id, 'school', e.target.value)} placeholder="MIT" />
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="Degree"><input className="field-input" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="B.S." /></Field>
                        <Field label="Field of Study"><input className="field-input" value={edu.field} onChange={e => updateEdu(edu.id, 'field', e.target.value)} placeholder="Computer Science" /></Field>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <Field label="Start"><input className="field-input" value={edu.startDate} onChange={e => updateEdu(edu.id, 'startDate', e.target.value)} placeholder="Sep 2018" /></Field>
                        <Field label="End"><input className="field-input" value={edu.endDate} onChange={e => updateEdu(edu.id, 'endDate', e.target.value)} placeholder="May 2022" /></Field>
                        <Field label="GPA"><input className="field-input" value={edu.gpa} onChange={e => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="3.9" /></Field>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── SKILLS ───────────────────────────────────────────────────────── */}
        {activeTab === 'skills' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SectionHeader title="Skills">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => addSkill()}>
                <Plus size={13} /> Add Skill
              </button>
            </SectionHeader>

            {/* AI skill finder */}
            <div style={{ padding: '14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#A78BFA', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} /> AI Skill Finder
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="field-input" value={skillJobTitle} onChange={e => setSkillJobTitle(e.target.value)} placeholder="Enter job title (e.g. Full Stack Developer)" onKeyDown={e => e.key === 'Enter' && handleFindSkills()} style={{ flex: 1, fontSize: '12.5px' }} />
                <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px', flexShrink: 0 }} onClick={handleFindSkills} disabled={loadingSkills}>
                  {loadingSkills ? <Loader2 size={13} className="spin" /> : 'Find'}
                </button>
              </div>
              {skillSuggestions && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Technical</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {skillSuggestions.technical.map(s => (
                      <button key={s} className="chip" onClick={() => { addSkill(s); setSkillSuggestions(prev => prev ? { ...prev, technical: prev.technical.filter(x => x !== s) } : null); }}>+ {s}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Soft Skills</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skillSuggestions.soft.map(s => (
                      <button key={s} className="chip" onClick={() => { addSkill(s); setSkillSuggestions(prev => prev ? { ...prev, soft: prev.soft.filter(x => x !== s) } : null); }}>+ {s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {resume.skills.length === 0 && <EmptyState icon={<Wrench size={20} />} text="No skills added yet." />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resume.skills.map(skill => (
                <div key={skill.id} className="entry-card" {...dragCardProps('skills', skill.id)} style={{ ...dragCardProps('skills', skill.id).style, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px' }}>
                  <GripVertical size={13} style={{ color: 'var(--color-ui-text-dim)', flexShrink: 0, cursor: 'grab' }} />
                  <input className="field-input" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" style={{ flex: 1, fontSize: '13px' }} />
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    {[25, 50, 75, 100].map(v => (
                      <button key={v} onClick={() => updateSkill(skill.id, 'level', v)} style={{ width: '18px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', transition: 'background 0.15s', backgroundColor: skill.level >= v ? 'var(--color-ui-accent)' : 'var(--color-ui-border)' }} />
                    ))}
                  </div>
                  <button className="btn-danger" onClick={() => removeSkill(skill.id)}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROJECTS ─────────────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Projects">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addProject}>
                <Plus size={13} /> Add Project
              </button>
            </SectionHeader>
            {resume.projects.length === 0 && <EmptyState icon={<FolderOpen size={20} />} text="No projects added yet." />}
            {resume.projects.map(p => {
              const isCollapsed = collapsed.has(p.id);
              return (
                <div key={p.id} className="entry-card" {...dragCardProps('projects', p.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '10px', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <GripVertical size={14} style={{ color: 'var(--color-ui-text-dim)', flexShrink: 0, cursor: 'grab' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title || <span style={{ color: 'var(--color-ui-text-dim)' }}>New Project</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => toggleCollapsed(p.id)}>
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button className="btn-danger" onClick={() => removeProject(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Field label="Project Name">
                        <input className="field-input" value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} placeholder="My Awesome Project" />
                      </Field>
                      <Field label="Description">
                        <RichEditor value={p.description} onChange={v => updateProject(p.id, 'description', v)} placeholder="What does it do and what impact did it have?" maxLength={400} minHeight={80} />
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="URL / Link"><input className="field-input" value={p.url} onChange={e => updateProject(p.id, 'url', e.target.value)} placeholder="github.com/..." /></Field>
                        <Field label="Tech Stack (comma separated)"><input className="field-input" value={p.tech.join(', ')} onChange={e => updateProject(p.id, 'tech', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="React, Node.js, AWS" /></Field>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── CERTIFICATIONS ───────────────────────────────────────────────── */}
        {activeTab === 'certifications' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Certifications">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addCert}>
                <Plus size={13} /> Add Certification
              </button>
            </SectionHeader>
            {resume.certifications.length === 0 && <EmptyState icon={<Award size={20} />} text="No certifications added yet." />}
            {resume.certifications.map(c => {
              const isCollapsed = collapsed.has(c.id);
              return (
                <div key={c.id} className="entry-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '10px', gap: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {c.name || <span style={{ color: 'var(--color-ui-text-dim)' }}>New Certification</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => toggleCollapsed(c.id)}>
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button className="btn-danger" onClick={() => removeCert(c.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Field label="Certification Name"><input className="field-input" value={c.name} onChange={e => updateCert(c.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" /></Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="Issuer"><input className="field-input" value={c.issuer} onChange={e => updateCert(c.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" /></Field>
                        <Field label="Date"><input className="field-input" value={c.date} onChange={e => updateCert(c.id, 'date', e.target.value)} placeholder="Dec 2023" /></Field>
                      </div>
                      <Field label="Credential URL"><input className="field-input" value={c.url} onChange={e => updateCert(c.id, 'url', e.target.value)} placeholder="credly.com/..." /></Field>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── LANGUAGES ────────────────────────────────────────────────────── */}
        {activeTab === 'languages' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Languages">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addLang}>
                <Plus size={13} /> Add Language
              </button>
            </SectionHeader>
            {resume.languages.length === 0 && <EmptyState icon={<Globe size={20} />} text="No languages added yet." />}
            {resume.languages.map(l => (
              <div key={l.id} className="entry-card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input className="field-input" value={l.language} onChange={e => updateLang(l.id, 'language', e.target.value)} placeholder="Language" style={{ flex: 1 }} />
                <select className="field-input" value={l.proficiency} onChange={e => updateLang(l.id, 'proficiency', e.target.value)} style={{ flex: 1, cursor: 'pointer' }}>
                  {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button className="btn-danger" onClick={() => removeLang(l.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ResumeBuilder;
