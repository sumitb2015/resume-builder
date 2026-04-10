import React, { useEffect, useState } from 'react';
import { Zap, LogOut, Shield, Crown, Sun, Moon, Layout, Sparkles, CreditCard, BookOpen } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../contexts/PlanContext';
import { useTheme } from '../../contexts/ThemeContext';
import BreadcrumbNav from '../BreadcrumbNav';

interface Props { 
  onStart: () => void;
  isBlogPage?: boolean;
  onBackToHome?: () => void;
  onOpenBlog?: () => void;
  view?: any;
  currentLabel?: string;
}

const PLAN_BADGE_CONFIG = {
  free:    { label: 'Free',     color: '#94A3B8', bg: 'rgba(148,163,184,0.15)', icon: (size: number) => <Shield size={size} /> },
  basic:   { label: 'Basic',    color: '#FCD34D', bg: 'rgba(245,158,11,0.15)', icon: (size: number) => <Shield size={size} /> },
  pro:     { label: 'Pro',      color: '#818CF8', bg: 'rgba(99,102,241,0.15)', icon: (size: number) => <Zap size={size} /> },
  ultimate:{ label: 'Ultimate', color: '#C084FC', bg: 'rgba(168,85,247,0.15)', icon: (size: number) => <Crown size={size} /> },
} as const;

const NavBar: React.FC<Props> = ({ onStart, isBlogPage, onBackToHome, onOpenBlog, currentLabel }) => {
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
    { label: 'Templates', id: 'templates', icon: <Layout size={15} /> },
    { label: 'AI Features', id: 'ai-features', icon: <Sparkles size={15} /> },
    { label: 'Pricing', id: 'pricing', icon: <CreditCard size={15} /> },
  ];

  const badge = plan ? PLAN_BADGE_CONFIG[plan] : null;

  const iconBtnStyle: React.CSSProperties = {
    padding: '8px', borderRadius: '10px',
    border: '1px solid var(--color-ui-border)',
    background: 'transparent', color: 'var(--color-ui-text-muted)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const linkBtnStyle: React.CSSProperties = {
    padding: '8px 14px', borderRadius: '10px', border: '1px solid transparent', 
    background: 'transparent',
    fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text-muted)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.01em',
  };

  const handleLogoClick = () => {
    if (isBlogPage && onBackToHome) {
      onBackToHome();
    } else {
      scrollToSection('hero');
    }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '72px',
      backgroundColor: scrollY > 40 ? 'var(--color-ui-nav-scroll)' : 'transparent',
      borderBottom: scrollY > 40 ? '1px solid var(--color-ui-border)' : '1px solid transparent',
      backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Scroll progress bar */}
      {scrollPct > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2.5px',
          background: 'rgba(255,255,255,0.05)', zIndex: 1,
        }}>
          <div style={{
            height: '100%', width: `${scrollPct}%`,
            background: 'linear-gradient(90deg, #6366F1, #A855F7, #EC4899)',
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
            transition: 'width 0.15s linear',
          }} />
        </div>
      )}
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleLogoClick}>
        <div style={{ 
          width: '34px', height: '34px', 
          background: 'linear-gradient(135deg, #6366F1, #A855F7)', 
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <span style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--color-ui-text)' }}>
          Bespoke<span style={{ color: '#818CF8' }}>CV</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '6px', borderRadius: '16px',
        background: scrollY > 40 ? 'rgba(255,255,255,0.03)' : 'transparent',
        border: scrollY > 40 ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}>
        {isBlogPage ? (
          <BreadcrumbNav 
            view="blog" 
            onNavigate={(v) => { if (v === 'landing') onBackToHome?.(); else if (v === 'blog') onOpenBlog?.(); }} 
            currentLabel={currentLabel}
          />
        ) : (
          <>
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                style={linkBtnStyle}
                onMouseEnter={e => { 
                  e.currentTarget.style.color = 'var(--color-ui-text)'; 
                  e.currentTarget.style.background = 'var(--color-ui-surface-2)';
                  e.currentTarget.style.borderColor = 'var(--color-ui-border)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.color = 'var(--color-ui-text-muted)'; 
                  e.currentTarget.style.background = 'transparent'; 
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ opacity: 0.7 }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <button
              onClick={onOpenBlog}
              style={linkBtnStyle}
              onMouseEnter={e => { 
                e.currentTarget.style.color = 'var(--color-ui-text)'; 
                e.currentTarget.style.background = 'var(--color-ui-surface-2)';
                e.currentTarget.style.borderColor = 'var(--color-ui-border)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.color = 'var(--color-ui-text-muted)'; 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ opacity: 0.7 }}><BookOpen size={15} /></span>
              Blog
            </button>
          </>
        )}
      </div>

      {/* Right side: theme toggle + CTA / User section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={iconBtnStyle}
          onMouseEnter={e => { 
            e.currentTarget.style.color = 'var(--color-ui-text)'; 
            e.currentTarget.style.background = 'var(--color-ui-surface-2)';
            e.currentTarget.style.borderColor = 'var(--color-ui-text-muted)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.color = 'var(--color-ui-text-muted)'; 
            e.currentTarget.style.background = 'transparent'; 
            e.currentTarget.style.borderColor = 'var(--color-ui-border)';
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {currentUser ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px', borderRadius: '12px', background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)' }}>
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName ?? 'User'}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid var(--color-ui-border)' }}
                />
              ) : (
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>
                  {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
                </div>
              )}
              
              {badge && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', borderRadius: '6px',
                  background: badge.bg, border: `1px solid ${badge.color}30`,
                }}>
                  <span style={{ color: badge.color, display: 'flex', alignItems: 'center' }}>{badge.icon(10)}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: badge.color, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{badge.label}</span>
                </div>
              )}
            </div>

            <button
              onClick={onStart}
              style={{
                padding: '10px 24px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; }}
            >
              Open Builder
            </button>
            <button
              onClick={() => signOut()}
              title="Sign out"
              style={iconBtnStyle}
              onMouseEnter={e => { 
                e.currentTarget.style.color = 'var(--color-danger)'; 
                e.currentTarget.style.background = 'rgba(248, 81, 73, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(248, 81, 73, 0.2)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.color = 'var(--color-ui-text-muted)'; 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.borderColor = 'var(--color-ui-border)';
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={onStart}
            style={{
              padding: '10px 24px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '-0.01em',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; }}
          >
            Get Started Free
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
