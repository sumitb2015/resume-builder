import { useState, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import {
  FileText, Upload, ArrowLeft, Loader2, AlertCircle,
  Zap, Link2, CheckCircle2, Check,
} from 'lucide-react';
import { api } from '../lib/api';
import { plainTextToHtml, stripHtml } from '../lib/htmlUtils';
import type { Resume } from '../shared/types';
import type { Feature } from '../shared/constants';

interface TailorResult {
  missingKeywords: string[];
  rewrittenBullets: { original: string; suggested: string }[];
  suggestedSummary: string;
}

interface Props {
  resume: Resume;
  onApplyChanges: (updated: Resume) => void;
  onBack: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

type WizardStep = 1 | 2 | 3;
type ResumeSource = 'current' | 'upload';
type JdTab = 'paste' | 'url';

export default function JobTailorPage({ resume, onApplyChanges, onBack }: Props) {
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
  const [result, setResult] = useState<TailorResult | null>(null);

  // Apply tracking
  const [appliedBullets, setAppliedBullets] = useState<Set<number>>(new Set());
  const [summaryApplied, setSummaryApplied] = useState(false);

  const activeResume = resumeSource === 'current' ? resume : uploadedResume;
  const canProceedStep1 = resumeSource === 'current' || uploadedResume !== null;
  const canProceedStep2 = jobText.trim().length > 50;

  const totalChanges = appliedBullets.size + (summaryApplied ? 1 : 0);
  const totalAvailable = (result?.rewrittenBullets.length ?? 0) + (result?.suggestedSummary ? 1 : 0);

  const handleFile = async (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      setUploadError('Please upload a PDF or .docx file.');
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      const res = await api.uploadResume(f);
      setUploadedResume(res.resume);
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

  const handleTailor = async () => {
    if (!activeResume || !canProceedStep2) return;
    setLoading(true);
    setError('');
    setStep(3);
    setAppliedBullets(new Set());
    setSummaryApplied(false);
    try {
      const res = await api.tailorResume(activeResume, jobText);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tailoring failed. Please try again.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const toggleBullet = (i: number) => {
    setAppliedBullets(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const applyAll = () => {
    if (!result) return;
    setAppliedBullets(new Set(result.rewrittenBullets.map((_, i) => i)));
    if (result.suggestedSummary) setSummaryApplied(true);
  };

  const buildMergedResume = (): Resume => {
    const base: Resume = JSON.parse(JSON.stringify(activeResume!));
    if (summaryApplied && result?.suggestedSummary) {
      base.personal = { ...base.personal, summary: plainTextToHtml(result.suggestedSummary) };
    }
    if (result?.rewrittenBullets) {
      const toApply = result.rewrittenBullets.filter((_, i) => appliedBullets.has(i));
      base.experience = base.experience.map(exp => ({
        ...exp,
        bullets: exp.bullets.map(b => {
          const plain = stripHtml(b).trim();
          const match = toApply.find(rw => plain === rw.original.trim());
          return match ? plainTextToHtml(match.suggested) : b;
        }),
      }));
    }
    return base;
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
          <div style={{ width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', background: 'rgba(168,85,247,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: isMobile ? '10px' : '16px' }}>
            <Zap size={isMobile ? 18 : 24} style={{ color: '#A855F7' }} />
          </div>
          <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '4px' }}>
            Job Tailor
          </h1>
          <p style={{ fontSize: isMobile ? '12.5px' : '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.4 }}>
            AI rewrites your bullets and summary to match the job description
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} labels={['Resume', 'Job Description', 'Suggestions']} loading={loading} />

        {/* ── STEP 1: Resume source ── */}
        {step === 1 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: isMobile ? '15px' : '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>
              Which resume should we tailor?
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--color-ui-text-muted)', marginBottom: isMobile ? '14px' : '24px' }}>
              Use your current resume from the builder, or upload a different one.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '8px' : '12px', marginBottom: '16px' }}>
              <SourceCard
                icon={<FileText size={isMobile ? 16 : 22} style={{ color: '#A855F7' }} />}
                title="Current resume"
                description={resume.personal.name || 'Your active resume'}
                selected={resumeSource === 'current'}
                onClick={() => { setResumeSource('current'); setUploadedResume(null); setUploadError(''); }}
              />
              <SourceCard
                icon={<Upload size={isMobile ? 16 : 22} style={{ color: '#F59E0B' }} />}
                title="Upload a resume"
                description="PDF or Word (.docx)"
                selected={resumeSource === 'upload'}
                onClick={() => setResumeSource('upload')}
              />
            </div>

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
                style={{ gap: '6px', fontSize: '13px', padding: '9px 20px', background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}
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
              AI will rewrite your experience bullets and summary to match this role.
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
              <button className="btn-ghost" style={{ gap: '6px', fontSize: '12.5px' }} onClick={() => setStep(1)}>
                <ArrowLeft size={13} /> Back
              </button>
              <button
                className="btn-primary"
                style={{ gap: '6px', fontSize: '13px', padding: '9px 20px', background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}
                disabled={!canProceedStep2}
                onClick={handleTailor}
              >
                <Zap size={14} /> Tailor Resume
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Loading or results ── */}
        {step === 3 && (
          loading ? (
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textAlign: 'center', marginBottom: '24px' }}>
                <Loader2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', animation: 'spin 1s linear infinite', color: '#A855F7' }} />
                AI is rewriting your bullets — this takes 15–30 seconds…
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[100, 85, 95, 75, 90].map((w, i) => (
                  <div key={i} style={{ background: 'var(--color-ui-surface)', borderRadius: '12px', padding: '16px 20px', border: '1px solid var(--color-ui-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '11px', width: '55px' }} />
                    <div className="skeleton" style={{ height: '13px', width: `${w}%` }} />
                    <div className="skeleton" style={{ height: '11px', width: '50px', marginTop: '6px' }} />
                    <div className="skeleton" style={{ height: '13px', width: `${Math.min(100, w + 5)}%` }} />
                  </div>
                ))}
              </div>
            </div>
          ) : result ? (
            <TailorResults
              result={result}
              appliedBullets={appliedBullets}
              summaryApplied={summaryApplied}
              totalChanges={totalChanges}
              totalAvailable={totalAvailable}
              isMobile={isMobile}
              onToggleBullet={toggleBullet}
              onToggleSummary={() => setSummaryApplied(v => !v)}
              onApplyAll={applyAll}
              onApplyToResume={() => onApplyChanges(buildMergedResume())}
              onRedo={() => { setStep(1); setResult(null); setAppliedBullets(new Set()); setSummaryApplied(false); }}
              onBack={onBack}
            />
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
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: isMobile ? '24px' : '32px', height: isMobile ? '24px' : '32px', borderRadius: '50%',
                background: isDone ? '#4ADE80' : isActive ? '#A855F7' : 'var(--color-ui-surface)',
                border: `2px solid ${isDone ? '#4ADE80' : isActive ? '#A855F7' : 'var(--color-ui-border)'}`,
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
        background: selected ? 'rgba(168,85,247,0.08)' : 'var(--color-ui-surface)',
        border: `2px solid ${selected ? '#A855F7' : 'var(--color-ui-border)'}`,
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

function TailorResults({
  result, appliedBullets, summaryApplied, totalChanges, totalAvailable, isMobile,
  onToggleBullet, onToggleSummary, onApplyAll, onApplyToResume, onRedo, onBack,
}: {
  result: TailorResult;
  appliedBullets: Set<number>;
  summaryApplied: boolean;
  totalChanges: number;
  totalAvailable: number;
  isMobile: boolean;
  onToggleBullet: (i: number) => void;
  onToggleSummary: () => void;
  onApplyAll: () => void;
  onApplyToResume: () => void;
  onRedo: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: isMobile ? '16px' : '28px', padding: isMobile ? '10px 14px' : '14px 18px',
        background: 'var(--color-ui-surface)', borderRadius: '12px',
        border: '1px solid var(--color-ui-border)',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '2px' }}>
            {totalAvailable} suggestions ready
          </div>
          <div style={{ fontSize: isMobile ? '11px' : '12px', color: 'var(--color-ui-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Select changes to apply
          </div>
        </div>
        <button
          className="btn-secondary"
          style={{ fontSize: isMobile ? '11.5px' : '12.5px', gap: '5px', padding: isMobile ? '6px 10px' : undefined }}
          onClick={onApplyAll}
        >
          <Check size={isMobile ? 11 : 12} /> {isMobile ? 'All' : 'Select All'}
        </button>
      </div>

      {/* Missing keywords */}
      {result.missingKeywords.length > 0 && (
        <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Missing Keywords
            <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'rgba(248,113,113,0.1)', fontSize: '11px', fontWeight: 700, color: '#F87171' }}>
              {result.missingKeywords.length}
            </span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.missingKeywords.map((kw, i) => (
              <span key={i} className="chip" style={{ fontSize: isMobile ? '11px' : '12px', padding: isMobile ? '3px 8px' : '4px 10px' }}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested summary */}
      {result.suggestedSummary && (
        <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: isMobile ? '8px' : '12px' }}>
            Professional Summary
          </h3>
          <div style={{
            background: 'var(--color-ui-surface)', borderRadius: '12px', padding: isMobile ? '14px' : '18px',
            border: `1px solid ${summaryApplied ? '#4ADE80' : 'var(--color-ui-border)'}`,
            transition: 'border-color 0.2s',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Suggested</div>
            <p style={{ fontSize: isMobile ? '12.5px' : '13px', color: 'var(--color-ui-text)', lineHeight: 1.7, marginTop: 0, marginBottom: '14px' }}>
              {result.suggestedSummary}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onToggleSummary}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: summaryApplied ? 'rgba(74,222,128,0.12)' : 'var(--color-ui-accent)',
                  color: summaryApplied ? '#4ADE80' : '#fff',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                {summaryApplied ? <><Check size={12} /> Applied</> : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rewritten bullets */}
      {result.rewrittenBullets.length > 0 && (
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: isMobile ? '8px' : '12px' }}>
            Rewritten Bullets ({result.rewrittenBullets.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.rewrittenBullets.map((rw, i) => {
              const applied = appliedBullets.has(i);
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--color-ui-surface)', borderRadius: '12px', padding: isMobile ? '14px' : '16px 18px',
                    border: `1px solid ${applied ? '#4ADE80' : 'var(--color-ui-border)'}`,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '5px' }}>Before</div>
                    <p style={{
                      fontSize: isMobile ? '12.5px' : '13px', lineHeight: 1.6, margin: 0,
                      color: 'var(--color-ui-text-muted)',
                      textDecoration: applied ? 'line-through' : 'none',
                      opacity: applied ? 0.5 : 0.8,
                    }}>
                      {rw.original}
                    </p>
                  </div>
                  <div style={{ width: '100%', height: '1px', background: 'var(--color-ui-border)', margin: '10px 0' }} />
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-success)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '5px' }}>After</div>
                    <p style={{ fontSize: isMobile ? '12.5px' : '13px', lineHeight: 1.6, margin: 0, color: applied ? '#4ADE80' : 'var(--color-ui-text)' }}>
                      {rw.suggested}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onToggleBullet(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                        background: applied ? 'rgba(74,222,128,0.12)' : 'var(--color-ui-accent)',
                        color: applied ? '#4ADE80' : '#fff',
                        fontSize: '12px', fontWeight: 600, transition: 'all 0.2s',
                      }}
                    >
                      {applied ? <><Check size={12} /> Applied</> : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{
        position: 'sticky', bottom: '0',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between',
        gap: isMobile ? '8px' : '0',
        padding: isMobile ? '10px 14px' : '16px 20px',
        background: 'var(--color-ui-bg)',
        borderTop: '1px solid var(--color-ui-border)',
        marginTop: '8px',
      }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: isMobile ? 'space-between' : undefined }}>
          <button className="btn-ghost" style={{ fontSize: isMobile ? '12px' : '13px', gap: '5px', padding: isMobile ? '6px' : undefined }} onClick={onRedo}>
            {isMobile ? 'Try Another' : 'Try another job'}
          </button>
          <button className="btn-secondary" style={{ fontSize: isMobile ? '12px' : '13px', padding: isMobile ? '6px 10px' : undefined }} onClick={onBack}>
            {isMobile ? 'Back' : 'Back to Builder'}
          </button>
        </div>
        <button
          className="btn-primary"
          style={{
            gap: '6px', fontSize: isMobile ? '12.5px' : '13.5px', padding: isMobile ? '10px 16px' : '10px 22px',
            background: totalChanges > 0 ? 'linear-gradient(135deg, #A855F7, #7C3AED)' : undefined,
            opacity: totalChanges === 0 ? 0.5 : 1,
          }}
          disabled={totalChanges === 0}
          onClick={onApplyToResume}
        >
          <CheckCircle2 size={isMobile ? 13 : 14} />
          Apply {totalChanges > 0 ? `${totalChanges} change${totalChanges !== 1 ? 's' : ''}` : 'changes'}
        </button>
      </div>
    </div>
  );
}
