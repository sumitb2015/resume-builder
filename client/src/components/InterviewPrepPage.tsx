import { useState } from 'react';
import {
  ArrowLeft, Loader2, HelpCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import type { Resume } from '../shared/types';
import type { Feature } from '../shared/constants';

interface Props {
  resume: Resume;
  onBack: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

interface PrepResult {
  analysis: string;
  questions: { question: string; type: string; strategy: string; sampleAnswer: string }[];
}

export default function InterviewPrepPage({ resume, onBack }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrepResult | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isMobile = useIsMobile();

  const handleGenerate = async () => {
    setLoading(true);
    setStep(3);
    try {
      const res = await api.generateInterviewPrep(resume, jobText);
      setResult(res);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Prep generation failed.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '800px', 
          padding: isMobile ? '12px 16px' : '24px 40px',
          paddingBottom: isMobile ? '80px' : '100px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '16px' : '32px' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px' }}>
            <ArrowLeft size={14} /> Back to Builder
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? '12px' : '40px' }}>
          <div style={{ width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', background: 'rgba(168,85,247,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <HelpCircle size={isMobile ? 18 : 24} style={{ color: '#A855F7' }} />
          </div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '4px' }}>AI Interview Prep</h1>
          <p style={{ fontSize: isMobile ? '12.5px' : '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.4 }}>Get tailored questions and strategies for your next big interview</p>
        </div>

        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 700, marginBottom: isMobile ? '16px' : '24px' }}>Ready to prepare for an interview?</h2>
            <div style={{ background: 'var(--color-ui-surface)', padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: '1px solid var(--color-ui-border)', marginBottom: isMobile ? '16px' : '24px' }}>
              <p style={{ fontSize: isMobile ? '12.5px' : '14px', lineHeight: 1.6 }}>We'll use your current resume: <strong>{resume.personal.name}</strong></p>
            </div>
            <button className="btn-primary" style={{ padding: isMobile ? '9px 20px' : undefined, fontSize: isMobile ? '13px' : undefined }} onClick={() => setStep(2)}>Next: Job Description →</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 700, marginBottom: isMobile ? '8px' : '16px' }}>Paste the job description</h2>
            <textarea
              className="field-textarea" rows={isMobile ? 8 : 10} placeholder="Paste JD here…"
              value={jobText} onChange={e => setJobText(e.target.value)}
              style={{ marginBottom: '16px', fontSize: isMobile ? '12.5px' : '13px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-ghost" style={{ fontSize: isMobile ? '12.5px' : '13px' }} onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" style={{ padding: isMobile ? '9px 16px' : undefined, fontSize: isMobile ? '13px' : undefined }} disabled={jobText.length < 50} onClick={handleGenerate}>Generate Questions</button>
            </div>
          </div>
        )}

        {step === 3 && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader2 size={isMobile ? 32 : 40} className="spin" style={{ color: '#A855F7', marginBottom: '16px' }} />
              <p style={{ fontSize: '13px' }}>Preparing your interview coach…</p>
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px' }}>
              <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', padding: isMobile ? '14px' : '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: isMobile ? '13px' : '15px', fontWeight: 700, color: '#A855F7', marginBottom: '6px' }}>Interview Focus</h3>
                <p style={{ fontSize: isMobile ? '12.5px' : '14px', lineHeight: 1.6 }}>{result.analysis}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '12px' }}>
                {result.questions.map((q, i) => (
                  <div key={q.question} style={{ background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      style={{ width: '100%', padding: isMobile ? '12px 14px' : '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', minWidth: 0 }}>
                        <span style={{ fontSize: isMobile ? '9px' : '11px', fontWeight: 700, padding: isMobile ? '1px 6px' : '2px 8px', borderRadius: '100px', background: 'var(--color-ui-border)', color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', flexShrink: 0 }}>{q.type}</span>
                        <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 600, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isMobile ? 'nowrap' : 'normal' }}>{q.question}</span>
                      </div>
                      {openIndex === i ? <ChevronUp size={isMobile ? 16 : 18} style={{ flexShrink: 0 }} /> : <ChevronDown size={isMobile ? 16 : 18} style={{ flexShrink: 0 }} />}
                    </button>
                    {openIndex === i && (
                      <div style={{ padding: isMobile ? '0 14px 14px' : '0 20px 20px', borderTop: '1px solid var(--color-ui-border)' }}>
                        <div style={{ marginTop: '12px' }}>
                          <h4 style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 700, color: '#A855F7', marginBottom: '2px', textTransform: 'uppercase' }}>Strategy</h4>
                          <p style={{ fontSize: isMobile ? '12.5px' : '13.5px', lineHeight: 1.6, color: 'var(--color-ui-text-muted)' }}>{q.strategy}</p>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <h4 style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 700, color: '#4ADE80', marginBottom: '2px', textTransform: 'uppercase' }}>Sample Answer</h4>
                          <p style={{ fontSize: isMobile ? '12.5px' : '13.5px', lineHeight: 1.6, color: 'var(--color-ui-text)' }}>{q.sampleAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-ghost" style={{ fontSize: isMobile ? '12px' : '13px' }} onClick={() => { setStep(1); setResult(null); }} style={{ alignSelf: 'center' }}>{isMobile ? 'Try Another' : 'Try another job'}</button>
            </div>
          ) : <p>Error occurred.</p>
        )}
      </div>
    </div>
  );
}
