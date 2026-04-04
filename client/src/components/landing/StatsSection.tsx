import React from 'react';

const STATS = [
  { value: '15', label: 'Professional Templates' },
  { value: '50K+', label: 'Resumes Created' },
  { value: '98%', label: 'ATS Pass Rate' },
  { value: 'Claude AI', label: 'Powered By Anthropic' },
];

const StatsSection: React.FC = () => (
  <section style={{
    padding: '0 48px',
    background: 'rgba(255,255,255,0.02)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'stretch' }}>
      {STATS.map((stat, i) => (
        <div key={i} style={{
          flex: 1, padding: '36px 24px', textAlign: 'center',
          borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
          <div style={{
            fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px',
            background: 'linear-gradient(135deg, #E6EDF3, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            {stat.value}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
