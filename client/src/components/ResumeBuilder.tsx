import React, { useState } from 'react';
import type { Resume, ExperienceEntry, SkillEntry, EducationEntry, ProjectEntry, CertificationEntry, LanguageEntry } from '../shared/types';
import { api } from '../lib/api';
import {
  User, Briefcase, GraduationCap, Wrench, FolderOpen,
  Award, Globe, Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2, Zap
} from 'lucide-react';

interface Props {
  resume: Resume;
  onChange: (resume: Resume) => void;
  onTailor: () => void;
  onAtsScore: () => void;
}

type TabId = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';

const TABS: { id: TabId; label: string; icon: React.ElementType; countKey?: keyof Resume }[] = [
  { id: 'personal',       label: 'Personal Info',    icon: User },
  { id: 'experience',     label: 'Experience',        icon: Briefcase,    countKey: 'experience' },
  { id: 'education',      label: 'Education',         icon: GraduationCap, countKey: 'education' },
  { id: 'skills',         label: 'Skills',            icon: Wrench,       countKey: 'skills' },
  { id: 'projects',       label: 'Projects',          icon: FolderOpen,   countKey: 'projects' },
  { id: 'certifications', label: 'Certifications',    icon: Award,        countKey: 'certifications' },
  { id: 'languages',      label: 'Languages',         icon: Globe,        countKey: 'languages' },
];

