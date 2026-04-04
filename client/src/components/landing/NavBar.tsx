import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';

interface Props { onStart: () => void }

const NavBar: React.FC<Props> = ({ onStart }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = document.querySelector('.landing-page') as HTMLElement | null;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Templates', id: 'templates' },
    { label: 'AI Features', id: 'ai-features' },
    { label: 'Pricing', id: 'pricing' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: '64px',
      backgroundColor: scrollY > 40 ? 'rgba(6,6,9,0.92)' : 'transparent',
      borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
      transition: 'all 0.3s',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
          Bespoke<span style={{ color: '#818CF8' }}>CV</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent',
              fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          padding: '9px 22px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          border: 'none', color: 'white', fontSize: '14px', fontWeight: 600,
          cursor: 'pointer', letterSpacing: '-0.01em',
          boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
          transition: 'opacity 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Get Started →
      </button>
    </nav>
  );
};

export default NavBar;
