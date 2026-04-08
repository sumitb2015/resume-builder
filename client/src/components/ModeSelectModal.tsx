import { useState, useRef } from 'react';
import { Zap, PenLine, Upload, Link2, ArrowLeft, Loader2, AlertCircle, Lock } from 'lucide-react';
import { api } from '../lib/api';
import type { Resume, ImprovementSuggestions } from '../shared/types';
import { usePlan } from '../contexts/PlanContext';
import type { Feature } from '../contexts/PlanContext';

interface Props {
  onSelect: (mode: 'manual' | 'enhance' | 'linkedin', resume?: Resume, improvements?: ImprovementSuggestions) => void;
  onBack: () => void;
  onUpgradeNeeded: (feature: Feature) => void;
}

type Step = 'pick' | 'enhance' | 'linkedin' | 'loading';

export default function ModeSelectModal({ onSelect, onBack, onUpgradeNeeded }: Props) {
  const { canAccess } = usePlan();
  const [step, setStep] = useState<Step>('pick');
  const [file, setFile] = useState<File | null>(null);
  const [linkedinText, setLinkedinText] = useState('');
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const name = f.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      setError('Please upload a PDF or .docx file.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleEnhanceSubmit = async () => {
    if (!file) return;
    setStep('loading');
    setLoadingMsg('Reading your resume…');
    try {
      const result = await api.uploadResume(file);
      onSelect('enhance', result.resume, result.improvements);
    } catch (err: any) {
      setStep('enhance');
      setError(err.message || 'Failed to parse resume. Please try again.');
    }
  };

  const handleLinkedInSubmit = async () => {
    if (!linkedinText.trim()) return;
    setStep('loading');
    setLoadingMsg('Reading LinkedIn profile…');
    try {
      const result = await api.syncLinkedIn(linkedinText.trim());
      onSelect('linkedin', result.resume);
    } catch (err: any) {
      setStep('linkedin');
      setError(err.message || 'Failed to parse profile. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-ui-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', fontWeight: 500, padding: '6px 10px', borderRadius: '8px' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
            Bespoke<span style={{ color: '#818CF8' }}>CV</span>
          </span>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>

        {/* Loading */}
        {step === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <Loader2 size={40} style={{ color: '#818CF8', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
            <p style={{ fontSize: '16px', color: 'var(--color-ui-text)', fontWeight: 600 }}>{loadingMsg}</p>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginTop: '8px' }}>This may take a few seconds…</p>
          </div>
        )}

        {/* Pick mode */}
        {step === 'pick' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '10px', letterSpacing: '-0.03em' }}>
                How would you like to start?
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>
                Choose the option that works best for you
              </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px', width: '100%' }}>
              {/* Build Manually — available to all plans */}
              <ModeCard
                icon={<PenLine size={28} />}
                iconColor="#818CF8"
                iconBg="rgba(99,102,241,0.1)"
                title="Build Manually"
                description="Start with a blank form and fill in your details step by step. Great if you're starting fresh."
                badgeText="All plans"
                badgeColor="#818CF8"
                badgeBg="rgba(99,102,241,0.12)"
                locked={false}
                onClick={() => onSelect('manual')}
              />

              {/* Enhance Existing — Ultimate only */}
              <ModeCard
                icon={<Upload size={28} />}
                iconColor="#F59E0B"
                iconBg="rgba(245,158,11,0.1)"
                title="Enhance Existing Resume"
                description="Upload your current resume (PDF or Word) and AI will import your data and suggest improvements."
                badgeText="AI-powered"
                badgeColor="#F59E0B"
                badgeBg="rgba(245,158,11,0.12)"
                locked={!canAccess('enhance-mode')}
                requiredPlan="Ultimate"
                onClick={() => {
                  if (!canAccess('enhance-mode')) { onUpgradeNeeded('enhance-mode'); return; }
                  setError(''); setFile(null); setStep('enhance');
                }}
              />

              {/* LinkedIn Sync — Ultimate only */}
              <ModeCard
                icon={<Link2 size={28} />}
                iconColor="#38BDF8"
                iconBg="rgba(56,189,248,0.1)"
                title="Import from LinkedIn"
                description="Copy your LinkedIn profile text and AI will build your resume from it automatically."
                badgeText="AI-powered"
                badgeColor="#38BDF8"
                badgeBg="rgba(56,189,248,0.12)"
                locked={!canAccess('linkedin-mode')}
                requiredPlan="Ultimate"
                onClick={() => {
                  if (!canAccess('linkedin-mode')) { onUpgradeNeeded('linkedin-mode'); return; }
                  setError(''); setLinkedinText(''); setStep('linkedin');
                }}
              />
            </div>
          </>
        )}

        {/* Enhance sub-step */}
        {step === 'enhance' && (
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <button onClick={() => { setStep('pick'); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', marginBottom: '32px', padding: 0 }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Upload your resume</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginBottom: '28px' }}>AI will read your resume and pre-fill all fields, plus suggest improvements.</p>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{ border: `2px dashed ${dragOver ? '#F59E0B' : file ? '#4ADE80' : 'var(--color-ui-border)'}`, borderRadius: '14px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(245,158,11,0.04)' : file ? 'rgba(74,222,128,0.04)' : 'var(--color-ui-surface)', transition: 'all 0.2s', marginBottom: '16px' }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              {file ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#4ADE80' }}>{file.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', marginTop: '4px' }}>{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                </div>
              ) : (
                <div>
                  <Upload size={32} style={{ color: 'var(--color-ui-text-muted)', marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)', marginBottom: '4px' }}>Drop your resume here, or click to browse</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>PDF or Word (.docx) · Max 10MB</p>
                </div>
              )}
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', marginBottom: '16px' }}>
                <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: '#F87171' }}>{error}</p>
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '12px' }} disabled={!file} onClick={handleEnhanceSubmit}>
              Parse & Continue
            </button>
          </div>
        )}

        {/* LinkedIn sub-step */}
        {step === 'linkedin' && (
          <div style={{ width: '100%', maxWidth: '560px' }}>
            <button onClick={() => { setStep('pick'); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', fontSize: '13px', marginBottom: '32px', padding: 0 }}>
              <ArrowLeft size={14} /> Back
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>Paste your LinkedIn profile</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginBottom: '20px' }}>LinkedIn blocks automated scraping, so copy your profile text manually and paste it below.</p>

            <div style={{ padding: '14px 16px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '10px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', marginBottom: '8px' }}>How to copy your LinkedIn profile:</p>
              <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {['Open your LinkedIn profile in a browser', 'Press Ctrl+A (or Cmd+A on Mac) to select all', 'Press Ctrl+C to copy', 'Paste below with Ctrl+V'].map((s, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>{s}</li>
                ))}
              </ol>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label" style={{ marginBottom: '8px', display: 'block' }}>LinkedIn Profile Text</label>
              <textarea className="field-textarea" rows={8} placeholder="Paste your LinkedIn profile content here…" value={linkedinText} onChange={e => { setLinkedinText(e.target.value); setError(''); }} style={{ fontSize: '13px', resize: 'vertical' }} />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', marginBottom: '16px' }}>
                <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontSize: '13px', color: '#F87171' }}>{error}</p>
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '14px', padding: '12px' }} disabled={linkedinText.trim().length < 50} onClick={handleLinkedInSubmit}>
              Build Resume & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ModeCardProps {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  locked: boolean;
  requiredPlan?: string;
  onClick: () => void;
}

