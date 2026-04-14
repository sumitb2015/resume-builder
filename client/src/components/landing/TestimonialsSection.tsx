import React, { useState, useEffect } from 'react';
import { Star, Linkedin, ShieldCheck } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Aman Sharma',
    role: 'Software Engineer',
    company: 'Zomato',
    initials: 'AS',
    avatarColor: '#6366F1',
    stars: 5,
    text: 'BespokeCV helped me land 3 interviews in my first week. The AI job tailor feature rewrote my bullets to perfectly match each JD. Got an offer from Zomato within 2 months.',
    verified: true
  },
  {
    name: 'Siddharth Nair',
    role: 'Product Manager',
    company: 'TCS',
    initials: 'SN',
    avatarColor: '#10B981',
    stars: 5,
    text: 'My ATS score went from 62 to 94 after using the tailoring tool. Recruiters started calling back within days. The Pro plan paid for itself with my first interview.',
    verified: true
  },
  {
    name: 'Priya Patel',
    role: 'Data Scientist',
    company: 'Flipkart',
    initials: 'PP',
    avatarColor: '#F59E0B',
    stars: 5,
    text: 'The bullet point writer captures your experience better than you write it yourself. Landed a senior role 40% above my previous salary. The skills finder alone is worth it.',
    verified: true
  },
  {
    name: 'Ananya Iyer',
    role: 'UX Designer',
    company: 'Infosys',
    initials: 'AI',
    avatarColor: '#EC4899',
    stars: 5,
    text: 'The Creative and Magazine templates are stunning. My resume finally looks as polished as my portfolio. Three callbacks in the first week after switching templates.',
    verified: true
  },
  {
    name: 'Sneha Kapoor',
    role: 'Marketing Director',
    company: 'Nykaa',
    initials: 'SK',
    avatarColor: '#A855F7',
    stars: 5,
    text: "The Executive template with the gold accent is exactly what a senior hire's resume should look like. The AI summary writer nailed my 15-year career story in 3 sentences.",
    verified: true
  },
  {
    name: 'Vikram Mehta',
    role: 'DevOps Engineer',
    company: 'Razorpay',
    initials: 'VM',
    avatarColor: '#38BDF8',
    stars: 5,
    text: 'Developer template is perfect for technical roles. The ATS checker told me exactly which keywords I was missing. Went from zero callbacks to 5 interviews in two weeks.',
    verified: true
  },
];

const TestimonialCard: React.FC<{ t: typeof TESTIMONIALS[0] }> = ({ t }) => (
  <div
    style={{
      padding: '28px', borderRadius: '20px',
      background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', flexDirection: 'column', gap: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    }}
    onMouseEnter={e => { 
      e.currentTarget.style.borderColor = '#818CF850'; 
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={e => { 
      e.currentTarget.style.borderColor = 'var(--color-ui-border)'; 
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
    }}
  >
    {/* Top Row: Stars & Verified */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
        ))}
      </div>
      {t.verified && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>
          <ShieldCheck size={14} /> VERIFIED
        </div>
      )}
    </div>

    {/* Quote */}
    <p style={{ fontSize: '14.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, flex: 1, fontStyle: 'italic' }}>
      "{t.text}"
    </p>

    {/* Author */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--color-ui-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: t.avatarColor + '20', border: `1.5px solid ${t.avatarColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: t.avatarColor,
          flexShrink: 0,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '1px' }}>{t.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>
            {t.role} · <span style={{ color: 'var(--color-ui-text-muted)' }}>{t.company}</span>
          </div>
        </div>
      </div>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-ui-text-dim)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0A66C2'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ui-text-dim)'}>
        <Linkedin size={16} />
      </a>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024 && window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      padding: isMobile ? '80px 20px' : '120px 48px',
      background: 'var(--color-ui-surface-2)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '56px' : '80px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            marginBottom: '20px',
          }}>
            <ShieldCheck size={13} color="#10B981" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', letterSpacing: '0.05em' }}>SUCCESS STORIES</span>
          </div>
          <h2 style={{ fontSize: isMobile ? '32px' : 'clamp(36px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-ui-text)', marginBottom: '20px', lineHeight: 1.1 }}>
            Trusted by professionals <span style={{ color: '#818CF8' }}>landing top roles</span>
          </h2>
          <p style={{ fontSize: isMobile ? '16px' : '19px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Join thousands of job seekers who have accelerated their career with BespokeCV's AI-powered tools.
          </p>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? (isTablet ? 'repeat(2, 1fr)' : '1fr') : 'repeat(3, 1fr)', 
          gap: '24px' 
        }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
