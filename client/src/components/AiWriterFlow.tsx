import { useState, useRef, useEffect } from 'react';
import { Loader2, Wand2, CheckCircle2, ChevronLeft, ChevronRight, Briefcase, GraduationCap, Trophy, Sparkles, Check, ArrowRight, Upload, MousePointer2 } from 'lucide-react';

import { api, parseQuotaError } from '../lib/api';
import { usePlan } from '../contexts/PlanContext';
import QuotaWarningModal from './QuotaWarningModal';
import UsagePill from './UsagePill';
import type { Resume, TemplateConfig, SmartResumeResponse } from '../shared/types';
import { templates } from '../templates';
import TemplateRenderer from '../templates/TemplateRenderer';
import BreadcrumbNav from './BreadcrumbNav';
import UserAvatar from './UserAvatar';

const SAMPLE_RESUME: Resume = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.design',
    summary: 'Results-driven designer with 8+ years crafting intuitive digital experiences. Led design teams at Fortune 500 companies delivering products used by millions worldwide.',
  },
  experience: [
    {
      id: '1',
      company: 'Stripe',
      role: 'Senior Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Led redesign of core payment flow, increasing conversion by 23%',
        'Managed team of 4 designers across 3 product lines',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2011',
      endDate: '2015',
      gpa: '3.9',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 95 },
    { id: '2', name: 'React', level: 75 },
    { id: '3', name: 'Prototyping', level: 90 },
  ],
  projects: [],
  certifications: [],
  languages: [],
  custom: [],
};

const SCALE = 0.40;
const MM_TO_PX = 96 / 25.4;
const TEMPLATE_W = 210 * MM_TO_PX;
const TEMPLATE_H = 297 * MM_TO_PX;

