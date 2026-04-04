import React, { useState } from 'react';
import NavBar from './landing/NavBar';
import HeroSection from './landing/HeroSection';
import StatsSection from './landing/StatsSection';
import TemplateShowcase from './landing/TemplateShowcase';
import AiFeaturesSection from './landing/AiFeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import PricingSection from './landing/PricingSection';
import TestimonialsSection from './landing/TestimonialsSection';
import CtaSection from './landing/CtaSection';
import FooterSection from './landing/FooterSection';
import { TosModal, PrivacyModal } from './landing/TosModal';

interface Props { onStart: () => void }

const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="landing-page">
      <NavBar onStart={onStart} />
      <HeroSection onStart={onStart} />
      <StatsSection />
      <TemplateShowcase onStart={onStart} />
      <AiFeaturesSection />
      <HowItWorksSection />
      <PricingSection onStart={onStart} />
      <TestimonialsSection />
      <CtaSection onStart={onStart} />
      <FooterSection onOpenTos={() => setTosOpen(true)} onOpenPrivacy={() => setPrivacyOpen(true)} />

      {tosOpen && <TosModal onClose={() => setTosOpen(false)} />}
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </div>
  );
};

export default LandingPage;
