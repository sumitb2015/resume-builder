import React, { useEffect } from 'react';
import NavBar from './NavBar';
import FooterSection from './FooterSection';
import FaqSection from './FaqSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../SEO';

const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStart = () => {
    if (currentUser) {
      navigate('/hub');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page" style={{ background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SEO 
        title="Frequently Asked Questions"
        description="Find answers to common questions about our AI resume builder, ATS optimization, pricing, and how BespokeCV can help you land your dream job."
        canonical="/faq"
      />
      <NavBar onStart={handleStart} onBackToHome={() => navigate('/')} />
      
      <main style={{ flex: 1, paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px 20px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.04em', marginBottom: '16px' }}>
            Frequently Asked <span style={{ color: '#818CF8' }}>Questions</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to know about BespokeCV and our AI resume builder.
          </p>
        </div>
        <FaqSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default FaqPage;
