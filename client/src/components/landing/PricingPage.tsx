import React, { useEffect } from 'react';
import NavBar from './NavBar';
import FooterSection from './FooterSection';
import PricingSection from './PricingSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../SEO';

const PricingPage: React.FC = () => {
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

  const handleCheckout = (plan: any, isAnnual: boolean) => {
    if (currentUser) {
      navigate('/checkout', { state: { plan, annual: isAnnual } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page" style={{ background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SEO 
        title="Plans & Pricing"
        description="Affordable plans for every job seeker. From basic resume building to advanced AI-powered job tailoring and expert reviews."
        canonical="/pricing"
      />
      <NavBar onStart={handleStart} onBackToHome={() => navigate('/')} />
      
      <main style={{ flex: 1, paddingTop: '40px' }}>
        <PricingSection onStart={handleStart} onCheckout={handleCheckout} />
      </main>

      <FooterSection />
    </div>
  );
};

export default PricingPage;
