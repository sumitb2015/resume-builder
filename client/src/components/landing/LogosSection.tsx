import React from 'react';

const LogosSection: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px 24px 60px', 
      textAlign: 'center',
      borderBottom: '1px solid var(--color-ui-border)',
      background: 'rgba(99,102,241,0.02)'
    }}>
      <p style={{ 
        fontSize: '13px', 
        fontWeight: 700, 
        color: 'var(--color-ui-text-dim)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        marginBottom: '32px'
      }}>
        Our users are landing interviews at
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '40px 60px',
        opacity: 0.6,
        filter: 'grayscale(1) invert(var(--theme-invert, 0))'
      }}>
        {/* Using stylized text as placeholders for logos to ensure clean look without missing assets */}
        <CompanyLogo name="Google" />
        <CompanyLogo name="Amazon" />
        <CompanyLogo name="Microsoft" />
        <CompanyLogo name="TCS" />
        <CompanyLogo name="Tech Mahindra" />
        <CompanyLogo name="Adobe" />
      </div>
    </div>
  );
};

const CompanyLogo: React.FC<{ name: string }> = ({ name }) => (
  <span style={{ 
    fontSize: '22px', 
    fontWeight: 800, 
    letterSpacing: '-0.03em', 
    color: 'var(--color-ui-text)',
    fontFamily: 'var(--font-sans)'
  }}>
    {name}
  </span>
);

export default LogosSection;
