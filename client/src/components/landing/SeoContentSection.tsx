import React from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../../templates';

const SeoContentSection: React.FC = () => {
  const glassCardStyle: React.CSSProperties = {
    background: 'rgba(99, 102, 241, 0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(99, 102, 241, 0.12)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
  };

  const featureCardStyle: React.CSSProperties = {
    ...glassCardStyle,
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.02)',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-6px)';
    e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(99, 102, 241, 0.1)';
    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.04)';
    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.12)';
  };

  return (
    <section 
      id="seo-content" 
      style={{ 
        padding: '120px 24px', 
        maxWidth: '1100px', 
        margin: '0 auto', 
        background: 'var(--color-ui-bg)',
        color: 'var(--color-ui-text)',
        lineHeight: '1.7',
        fontSize: '16px'
      }}
    >
      {/* Header with gradient highlight */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ 
          fontSize: 'clamp(32px, 5vw, 48px)', 
          fontWeight: 900, 
          marginBottom: '24px', 
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          background: 'linear-gradient(135deg, var(--color-ui-text) 60%, #818CF8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          The Ultimate AI-Powered Resume Builder
        </h2>
        <p style={{ fontSize: '19px', color: 'var(--color-ui-text-muted)', maxWidth: '750px', margin: '0 auto', fontWeight: 500 }}>
          Empowering job seekers with cutting-edge AI technology to beat the ATS and land interviews at top product and service companies.
        </p>
      </div>

      {/* Main Glass Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', marginBottom: '80px' }}>
        <div 
          style={glassCardStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
          }}>
            <span style={{ fontSize: '24px' }}>🎯</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', color: '#818CF8', letterSpacing: '-0.01em' }}>
            Why ATS Optimization Matters
          </h3>
          <p style={{ color: 'var(--color-ui-text-muted)', flex: 1 }}>
            In today's highly competitive job market, a single role at a top-tier company can attract thousands of applications. To manage this volume, <strong>98% of Fortune 500 companies</strong> and leading global firms use <strong>Applicant Tracking Systems (ATS)</strong>.
          </p>
          <p style={{ marginTop: '16px', color: 'var(--color-ui-text-muted)' }}>
            BespokeCV is built specifically to handle these automated gatekeepers. Our AI ensures your skills in <strong>Java, Python, React, or Project Management</strong> are highlighted exactly where they need to be.
          </p>
        </div>

        <div 
          style={glassCardStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
          }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px', color: '#A78BFA', letterSpacing: '-0.01em' }}>
            Tailored for Every Career Stage
          </h3>
          <p style={{ color: 'var(--color-ui-text-muted)', flex: 1 }}>
            Whether you are a <strong>fresher</strong> graduating from university or a <strong>senior professional</strong> transitioning industries, BespokeCV offers the tools you need.
          </p>
          <p style={{ marginTop: '16px', color: 'var(--color-ui-text-muted)' }}>
            Our AI Bullet Writer uses the <strong>Google XYZ formula</strong> to turn responsibilities into high-impact achievements. Learn more in our <Link to="/blog?article=ats-bullets" style={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #818CF8' }}>ATS Strategy Guide</Link>. Choose from <strong>{templates.length}+ professional templates</strong> designed to be 100% ATS-friendly.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ marginTop: '80px', borderTop: '1px solid var(--color-ui-border)', paddingTop: '80px' }}>
        <h3 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '48px', textAlign: 'center', letterSpacing: '-0.02em' }}>
          Master the 2026 Job Hunt with AI
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div 
            style={featureCardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: 'var(--color-ui-text)' }}>Resume Tailoring</h4>
            <p style={{ fontSize: '14.5px', color: 'var(--color-ui-text-muted)', margin: 0 }}>
              Stop using generic resumes. Our Job Tailor analyzes job descriptions to suggest specific rewrites that increase your match score instantly.
            </p>
          </div>
          <div 
            style={featureCardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: 'var(--color-ui-text)' }}>Skill Discovery</h4>
            <p style={{ fontSize: '14.5px', color: 'var(--color-ui-text-muted)', margin: 0 }}>
              Not sure what's trending? Our AI scans thousands of postings to identify high-demand keywords you should add to your profile today.
            </p>
          </div>
          <div 
            style={featureCardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: 'var(--color-ui-text)' }}>Pro PDF Export</h4>
            <p style={{ fontSize: '14.5px', color: 'var(--color-ui-text-muted)', margin: 0 }}>
              Say goodbye to formatting headaches. Build once and export as a pixel-perfect A4 PDF that maintains its integrity across all ATS platforms.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default SeoContentSection;
