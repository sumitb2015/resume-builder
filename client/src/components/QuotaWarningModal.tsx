import { useNavigate } from 'react-router-dom';
import { AlertCircle, X, Zap } from 'lucide-react';
import { QUOTA_FEATURE_LABELS, type QuotaFeatureKey } from '../shared/constants';
import { usePlan } from '../contexts/PlanContext';

interface Props {
  feature: QuotaFeatureKey;
  resetAt?: string; // ISO string of next reset (tomorrow UTC midnight)
  onClose: () => void;
}

function getResetLabel(resetAt?: string): string {
  if (!resetAt) return 'tomorrow';
  try {
    const d = new Date(resetAt);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffHrs = Math.ceil(diffMs / (1000 * 60 * 60));
    if (diffHrs <= 1) return 'in less than an hour';
    if (diffHrs < 24) return `in about ${diffHrs} hour${diffHrs !== 1 ? 's' : ''}`;
    return 'tomorrow';
  } catch {
    return 'tomorrow';
  }
}

export default function QuotaWarningModal({ feature, resetAt, onClose }: Props) {
  const navigate = useNavigate();
  const { refreshUsage } = usePlan();
  const featureLabel = QUOTA_FEATURE_LABELS[feature] ?? 'this feature';
  const resetLabel = getResetLabel(resetAt);

  const handleClose = () => {
    refreshUsage(); // sync counts from Firestore when user dismisses (handles midnight reset, other-tab usage)
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6"
        style={{
          background: '#1a1a2e',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#888',
            padding: 4,
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <AlertCircle size={24} color="#ef4444" />
        </div>

        {/* Heading */}
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Daily limit reached
        </h2>
        <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          You've used all your <strong style={{ color: '#fff' }}>{featureLabel}</strong> generations
          for today. Your limit resets <strong style={{ color: '#fff' }}>{resetLabel}</strong>.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/plans')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Zap size={15} />
            Upgrade Plan
          </button>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              background: 'transparent',
              color: '#aaa',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
