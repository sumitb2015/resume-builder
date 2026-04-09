import React, { useState } from 'react';
import NavBar from './landing/NavBar';
import HeroSection from './landing/HeroSection';
import StatsSection from './landing/StatsSection';
import TemplateShowcase from './landing/TemplateShowcase';
import AiFeaturesSection from './landing/AiFeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import PricingSection from './landing/PricingSection';
import TestimonialsSection from './landing/TestimonialsSection';
import FaqSection from './landing/FaqSection';
import CtaSection from './landing/CtaSection';
import FooterSection from './landing/FooterSection';
import { TosModal, PrivacyModal } from './landing/TosModal';
import { AboutModal, CareersModal, ContactModal } from './landing/CompanyModals';

interface Props { 
  onStart: () => void;
  onOpenBlog: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onOpenBlog }) => {
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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
      <FaqSection />
      <CtaSection onStart={onStart} />
      <FooterSection
        onOpenTos={() => setTosOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenBlog={onOpenBlog}
        onOpenCareers={() => setCareersOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      {tosOpen && <TosModal onClose={() => setTosOpen(false)} />}
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {careersOpen && <CareersModal onClose={() => setCareersOpen(false)} />}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
};

export default LandingPage;