const TemplatePreview = ({ t }: { t: TemplateConfig }) => {
  const marginPx = (t.settings?.margin ?? 15) * MM_TO_PX;
  return (
    <div style={{
      width: `${TEMPLATE_W * SCALE}px`,
      height: `${TEMPLATE_H * SCALE}px`,
      overflow: 'hidden',
      margin: '0 auto',
      flexShrink: 0,
      background: '#fff',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 15px rgba(0,0,0,0.1)',
      borderRadius: '4px',
    }}>
      <div style={{
        width: `${TEMPLATE_W}px`,
        height: `${TEMPLATE_H}px`,
        padding: `${marginPx}px`,
        boxSizing: 'border-box',
        transformOrigin: 'top left',
        transform: `scale(${SCALE})`,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <TemplateRenderer resume={SAMPLE_RESUME} config={t} />
      </div>
    </div>
  );
};

interface Props {
  onComplete: (resume: Resume, template: TemplateConfig) => void;
  onBack: () => void;
  onShowProfile: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export default function AiWriterFlow({ onComplete, onBack, onShowProfile }: Props) {
  const { getRemainingUses, incrementLocalUsage } = usePlan();
  const [quotaModal, setQuotaModal] = useState<{ resetAt?: string } | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(templates[1]!);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form State
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [experience, setExperience] = useState('Mid Level (3-5 years)');
  const [education, setEducation] = useState('');
  const [achievements, setAchievements] = useState('');
  const [coreSkills, setCoreSkills] = useState('');
  const [context] = useState('');

  // AI Response State
  const [aiResponse, setAiResponse] = useState<SmartResumeResponse | null>(null);

  // Guard against state updates after unmount
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  const handleAutoFill = async () => {
    if (!targetRole || !industry) {
      setError('Please provide Target Role and Industry first.');
      return;
    }
    setIsAutoFilling(true);
    setError('');
    try {
      const result = await api.generateSmartResume({
        targetRole,
        industry,
        experience: 'Mid Level (3-5 years)',
      });
      if (!isMountedRef.current) return;
      const { resume } = result;
      setCurrentRole(resume.experience[0]?.role || '');
      setEducation(resume.education[0] ? `${resume.education[0].degree} in ${resume.education[0].field}, ${resume.education[0].school}` : '');
      setCoreSkills(resume.skills.map(s => s.name).join(', '));
      setAchievements(resume.experience.flatMap(exp => exp.bullets).slice(0, 10).join('\n'));
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      setError('Failed to auto-fill sample details. Please enter details manually.');
    } finally {
      if (isMountedRef.current) setIsAutoFilling(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const { resume } = await api.uploadResume(file);
      if (!isMountedRef.current) return;
      // Pre-fill form from parsed resume
      setTargetRole(resume.personal.title || '');
      setCurrentRole(resume.experience[0]?.role || resume.personal.title || '');
      setEducation(resume.education[0] ? `${resume.education[0].degree} in ${resume.education[0].field}, ${resume.education[0].school}` : '');
      setCoreSkills(resume.skills.map(s => s.name).slice(0, 10).join(', '));

      const allBullets = resume.experience.flatMap(exp => exp.bullets).slice(0, 5).join('\n');
      setAchievements(allBullets);

      // Infer experience level roughly
      const years = resume.experience.length * 2; // Very rough proxy
      if (years <= 2) setExperience('Entry Level (0-2 years)');
      else if (years <= 5) setExperience('Mid Level (3-5 years)');
      else if (years <= 10) setExperience('Senior (5-10 years)');
      else setExperience('Executive (10+ years)');

      setStep(1); // Proceed to template selection
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to parse resume. Try the Career Wizard instead.');
    } finally {
      if (isMountedRef.current) setIsUploading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    if (getRemainingUses('generateFullResume') === 0) {
      setQuotaModal({});
      return;
    }
    setStep(5);
    setLoadingMsg('Searching for latest market trends...');

    const messages = [
      'Searching for latest market trends...',
      'Analyzing your career details...',
      'Incorporating in-demand technologies...',
      'Drafting your professional resume...',
      'Optimizing for ATS compatibility...',
      'Polishing quantified achievements...'
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMsg(messages[msgIndex]!);
    }, 4000);

    try {
      const result = await api.generateSmartResume({
        targetRole,
        industry,
        currentRole,
        experience,
        education,
        achievements,
        context: `${coreSkills}. ${context}`,
      });
      if (!isMountedRef.current) return;
      incrementLocalUsage('generateFullResume');
      setAiResponse(result);
      setStep(6);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const quotaErr = parseQuotaError(err);
      if (quotaErr) {
        setQuotaModal({ resetAt: quotaErr.resetAt });
        setStep(4);
      } else {
        setStep(4);
        setError(err instanceof Error ? err.message : 'Failed to generate resume. Please try again.');
      }
    } finally {
      clearInterval(interval);
    }
  };

  const nextStep = () => {
    if (step === 2 && (!targetRole || !industry)) {
      setError('Target role and Industry are required.');
      return;
    }
    setError('');
    setStep((s) => (s + 1) as Step);
  };

  const prevStep = () => {
    setStep((s) => (s - 1) as Step);
  };

  const renderProgress = () => {
    if (step < 2 || step > 4) return null;
    const currentStep = step - 1;
    return (
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ 
              flex: 1, height: '4px', borderRadius: '2px', 
              background: i <= currentStep ? 'linear-gradient(90deg, #6366F1, #A855F7)' : 'var(--color-ui-border)',
              marginRight: i < 3 ? '8px' : '0'
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-ui-text-muted)', fontWeight: 600 }}>
          <span>BASIC INFO</span>
          <span>EXPERIENCE</span>
          <span>SKILLS & ACHIEVEMENTS</span>
        </div>
      </div>
    );
  };

  const [isMobile] = useState(window.innerWidth < 1024);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
      {quotaModal && (
        <QuotaWarningModal feature="generateFullResume" resetAt={quotaModal.resetAt} onClose={() => setQuotaModal(null)} />
      )}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-ui-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--color-ui-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer' }} 
            onClick={() => {
              if (step > 0) setStep((step - 1) as Step);
              else onBack();
            }}
          >
            <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wand2 size={13} color="white" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              AI Resume <span style={{ color: '#818CF8' }}>Writer</span>
            </span>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'var(--color-ui-border)' }} />
          <BreadcrumbNav view="ai-writer" />
        </div>

        <UserAvatar onClick={onShowProfile} showBadge={!isMobile} />
      </header>
      {isMobile && <div style={{ height: '60px' }} />}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        
        {step === 0 && (
          <div style={{ width: '100%', maxWidth: '900px', animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px', letterSpacing: '-0.04em' }}>
                How would you like to start?
              </h1>
              <p style={{ fontSize: '17px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                Choose the fastest way to get your professional, AI-optimized resume ready.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {/* Option 1: Career Wizard */}
              <button 
                onClick={() => setStep(1)}
                style={{ 
                  background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '24px', padding: '40px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#818CF8';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-ui-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Sparkles size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>AI Career Wizard</h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5 }}>
                    Answer a few targeted questions and let our AI Agent build your resume from scratch using real-time market trends.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#818CF8', fontWeight: 700, fontSize: '15px' }}>
                  Start Wizard <ArrowRight size={18} />
                </div>
              </button>

              {/* Option 2: Upload Resume */}
              <div 
                style={{ 
                  background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '24px', padding: '40px', textAlign: 'left', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,185,129,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-ui-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Upload size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>Upload & Refine</h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5 }}>
                    Import your existing resume (PDF/DOCX) and our AI Agent will modernize it with the latest tech and tools in your domain.
                  </p>
                </div>
                
                <div style={{ marginTop: 'auto' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}>
                    {isUploading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Uploading & Parsing...
                      </>
                    ) : (
                      <>
                        Upload Resume <Upload size={18} />
                      </>
                    )}
                    <input type="file" style={{ display: 'none' }} accept=".pdf,.docx" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                  {error && <div style={{ color: '#F87171', fontSize: '12px', marginTop: '8px' }}>{error}</div>}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center', padding: '24px', border: '1px dashed var(--color-ui-border)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MousePointer2 size={14} /> Both options include AI Agent optimization with real-time web search capabilities.
              </p>
            </div>
          </div>
        )}
        {step === 1 && (
          <div style={{ width: '100%', maxWidth: '1200px', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '10px', letterSpacing: '-0.04em' }}>
                Select Your Design
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)' }}>
                Choose a professional template as your starting point.
              </p>
            </div>

            <div style={{ position: 'relative', padding: '0 60px' }}>
              <button onClick={() => scroll('left')} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scroll('right')} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <ChevronRight size={20} />
              </button>

              <div ref={scrollRef} style={{ display: 'flex', overflowX: 'auto', gap: '32px', padding: '20px 0 40px', scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="hide-scrollbar">
                {templates.map(tpl => {
                  const isActive = selectedTemplate.id === tpl.id;
                  return (
                    <button key={tpl.id} onClick={() => { setSelectedTemplate(tpl); setStep(2); }} style={{ flexShrink: 0, borderRadius: '20px', textAlign: 'left', background: isActive ? 'rgba(99,102,241,0.05)' : 'var(--color-ui-surface)', border: `2px solid ${isActive ? '#818CF8' : 'var(--color-ui-border)'}`, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', scrollSnapAlign: 'start', width: `${(TEMPLATE_W * SCALE) + 32}px` }}>
                      {isActive && <CheckCircle2 size={32} color="#818CF8" fill="white" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />}
                      <div style={{ borderBottom: '1px solid var(--color-ui-border)', background: 'var(--color-ui-surface-2)', padding: '16px 16px 0 16px' }}>
                        <TemplatePreview t={tpl} />
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{tpl.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginTop: '4px', textTransform: 'capitalize' }}>{tpl.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step >= 2 && step <= 4 && renderProgress()}

        {step === 2 && (
          <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#818CF8' }}>
                <Briefcase size={24} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                What are you aiming for?
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
                Let's start with the basics of your career direction.
              </p>
            </div>

            <div style={{ background: 'var(--color-ui-surface)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-ui-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '20px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Target Job Title *</label>
                <input className="field-input" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Industry *</label>
                <input className="field-input" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Technology, Finance, Healthcare" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Current / Last Role</label>
                <input className="field-input" value={currentRole} onChange={e => setCurrentRole(e.target.value)} placeholder="e.g. Software Developer" />
              </div>

              {error && <div style={{ padding: '12px', background: 'rgba(248,113,113,0.1)', color: '#F87171', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', borderColor: '#818CF8', color: '#818CF8', padding: '12px' }} 
                  onClick={handleAutoFill}
                  disabled={isAutoFilling}
                >
                  {isAutoFilling ? <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} /> : <Sparkles size={18} style={{ marginRight: '8px' }} />}
                  {isAutoFilling ? 'Generating Detailed Sample...' : 'Auto-Fill Detailed Sample with AI'}
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>Back</button>
                  <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={nextStep}>Continue <ChevronRight size={18} style={{ marginLeft: '4px' }} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(168,85,247,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#A855F7' }}>
                <GraduationCap size={24} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                Experience & Education
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
                Your background helps us tailor the seniority level.
              </p>
            </div>

            <div style={{ background: 'var(--color-ui-surface)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-ui-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '20px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Experience Level</label>
                <select className="field-input" value={experience} onChange={e => setExperience(e.target.value)} style={{ appearance: 'none', backgroundColor: 'var(--color-ui-bg)' }}>
                  <option>Entry Level (0-2 years)</option>
                  <option>Mid Level (3-5 years)</option>
                  <option>Senior (5-10 years)</option>
                  <option>Executive (10+ years)</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Highest Degree / Education</label>
                <input className="field-input" value={education} onChange={e => setEducation(e.target.value)} placeholder="e.g. Master's in Computer Science, Stanford University" />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>Back</button>
                <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={nextStep}>Continue <ChevronRight size={18} style={{ marginLeft: '4px' }} /></button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(236,72,153,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EC4899' }}>
                <Trophy size={24} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                Skills & Achievements
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
                Highlight what makes you stand out.
              </p>
            </div>

            <div style={{ background: 'var(--color-ui-surface)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-ui-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ marginBottom: '20px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Core Skills (Comma separated)</label>
                <input className="field-input" value={coreSkills} onChange={e => setCoreSkills(e.target.value)} placeholder="e.g. React, Node.js, Project Management, SEO" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600 }}>Key Achievements / Accomplishments</label>
                <textarea className="field-textarea" rows={4} value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="e.g. Led a team of 5 to launch a mobile app with 10k downloads. Reduced server costs by 30%." style={{ resize: 'vertical' }} />
              </div>

              {error && <div style={{ padding: '12px', background: 'rgba(248,113,113,0.1)', color: '#F87171', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={prevStep}>Back</button>
                <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleGenerate}>
                  <Sparkles size={18} style={{ marginRight: '8px' }} />
                  Generate Smart Resume
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <UsagePill feature="generateFullResume" />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', marginTop: '10vh', animation: 'fadeIn 0.5s ease-in' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 32px' }}>
              <Loader2 size={80} style={{ color: '#818CF8', animation: 'spin 2s linear infinite' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Wand2 size={32} style={{ color: '#A855F7' }} />
              </div>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px', letterSpacing: '-0.03em' }}>
              {loadingMsg}
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', maxWidth: '450px', margin: '0 auto', lineHeight: 1.6 }}>
              Our AI Agent is checking current job market trends via web search to ensure your resume includes the most relevant technologies.
            </p>
          </div>
        )}

        {step === 6 && aiResponse && (
          <div style={{ width: '100%', maxWidth: '800px', animation: 'slideUp 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #10B981, #3B82F6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white', boxShadow: '0 8px 16px rgba(16,185,129,0.2)' }}>
                <Check size={32} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px', letterSpacing: '-0.04em' }}>
                Your Smart Resume is Ready!
              </h1>
              <p style={{ fontSize: '17px', color: 'var(--color-ui-text-muted)' }}>
                Review the enhancements our AI Agent made based on current market data.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(99,102,241,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} /> New Tech Added
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {aiResponse.analysis.addedTechnologies.map((tech) => (
                    <span key={tech} style={{ padding: '6px 12px', background: 'white', border: '1px solid var(--color-ui-border)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--color-ui-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-ui-border)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  Key Improvements
                </h3>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                  {aiResponse.analysis.changesMade.map((change, i) => (
                    <li key={`change-${i}`} style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#818CF8', flexShrink: 0 }} />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                className="btn-primary" 
                style={{ padding: '16px 48px', fontSize: '17px', borderRadius: '14px', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}
                onClick={() => onComplete(aiResponse.resume, selectedTemplate)}
              >
                Go to Resume Builder <ArrowRight size={20} style={{ marginLeft: '10px' }} />
              </button>
              <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>
                You'll be able to edit and customize every detail in the builder.
              </p>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
