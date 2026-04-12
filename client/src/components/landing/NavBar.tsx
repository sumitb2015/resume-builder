import React, { useEffect, useState } from 'react';
import { Zap, LogOut, Sun, Moon, Layout, Sparkles, CreditCard, BookOpen, Menu, X as CloseIcon } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';
import { useAuth } from '../../contexts/AuthContext';
import { usePlan } from '../../contexts/PlanContext';
import { useTheme } from '../../contexts/ThemeContext';
import BreadcrumbNav from '../BreadcrumbNav';
import UserAvatar from '../UserAvatar';

interface Props { 
  onStart: () => void;
  isBlogPage?: boolean;
  onBackToHome?: () => void;
  onOpenBlog?: () => void;
  onShowProfile?: () => void;
  view?: any;
  currentLabel?: string;
}

const NAV_LINKS = [
  { label: 'Templates', id: 'templates', icon: <Layout size={16} /> },
  { label: 'AI Features', id: 'ai-features', icon: <Sparkles size={16} /> },
  { label: 'Pricing', id: 'pricing', icon: <CreditCard size={16} /> },
];

const NavBar: React.FC<Props> = ({ onStart, isBlogPage, onBackToHome, onOpenBlog, onShowProfile, currentLabel }) => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 480);
  const { currentUser, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSmallMobile(window.innerWidth < 480);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const el = document.querySelector('.landing-page') as HTMLElement | null;
    const handler = () => {
      const scrollPos = el ? el.scrollTop : window.scrollY;
      setScrollY(scrollPos);
      const scrollHeight = el ? el.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = el ? el.clientHeight : window.innerHeight;
      const max = scrollHeight - clientHeight;
      setScrollPct(max > 0 ? (scrollPos / max) * 100 : 0);
    };
    
    if (el) el.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('scroll', handler, { passive: true });
    
    handler();
    
    return () => {
      if (el) el.removeEventListener('scroll', handler);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  const iconBtnStyle: React.CSSProperties = {
    padding: isSmallMobile ? '6px' : '8px', borderRadius: '10px',
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
    setMobileMenuOpen(false);
  };

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isSmallMobile ? '0 12px' : (isMobile ? '0 16px' : '0 40px'), height: '72px',
        backgroundColor: (scrollY > 40 || mobileMenuOpen) ? 'var(--color-ui-nav-scroll)' : 'transparent',
        borderBottom: (scrollY > 40 || mobileMenuOpen) ? '1px solid var(--color-ui-border)' : '1px solid transparent',
        backdropFilter: (scrollY > 40 || mobileMenuOpen) ? 'blur(20px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Scroll progress bar */}
        {scrollPct > 0 && !mobileMenuOpen && (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '6px' : '10px', cursor: 'pointer', zIndex: 101 }} onClick={handleLogoClick}>
          <div style={{ 
            width: isSmallMobile ? '28px' : '34px', height: isSmallMobile ? '28px' : '34px', 
            background: 'linear-gradient(135deg, #6366F1, #A855F7)', 
            borderRadius: isSmallMobile ? '8px' : '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>
            <Zap size={isSmallMobile ? 15 : 18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: isSmallMobile ? '16px' : '19px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--color-ui-text)' }}>
            Bespoke<span style={{ color: '#818CF8' }}>CV</span>
          </span>
        </div>

        {/* Desktop Nav links */}
        {!isMobile && (
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
                {NAV_LINKS.map(link => (
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
        )}

        {/* Right side: theme toggle + CTA / User section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '8px' : '12px', zIndex: 101 }}>
          {/* Theme toggle */}
          {!isMobile && (
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
          )}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: isSmallMobile ? '6px' : (isMobile ? '8px' : '12px') }}>
              <UserAvatar 
                onClick={onShowProfile || (() => {})} 
                showBadge={!isMobile} 
              />

              {!isMobile && (
                <button
                  onClick={onStart}
                style={{
                  padding: isSmallMobile ? '8px 12px' : (isMobile ? '8px 16px' : '10px 24px'), borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  border: 'none', color: 'white', fontSize: isSmallMobile ? '12px' : (isMobile ? '13px' : '14px'), fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '-0.01em',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; }}
              >
                {isMobile ? (isSmallMobile ? 'Build' : 'Builder') : 'Open Builder'}
              </button>
              )}
              
              {!isMobile && (
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
              )}
            </div>
          ) : (
            <button
              onClick={onStart}
              style={{
                padding: isSmallMobile ? '8px 12px' : (isMobile ? '8px 16px' : '10px 24px'), borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: 'none', color: 'white', fontSize: isSmallMobile ? '12px' : (isMobile ? '13px' : '14px'), fontWeight: 700,
                cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; }}
            >
              {isMobile ? (isSmallMobile ? 'Start' : 'Get Started') : 'Get Started Free'}
            </button>
          )}

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ ...iconBtnStyle, border: 'none', background: 'var(--color-ui-surface-2)', color: 'var(--color-ui-text)', zIndex: 1001 }}
            >
              {mobileMenuOpen ? <CloseIcon size={isSmallMobile ? 18 : 20} /> : <Menu size={isSmallMobile ? 18 : 20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Dropdown Overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'transparent' }} 
          />
          
          <div style={{
            position: 'fixed', top: '80px', right: '16px',
            width: isSmallMobile ? 'calc(100% - 32px)' : '320px',
            background: 'var(--color-ui-surface)',
            border: '1px solid var(--color-ui-border)',
            borderRadius: '20px',
            zIndex: 999, padding: '16px',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'fadeSlideIn 0.2s ease-out forwards',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Nav Links */}
              {!isBlogPage && NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    ...linkBtnStyle, width: '100%', padding: '12px 16px',
                    background: 'var(--color-ui-surface-2)', borderRadius: '12px',
                    border: '1px solid var(--color-ui-border)', justifyContent: 'flex-start',
                    fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <span style={{ color: 'var(--color-ui-accent)', display: 'flex' }}>{link.icon}</span>
                  {link.label}
                </button>
              ))}
              
              {/* Blog Link */}
              <button
                onClick={() => { onOpenBlog?.(); setMobileMenuOpen(false); }}
                style={{
                  ...linkBtnStyle, width: '100%', padding: '12px 16px',
                  background: 'var(--color-ui-surface-2)', borderRadius: '12px',
                  border: '1px solid var(--color-ui-border)', justifyContent: 'flex-start',
                  fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)',
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}
              >
                <span style={{ color: 'var(--color-ui-accent)', display: 'flex' }}><BookOpen size={16} /></span>
                Blog
              </button>
            </div>

            <div style={{ height: '1px', background: 'var(--color-ui-border)', margin: '12px 0' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text-muted)' }}>Appearance</span>
              <button
                onClick={toggleTheme}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px',
                  borderRadius: '10px', background: 'var(--color-ui-surface-2)',
                  border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)',
                  fontSize: '13px', fontWeight: 700,
                }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                <div style={{ height: '1px', background: 'var(--color-ui-border)', margin: '4px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--color-ui-surface-2)', borderRadius: '14px', border: '1px solid var(--color-ui-border)' }}>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName ?? 'User'}
                      style={{ width: '36px', height: '36px', borderRadius: '10px' }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: 'white' }}>
                      {(currentUser.displayName ?? currentUser.email ?? '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.displayName || 'User'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser.email}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '12px', borderRadius: '12px',
                    background: 'rgba(248, 81, 73, 0.05)', border: '1px solid rgba(248, 81, 73, 0.1)',
                    color: 'var(--color-danger)', fontSize: '14px', fontWeight: 700, justifyContent: 'center',
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={onStart}
                  style={{
                    padding: '12px', borderRadius: '12px',
                    background: 'var(--color-ui-surface-2)',
                    border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={onStart}
                  style={{
                    padding: '12px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    border: 'none', color: 'white',
                    fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
