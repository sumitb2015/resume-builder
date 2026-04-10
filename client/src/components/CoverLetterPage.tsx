import { useState, useRef } from 'react';
import {
  FileText, Upload, ArrowLeft, Loader2,
  CheckCircle2, Copy,
} from 'lucide-react';
import { api } from '../lib/api';
import type { Resume } from '../shared/types';
import type { Feature } from '../contexts/PlanContext';

interface Props {
  resume: Resume;
  onBack: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

type WizardStep = 1 | 2 | 3;
type ResumeSource = 'current' | 'upload';

export default function CoverLetterPage({ resume, onBack }: Props) {
  const [step, setStep] = useState<WizardStep>(1);
  const [resumeSource, setResumeSource] = useState<ResumeSource>('current');
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobText, setJobText] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      const res = await api.uploadResume(f);
      setUploadedResume(res.resume);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to parse resume. Please try again.');
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

  const handleGenerate = async () => {
    if (!activeResume || !canProceedStep2) return;
    setLoading(true);
    setStep(3);
    try {
      const res = await api.generateCoverLetter(activeResume, jobText);
      setResult(res.text);
    } catch (err: any) {
      alert(err.message || 'Generation failed. Please try again.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    if (!result) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Cover Letter</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + result.replace(/\n/g, '<br>') + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Cover_Letter_${activeResume?.personal.name.replace(/\s+/g, '_') || 'BespokeCV'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-ui-bg)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 100px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <button
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', padding: '6px 10px', borderRadius: '8px' }}
          >
            <ArrowLeft size={14} /> Back to Builder
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={24} style={{ color: '#818CF8' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
            AI Cover Letter
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>
            Generate a persuasive, tailored cover letter in seconds
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '48px' }}>
          {['Resume', 'Job Description', 'Cover Letter'].map((label, i) => {
            const s = i + 1;
            const isDone = step > s || (step === s && !loading && s === 3);
            const isActive = step === s;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: isDone ? '#4ADE80' : isActive ? '#818CF8' : 'var(--color-ui-surface)',
                    border: `2px solid ${isDone ? '#4ADE80' : isActive ? '#818CF8' : 'var(--color-ui-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isDone || isActive ? '#fff' : 'var(--color-ui-text-muted)',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {isDone ? '✓' : s}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{ width: '80px', height: '2px', background: step > s ? '#4ADE80' : 'var(--color-ui-border)', margin: '0 8px 20px' }} />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
              Select your resume
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => { setResumeSource('current'); setUploadedResume(null); }}
                style={{
                  padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                  background: resumeSource === 'current' ? 'rgba(99,102,241,0.08)' : 'var(--color-ui-surface)',
                  border: `2px solid ${resumeSource === 'current' ? '#818CF8' : 'var(--color-ui-border)'}`,
                  width: '100%',
                }}
              >
                <FileText size={22} style={{ color: '#818CF8', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>Current resume</div>
                <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>{resume.personal.name}</div>
              </button>
              <button
                onClick={() => setResumeSource('upload')}
                style={{
                  padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                  background: resumeSource === 'upload' ? 'rgba(245,158,11,0.08)' : 'var(--color-ui-surface)',
                  border: `2px solid ${resumeSource === 'upload' ? '#F59E0B' : 'var(--color-ui-border)'}`,
                  width: '100%',
                }}
              >
                <Upload size={22} style={{ color: '#F59E0B', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>Upload PDF/DOCX</div>
                <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>From your computer</div>
              </button>
            </div>

            {resumeSource === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? '#F59E0B' : uploadedResume ? '#4ADE80' : 'var(--color-ui-border)'}`,
                  borderRadius: '12px', padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(245,158,11,0.04)' : uploadedResume ? 'rgba(74,222,128,0.04)' : 'var(--color-ui-surface)',
                  marginBottom: '20px',
                }}
              >
                <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                {uploading ? <Loader2 size={24} className="spin" /> : uploadedResume ? <CheckCircle2 size={24} color="#4ADE80" /> : <Upload size={24} />}
                <p style={{ marginTop: '8px', fontSize: '13px' }}>{uploadedResume ? uploadedResume.personal.name : 'Click to upload'}</p>
                {uploadError && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '8px' }}>{uploadError}</p>}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" disabled={!canProceedStep1} onClick={() => setStep(2)}>Next Step →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
              Paste the job description
            </h2>
            <textarea
              className="field-textarea" rows={10} placeholder="Paste JD here…"
              value={jobText} onChange={e => setJobText(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" disabled={!canProceedStep2} onClick={handleGenerate}>Generate Cover Letter</button>
            </div>
          </div>
        )}

        {step === 3 && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader2 size={40} className="spin" style={{ color: '#818CF8', marginBottom: '16px' }} />
              <p>Writing your cover letter…</p>
            </div>
          ) : result ? (
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{
                background: 'var(--color-ui-surface)', borderRadius: '16px', padding: '32px',
                border: '1px solid var(--color-ui-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: 1.6, color: 'var(--color-ui-text)',
                marginBottom: '24px',
              }}>
                {result}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button className="btn-secondary" onClick={handleCopy}>
                  {copied ? 'Copied!' : <><Copy size={16} /> Copy Text</>}
                </button>
                <button className="btn-primary" onClick={handleDownloadWord}>
                  <FileText size={16} /> Download Word
                </button>
                <button className="btn-ghost" onClick={() => { setStep(1); setResult(null); }}>
                  Try another
                </button>
              </div>
            </div>
          ) : <p>Error occurred. Please try again.</p>
        )}
      </div>
    </div>
  );
}
