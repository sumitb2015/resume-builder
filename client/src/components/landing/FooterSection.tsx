import React, { useState } from 'react';
import { Zap, Globe, Link2, ExternalLink } from 'lucide-react';

const FooterSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkStyle: React.CSSProperties = {
    fontSize: '14px', color: 'var(--color-ui-text-muted)', textDecoration: 'none',
    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
    textAlign: 'left', display: 'block', marginBottom: '12px',
    transition: 'color 0.2s',
    fontFamily: 'inherit',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.color = 'var(--color-ui-text)';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.color = 'var(--color-ui-text-muted)';
  };

  return (
    <footer style={{ borderTop: '1px solid var(--color-ui-border)', padding: isMobile ? '48px 20px' : '72px 48px 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', 
          gap: isMobile ? '40px' : '48px', 
          marginBottom: isMobile ? '48px' : '64px' 
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
                Bespoke<span style={{ color: '#818CF8' }}>CV</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, maxWidth: '260px', marginBottom: '24px' }}>
              AI-powered resume builder that helps you create ATS-optimized resumes and land more interviews.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { Icon: Globe, href: '#', label: 'Twitter/X' },
                { Icon: Link2, href: '#', label: 'LinkedIn' },
                { Icon: ExternalLink, href: '#', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-ui-text-muted)', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ui-border)'; e.currentTarget.style.color = 'var(--color-ui-text)'; e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-ui-surface-2)'; e.currentTarget.style.color = 'var(--color-ui-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-ui-border)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Product</h4>
            <a href="/templates" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Templates</a>
            <a href="/features" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>AI Features</a>
            <a href="/pricing" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Pricing</a>
            <a href="/expert-review" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Expert Review</a>
            <a href="/faq" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>FAQ</a>
          </div>

          {/* Company column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Company</h4>
            <a href="/about" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</a>
            <a href="/blog" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Blog</a>
            <a href="/careers" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Careers</a>
            <a href="/contact" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact Us</a>
          </div>

          {/* Legal column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-ui-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Legal</h4>
            <a href="/terms" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Terms of Service</a>
            <a href="/privacy" style={{ ...linkStyle, textDecoration: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Privacy Policy</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ 
          borderTop: '1px solid var(--color-ui-border)', 
          paddingTop: '28px', 
          display: 'flex', 
          justifyContent: isMobile ? 'center' : 'space-between', 
          alignItems: 'center', 
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap', 
          gap: '12px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-ui-text-dim)', margin: 0 }}>
              © 2026 BespokeCV · AI-powered resume builder
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)', opacity: 0.8, margin: 0 }}>
              Owned and operated by <a href="https://aspireaisolutions.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>AspireAI Solutions</a>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ fontSize: '12.5px', color: 'var(--color-ui-text-dim)' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