const ResumeBuilder: React.FC<Props> = ({ resume, onChange, onTailor, onAtsScore }) => {
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const [loadingBullets, setLoadingBullets] = useState<string | null>(null);
  const [bulletSuggestions, setBulletSuggestions] = useState<{ expId: string; bullets: string[] } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState<{ technical: string[]; soft: string[] } | null>(null);
  const [skillJobTitle, setSkillJobTitle] = useState('');
  const [collapsedExp, setCollapsedExp] = useState<Set<string>>(new Set());

  const up = (field: string, val: string) =>
    onChange({ ...resume, personal: { ...resume.personal, [field]: val } });

  const addExp = () => {
    const e: ExperienceEntry = { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, bullets: [''] };
    onChange({ ...resume, experience: [e, ...resume.experience] });
  };
  const updateExp = (id: string, field: keyof ExperienceEntry, val: any) =>
    onChange({ ...resume, experience: resume.experience.map(e => e.id === id ? { ...e, [field]: val } : e) });
  const removeExp = (id: string) =>
    onChange({ ...resume, experience: resume.experience.filter(e => e.id !== id) });

  const addEdu = () => {
    const e: EducationEntry = { id: crypto.randomUUID(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
    onChange({ ...resume, education: [e, ...resume.education] });
  };
  const updateEdu = (id: string, field: keyof EducationEntry, val: string) =>
    onChange({ ...resume, education: resume.education.map(e => e.id === id ? { ...e, [field]: val } : e) });

  const addSkill = (name = '') => {
    const s: SkillEntry = { id: crypto.randomUUID(), name, level: 75 };
    onChange({ ...resume, skills: [...resume.skills, s] });
  };
  const updateSkill = (id: string, field: keyof SkillEntry, val: any) =>
    onChange({ ...resume, skills: resume.skills.map(s => s.id === id ? { ...s, [field]: val } : s) });

  const addProject = () => {
    const p: ProjectEntry = { id: crypto.randomUUID(), title: '', description: '', url: '', tech: [] };
    onChange({ ...resume, projects: [p, ...resume.projects] });
  };
  const updateProject = (id: string, field: keyof ProjectEntry, val: any) =>
    onChange({ ...resume, projects: resume.projects.map(p => p.id === id ? { ...p, [field]: val } : p) });

  const addCert = () => {
    const c: CertificationEntry = { id: crypto.randomUUID(), name: '', issuer: '', date: '', url: '' };
    onChange({ ...resume, certifications: [c, ...resume.certifications] });
  };
  const updateCert = (id: string, field: keyof CertificationEntry, val: string) =>
    onChange({ ...resume, certifications: resume.certifications.map(c => c.id === id ? { ...c, [field]: val } : c) });

  const addLang = () => {
    const l: LanguageEntry = { id: crypto.randomUUID(), language: '', proficiency: 'Intermediate' };
    onChange({ ...resume, languages: [l, ...resume.languages] });
  };
  const updateLang = (id: string, field: keyof LanguageEntry, val: string) =>
    onChange({ ...resume, languages: resume.languages.map(l => l.id === id ? { ...l, [field]: val } : l) });

  const handleAIBullets = async (exp: ExperienceEntry) => {
    if (!exp.role && !exp.company) return;
    setLoadingBullets(exp.id);
    try {
      const data = await api.generateBullets(exp.role, exp.company, 'Technology');
      setBulletSuggestions({ expId: exp.id, bullets: data.bullets });
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingBullets(null); }
  };

  const applyBullet = (expId: string, bullet: string) => {
    const exp = resume.experience.find(e => e.id === expId);
    if (!exp) return;
    const bullets = exp.bullets[0] === '' ? [bullet] : [...exp.bullets, bullet];
    updateExp(expId, 'bullets', bullets);
    setBulletSuggestions(null);
  };

  const handleFindSkills = async () => {
    if (!skillJobTitle.trim()) return;
    setLoadingSkills(true);
    try {
      const data = await api.findSkills(skillJobTitle);
      setSkillSuggestions(data);
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingSkills(false); }
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const skills = resume.skills.map(s => s.name).filter(Boolean);
      const yoe = resume.experience.length > 0 ? `${resume.experience.length * 2}+` : '1';
      const data = await api.generateSummary(resume.personal.name, resume.personal.title, yoe, skills);
      up('summary', data.summary);
    } catch {
      alert('AI unavailable. Check server is running with OPENAI_API_KEY set.');
    } finally { setLoadingSummary(false); }
  };

  const getCount = (tab: typeof TABS[0]): number => {
    if (!tab.countKey) return 0;
    const val = resume[tab.countKey];
    return Array.isArray(val) ? val.length : 0;
  };

  return (
    <div className="editor-panel">

      {/* ── VERTICAL NAV ─────────────────────────────── */}
      <div className="editor-nav">
        {TABS.map(({ id, label, icon: Icon, countKey }) => {
          const count = countKey ? getCount({ id, label, icon: Icon, countKey }) : 0;
          return (
            <button key={id} className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <Icon size={15} strokeWidth={activeTab === id ? 2.5 : 2} />
              <span>{label}</span>
              {countKey && count > 0 && (
                <span className="nav-badge">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── SECTION CONTENT ──────────────────────────── */}
      <div className="editor-content">

        {/* PERSONAL */}
        {activeTab === 'personal' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SectionHeader title="Personal Info" />
            <Field label="Full Name">
              <input className="field-input" value={resume.personal.name} onChange={e => up('name', e.target.value)} placeholder="e.g. Jane Smith" />
            </Field>
            <Field label="Job Title">
              <input className="field-input" value={resume.personal.title} onChange={e => up('title', e.target.value)} placeholder="e.g. Senior Software Engineer" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Email">
                <input className="field-input" value={resume.personal.email} onChange={e => up('email', e.target.value)} placeholder="you@email.com" />
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
                <textarea
                  className="field-textarea"
                  rows={5}
                  value={resume.personal.summary}
                  onChange={e => up('summary', e.target.value)}
                  placeholder="Briefly describe your professional background..."
                />
                <button className="btn-ai" style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                  onClick={handleGenerateSummary} disabled={loadingSummary}>
                  {loadingSummary ? <Loader2 size={11} className="spin" /> : <Sparkles size={11} />}
                  {loadingSummary ? 'Writing…' : 'AI Write'}
                </button>
              </div>
            </Field>
          </div>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Work Experience">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addExp}>
                <Plus size={13} /> Add
              </button>
            </SectionHeader>
            {resume.experience.length === 0 && <EmptyState icon={<Briefcase size={20} />} text="No work experience added yet." />}
            {resume.experience.map(exp => {
              const isCollapsed = collapsedExp.has(exp.id);
              return (
                <div key={exp.id} className="entry-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '12px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', lineHeight: 1.3 }}>
                        {exp.role || <span style={{ color: 'var(--color-ui-text-dim)' }}>New Role</span>}
                      </div>
                      {exp.company && <div style={{ fontSize: '11.5px', color: 'var(--color-ui-text-muted)', marginTop: '1px' }}>{exp.company}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setCollapsedExp(prev => { const s = new Set(prev); s.has(exp.id) ? s.delete(exp.id) : s.add(exp.id); return s; })}>
                        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button className="btn-danger" onClick={() => removeExp(exp.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <Field label="Company">
                          <input className="field-input" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Company Inc." />
                        </Field>
                        <Field label="Role">
                          <input className="field-input" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} placeholder="Software Engineer" />
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
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="field-label" style={{ margin: 0 }}>Bullet Points</label>
                          <button className="btn-ai" onClick={() => handleAIBullets(exp)} disabled={loadingBullets === exp.id}>
                            {loadingBullets === exp.id ? <Loader2 size={11} className="spin" /> : <Sparkles size={11} />}
                            {loadingBullets === exp.id ? 'Generating…' : '✨ AI Bullets'}
                          </button>
                        </div>
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                            <textarea className="field-textarea" rows={2} value={bullet}
                              onChange={e => { const next = [...exp.bullets]; next[bi] = e.target.value; updateExp(exp.id, 'bullets', next); }}
                              placeholder="Achieved X by doing Y, resulting in Z% improvement..." style={{ fontSize: '12.5px' }} />
                            <button className="btn-danger" onClick={() => updateExp(exp.id, 'bullets', exp.bullets.filter((_, i) => i !== bi))} style={{ alignSelf: 'center' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '4px', border: '1px dashed var(--color-ui-border)', borderRadius: '6px', padding: '6px' }}
                          onClick={() => updateExp(exp.id, 'bullets', [...exp.bullets, ''])}>
                          <Plus size={13} /> Add bullet
                        </button>
                      </div>
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

        {/* EDUCATION */}
        {activeTab === 'education' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Education">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addEdu}><Plus size={13} /> Add</button>
            </SectionHeader>
            {resume.education.length === 0 && <EmptyState icon={<GraduationCap size={20} />} text="No education added yet." />}
            {resume.education.map(edu => (
              <div key={edu.id} className="entry-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-danger" onClick={() => onChange({ ...resume, education: resume.education.filter(e => e.id !== edu.id) })}><Trash2 size={14} /></button>
                </div>
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
            ))}
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <SectionHeader title="Skills">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => addSkill()}><Plus size={13} /> Add</button>
            </SectionHeader>
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
                <div key={skill.id} className="entry-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px' }}>
                  <input className="field-input" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" style={{ flex: 1, fontSize: '13px' }} />
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    {[25, 50, 75, 100].map(v => (
                      <button key={v} onClick={() => updateSkill(skill.id, 'level', v)} style={{ width: '18px', height: '6px', borderRadius: '3px', border: 'none', cursor: 'pointer', transition: 'background 0.15s', backgroundColor: skill.level >= v ? 'var(--color-ui-accent)' : 'var(--color-ui-border)' }} />
                    ))}
                  </div>
                  <button className="btn-danger" onClick={() => onChange({ ...resume, skills: resume.skills.filter(s => s.id !== skill.id) })}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Projects">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addProject}><Plus size={13} /> Add</button>
            </SectionHeader>
            {resume.projects.length === 0 && <EmptyState icon={<FolderOpen size={20} />} text="No projects added yet." />}
            {resume.projects.map(p => (
              <div key={p.id} className="entry-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-danger" onClick={() => onChange({ ...resume, projects: resume.projects.filter(x => x.id !== p.id) })}><Trash2 size={14} /></button>
                </div>
                <Field label="Project Name"><input className="field-input" value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} placeholder="My Awesome Project" /></Field>
                <Field label="Description"><textarea className="field-textarea" rows={3} value={p.description} onChange={e => updateProject(p.id, 'description', e.target.value)} placeholder="What does it do and what impact did it have?" style={{ fontSize: '12.5px' }} /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Field label="URL / Link"><input className="field-input" value={p.url} onChange={e => updateProject(p.id, 'url', e.target.value)} placeholder="github.com/..." /></Field>
                  <Field label="Tech Stack (comma separated)"><input className="field-input" value={p.tech.join(', ')} onChange={e => updateProject(p.id, 'tech', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="React, Node.js, AWS" /></Field>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Certifications">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addCert}><Plus size={13} /> Add</button>
            </SectionHeader>
            {resume.certifications.length === 0 && <EmptyState icon={<Award size={20} />} text="No certifications added yet." />}
            {resume.certifications.map(c => (
              <div key={c.id} className="entry-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-danger" onClick={() => onChange({ ...resume, certifications: resume.certifications.filter(x => x.id !== c.id) })}><Trash2 size={14} /></button>
                </div>
                <Field label="Certification Name"><input className="field-input" value={c.name} onChange={e => updateCert(c.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" /></Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <Field label="Issuer"><input className="field-input" value={c.issuer} onChange={e => updateCert(c.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" /></Field>
                  <Field label="Date"><input className="field-input" value={c.date} onChange={e => updateCert(c.id, 'date', e.target.value)} placeholder="Dec 2023" /></Field>
                </div>
                <Field label="Credential URL"><input className="field-input" value={c.url} onChange={e => updateCert(c.id, 'url', e.target.value)} placeholder="credly.com/..." /></Field>
              </div>
            ))}
          </div>
        )}

        {/* LANGUAGES */}
        {activeTab === 'languages' && (
          <div className="fade-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionHeader title="Languages">
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addLang}><Plus size={13} /> Add</button>
            </SectionHeader>
            {resume.languages.length === 0 && <EmptyState icon={<Globe size={20} />} text="No languages added yet." />}
            {resume.languages.map(l => (
              <div key={l.id} className="entry-card" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input className="field-input" value={l.language} onChange={e => updateLang(l.id, 'language', e.target.value)} placeholder="Language" style={{ flex: 1 }} />
                <select className="field-input" value={l.proficiency} onChange={e => updateLang(l.id, 'proficiency', e.target.value)} style={{ flex: 1, cursor: 'pointer' }}>
                  {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button className="btn-danger" onClick={() => onChange({ ...resume, languages: resume.languages.filter(x => x.id !== l.id) })}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTIONS ────────────────────────────── */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-ui-border)', backgroundColor: 'var(--color-ui-surface)', display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', gap: '6px', fontSize: '12.5px' }} onClick={onAtsScore}>
          <Award size={14} /> ATS Score
        </button>
        <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', gap: '6px', fontSize: '12.5px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }} onClick={onTailor}>
          <Zap size={14} /> Job Tailor
        </button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div><label className="field-label">{label}</label>{children}</div>
);
const SectionHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', letterSpacing: '-0.01em' }}>{title}</h3>
    {children}
  </div>
);
const EmptyState: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-ui-text-dim)', border: '1px dashed var(--color-ui-border)', borderRadius: '10px' }}>
    <div style={{ marginBottom: '8px', opacity: 0.4 }}>{icon}</div>
    <p style={{ fontSize: '13px' }}>{text}</p>
  </div>
);

export default ResumeBuilder;
