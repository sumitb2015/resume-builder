import { useState } from 'react';
import {
  ArrowLeft, Loader2, HelpCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
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

  const handleGenerate = async () => {
    setLoading(true);
    setStep(3);
    try {
      const res = await api.generateInterviewPrep(resume, jobText);
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'Prep generation failed.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-ui-bg)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 100px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', marginBottom: '32px' }}>
          <ArrowLeft size={14} /> Back to Builder
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(168,85,247,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <HelpCircle size={24} style={{ color: '#A855F7' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>AI Interview Prep</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>Get tailored questions and strategies for your next big interview</p>
        </div>

        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Ready to prepare for an interview?</h2>
            <div style={{ background: 'var(--color-ui-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-ui-border)', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', lineHeight: 1.6 }}>We'll use your current resume: <strong>{resume.personal.name}</strong></p>
            </div>
            <button className="btn-primary" onClick={() => setStep(2)}>Next: Job Description →</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Paste the job description</h2>
            <textarea
              className="field-textarea" rows={10} placeholder="Paste JD here…"
              value={jobText} onChange={e => setJobText(e.target.value)}
              style={{ marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" disabled={jobText.length < 50} onClick={handleGenerate}>Generate Questions</button>
            </div>
          </div>
        )}

        {step === 3 && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader2 size={40} className="spin" style={{ color: '#A855F7', marginBottom: '16px' }} />
              <p>Preparing your interview coach…</p>
            </div>
          ) : result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#A855F7', marginBottom: '8px' }}>Interview Focus</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{result.analysis}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {result.questions.map((q, i) => (
                  <div key={i} style={{ background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--color-ui-border)', color: 'var(--color-ui-text-muted)', textTransform: 'uppercase' }}>{q.type}</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{q.question}</span>
                      </div>
                      {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openIndex === i && (
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--color-ui-border)' }}>
                        <div style={{ marginTop: '16px' }}>
                          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#A855F7', marginBottom: '4px', textTransform: 'uppercase' }}>Strategy</h4>
                          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-ui-text-muted)' }}>{q.strategy}</p>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#4ADE80', marginBottom: '4px', textTransform: 'uppercase' }}>Sample Answer</h4>
                          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-ui-text)' }}>{q.sampleAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-ghost" onClick={() => { setStep(1); setResult(null); }} style={{ alignSelf: 'center' }}>Try another job</button>
            </div>
          ) : <p>Error occurred.</p>
        )}
      </div>
    </div>
  );
}
