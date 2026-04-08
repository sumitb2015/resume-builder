import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props { onClose: () => void; title?: string; children?: React.ReactNode }

export const LegalModal: React.FC<Props> = ({ onClose, title = 'Terms of Service', children }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content" style={{ maxWidth: '720px', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid var(--color-ui-border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ui-text-muted)', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-ui-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-ui-text-muted)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid var(--color-ui-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text-muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)'; e.currentTarget.style.color = 'var(--color-ui-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-ui-border)'; e.currentTarget.style.color = 'var(--color-ui-text-muted)'; }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };
const lastUpdated: React.CSSProperties = { fontSize: '12px', color: 'var(--color-ui-text-dim)', marginBottom: '24px' };

export const TosModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <LegalModal onClose={onClose} title="Terms of Service">
    <p style={lastUpdated}>Last updated: April 1, 2026</p>
    <p style={pStyle}>
      Welcome to BespokeCV. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
    </p>

    <h2 style={h2Style}>1. Acceptance of Terms</h2>
    <p style={pStyle}>
      By creating an account or using BespokeCV in any way, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use our service. These Terms apply to all visitors, users, and others who access the service.
    </p>

    <h2 style={h2Style}>2. Description of Service</h2>
    <p style={pStyle}>
      BespokeCV provides an AI-powered resume building platform that enables users to create, edit, and export professional resumes. The service includes AI-generated content suggestions, template selection, ATS optimization tools, and PDF export functionality. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.
    </p>

    <h2 style={h2Style}>3. User Accounts and Responsibilities</h2>
    <p style={pStyle}>
      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information and to update it as necessary. You must not use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
    </p>

    <h2 style={h2Style}>4. Intellectual Property</h2>
    <p style={pStyle}>
      The BespokeCV platform, including its software, design, templates, and AI models, is the intellectual property of BespokeCV and its licensors. You retain ownership of the content you create using our service, including your resume data. By using the service, you grant BespokeCV a limited, non-exclusive license to process your content solely for the purpose of providing the service.
    </p>

    <h2 style={h2Style}>5. AI-Generated Content</h2>
    <p style={pStyle}>
      Our service uses AI models to generate suggestions, bullet points, summaries, and other content. While we strive to provide accurate and helpful suggestions, AI-generated content may contain errors or inaccuracies. You are solely responsible for reviewing and verifying all content before using it in professional contexts. BespokeCV makes no warranty regarding the accuracy, completeness, or fitness for purpose of AI-generated content.
    </p>

    <h2 style={h2Style}>6. Privacy and Data</h2>
    <p style={pStyle}>
      Your privacy is important to us. Please review our Privacy Policy, which describes how we collect, use, and share information about you when you use our service. By using BespokeCV, you agree to the collection and use of information as described in our Privacy Policy.
    </p>

    <h2 style={h2Style}>7. Disclaimer of Warranties</h2>
    <p style={pStyle}>
      The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. BespokeCV does not warrant that the service will be uninterrupted, error-free, or completely secure.
    </p>

    <h2 style={h2Style}>8. Limitation of Liability</h2>
    <p style={pStyle}>
      To the fullest extent permitted by law, BespokeCV shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the service. Our total liability to you for any claims shall not exceed the amount you paid us in the twelve months preceding the claim.
    </p>

    <h2 style={h2Style}>9. Governing Law</h2>
    <p style={pStyle}>
      These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.
    </p>

    <h2 style={h2Style}>10. Changes to Terms</h2>
    <p style={pStyle}>
      We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "last updated" date above. Your continued use of the service after such changes constitutes acceptance of the revised Terms. If you have questions about these Terms, please contact us at legal@bespokecv.com.
    </p>
  </LegalModal>
);

export const PrivacyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <LegalModal onClose={onClose} title="Privacy Policy">
    <p style={lastUpdated}>Last updated: April 1, 2026</p>
    <p style={pStyle}>
      At BespokeCV, we take your privacy seriously. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.
    </p>

    <h2 style={h2Style}>1. Information We Collect</h2>
    <p style={pStyle}>
      We collect information you provide directly to us, including your resume data (name, work experience, education, skills), account credentials, and any feedback you send us. We also automatically collect usage data such as browser type, pages visited, and features used to help us improve the service.
    </p>

    <h2 style={h2Style}>2. How We Use Your Information</h2>
    <p style={pStyle}>
      We use your information to provide and improve the service, process AI-powered resume enhancements, generate PDFs, and communicate with you about your account. We do not sell your personal data to third parties. Resume data processed through AI features is not stored beyond the session unless you are a registered user with cloud save enabled.
    </p>

    <h2 style={h2Style}>3. Data Security</h2>
    <p style={pStyle}>
      We implement industry-standard security measures including TLS encryption for data in transit and AES-256 encryption for data at rest. We regularly review our security practices and update them as needed. Despite these measures, no system is completely secure, and we cannot guarantee absolute security.
    </p>

    <h2 style={h2Style}>4. Your Rights</h2>
    <p style={pStyle}>
      Depending on your jurisdiction, you may have rights to access, correct, delete, or port your data. To exercise these rights, contact us at privacy@bespokecv.com. We will respond to all requests within 30 days.
    </p>

    <h2 style={h2Style}>5. Contact</h2>
    <p style={pStyle}>
      For privacy-related questions, contact our Data Protection Officer at privacy@bespokecv.com or write to BespokeCV, Inc., 548 Market St, San Francisco, CA 94104.
    </p>
  </LegalModal>
);

export default TosModal;
