import { useState, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  FileText, Upload, ArrowLeft, Loader2, AlertCircle, Award,
  Sparkles, Link2, CheckCircle2,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { Resume } from '../shared/types';
import type { Feature } from '../shared/constants';
import { usePlan } from '../contexts/PlanContext';
import { parseQuotaError } from '../lib/api';
import QuotaWarningModal from './QuotaWarningModal';
import UsagePill from './UsagePill';

interface AtsResult {
  score: number;
  missingKeywords: string[];
  weakSections: string[];
  feedback: string;
}

interface Props {
  resume: Resume;
  onBack: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

type WizardStep = 1 | 2 | 3;
type ResumeSource = 'current' | 'upload';
type JdTab = 'paste' | 'url';

export default function AtsCheckerPage({ resume, onBack }: Props) {
  const { currentUser } = useAuth();
  const { getRemainingUses, incrementLocalUsage } = usePlan();
  const [quotaModal, setQuotaModal] = useState<{ resetAt?: string } | null>(null);
  const [step, setStep] = useState<WizardStep>(1);
  const [resumeSource, setResumeSource] = useState<ResumeSource>('current');
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const [jdTab, setJdTab] = useState<JdTab>('paste');
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);

  const activeResume = resumeSource === 'current' ? resume : uploadedResume;
  const canProceedStep1 = resumeSource === 'current' || uploadedResume !== null;
  const canProceedStep2 = jobText.trim().length > 50;

  const handleFile = async (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      setUploadError('Please upload a PDF or .docx file.');
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      const result = await api.uploadResume(f);
      setUploadedResume(result.resume);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Failed to parse resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleFetchUrl = async () => {
    if (!jobUrl.trim()) return;
    setFetchingUrl(true);
    setUrlError('');
    try {
      const res = await api.fetchJobUrl(jobUrl.trim());
      setJobText(res.text);
      setJdTab('paste');
    } catch (err: unknown) {
      setUrlError(err instanceof Error ? err.message : 'Failed to fetch job URL. Try pasting the text directly.');
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleAnalyze = async () => {
    if (!activeResume || !canProceedStep2) return;
    if (getRemainingUses('atsScore') === 0) {
      setQuotaModal({});
      return;
    }
    setLoading(true);
    setError('');
    setStep(3);
    try {
      const res = await api.atsScore(activeResume, jobText);
      setResult(res);
      incrementLocalUsage('atsScore');

      // Save to history (Point 6)
      if (currentUser) {
        api.saveAtsHistory({
          userId: currentUser.uid,
          resumeId: null,
          score: res.score,
          jobTitle: activeResume.personal.title || 'Unknown Position',
        }).catch(err => console.error('Failed to save ATS history:', err));
      }
    } catch (err: unknown) {
      const quotaErr = parseQuotaError(err);
      if (quotaErr) {
        setQuotaModal({ resetAt: quotaErr.resetAt });
        setStep(2);
      } else {
        setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
        setStep(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) =>
    score >= 75 ? '#4ADE80' : score >= 50 ? '#FBBF24' : '#F87171';

  const scoreLabel = (score: number) =>
    score >= 75 ? 'Strong Match' : score >= 50 ? 'Good Start' : 'Needs Work';

  // SVG gauge arc calculation
  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const scoreArc = (score: number) => CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {quotaModal && (
        <QuotaWarningModal feature="atsScore" resetAt={quotaModal.resetAt} onClose={() => setQuotaModal(null)} />
      )}
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '860px', 
          padding: isMobile ? '12px 16px' : '24px 40px',
          paddingBottom: isMobile ? '80px' : '100px'
        }}
      >

        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: isMobile ? '16px' : '32px' }}>
          <button
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', padding: '6px 10px', borderRadius: '8px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
          >
            <ArrowLeft size={14} /> Back to Builder
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: isMobile ? '12px' : '40px' }}>
          <div style={{ width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', background: 'rgba(99,102,241,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: isMobile ? '10px' : '16px' }}>
            <Award size={isMobile ? 18 : 24} style={{ color: '#818CF8' }} />
          </div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            ATS Score Checker
          </h1>
          <p style={{ fontSize: isMobile ? '12.5px' : '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.4 }}>
            See how well your resume matches a job description
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} labels={['Resume', 'Job Description', 'Results']} loading={loading} />

        {/* ── STEP 1: Resume source ── */}
        {step === 1 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
              Which resume should we analyze?
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', marginBottom: isMobile ? '14px' : '24px' }}>
              Use your current resume from the builder, or upload a different one.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '8px' : '12px', marginBottom: '16px' }}>
              {/* Current resume card */}
              <SourceCard
                icon={<FileText size={isMobile ? 16 : 22} style={{ color: '#818CF8' }} />}
                title="Current resume"
                description={resume.personal.name || 'Your active resume'}
                selected={resumeSource === 'current'}
                onClick={() => { setResumeSource('current'); setUploadedResume(null); setUploadError(''); }}
              />
              {/* Upload card */}
              <SourceCard
                icon={<Upload size={isMobile ? 16 : 22} style={{ color: '#F59E0B' }} />}
                title="Upload a resume"
                description="PDF or Word (.docx)"
                selected={resumeSource === 'upload'}
                onClick={() => setResumeSource('upload')}
              />
            </div>

            {/* File drop zone */}
            {resumeSource === 'upload' && (
              <div style={{ marginBottom: '16px' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${dragOver ? '#F59E0B' : uploadedResume ? '#4ADE80' : 'var(--color-ui-border)'}`,
                    borderRadius: '12px', padding: isMobile ? '20px 16px' : '32px 24px', textAlign: 'center', cursor: 'pointer',
                    background: dragOver ? 'rgba(245,158,11,0.04)' : uploadedResume ? 'rgba(74,222,128,0.04)' : 'var(--color-ui-surface)',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    ref={fileInputRef} type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  {uploading ? (
                    <div>
                      <Loader2 size={isMobile ? 22 : 28} style={{ color: '#818CF8', animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>Parsing resume…</p>
                    </div>
                  ) : uploadedResume ? (
                    <div>
                      <CheckCircle2 size={isMobile ? 22 : 28} style={{ color: '#4ADE80', marginBottom: '8px' }} />
                      <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#4ADE80' }}>
                        {uploadedResume.personal.name || 'Resume parsed'}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginTop: '4px' }}>Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={isMobile ? 22 : 28} style={{ color: 'var(--color-ui-text-muted)', marginBottom: '10px' }} />
                      <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
                        Drop your resume here, or click to browse
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>PDF or Word (.docx) · Max 10MB</p>
                    </div>
                  )}
                </div>

                {uploadError && <ErrorBox message={uploadError} />}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                style={{ gap: '6px', fontSize: '13px', padding: '9px 20px' }}
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                {isMobile ? 'Next →' : 'Next: Job Description →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Job description ── */}
        {step === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
              Paste the job description
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', marginBottom: isMobile ? '14px' : '24px' }}>
              The more complete the job posting, the more accurate your ATS score will be.
            </p>

            {/* Tab toggle */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '9px', padding: '3px', marginBottom: '16px', width: 'fit-content' }}>
              {(['paste', 'url'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setJdTab(t)}
                  style={{
                    padding: isMobile ? '4px 10px' : '5px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    background: jdTab === t ? 'var(--color-ui-accent)' : 'transparent',
                    color: jdTab === t ? '#fff' : 'var(--color-ui-text-muted)',
                    fontSize: isMobile ? '11px' : '12px', fontWeight: jdTab === t ? 600 : 400, transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                >
                  {t === 'paste' ? <FileText size={isMobile ? 10 : 11} /> : <Link2 size={isMobile ? 10 : 11} />}
                  {t === 'paste' ? 'Paste Text' : 'Fetch from URL'}
                </button>
              ))}
            </div>

            {jdTab === 'paste' ? (
              <textarea
                className="field-textarea"
                rows={isMobile ? 8 : 10}
                placeholder="Paste the full job posting here…"
                value={jobText}
                onChange={e => setJobText(e.target.value)}
                style={{ marginBottom: '8px', fontSize: '12.5px', resize: 'vertical' }}
              />
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  className="field-input"
                  placeholder="https://company.com/jobs/123"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  style={{ flex: 1, fontSize: '12.5px' }}
                  onKeyDown={e => e.key === 'Enter' && handleFetchUrl()}
                />
                <button
                  className="btn-secondary"
                  style={{ gap: '6px', fontSize: '12px', padding: isMobile ? '8px 12px' : '8px 14px', whiteSpace: 'nowrap' }}
                  onClick={handleFetchUrl}
                  disabled={fetchingUrl || !jobUrl.trim()}
                >
                  {fetchingUrl ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Link2 size={13} />}
                  {fetchingUrl ? (isMobile ? '' : 'Fetching…') : (isMobile ? 'Fetch' : 'Fetch')}
                </button>
              </div>
            )}

            {urlError && <ErrorBox message={urlError} />}

            {jdTab === 'paste' && (
              <p style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: isMobile ? '14px' : '20px' }}>
                {jobText.trim().length} characters {jobText.trim().length < 50 ? '(need at least 50)' : ''}
              </p>
            )}
            {jdTab === 'url' && (
              <p style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', marginBottom: isMobile ? '14px' : '20px' }}>
                We'll extract the job description text from the URL.
              </p>
            )}

            {error && <ErrorBox message={error} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? '10px' : '0' }}>
              <button
                className="btn-ghost"
                style={{ gap: '6px', fontSize: '12.5px' }}
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={13} /> Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="btn-primary"
                  style={{ gap: '6px', fontSize: '13px', padding: '9px 20px' }}
                  disabled={!canProceedStep2}
                  onClick={handleAnalyze}
                >
                  <Award size={14} /> Analyze Resume
                </button>
                <UsagePill feature="atsScore" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Loading or results ── */}
        {step === 3 && (
          loading ? (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textAlign: 'center', marginBottom: '24px' }}>
                <Loader2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', animation: 'spin 1s linear infinite', color: '#818CF8' }} />
                Analyzing your resume — this takes 10–20 seconds…
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'var(--color-ui-surface)', borderRadius: '16px', padding: '32px 24px', border: '1px solid var(--color-ui-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div className="skeleton" style={{ width: '140px', height: '140px', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ height: '18px', width: '100px' }} />
                    <div className="skeleton" style={{ height: '13px', width: '140px' }} />
                  </div>
                  <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-ui-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="skeleton" style={{ height: '13px', width: '80px' }} />
                    <div className="skeleton" style={{ height: '13px' }} />
                    <div className="skeleton" style={{ height: '13px' }} />
                    <div className="skeleton" style={{ height: '13px', width: '70%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-ui-border)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="skeleton" style={{ height: '13px', width: '120px' }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {[70, 90, 60, 80, 50].map((w) => <div key={w} className="skeleton" style={{ height: '24px', width: `${w}px`, borderRadius: '100px' }} />)}
                    </div>
                  </div>
                  <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: '20px', border: '1px solid var(--color-ui-border)', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="skeleton" style={{ height: '13px', width: '140px' }} />
                    <div className="skeleton" style={{ height: '13px' }} />
                    <div className="skeleton" style={{ height: '13px', width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : result ? (
            <AtsResults result={result} scoreArc={scoreArc} scoreColor={scoreColor} scoreLabel={scoreLabel} CIRCUMFERENCE={CIRCUMFERENCE} RADIUS={RADIUS} onBack={onBack} onRedo={() => { setStep(1); setResult(null); }} />
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'var(--color-ui-text-muted)' }}>Something went wrong. Please try again.</p>
              <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={() => setStep(2)}>← Back</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep, labels, loading }: { currentStep: number; labels: string[]; loading: boolean }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: isMobile ? '16px' : '48px' }}>
      {labels.map((label, i) => {
        const step = i + 1;
        const isDone = currentStep > step || (currentStep === step && !loading && step === 3);
        const isActive = currentStep === step;
        const isLast = i === labels.length - 1;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: isMobile ? '24px' : '32px', height: isMobile ? '24px' : '32px', borderRadius: '50%',
                background: isDone ? '#4ADE80' : isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-surface)',
                border: `2px solid ${isDone ? '#4ADE80' : isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDone || isActive ? '#fff' : 'var(--color-ui-text-muted)',
                fontSize: isMobile ? '10px' : '13px', fontWeight: 700, transition: 'all 0.3s',
              }}>
                {isDone ? '✓' : step}
              </div>
              <span style={{ fontSize: isMobile ? '9px' : '11px', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div style={{ width: isMobile ? '16px' : '80px', height: '2px', background: currentStep > step ? '#4ADE80' : 'var(--color-ui-border)', marginTop: 0, marginRight: isMobile ? '4px' : '8px', marginBottom: isMobile ? '14px' : '20px', marginLeft: isMobile ? '4px' : '8px', transition: 'background 0.3s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SourceCard({ icon, title, description, selected, onClick }: { icon: React.ReactNode; title: string; description: string; selected: boolean; onClick: () => void }) {
  const isMobile = useIsMobile();
  return (
    <button
      onClick={onClick}
      style={{
        padding: isMobile ? '12px 14px' : '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
        background: selected ? 'rgba(99,102,241,0.08)' : 'var(--color-ui-surface)',
        border: `2px solid ${selected ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
        transition: 'all 0.15s', width: '100%',
      }}
    >
      <div style={{ marginBottom: isMobile ? '4px' : '10px' }}>{icon}</div>
      <div style={{ fontSize: isMobile ? '12.5px' : '14px', fontWeight: 600, color: 'var(--color-ui-text)', marginBottom: '2px' }}>{title}</div>
      <div style={{ fontSize: isMobile ? '10.5px' : '12px', color: 'var(--color-ui-text-muted)', lineHeight: 1.3 }}>{description}</div>
    </button>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', marginBottom: '16px' }}>
      <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: '1px' }} />
      <p style={{ fontSize: '13px', color: '#F87171', margin: 0 }}>{message}</p>
    </div>
  );
}

function AtsResults({
  result, scoreArc, scoreColor, scoreLabel, CIRCUMFERENCE, RADIUS, onBack, onRedo,
}: {
  result: AtsResult;
  scoreArc: (n: number) => number;
  scoreColor: (n: number) => string;
  scoreLabel: (n: number) => string;
  CIRCUMFERENCE: number;
  RADIUS: number;
  onBack: () => void;
  onRedo: () => void;
}) {
  const color = scoreColor(result.score);
  const label = scoreLabel(result.score);
  const isMobile = useIsMobile();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? '16px' : '24px', marginBottom: isMobile ? '16px' : '24px' }}>
        {/* Left: score + feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
          {/* Score gauge */}
          <div style={{ background: 'var(--color-ui-surface)', borderRadius: '16px', padding: isMobile ? '24px 16px' : '32px 24px', textAlign: 'center', border: '1px solid var(--color-ui-border)' }}>
            <div className="ats-ring" style={{ marginBottom: isMobile ? '12px' : '16px' }}>
              <svg width={isMobile ? '120' : '140'} height={isMobile ? '120' : '140'} viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                  cx="70" cy="70" r={RADIUS}
                  fill="none"
                  stroke="var(--color-ui-border)"
                  strokeWidth="10"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
                {/* Score arc */}
                <circle
                  cx="70" cy="70" r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={scoreArc(result.score)}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '30px' : '36px', fontWeight: 800, color, lineHeight: 1 }}>{result.score}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginTop: '2px' }}>/100</div>
              </div>
            </div>
            <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color, marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>ATS compatibility score</div>
          </div>

          {/* Feedback */}
          <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: isMobile ? '16px' : '20px', border: '1px solid var(--color-ui-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '8px' : '12px' }}>
              <Sparkles size={15} style={{ color: '#818CF8' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)' }}>AI Feedback</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, margin: 0 }}>{result.feedback}</p>
          </div>
        </div>

        {/* Right: keywords + weak sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
          {/* Missing keywords */}
          <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: isMobile ? '16px' : '20px', border: '1px solid var(--color-ui-border)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)' }}>Missing Keywords</span>
              {result.missingKeywords.length > 0 && (
                <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(248,113,113,0.1)', fontSize: '11px', fontWeight: 700, color: '#F87171' }}>
                  {result.missingKeywords.length}
                </span>
              )}
            </div>
            {result.missingKeywords.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#4ADE80' }}>Great — no critical keywords missing!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.missingKeywords.map((kw) => (
                  <span key={kw} className="chip" style={{ fontSize: isMobile ? '11px' : '12px' }}>{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* Weak sections */}
          <div style={{ background: 'var(--color-ui-surface)', borderRadius: '14px', padding: isMobile ? '16px' : '20px', border: '1px solid var(--color-ui-border)', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)' }}>Sections to Improve</span>
              {result.weakSections.length > 0 && (
                <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(251,191,36,0.1)', fontSize: '11px', fontWeight: 700, color: '#FBBF24' }}>
                  {result.weakSections.length}
                </span>
              )}
            </div>
            {result.weakSections.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#4ADE80' }}>All sections look solid!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.weakSections.map((section) => (
                  <div key={section} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={13} style={{ color: '#FBBF24', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>{section}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', justifyContent: isMobile ? 'flex-start' : 'space-between', alignItems: 'center', gap: isMobile ? '8px' : '0', paddingTop: '8px' }}>
        <button className="btn-ghost" style={{ gap: '6px', fontSize: isMobile ? '12px' : '13px' }} onClick={onRedo}>
          {isMobile ? 'Try Another Job' : 'Try another job description'}
        </button>
        <button className="btn-secondary" style={{ gap: '6px', fontSize: isMobile ? '12px' : '13px' }} onClick={onBack}>
          {isMobile ? 'Back' : 'Back to Builder'}
        </button>
      </div>
    </div>
  );
}
