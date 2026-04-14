import React, { useEffect } from 'react';
import { Zap, MapPin, Rocket, Heart, Users } from 'lucide-react';
import { templates } from '../../templates';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us — BespokeCV';
  }, []);

  const statCard = (icon: React.ReactNode, value: string, label: string) => (
    <div style={{
      background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
      borderRadius: '12px', padding: '20px', textAlign: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#818CF8' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>{label}</div>
    </div>
  );

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', padding: '48px 24px 80px' }}>
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

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
          About BespokeCV
        </h1>

        <p style={pStyle}>
          BespokeCV is an AI-powered resume builder built for the modern job seeker. We combine cutting-edge AI with beautiful design to help you create resumes that stand out — and get past ATS filters. 
          The platform is owned and operated by <a href="https://aspireaisolutions.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#818CF8', textDecoration: 'none' }}>AspireAI Solutions</a>.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '8px' }}>
          {statCard(<Rocket size={18} />, `${templates.length}+`, 'Resume Templates')}
          {statCard(<Users size={18} />, '10k+', 'Resumes Created')}
          {statCard(<Heart size={18} />, '4.9★', 'User Rating')}
        </div>

        <h2 style={h2Style}>Our Mission</h2>
        <p style={pStyle}>
          We believe every job seeker deserves a professional, well-crafted resume — regardless of their design skills or budget. Our mission is to democratize access to career tools that were previously only available through expensive resume services.
        </p>

        <h2 style={h2Style}>Our Global Team</h2>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '10px', padding: '14px 18px', marginBottom: '14px',
        }}>
          <MapPin size={18} color="#818CF8" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>Remote-First & Distributed</div>
            <div style={{ fontSize: '12px', color: 'var(--color-ui-text)' }}>Serving job seekers worldwide with a passion for excellence</div>
          </div>
        </div>
        <p style={pStyle}>
          We're a small, passionate team of designers and engineers working remotely to build the best career tools. We understand the unique challenges job seekers face globally, from navigating competitive markets to tailoring resumes for both domestic and international opportunities.
        </p>

        <h2 style={h2Style}>What Makes Us Different</h2>
        <p style={pStyle}>
          Unlike generic resume builders, BespokeCV uses AI to understand context. Our AI doesn't just rephrase your bullet points — it analyzes job descriptions, identifies relevant keywords, and helps you tell your career story in a way that resonates with hiring managers and ATS systems alike.
        </p>

        <h2 style={h2Style}>Get in Touch</h2>
        <p style={pStyle}>
          Have questions or feedback? We'd love to hear from you. Reach us at{' '}
          <a href="mailto:support@bespokecv.in" style={{ color: '#818CF8', textDecoration: 'none' }}>support@bespokecv.in</a>
          {' '}or visit our <a href="/contact" style={{ color: '#818CF8', textDecoration: 'none' }}>Contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
