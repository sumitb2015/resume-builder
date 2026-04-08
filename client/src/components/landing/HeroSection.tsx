import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';

interface Props { onStart: () => void }

const HeroSection: React.FC<Props> = ({ onStart }) => (
  <section id="hero" style={{ position: 'relative', padding: '110px 48px 90px', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
    {/* Background glow */}
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

    {/* Headline */}
    <h1 style={{ fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: 'var(--color-ui-text)', marginBottom: '24px' }}>
      Resumes that
      <br />
      <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        get you hired
      </span>
    </h1>

    {/* Subheading */}
    <p style={{ fontSize: '19px', fontWeight: 400, color: 'var(--color-ui-text-muted)', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 44px' }}>
      Build ATS-optimized resumes with AI-powered writing, 15 professional templates, and real-time live preview. Land more interviews.
    </p>

    {/* CTAs */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <button
        onClick={onStart}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '15px 30px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          border: 'none', color: 'white', fontSize: '15px', fontWeight: 600,
          cursor: 'pointer', letterSpacing: '-0.01em',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
      >
        Build My Resume Free
        <ArrowRight size={16} />
      </button>
      <button
        onClick={() => scrollToSection('templates')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '15px 26px', borderRadius: '10px',
          background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
          color: 'var(--color-ui-text)', fontSize: '15px', fontWeight: 500,
          cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ui-border)'; e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-ui-surface-2)'; e.currentTarget.style.borderColor = 'var(--color-ui-border)'; }}
      >
        View Templates
      </button>
    </div>

    {/* Social proof */}
    <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            width: '34px', height: '34px', borderRadius: '50%',
            marginLeft: i > 0 ? '-10px' : '0',
            border: '2px solid var(--color-ui-bg)',
            background: `hsl(${i * 55 + 200}, 65%, 50%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: 700, color: 'white',
          }}>
            {['S','M','P','J','E'][i]}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[0,1,2,3,4].map(i => <Star key={i} size={13} color="#F59E0B" fill="#F59E0B" />)}
      </div>
      <span style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
        Loved by <strong style={{ color: 'var(--color-ui-text)' }}>50,000+</strong> job seekers
      </span>
    </div>
  </section>
);

export default HeroSection;
