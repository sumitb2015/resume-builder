import React from 'react';
import { Zap, Globe, Link2, ExternalLink } from 'lucide-react';
import { scrollToSection } from '../../lib/scroll';

interface Props {
  onOpenTos: () => void;
  onOpenPrivacy: () => void;
  onOpenAbout: () => void;
  onOpenBlog: () => void;
  onOpenCareers: () => void;
  onOpenContact: () => void;
}

const FooterSection: React.FC<Props> = ({ onOpenTos, onOpenPrivacy, onOpenAbout, onOpenBlog, onOpenCareers, onOpenContact }) => {
  const linkStyle: React.CSSProperties = {
    fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
    background: 'none', border: 'none', cursor: 'pointer', padding: '0',
    textAlign: 'left', display: 'block', marginBottom: '12px',
    transition: 'color 0.2s',
    fontFamily: 'inherit',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
  };

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '72px 48px 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '64px' }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>
                Bespoke<span style={{ color: '#818CF8' }}>CV</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, maxWidth: '260px', marginBottom: '24px' }}>
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
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Product column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Product</h4>
            <button style={linkStyle} onClick={() => scrollToSection('templates')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Templates</button>
            <button style={linkStyle} onClick={() => scrollToSection('ai-features')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>AI Features</button>
            <button style={linkStyle} onClick={() => scrollToSection('pricing')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Pricing</button>
          </div>

          {/* Company column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Company</h4>
            <button style={linkStyle} onClick={onOpenAbout} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>About</button>
            <button style={linkStyle} onClick={onOpenBlog} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Blog</button>
            <button style={linkStyle} onClick={onOpenCareers} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Careers</button>
            <button style={linkStyle} onClick={onOpenContact} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact Us</button>
          </div>

          {/* Legal column */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Legal</h4>
            <button style={linkStyle} onClick={onOpenTos} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Terms of Service</button>
            <button style={linkStyle} onClick={onOpenPrivacy} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Privacy Policy</button>
            <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Cookie Policy</a>
            <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Security</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
            © 2026 BespokeCV · Built with Claude AI by Anthropic
          </p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.3)' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
