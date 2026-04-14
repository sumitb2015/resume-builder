import React, { useEffect } from 'react';
import NavBar from './NavBar';
import FooterSection from './FooterSection';
import AiFeaturesSection from './AiFeaturesSection';
import AdvancedFeaturesSection from './AdvancedFeaturesSection';
import SeoContentSection from './SeoContentSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = 'AI Resume Features — BespokeCV';
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
      <NavBar onStart={handleStart} onBackToHome={() => navigate('/')} />
      
      <main style={{ flex: 1, paddingTop: '40px' }}>
        <div style={{ textAlign: 'center', padding: '60px 24px 20px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.04em', marginBottom: '16px' }}>
            AI-Powered <span style={{ color: '#818CF8' }}>Career Tools</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Everything you need to beat the ATS and land your next role.
          </p>
        </div>
        <AiFeaturesSection />
        <AdvancedFeaturesSection />
        <SeoContentSection />
      </main>

      <FooterSection />
    </div>
  );
};

export default FeaturesPage;
