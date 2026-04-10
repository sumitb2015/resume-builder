import React, { useState } from 'react';
import { Check, X, FileText, Zap, Palette, Award, Upload, Link2, Download } from 'lucide-react';
import { api } from '../../lib/api';
import { openRazorpay } from '../../lib/razorpay';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../contexts/PlanContext';

interface Props { onStart: () => void }

const TIERS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    period: 'forever',
    tagline: 'Perfect for getting started',
    cta: 'Get Started',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: '1 professional template', included: true, Icon: Palette },
      { label: 'Downloads in TXT format only', included: true, Icon: Download },
      { label: 'Save 1 resume', included: true, Icon: FileText },
      { label: 'Limited resume sharing', included: true, Icon: Link2 },
      { label: 'Basic analytics', included: true, Icon: Award },
      { label: 'PDF export', included: false, Icon: Download },
      { label: 'AI writing tools', included: false, Icon: Zap },
      { label: 'Advanced templates', included: false, Icon: Palette },
    ],
  },
  {
    name: 'Basic',
    price: { monthly: 399, annual: 319 },
    period: '14 days',
    tagline: 'Try the essentials, no commitment',
    cta: 'Start 14-Day Trial',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: '3 professional templates', included: true, Icon: Palette },
      { label: 'Live preview & editor', included: true, Icon: FileText },
      { label: 'PDF export (1 per day)', included: true, Icon: Download },
      { label: 'ATS score (template-based)', included: true, Icon: Award },
      { label: 'AI bullet point writer (3/day)', included: true, Icon: Zap },
      { label: 'All 15 premium templates', included: false, Icon: Palette },
      { label: 'AI summary writer', included: false, Icon: Zap },
      { label: 'Skills finder', included: false, Icon: Award },
      { label: 'Job tailoring (JD matching)', included: false, Icon: FileText },
      { label: 'Resume import & LinkedIn sync', included: false, Icon: Upload },
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 599, annual: 479 },
    period: 'mo',
    tagline: 'Core AI writing tools for active job seekers',
    cta: 'Start Pro',
    ctaStyle: 'primary' as const,
    popular: true,
    features: [
      { label: 'All 15 premium templates', included: true, Icon: Palette },
      { label: 'Live preview & editor', included: true, Icon: FileText },
      { label: 'Unlimited PDF exports', included: true, Icon: Download },
      { label: 'Dynamic ATS score with JD matching', included: true, Icon: Award },
      { label: 'AI bullet point writer (unlimited)', included: true, Icon: Zap },
      { label: 'AI summary writer', included: true, Icon: Zap },
      { label: 'Skills finder', included: true, Icon: Award },
      { label: 'Color & style customization', included: true, Icon: Palette },
      { label: 'Resume import from PDF / DOCX', included: true, Icon: Upload },
      { label: 'Job tailoring (full resume rewrite)', included: false, Icon: FileText },
    ],
  },
  {
    name: 'Ultimate',
    price: { monthly: 999, annual: 799 },
    period: 'mo',
    tagline: 'Pro + advanced AI workflows & import tools',
    cta: 'Go Ultimate',
    ctaStyle: 'secondary' as const,
    popular: false,
    features: [
      { label: 'Everything in Pro', included: true, Icon: Award },
      { label: 'Job tailoring — AI rewrites resume to match JD', included: true, Icon: FileText },
      { label: 'Diff review (before/after on every change)', included: true, Icon: Zap },
      { label: 'Resume import from PDF / DOCX', included: true, Icon: Upload },
      { label: 'LinkedIn profile import', included: true, Icon: Link2 },
      { label: 'AI improvement suggestions on import', included: true, Icon: Zap },
      { label: 'Priority PDF generation', included: true, Icon: Download },
      { label: 'Email support', included: true, Icon: Award },
      { label: 'Drag & drop section reordering', included: true, Icon: Palette },
      { label: 'Early access to new templates', included: true, Icon: Palette },
    ],
  },
];

