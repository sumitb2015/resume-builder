import React from 'react';

const STEPS = [
  {
    number: '01',
    icon: '📝',
    title: 'Fill in your details',
    desc: 'Add your work experience, education, and skills using our guided editor. Import from LinkedIn or start from scratch.',
  },
  {
    number: '02',
    icon: '🤖',
    title: 'Let AI enhance it',
    desc: 'Use AI to generate compelling bullet points, write your summary, and optimize your content for ATS systems.',
  },
  {
    number: '03',
    icon: '📥',
    title: 'Download & apply',
    desc: "Export a pixel-perfect PDF in one click and start sending applications. ATS score shows you're ready.",
  },
];

const HowItWorksSection: React.FC = () => (
  <section style={{ padding: '100px 48px' }}>
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
        From zero to hired in 3 steps
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', marginBottom: '72px' }}>
        No fuss, no friction. Most users create a polished resume in under 15 minutes.
      </p>

      <div style={{ display: 'flex', gap: '0', position: 'relative' }}>
        {/* Connecting line */}
        <div style={{
          position: 'absolute', top: '36px', left: 'calc(16.67% + 28px)', right: 'calc(16.67% + 28px)',
          height: '1px', background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(168,85,247,0.4))',
          zIndex: 0,
        }} />

        {STEPS.map((step, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            {/* Icon circle */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))',
              border: '1px solid rgba(99,102,241,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: '26px',
              boxShadow: '0 0 0 8px rgba(99,102,241,0.05)',
            }}>
              {step.icon}
            </div>
            {/* Step number */}
            <div style={{
              fontSize: '11px', fontWeight: 700, color: 'rgba(99,102,241,0.7)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px',
            }}>
              Step {step.number}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px' }}>{step.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
