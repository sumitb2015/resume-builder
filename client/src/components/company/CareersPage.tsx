import React, { useEffect } from 'react';
import { Zap, MapPin, Mail, Briefcase } from 'lucide-react';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };

const upcomingRoles = [
  { role: 'Full Stack Engineer', team: 'Product' },
  { role: 'AI / ML Engineer', team: 'AI' },
  { role: 'Product Designer (UI/UX)', team: 'Design' },
  { role: 'Growth & Marketing Manager', team: 'Growth' },
];

const CareersPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Careers — BespokeCV';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </a>
          <a href="/" style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textDecoration: 'underline' }}>
            ← Back to Home
          </a>
        </div>

        {/* Hero banner */}
        <div style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '14px', padding: '28px 24px', textAlign: 'center', marginBottom: '8px',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
            Careers at BespokeCV
          </h1>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
            We're Hiring Soon!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, margin: 0 }}>
            We're growing fast and will be opening positions shortly. If you're passionate about helping people land their dream jobs, we'd love to meet you.
          </p>
        </div>

        <h2 style={h2Style}>Our Culture</h2>
        <p style={pStyle}>
          At BespokeCV, we move fast, care deeply about our users, and believe the best products come from small, empowered teams. We're a distributed team building something that matters: giving every job seeker a fair shot.
        </p>

        <h2 style={h2Style}>Roles We're Planning to Open</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
          {upcomingRoles.map(({ role, team }) => (
            <div key={role} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
              borderRadius: '10px', padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#818CF8' }}><Briefcase size={15} /></span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{role}</span>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: '#818CF8', background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px', padding: '3px 8px',
              }}>
                {team}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
          borderRadius: '10px', padding: '16px 18px', marginTop: '20px',
        }}>
          <MapPin size={16} color="#818CF8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)', marginBottom: '2px' }}>Remote-First & Global</div>
            <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>Roles will be remote-friendly and flexible</div>
          </div>
        </div>

        <h2 style={h2Style}>Interested? Say Hello.</h2>
        <p style={pStyle}>
          Even though positions aren't open yet, we'd love to hear from exceptional people. Send us a brief intro and we'll reach out when roles go live.
        </p>
        <a
          href="mailto:support@bespokecv.in?subject=Career Interest — BespokeCV"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366F1, #A855F7)',
            color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}
        >
          <Mail size={14} />
          Send an intro to support@bespokecv.in
        </a>
      </div>
    </div>
  );
};

export default CareersPage;
