import React from 'react';

const STATS = [
  { value: '15', label: 'Professional Templates' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '98%', label: 'ATS Pass Rate' },
  { value: 'AI', label: 'Powered Resume Builder' },
];

const StatsSection: React.FC = () => (
  <section style={{
    padding: '0 48px',
    background: 'var(--color-ui-surface-2)',
    borderTop: '1px solid var(--color-ui-border)',
    borderBottom: '1px solid var(--color-ui-border)',
  }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'stretch' }}>
      {STATS.map((stat, i) => (
        <div key={i} style={{
          flex: 1, padding: '36px 24px', textAlign: 'center',
          borderRight: i < STATS.length - 1 ? '1px solid var(--color-ui-border)' : 'none',
        }}>
          <div style={{
            fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px',
            color: 'var(--color-ui-text)',
          }}>
            {stat.value}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
