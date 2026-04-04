import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Props { onStart: () => void }

type BillingCycle = 'monthly' | 'annual';

const TIERS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: 'Perfect for getting started',
    cta: 'Get Started Free',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: '5 professional templates', included: true },
      { label: 'Live preview & editor', included: true },
      { label: 'PDF export (1 per day)', included: true },
      { label: 'ATS compatibility score', included: true },
      { label: 'AI bullet point writer (3/day)', included: true },
      { label: 'All 15 premium templates', included: false },
      { label: 'Unlimited AI features', included: false },
      { label: 'Job tailoring (JD matching)', included: false },
      { label: 'Skills finder', included: false },
      { label: 'Email support', included: false },
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 9,
    tagline: 'For serious job seekers',
    cta: 'Start Pro',
    ctaStyle: 'primary' as const,
    popular: true,
    features: [
      { label: 'All 15 premium templates', included: true },
      { label: 'Live preview & editor', included: true },
      { label: 'Unlimited PDF exports', included: true },
      { label: 'ATS compatibility score', included: true },
      { label: 'Unlimited AI features (all 6)', included: true },
      { label: 'Job tailoring (JD matching)', included: true },
      { label: 'Skills finder', included: true },
      { label: 'Diff review (before/after)', included: true },
      { label: 'Priority PDF generation', included: true },
      { label: 'Email support', included: true },
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 29,
    annualPrice: 23,
    tagline: 'For teams & organizations',
    cta: 'Contact Sales',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Team workspace (10 seats)', included: true },
      { label: 'Custom branding / white-label', included: true },
      { label: 'API access for integrations', included: true },
      { label: 'SSO / SAML authentication', included: true },
      { label: 'Priority support (< 4hr response)', included: true },
      { label: 'Dedicated customer success manager', included: true },
      { label: 'Custom template design', included: true },
      { label: 'Usage analytics dashboard', included: true },
      { label: 'SLA guarantee', included: true },
    ],
  },
];

const PricingSection: React.FC<Props> = ({ onStart }) => {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

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
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: '14px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '36px' }}>
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '4px' }}>
            {(['monthly', 'annual'] as BillingCycle[]).map(cycle => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                style={{
                  padding: '8px 20px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  fontSize: '13.5px', fontWeight: 600,
                  background: billing === cycle ? 'rgba(99,102,241,0.9)' : 'transparent',
                  color: billing === cycle ? 'white' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                {cycle === 'monthly' ? 'Monthly' : 'Annual'}
                {cycle === 'annual' && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                    background: billing === 'annual' ? 'rgba(74,222,128,0.25)' : 'rgba(74,222,128,0.15)',
                    color: '#4ADE80',
                  }}>
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch' }}>
          {TIERS.map((tier) => {
            const price = billing === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
            const originalPrice = billing === 'annual' && tier.monthlyPrice > 0 ? tier.monthlyPrice : null;

            return (
              <div
                key={tier.name}
                style={{
                  borderRadius: '20px', padding: '32px 28px',
                  border: tier.popular ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.07)',
                  background: tier.popular
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
                    : 'rgba(255,255,255,0.03)',
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
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{tier.name}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>{tier.tagline}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '42px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
                      ${price}
                    </span>
                    {tier.monthlyPrice > 0 && (
                      <div>
                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>/mo</span>
                        {originalPrice && (
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>
                            ${originalPrice}/mo
                          </div>
                        )}
                      </div>
                    )}
                    {tier.monthlyPrice === 0 && <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>forever</span>}
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
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: 'rgba(255,255,255,0.8)',
                        }),
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {tier.cta}
                </button>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

                {/* Feature list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {tier.features.map((feature, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      {feature.included
                        ? <Check size={15} color="#4ADE80" style={{ flexShrink: 0, marginTop: '1px' }} />
                        : <X size={15} color="rgba(255,255,255,0.18)" style={{ flexShrink: 0, marginTop: '1px' }} />
                      }
                      <span style={{
                        fontSize: '13.5px',
                        color: feature.included ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)',
                        lineHeight: 1.4,
                      }}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: '36px', fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
          All plans include secure data handling. Cancel anytime. No long-term contracts.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
