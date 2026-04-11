import { createPortal } from 'react-dom';
import { X, Check, Zap, Crown } from 'lucide-react';
import { templates } from '../templates';
import type { Plan } from '../shared/constants';

interface Props {
  requiredPlan: Plan;
  featureLabel: string;
  onClose: () => void;
  onUpgrade: (plan: Exclude<Plan, 'free'>) => void;
}

const PLAN_DETAILS: Record<string, {
  price: string;
  color: string;
  gradient: string;
  shadow: string;
  features: string[];
  icon: React.ReactNode;
}> = {
  basic: {
    price: '₹199/14d',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    shadow: 'rgba(245,158,11,0.4)',
    features: [
      '3 professional templates',
      'PDF export (1/day)',
      'ATS score (template level)',
      'AI bullets (3/day)',
      'Live preview & editor',
    ],
    icon: <Zap size={18} color="white" fill="white" />,
  },
  pro: {
    price: '₹499/mo',
    color: '#818CF8',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    shadow: 'rgba(99,102,241,0.4)',
    features: [
      `All ${templates.length} premium templates`,
      'Dynamic ATS score with JD matching',
      'AI bullet point writer (unlimited)',
      'AI summary writer',
      'Skills finder',
      'Color & style customization',
      'Unlimited PDF exports',
      'Resume import from PDF / DOCX',
    ],
    icon: <Zap size={18} color="white" fill="white" />,
  },
  ultimate: {
    price: '₹699/mo',
    color: '#C084FC',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
    shadow: 'rgba(168,85,247,0.4)',
    features: [
      'Everything in Pro',
      'Job tailoring — AI rewrites resume to match JD',
      'Diff review (before/after on every change)',
      'LinkedIn profile import',
      'AI improvement suggestions on import',
      'Priority PDF generation',
    ],
    icon: <Crown size={18} color="white" />,
  },
};

export default function UpgradeModal({ requiredPlan, featureLabel, onClose, onUpgrade }: Props) {
  const details = PLAN_DETAILS[requiredPlan] || PLAN_DETAILS.pro;
  const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);

  const handleActivate = () => {
    onUpgrade(requiredPlan as Exclude<Plan, 'free'>);
    onClose();
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--color-ui-surface)',
        border: `1px solid ${details.color}40`,
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${details.color}20`,
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--color-ui-text-dim)', padding: '4px',
            borderRadius: '6px',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon + heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: details.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${details.shadow}`,
          }}>
            {details.icon}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: details.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {planLabel} Required
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.02em', margin: 0 }}>
              Unlock {featureLabel}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          This feature is available on the <strong style={{ color: details.color }}>{planLabel}</strong> plan. Upgrade to access it along with:
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {details.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check size={14} color={details.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '13.5px', color: 'var(--color-ui-text)', lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{
          background: `${details.color}10`,
          border: `1px solid ${details.color}25`,
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em' }}>
              {details.price}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>per month</div>
          </div>
          <button
            onClick={handleActivate}
            style={{
              padding: '12px 24px', borderRadius: '10px',
              background: details.gradient,
              border: 'none', color: 'white',
              fontSize: '14px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 6px 20px ${details.shadow}`,
              letterSpacing: '-0.01em',
            }}
          >
            Upgrade to {planLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
