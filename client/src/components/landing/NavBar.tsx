import React, { useEffect, useState } from 'react';
import { Zap, LogOut, Shield, Crown, Sun, Moon } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../contexts/PlanContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Props { onStart: () => void }

const PLAN_BADGE_CONFIG = {
  basic:   { label: 'Basic',    color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: (size: number) => <Shield size={size} /> },
  pro:     { label: 'Pro',      color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: (size: number) => <Zap size={size} /> },
  ultimate:{ label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: (size: number) => <Crown size={size} /> },
} as const;

const NavBar: React.FC<Props> = ({ onStart }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const { currentUser, signOut } = useAuth();
  const { plan } = usePlan();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const el = document.querySelector('.landing-page') as HTMLElement | null;
    if (!el) return;
    const handler = () => {
      setScrollY(el.scrollTop);
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Templates', id: 'templates' },
    { label: 'AI Features', id: 'ai-features' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const badge = plan ? PLAN_BADGE_CONFIG[plan] : null;

  const iconBtnStyle: React.CSSProperties = {
    padding: '8px', borderRadius: '8px',
    border: '1px solid var(--color-ui-border)',
    background: 'transparent', color: 'var(--color-ui-text-muted)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: '64px',
      backgroundColor: scrollY > 40 ? 'var(--color-ui-nav-scroll)' : 'transparent',
      borderBottom: scrollY > 40 ? '1px solid var(--color-ui-border)' : '1px solid transparent',
      backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
      transition: 'all 0.3s',
    }}>
      {/* Scroll progress bar */}
      {scrollPct > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'var(--color-ui-border)', zIndex: 1,
        }}>
          <div style={{
            height: '100%', width: `${scrollPct}%`,
            background: 'linear-gradient(90deg, #6366F1, #A855F7)',
            transition: 'width 0.1s linear',
          }} />
        </div>
      )}
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
        <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
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
              fontSize: '14px', fontWeight: 500, color: 'var(--color-ui-text-muted)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ui-text)'; e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ui-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Right side: theme toggle + CTA / User section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={iconBtnStyle}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ui-text)'; e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ui-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {currentUser ? (
          <>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName ?? 'User'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--color-ui-border)' }}
              />
            ) : (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white' }}>
                {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
              </div>
            )}

            {badge && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '100px',
                background: badge.bg, border: `1px solid ${badge.color}40`,
              }}>
                <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon(11)}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: badge.color, letterSpacing: '0.03em' }}>{badge.label}</span>
              </div>
            )}

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
              Open Builder →
            </button>
            <button
              onClick={() => signOut()}
              title="Sign out"
              style={iconBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ui-text)'; e.currentTarget.style.background = 'var(--color-ui-surface-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-ui-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={15} />
            </button>
          </>
        ) : (
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
        )}
      </div>
    </nav>
  );
};

export default NavBar;