const PricingSection: React.FC<Props> = ({ onStart }) => {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { updatePlan } = usePlan();

  const handleSelectPlan = async (tier: typeof TIERS[0]) => {
    if (!currentUser) {
      onStart(); // Redirect to login
      return;
    }

    if (tier.name === 'Free') {
      onStart(); // Just go to dashboard
      return;
    }

    const price = annual && tier.period !== '14 days' ? tier.price.annual : tier.price.monthly;
    
    try {
      setLoading(tier.name);
      const isAnnualPlan = annual && tier.period !== '14 days';
      const order = await api.createOrder(price, 'INR', currentUser.uid, tier.name.toLowerCase(), isAnnualPlan);
      
      const rawKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!rawKeyId) {
        throw new Error('Razorpay Key ID is not configured (VITE_RAZORPAY_KEY_ID is missing from .env).');
      }

      const keyId = rawKeyId.trim();

      console.log(`[Razorpay Debug] Initiating payment for order: ${order.id} with key: ${keyId.substring(0, 8)}...`);

      await openRazorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'BespokeCV',
        description: `${tier.name} Plan - ${isAnnualPlan ? 'Annual' : 'Monthly'}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planTier: tier.name.toLowerCase(),
              userId: currentUser.uid,
              isAnnual: isAnnualPlan
            });

            if (verifyRes.success) {
              // Wait a moment for Firestore to propagate before fetching
              await new Promise(resolve => setTimeout(resolve, 1500));
              await updatePlan();
              alert(`Success! You are now on the ${tier.name} plan.`);
              window.location.reload(); 
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('An error occurred during verification. If money was deducted, please contact support.');
          }
        },
        prefill: {
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        },
        theme: {
          color: '#6366F1',
        },
      });
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', marginBottom: '32px' }}>
            Try Basic for 14 days. Upgrade to Pro when you need more power.
          </p>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '6px 16px 6px 16px', borderRadius: '100px',
            background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
          }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: annual ? 'var(--color-ui-text-muted)' : 'var(--color-ui-text)' }}>Monthly</span>
            <button
              onClick={() => setAnnual(v => !v)}
              aria-label="Toggle annual billing"
              style={{
                width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: annual ? 'var(--color-ui-accent)' : 'var(--color-ui-border)',
                position: 'relative', transition: 'background 0.25s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: '3px', left: annual ? '23px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                transition: 'left 0.25s', display: 'block',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
            <span style={{ fontSize: '13px', fontWeight: 500, color: annual ? 'var(--color-ui-text)' : 'var(--color-ui-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Annual
              <span style={{
                fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                background: 'rgba(74,222,128,0.15)', color: '#4ADE80',
                border: '1px solid rgba(74,222,128,0.25)',
              }}>Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          alignItems: 'stretch' 
        }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="pricing-card"
              style={{
                borderRadius: '20px', padding: '32px 24px',
                border: tier.popular ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--color-ui-border)',
                background: tier.popular
                  ? 'linear-gradient(145deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))'
                  : 'var(--color-ui-surface)',
                position: 'relative', display: 'flex', flexDirection: 'column',
                boxShadow: tier.popular
                  ? '0 0 0 1px rgba(99,102,241,0.3), 0 0 40px rgba(99,102,241,0.18)'
                  : 'none',
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  padding: '5px 18px', borderRadius: '100px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  fontSize: '11.5px', fontWeight: 700, color: 'white',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.45)', whiteSpace: 'nowrap',
                }}>
                  ★ Most Popular
                </div>
              )}

              {/* Tier header */}
              <div style={{ marginBottom: '24px', minHeight: '124px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '4px' }}>{tier.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', marginBottom: '18px' }}>{tier.tagline}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text-muted)', alignSelf: 'flex-start', marginTop: '10px' }}>₹</span>
                  <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em' }}>
                    {annual && tier.period !== '14 days' ? tier.price.annual : tier.price.monthly}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--color-ui-text-dim)' }}>/{tier.period}</span>
                </div>
                <div style={{ height: '20px' }}>
                  {annual && tier.period !== '14 days' && tier.price.monthly > 0 && (
                    <p style={{ fontSize: '11.5px', color: '#4ADE80', marginTop: '4px', fontWeight: 600 }}>
                      Save ₹{(tier.price.monthly - tier.price.annual) * 12}/yr vs monthly
                    </p>
                  )}
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={() => handleSelectPlan(tier)}
                disabled={loading !== null}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  marginBottom: '24px', fontSize: '14.5px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  opacity: loading ? 0.7 : 1,
                  ...(tier.ctaStyle === 'primary'
                    ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', color: 'white', boxShadow: '0 6px 24px rgba(99,102,241,0.4)' }
                    : { background: 'transparent', border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)' }),
                }}
                onMouseEnter={e => {
                  if (loading) return;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  if (tier.ctaStyle === 'primary') e.currentTarget.style.boxShadow = '0 10px 32px rgba(99,102,241,0.5)';
                }}
                onMouseLeave={e => {
                  if (loading) return;
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (tier.ctaStyle === 'primary') e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.4)';
                }}
              >
                {loading === tier.name ? 'Processing...' : tier.cta}
              </button>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--color-ui-border)', marginBottom: '20px' }} />

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                {tier.features.map((feature, fi) => (
                  <div
                    key={fi}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 8px', borderRadius: '6px',
                      background: fi % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                    }}
                  >
                    {feature.included
                      ? <Check size={14} color="#4ADE80" style={{ flexShrink: 0 }} />
                      : <X size={14} color="var(--color-ui-text-dim)" style={{ flexShrink: 0 }} />
                    }
                    <span style={{
                      fontSize: '13px',
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
        <p style={{ textAlign: 'center', marginTop: '48px', fontSize: '13px', color: 'var(--color-ui-text-dim)' }}>
          All plans include secure data handling. Cancel anytime. No long-term contracts.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
