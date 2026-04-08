import React from 'react';
import { Check, X } from 'lucide-react';

interface Props { onStart: () => void }

const TIERS = [
  {
    name: 'Basic',
    price: 199,
    period: '14 days',
    tagline: 'Try the essentials, no commitment',
    cta: 'Start 14-Day Trial',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: '3 professional templates', included: true },
      { label: 'Live preview & editor', included: true },
      { label: 'PDF export (1 per day)', included: true },
      { label: 'ATS score (template-based)', included: true },
      { label: 'AI bullet point writer (3/day)', included: true },
      { label: 'All 15 premium templates', included: false },
      { label: 'AI summary writer', included: false },
      { label: 'Skills finder', included: false },
      { label: 'Job tailoring (JD matching)', included: false },
      { label: 'Resume import & LinkedIn sync', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 499,
    period: 'mo',
    tagline: 'Core AI writing tools for active job seekers',
    cta: 'Start Pro',
    ctaStyle: 'primary' as const,
    popular: true,
    features: [
      { label: 'All 15 premium templates', included: true },
      { label: 'Live preview & editor', included: true },
      { label: 'Unlimited PDF exports', included: true },
      { label: 'Dynamic ATS score with JD matching', included: true },
      { label: 'AI bullet point writer (unlimited)', included: true },
      { label: 'AI summary writer', included: true },
      { label: 'Skills finder', included: true },
      { label: 'Color & style customization', included: true },
      { label: 'Job tailoring (full resume rewrite)', included: false },
      { label: 'Resume import & LinkedIn sync', included: false },
    ],
  },
  {
    name: 'Ultimate',
    price: 699,
    period: 'mo',
    tagline: 'Pro + advanced AI workflows & import tools',
    cta: 'Go Ultimate',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Job tailoring — AI rewrites resume to match JD', included: true },
      { label: 'Diff review (before/after on every change)', included: true },
      { label: 'Resume import from PDF / DOCX', included: true },
      { label: 'LinkedIn profile import', included: true },
      { label: 'AI improvement suggestions on import', included: true },
      { label: 'Priority PDF generation', included: true },
      { label: 'Email support', included: true },
      { label: 'Drag & drop section reordering', included: true },
      { label: 'Early access to new templates', included: true },
    ],
  },
];

const PricingSection: React.FC<Props> = ({ onStart }) => {
  return (
    <section id="pricing" style={{ padding: '100px 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.04em' }}>PRICING</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)' }}>
            Try Basic for 14 days. Upgrade to Pro when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch' }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                borderRadius: '20px', padding: '32px 28px',
                border: tier.popular ? '1px solid rgba(99,102,241,0.45)' : '1px solid var(--color-ui-border)',
                background: tier.popular
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))'
                  : 'var(--color-ui-surface)',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  padding: '5px 18px', borderRadius: '100px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  fontSize: '11.5px', fontWeight: 700, color: 'white',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                  whiteSpace: 'nowrap',
                }}>
                  ★ Most Popular
                </div>
              )}

              {/* Tier header */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px' }}>{tier.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginBottom: '20px' }}>{tier.tagline}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text-muted)', alignSelf: 'flex-start', marginTop: '10px' }}>₹</span>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em' }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-ui-text-dim)' }}>/{tier.period}</span>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={onStart}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  marginBottom: '28px', fontSize: '14.5px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  ...(tier.ctaStyle === 'primary'
                    ? {
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        border: 'none', color: 'white',
                        boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid var(--color-ui-border)',
                        color: 'var(--color-ui-text)',
                      }),
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {tier.cta}
              </button>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--color-ui-border)', marginBottom: '24px' }} />

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {tier.features.map((feature, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {feature.included
                      ? <Check size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '1px' }} />
                      : <X size={15} color="var(--color-ui-text-dim)" style={{ flexShrink: 0, marginTop: '1px' }} />
                    }
                    <span style={{
                      fontSize: '13.5px',
                      color: feature.included ? 'var(--color-ui-text)' : 'var(--color-ui-text-dim)',
                      lineHeight: 1.4,
                    }}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: '36px', fontSize: '13px', color: 'var(--color-ui-text-dim)' }}>
          All plans include secure data handling. Cancel anytime. No long-term contracts.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
