import React, { useEffect, useState } from 'react';
import { templates } from '../../templates';

const STATS = [
  { value: `${templates.length}+`, label: 'Professional Templates', sub: 'Classic to creative — a template for every role' },
  { value: 'ATS-Optimized', label: 'by Design', sub: 'Every template built to pass modern applicant tracking systems' },
  { value: 'AI-Powered', label: 'Writing', sub: 'Bullets, summaries and tailoring generated for your exact role' },
  { value: 'Interview-Ready', label: 'in Minutes', sub: 'From blank page to polished resume without the guesswork' },
];

const StatsSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      padding: isMobile ? '0 16px' : '0 48px',
      background: 'var(--color-ui-surface-2)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'stretch',
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: 'wrap'
      }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{
            flex: isMobile ? '1 0 50%' : 1,
            padding: isMobile ? '24px 16px' : '36px 24px',
            textAlign: 'center',
            borderRight: (!isMobile && i < STATS.length - 1) ? '1px solid var(--color-ui-border)' : 'none',
            borderBottom: (isMobile && i < STATS.length - 1) ? '1px solid var(--color-ui-border)' : 'none',
          }}>
            <div style={{
              fontSize: isMobile ? '20px' : '22px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '4px',
              color: 'var(--color-ui-text)',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'var(--color-ui-text-muted)', fontWeight: 600, letterSpacing: '0.02em', marginBottom: '6px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-dim)', lineHeight: 1.5, maxWidth: '180px', margin: '0 auto' }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