function ModeCard({ icon, iconColor, iconBg, title, description, badgeText, badgeColor, badgeBg, locked, requiredPlan, onClick }: ModeCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '260px',
        padding: '28px 24px',
        background: hovered ? 'var(--color-ui-surface-2)' : 'var(--color-ui-surface)',
        border: `1.5px solid ${hovered ? (locked ? '#C084FC' : iconColor) : 'var(--color-ui-border)'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
        position: 'relative',
        opacity: locked ? 0.85 : 1,
      }}
    >
      {/* Lock overlay badge */}
      {locked && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '3px 8px', borderRadius: '100px',
          background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(192,132,252,0.3)',
        }}>
          <Lock size={10} color="#C084FC" />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#C084FC' }}>{requiredPlan}</span>
        </div>
      )}

      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: locked ? 'var(--color-ui-surface-2)' : iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: locked ? 'var(--color-ui-text-dim)' : iconColor, marginBottom: '18px' }}>
        {locked ? <Lock size={24} /> : icon}
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '100px', background: badgeBg, marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: badgeColor, letterSpacing: '0.04em' }}>{badgeText}</span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 700, color: locked ? 'var(--color-ui-text-muted)' : 'var(--color-ui-text)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>{description}</p>

      {locked && (
        <p style={{ fontSize: '12px', color: '#C084FC', marginTop: '12px', fontWeight: 600 }}>
          Click to upgrade to {requiredPlan} →
        </p>
      )}
    </button>
  );
}
