import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };
const lastUpdated: React.CSSProperties = { fontSize: '12px', color: 'var(--color-ui-text-dim)', marginBottom: '24px' };

const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service — BespokeCV';
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
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={lastUpdated}>Last updated: April 1, 2026</p>
        <p style={pStyle}>Welcome to BespokeCV. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.</p>

        <h2 style={h2Style}>1. Acceptance of Terms</h2>
        <p style={pStyle}>By creating an account or using BespokeCV in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our service. These Terms apply to all visitors, users, and others who access the service.</p>

        <h2 style={h2Style}>2. Description of Service</h2>
        <p style={pStyle}>BespokeCV provides an AI-powered resume building platform that enables users to create, edit, and export professional resumes. The service includes AI-generated content suggestions, template selection, ATS optimization tools, and PDF export functionality. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.</p>

        <h2 style={h2Style}>3. User Accounts and Responsibilities</h2>
        <p style={pStyle}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information and to update it as necessary. You must not use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.</p>

        <h2 style={h2Style}>4. Intellectual Property</h2>
        <p style={pStyle}>The BespokeCV platform, including its software, design, templates, and AI models, is the intellectual property of <a href="https://aspireaisolutions.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-ui-accent)', textDecoration: 'none' }}>AspireAI Solutions</a> and its licensors. You retain ownership of the content you create using our service, including your resume data. By using the service, you grant us a limited, non-exclusive license to process your content solely for the purpose of providing the service.</p>

        <h2 style={h2Style}>5. AI-Generated Content</h2>
        <p style={pStyle}>Our service uses AI models to generate suggestions, bullet points, summaries, and other content. While we strive to provide accurate and helpful suggestions, AI-generated content may contain errors or inaccuracies. You are solely responsible for reviewing and verifying all content before using it in professional contexts. BespokeCV makes no warranty regarding the accuracy, completeness, or fitness for purpose of AI-generated content.</p>

        <h2 style={h2Style}>6. Privacy and Data</h2>
        <p style={pStyle}>Your privacy is important to us. Please review our <a href="/privacy" style={{ color: 'var(--color-ui-accent)' }}>Privacy Policy</a>, which describes how we collect, use, and share information about you when you use our service. By using BespokeCV, you agree to the collection and use of information as described in our Privacy Policy.</p>

        <h2 style={h2Style}>7. Disclaimer of Warranties</h2>
        <p style={pStyle}>The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. BespokeCV does not warrant that the service will be uninterrupted, error-free, or completely secure.</p>

        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>To the fullest extent permitted by law, BespokeCV shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the service. Our total liability to you for any claims shall not exceed the amount you paid us in the twelve months preceding the claim.</p>

        <h2 style={h2Style}>9. Governing Law</h2>
        <p style={pStyle}>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.</p>

        <h2 style={h2Style}>10. Changes to Terms</h2>
        <p style={pStyle}>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "last updated" date above. Your continued use of the service after such changes constitutes acceptance of the revised Terms. If you have questions about these Terms, please contact us at legal@bespokecv.in.</p>
      </div>
    </div>
  );
};

export default TermsPage;
