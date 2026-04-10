import { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  userId: string;
  resumeId: string | null;
  resumeData: any;
  onClose: () => void;
}

export default function ExpertReviewModal({ userId, resumeId, resumeData, onClose }: Props) {
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.requestExpertReview(userId, resumeId, resumeData, comments);
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--color-ui-surface)', borderRadius: '20px', padding: '32px',
        maxWidth: '460px', width: '100%', position: 'relative',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-dim)' }}>
          <X size={20} />
        </button>

        {!success ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} style={{ color: '#818CF8' }} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Request Expert Review</h2>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', marginBottom: '20px' }}>
              Get a professional recruiter or career coach to review your resume. They will provide actionable feedback on your content, layout, and ATS compatibility.
            </p>
            <textarea
              className="field-textarea" rows={4}
              placeholder="Any specific questions or concerns for the expert?"
              value={comments} onChange={e => setComments(e.target.value)}
              style={{ marginBottom: '24px' }}
            />
            <button
              className="btn-primary" style={{ width: '100%', padding: '12px' }}
              onClick={handleSubmit} disabled={loading}
            >
              {loading ? <Loader2 className="spin" size={18} /> : 'Submit Request'}
            </button>
            <p style={{ fontSize: '11px', color: 'var(--color-ui-text-dim)', textAlign: 'center', marginTop: '16px' }}>
              Response time: 24–48 hours. This is a free trial service for our early users.
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} style={{ color: '#4ADE80', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Request Submitted!</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', marginBottom: '24px' }}>
              An expert will review your resume and get back to you at your registered email address within 48 hours.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
