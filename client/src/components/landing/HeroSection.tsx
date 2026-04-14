import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Sparkles } from 'lucide-react';

interface Props { onStart: () => void }

const CAROUSEL_IMAGES = [
  { src: '/product.png',  alt: 'BespokeCV Resume Editor Dashboard' },
  { src: '/product2.png', alt: 'BespokeCV AI Resume Tailoring' },
  { src: '/product3.png', alt: 'BespokeCV Job-Specific Optimization' },
];

const HeroSection: React.FC<Props> = ({ onStart }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide(i => (i + 1) % CAROUSEL_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section id="hero" style={{
      position: 'relative',
      padding: isMobile ? '80px 20px 60px' : '110px 48px 90px',
      maxWidth: '1200px',
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
          Trusted by job seekers across India
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
        Increase your interview
        <br />
        <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          chances instantly
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
        Get hired faster with our AI-powered resume builder. Beat the ATS, tailor your application to any job description, and export a pixel-perfect PDF in minutes.
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
          Build My Resume — Free
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/templates')}
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

      {/* Risk reduction */}
      <p style={{ marginTop: '14px', fontSize: isMobile ? '11.5px' : '12.5px', color: 'var(--color-ui-text-dim)', letterSpacing: '0.01em' }}>
        No credit card required · Free forever
      </p>

      {/* Social proof */}
      <div style={{ marginTop: isMobile ? '28px' : '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
          Join professionals landing interviews
        </span>
      </div>

      {/* Product Demo Screenshot */}
      <div style={{
        marginTop: isMobile ? '40px' : '70px',
        position: 'relative',
      }}>
        {/* Ambient glow behind the frame */}
        <div style={{
          position: 'absolute',
          inset: '-30px',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.28) 0%, rgba(168,85,247,0.16) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Glassmorphism frame */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.4)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 40px 80px -10px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.18)',
          background: 'rgba(13,17,23,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: '6px',
        }}>
          {/* Browser chrome */}
          <div style={{
            background: 'rgba(33,38,45,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px 14px 0 0',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
            <div style={{
              flex: 1, marginLeft: '12px', height: '24px', borderRadius: '7px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                app.bespokecv.com
              </span>
            </div>
          </div>

          {/* Carousel images */}
          <div
            style={{
              position: 'relative',
              borderRadius: '0 0 14px 14px',
              overflow: 'hidden',
              aspectRatio: '2560 / 1280',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {CAROUSEL_IMAGES.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'top left',
                  opacity: i === currentSlide ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                }}
              />
            ))}

            {/* Bottom fade overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px',
              background: 'linear-gradient(to bottom, transparent, rgba(13,17,23,0.65))',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* Dot indicators */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '6px', zIndex: 2,
            }}>
              {CAROUSEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    width: i === currentSlide ? '20px' : '6px', height: '6px',
                    borderRadius: '3px', border: 'none', padding: 0, cursor: 'pointer',
                    background: i === currentSlide ? '#818CF8' : 'rgba(255,255,255,0.35)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
