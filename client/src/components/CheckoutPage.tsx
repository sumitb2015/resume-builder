import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, Zap, Crown, Shield, CreditCard, Tag, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { openRazorpay } from '../lib/razorpay';
import { useAuth } from '../contexts/AuthContext';
import { usePlan } from '../contexts/PlanContext';
import { PLAN_PRICES } from '../shared/constants';
import type { Plan } from '../shared/constants';
import UserAvatar from './UserAvatar';

interface Props {
  planTier: Exclude<Plan, 'free'>;
  isAnnual: boolean;
  onBack: () => void;
  onSuccess: () => void;
  onShowProfile: () => void;
}

const CheckoutPage: React.FC<Props> = ({ planTier, isAnnual, onBack, onSuccess, onShowProfile }) => {
  const { currentUser } = useAuth();
  const { updatePlan } = usePlan();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pricing = PLAN_PRICES[planTier];
  const basePrice = isAnnual ? pricing.annualMonthly * 12 : pricing.monthly;
  const discountAmount = appliedDiscount ? Math.round(basePrice * (appliedDiscount.percent / 100)) : 0;
  const finalPrice = basePrice - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    setDiscountError(null);
    try {
      const res = await api.validateDiscount(discountCode.trim());
      if (res.valid) {
        setAppliedDiscount({ code: discountCode.trim(), percent: res.discountPercent });
      } else {
        setDiscountError(res.message || 'Invalid discount code');
      }
    } catch (err) {
      setDiscountError('Failed to validate code. Try again.');
    } finally {
      setValidatingCode(false);
    }
  };

  const handlePayment = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const order = await api.createOrder({
        userId: currentUser.uid,
        planTier: planTier,
        isAnnual: isAnnual,
        discountCode: appliedDiscount?.code,
      });

      const rawKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!rawKeyId) throw new Error('Razorpay Key ID is not configured.');

      await openRazorpay({
        key: rawKeyId.trim(),
        amount: order.amount,
        currency: order.currency,
        name: 'BespokeCV',
        description: `${planTier.charAt(0).toUpperCase() + planTier.slice(1)} Plan - ${isAnnual ? 'Annual' : 'Monthly'}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planTier: planTier,
              userId: currentUser.uid,
              isAnnual: isAnnual
            });

            if (verifyRes.success) {
              await new Promise(resolve => setTimeout(resolve, 1500));
              await updatePlan();
              onSuccess();
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('An error occurred during verification. If money was deducted, please contact support.');
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
      toast.error(`Payment initiation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PlanIcon = planTier === 'ultimate' ? Crown : planTier === 'pro' ? Zap : Shield;
  const planColor = planTier === 'ultimate' ? '#C084FC' : planTier === 'pro' ? '#818CF8' : '#F59E0B';

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-ui-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '24px 16px' : '40px 24px',
      position: 'relative'
    }}>
      <div style={{ 
        position: 'fixed', 
        top: isMobile ? '16px' : '20px', 
        right: isMobile ? '16px' : '24px',
        zIndex: 100
      }}>
        <UserAvatar onClick={onShowProfile} showBadge={!isMobile} />
      </div>

      <div style={{ maxWidth: '800px', width: '100%', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? '24px' : '32px' }}>
        {/* Left Side: Summary */}
        <div>
          <div style={isMobile ? {
            position: 'sticky', top: 0, zIndex: 100, background: 'var(--color-ui-bg)',
            marginTop: '-24px', marginLeft: '-16px', marginRight: '-16px', marginBottom: '20px',
            padding: '16px', borderBottom: '1px solid var(--color-ui-border)'
          } : {}}>
            <button 
              onClick={onBack}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                background: 'transparent', border: 'none', color: 'var(--color-ui-text-muted)', 
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: isMobile ? '0' : '32px',
                padding: 0
              }}
            >
              <ChevronLeft size={16} /> Back to plans
            </button>
          </div>

          <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: isMobile ? '24px' : '32px' }}>
            Complete your upgrade
          </h1>

          <div style={{ 
            background: 'var(--color-ui-surface)', borderRadius: '16px', border: '1px solid var(--color-ui-border)',
            padding: isMobile ? '20px' : '24px', marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ 
                width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '12px', background: `${planColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: planColor
              }}>
                <PlanIcon size={isMobile ? 20 : 24} />
              </div>
              <div>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 700, color: 'var(--color-ui-text)' }}>
                  {planTier.charAt(0).toUpperCase() + planTier.slice(1)} Plan
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>
                  Billing {isAnnual ? 'annually (Save ~20%)' : 'monthly'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Everything included in your tier',
                'Cancel anytime with no hassle',
                'Priority support access',
                'Secure data encryption'
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Check size={14} color="#4ADE80" />
                  <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-ui-text-muted)', fontSize: '12px' }}>
            <Shield size={14} />
            Secure 256-bit SSL encrypted payment
          </div>
        </div>

        {/* Right Side: Payment Info */}
        <div style={{ 
          background: 'var(--color-ui-surface)', borderRadius: '24px', border: '1px solid var(--color-ui-border)',
          padding: isMobile ? '24px' : '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '16px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-ui-text-muted)' }}>
                {planTier.charAt(0).toUpperCase() + planTier.slice(1)} ({isAnnual ? 'Annual' : 'Monthly'})
              </span>
              <span style={{ color: 'var(--color-ui-text)', fontWeight: 600 }}>₹{basePrice}</span>
            </div>

            {appliedDiscount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4ADE80' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tag size={12} /> Discount ({appliedDiscount.percent}%)
                </span>
                <span style={{ fontWeight: 600 }}>-₹{discountAmount}</span>
              </div>
            )}

            <div style={{ height: '1px', background: 'var(--color-ui-border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)' }}>Total</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.02em' }}>
                  ₹{finalPrice}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>including taxes</div>
              </div>
            </div>
          </div>

          {/* Discount Input */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} /> HAVE A DISCOUNT CODE?
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={discountCode} 
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter code"
                disabled={appliedDiscount !== null || validatingCode}
                style={{ 
                  flex: 1, padding: '10px 14px', borderRadius: '10px', 
                  background: 'var(--color-ui-bg)', border: '1px solid var(--color-ui-border)',
                  color: 'var(--color-ui-text)', fontSize: '14px', outline: 'none'
                }}
              />
              {appliedDiscount ? (
                <button 
                  onClick={() => { setAppliedDiscount(null); setDiscountCode(''); }}
                  style={{ 
                    padding: '10px 16px', borderRadius: '10px', 
                    background: 'rgba(248,81,73,0.1)', border: 'none', color: '#F85149', 
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              ) : (
                <button 
                  onClick={handleApplyDiscount}
                  disabled={!discountCode || validatingCode}
                  style={{ 
                    padding: '10px 20px', borderRadius: '10px', 
                    background: 'var(--color-ui-accent)', border: 'none', color: 'white', 
                    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    opacity: (!discountCode || validatingCode) ? 0.6 : 1
                  }}
                >
                  {validatingCode ? <Loader2 size={16} className="spin" /> : 'Apply'}
                </button>
              )}
            </div>
            {discountError && (
              <div style={{ color: '#F85149', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={12} /> {discountError}
              </div>
            )}
            {appliedDiscount && (
              <div style={{ color: '#4ADE80', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <Check size={12} /> Discount "{appliedDiscount.code}" applied!
              </div>
            )}
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            style={{ 
              width: '100%', padding: '16px', borderRadius: '14px', 
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', border: 'none', color: 'white', 
              fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'transform 0.2s',
              opacity: loading ? 0.8 : 1
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <Loader2 size={20} className="spin" />
            ) : (
              <>
                <CreditCard size={20} />
                Pay with Razorpay
              </>
            )}
          </button>
          
          <p style={{ textAlign: 'center', color: 'var(--color-ui-text-dim)', fontSize: '12px', marginTop: '16px' }}>
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
