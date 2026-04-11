import React, { useEffect, useState } from 'react';
import { templates } from '../../templates';

const STATS = [
  { value: `${templates.length}+`, label: 'Professional Templates' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '98%', label: 'ATS Pass Rate' },
  { value: 'AI', label: 'Powered Resume Builder' },
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
              fontSize: isMobile ? '28px' : '32px', 
              fontWeight: 800, 
              letterSpacing: '-0.03em', 
              marginBottom: '6px',
              color: 'var(--color-ui-text)',
            }}>
              {stat.value}
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '13px', color: 'var(--color-ui-text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
