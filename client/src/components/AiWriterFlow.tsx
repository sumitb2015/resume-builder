import { useState, useRef } from 'react';
import { ArrowLeft, Loader2, Wand2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import type { Resume, TemplateConfig } from '../shared/types';
import { templates } from '../templates';
import TemplateRenderer from '../templates/TemplateRenderer';

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
const TEMPLATE_W = 210 * MM_TO_PX; // 793.7px
const TEMPLATE_H = 297 * MM_TO_PX; // 1122.5px

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
}

export default function AiWriterFlow({ onComplete, onBack }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(templates[1]!);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Form State
  const [targetRole, setTargetRole] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('Entry Level (0-2 years)');
  const [context, setContext] = useState('');

  const handleGenerate = async () => {
    if (!targetRole || !industry) {
      setError('Please fill in your Target Role and Industry.');
      return;
    }
    setError('');
    setStep(3);
    setLoadingMsg('AI is writing your professional resume...');

    try {
      const generatedResume = await api.generateFullResume({
        targetRole,
        currentRole,
        industry,
        experience,
        context,
      });

      // Pass it back up
      onComplete(generatedResume, selectedTemplate);
    } catch (err: any) {
      setStep(2);
      setError(err.message || 'Failed to generate resume. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={step === 1 ? onBack : () => setStep((s) => (s - 1) as 1 | 2)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', fontWeight: 500, padding: '6px 10px', borderRadius: '8px' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
          disabled={step === 3}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wand2 size={13} color="white" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
            AI Resume <span style={{ color: '#818CF8' }}>Writer</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        
        {step === 1 && (
          <div style={{ width: '100%', maxWidth: '1200px', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                Choose a Template
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
                Select a design to start with. You can change this anytime later.
              </p>
            </div>

            <div style={{ position: 'relative', padding: '0 60px' }}>
              {/* Navigation Buttons */}
              <button
                onClick={() => scroll('left')}
                style={{
                  position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)',
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
                  color: 'var(--color-ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#818CF8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-ui-border)'}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => scroll('right')}
                style={{
                  position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)',
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
                  color: 'var(--color-ui-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#818CF8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-ui-border)'}
              >
                <ChevronRight size={20} />
              </button>

              <div 
                ref={scrollRef}
                style={{ 
                  display: 'flex', overflowX: 'auto', gap: '32px', padding: '20px 0 40px', 
                  scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none'
                }}
                className="hide-scrollbar"
              >
                {templates.map(tpl => {
                  const isActive = selectedTemplate.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => { setSelectedTemplate(tpl); setStep(2); }}
                      style={{
                        flexShrink: 0,
                        borderRadius: '16px', textAlign: 'left',
                        background: isActive ? 'rgba(99,102,241,0.05)' : 'var(--color-ui-surface)',
                        border: `2px solid ${isActive ? '#818CF8' : 'var(--color-ui-border)'}`,
                        cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                        overflow: 'hidden',
                        scrollSnapAlign: 'start',
                        width: `${(TEMPLATE_W * SCALE) + 32}px`
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#818CF850'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--color-ui-border)'; }}
                    >
                      {isActive && <CheckCircle2 size={32} color="#818CF8" fill="white" style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />}
                      <div style={{ borderBottom: '1px solid var(--color-ui-border)', background: 'var(--color-ui-surface-2)', padding: '16px 16px 0 16px' }}>
                        <TemplatePreview t={tpl} />
                      </div>
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: tpl.colors.primary, border: '1px solid rgba(0,0,0,0.1)' }} />
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: tpl.colors.accent, border: '1px solid rgba(0,0,0,0.1)' }} />
                        </div>
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

        {step === 2 && (
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                Tell us about your goals
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)' }}>
                Provide a few details, and AI will generate a complete, professional resume for you.
              </p>
            </div>

            <div style={{ background: 'var(--color-ui-surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-ui-border)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Target Job Title *</label>
                  <input 
                    className="field-input" 
                    value={targetRole} 
                    onChange={e => setTargetRole(e.target.value)} 
                    placeholder="e.g. Senior Frontend Engineer" 
                  />
                </div>
                <div>
                  <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Industry *</label>
                  <input 
                    className="field-input" 
                    value={industry} 
                    onChange={e => setIndustry(e.target.value)} 
                    placeholder="e.g. Technology, Finance" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Current / Last Role</label>
                  <input 
                    className="field-input" 
                    value={currentRole} 
                    onChange={e => setCurrentRole(e.target.value)} 
                    placeholder="e.g. Frontend Developer" 
                  />
                </div>
                <div>
                  <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Experience Level</label>
                  <select 
                    className="field-input" 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)}
                    style={{ appearance: 'none', backgroundColor: 'var(--color-ui-bg)' }}
                  >
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior (5-10 years)</option>
                    <option>Executive (10+ years)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Additional Context (Optional)</label>
                <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginBottom: '8px' }}>
                  Mention specific skills, achievements, or keywords you want the AI to include.
                </p>
                <textarea 
                  className="field-textarea" 
                  rows={4} 
                  value={context} 
                  onChange={e => setContext(e.target.value)} 
                  placeholder="e.g. Expert in React, Node.js, and scaling web apps to millions of users." 
                  style={{ resize: 'vertical' }}
                />
              </div>

              {error && (
                <div style={{ padding: '12px', background: 'rgba(248,113,113,0.1)', color: '#F87171', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              <button 
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }} 
                onClick={handleGenerate}
              >
                <Wand2 size={18} style={{ marginRight: '6px' }} />
                Generate My Resume
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', marginTop: '10vh' }}>
            <Loader2 size={48} style={{ color: '#818CF8', animation: 'spin 1s linear infinite', marginBottom: '24px', margin: '0 auto' }} />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px' }}>
              {loadingMsg}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
              This takes about 10-15 seconds. We're crafting professional bullet points, summarizing your experience, and formatting your template.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
