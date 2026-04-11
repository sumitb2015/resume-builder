import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface Props { onStart: () => void }

const CtaSection: React.FC<Props> = ({ onStart }) => (
  <section style={{ padding: '80px 48px' }}>
    <div style={{
      maxWidth: '860px', margin: '0 auto', textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))',
      border: '1px solid rgba(99,102,241,0.25)', borderRadius: '28px',
      padding: '80px 56px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <h2 style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '18px', position: 'relative' }}>
        Ready to land your dream job?
      </h2>
      <p style={{ fontSize: '17px', color: 'var(--color-ui-text-muted)', marginBottom: '40px', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 40px', position: 'relative' }}>
        Join thousands of professionals who built interview-winning resumes with BespokeCV. Get started for free.
      </p>
      <button
        onClick={onStart}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '16px 36px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          border: 'none', color: 'white', fontSize: '16px', fontWeight: 700,
          cursor: 'pointer', letterSpacing: '-0.01em',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4)'; }}
      >
        Start Building Now
        <ArrowRight size={18} />
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '28px', flexWrap: 'wrap', position: 'relative' }}>
        {['No credit card required', 'PDF export included', '15 professional templates'].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Check size={14} color="#4ADE80" />
            <span style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)' }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CtaSection;
