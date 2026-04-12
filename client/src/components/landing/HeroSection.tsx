import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';
import { templates } from '../../templates';

interface Props { onStart: () => void }

const HeroSection: React.FC<Props> = ({ onStart }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="hero" style={{ 
      position: 'relative', 
      padding: isMobile ? '80px 20px 60px' : '110px 48px 90px', 
      maxWidth: '960px', 
      margin: '0 auto', 
      textAlign: 'center', 
      overflow: 'hidden' 
    }}>

      {/* Animated gradient mesh blobs */}
      <div style={{
        position: 'absolute', top: '-60px', left: '50%',
        width: isMobile ? '400px' : '900px', height: isMobile ? '250px' : '560px',
        background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, transparent 68%)',
        pointerEvents: 'none', animation: 'float 10s ease-in-out infinite',
        transform: 'translateX(-50%)',
      }} />
      <div style={{
        position: 'absolute', top: '100px', left: '50%',
        width: isMobile ? '300px' : '700px', height: isMobile ? '150px' : '350px',
        background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.13) 0%, transparent 68%)',
        pointerEvents: 'none', animation: 'floatSlow 14s ease-in-out infinite',
        transform: 'translateX(-50%)',
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
        <span style={{ fontSize: isMobile ? '11px' : '12.5px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.01em' }}>
          Trusted by <strong style={{ color: '#A78BFA' }}>50,000+</strong> job seekers worldwide
        </span>
      </div>

      {/* Headline */}
      <h1 style={{ 
        fontSize: isMobile ? '36px' : 'clamp(48px, 7vw, 80px)', 
        fontWeight: 800, 
        letterSpacing: '-0.04em', 
        lineHeight: isMobile ? 1.1 : 1.0, 
        color: 'var(--color-ui-text)', 
        marginBottom: '24px' 
      }}>
        The AI Resume Builder
        <br />
        <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          that gets you hired
        </span>
      </h1>

      {/* Subheading */}
      <p style={{ 
        fontSize: isMobile ? '16px' : '19px', 
        fontWeight: 400, 
        color: 'var(--color-ui-text-muted)', 
        lineHeight: 1.65, 
        maxWidth: '640px', 
        margin: '0 auto 44px' 
      }}>
        Build ATS-optimized resumes in minutes. Start from scratch with AI, import your LinkedIn, or upload a PDF. {templates.length}+ professional templates with real-time live preview.
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onStart}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: isMobile ? '12px 24px' : '15px 30px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            border: 'none', color: 'white', fontSize: isMobile ? '14px' : '15px', fontWeight: 600,
            cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(99,102,241,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
        >
          Start Building
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => scrollToSection('templates')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: isMobile ? '12px 20px' : '15px 26px', borderRadius: '10px',
            background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
            color: 'var(--color-ui-text)', fontSize: isMobile ? '14px' : '15px', fontWeight: 500,
            cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ui-border)'; e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-ui-surface-2)'; e.currentTarget.style.borderColor = 'var(--color-ui-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          View Templates
        </button>
      </div>

      {/* Social proof */}
      <div style={{ marginTop: isMobile ? '40px' : '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: isMobile ? '28px' : '34px', height: isMobile ? '28px' : '34px', borderRadius: '50%',
              marginLeft: i > 0 ? '-10px' : '0',
              border: '2px solid var(--color-ui-bg)',
              background: `hsl(${i * 55 + 200}, 65%, 50%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isMobile ? '9px' : '11px', fontWeight: 700, color: 'white',
            }}>
              {['S','M','P','J','E'][i]}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0,1,2,3,4].map(i => <Star key={i} size={isMobile ? 11 : 13} color="#F59E0B" fill="#F59E0B" />)}
        </div>
        <span style={{ fontSize: isMobile ? '12px' : '13.5px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
          Loved by <strong style={{ color: 'var(--color-ui-text)' }}>50,000+</strong>
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
