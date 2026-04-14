import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };
const lastUpdated: React.CSSProperties = { fontSize: '12px', color: 'var(--color-ui-text-dim)', marginBottom: '24px' };

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — BespokeCV';
  }, []);

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              Bespoke<span style={{ color: 'var(--color-ui-accent)' }}>CV</span>
            </span>
          </div>
          <a
            href="/"
            style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textDecoration: 'underline' }}
          >
            ← Back to Home
          </a>
        </div>

        {/* Content */}
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={lastUpdated}>Last updated: April 1, 2026</p>
        <p style={pStyle}>At BespokeCV, we take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.</p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <p style={pStyle}>We collect information you provide directly to us, including your resume data (name, work experience, education, skills), account credentials, and any feedback you send us. We also automatically collect usage data such as browser type, pages visited, and features used to help us improve the service.</p>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <p style={pStyle}>We use your information to provide and improve the service, process AI-powered resume enhancements, generate PDFs, and communicate with you about your account. We do not sell your personal data to third parties. Resume data processed through AI features is not stored beyond the session unless you are a registered user with cloud save enabled.</p>

        <h2 style={h2Style}>3. Data Security</h2>
        <p style={pStyle}>We implement industry-standard security measures including TLS encryption for data in transit and AES-256 encryption for data at rest. We regularly review our security practices and update them as needed. Despite these measures, no system is completely secure, and we cannot guarantee absolute security.</p>

        <h2 style={h2Style}>4. Your Rights</h2>
        <p style={pStyle}>Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. To exercise these rights, contact us at privacy@bespokecv.in. We will respond to all requests within 30 days.</p>

        <h2 style={h2Style}>5. Contact</h2>
        <p style={pStyle}>For privacy-related questions, contact our Data Protection Officer at privacy@bespokecv.in or write to <a href="https://aspireaisolutions.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-ui-accent)', textDecoration: 'none' }}>AspireAI Solutions</a>.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
