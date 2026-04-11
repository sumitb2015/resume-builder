import React from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';

interface Props { onStart: () => void }

const HeroSection: React.FC<Props> = ({ onStart }) => (
  <section id="hero" style={{ position: 'relative', padding: '110px 48px 90px', maxWidth: '960px', margin: '0 auto', textAlign: 'center', overflow: 'hidden' }}>

    {/* Animated gradient mesh blobs */}
    <div style={{
      position: 'absolute', top: '-60px', left: '50%',
      width: '900px', height: '560px',
      background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 68%)',
      pointerEvents: 'none', animation: 'float 10s ease-in-out infinite',
    }} />
    <div style={{
      position: 'absolute', top: '100px', left: '50%',
      width: '700px', height: '350px',
      background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.13) 0%, transparent 68%)',
      pointerEvents: 'none', animation: 'floatSlow 14s ease-in-out infinite',
    }} />
    <div style={{
      position: 'absolute', top: '80px', left: '25%',
      width: '380px', height: '280px',
      background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.07) 0%, transparent 70%)',
      pointerEvents: 'none', animation: 'floatSlow 18s ease-in-out infinite reverse',
    }} />

    {/* Trust badge */}
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '7px 18px', borderRadius: '100px', marginBottom: '28px',
      background: 'rgba(99,102,241,0.08)',
      border: '1px solid rgba(99,102,241,0.28)',
      boxShadow: '0 0 20px rgba(99,102,241,0.12)',
    }}>
      <Sparkles size={12} color="#818CF8" />
      <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.01em' }}>
        The #1 AI Resume Builder for <strong style={{ color: '#A78BFA' }}>India</strong>
      </span>
    </div>

    {/* Headline */}
    <h1 style={{ fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: 'var(--color-ui-text)', marginBottom: '24px' }}>
      The AI Resume Builder
      <br />
      <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        for Indian Job Seekers
      </span>
    </h1>

    {/* Subheading */}
    <p style={{ fontSize: '19px', fontWeight: 400, color: 'var(--color-ui-text-muted)', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 44px' }}>
      Build ATS-optimized resumes with AI writing, 15 professional templates, and real-time preview. Trusted by 50,000+ job seekers in India.
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
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(99,102,241,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
      >
        Build My Resume
        <ArrowRight size={16} />
      </button>
      <button
        onClick={() => scrollToSection('templates')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '15px 26px', borderRadius: '10px',
          background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
          color: 'var(--color-ui-text)', fontSize: '15px', fontWeight: 500,
          cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ui-border)'; e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-ui-surface-2)'; e.currentTarget.style.borderColor = 'var(--color-ui-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
