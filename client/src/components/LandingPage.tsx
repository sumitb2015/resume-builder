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
import SeoContentSection from './landing/SeoContentSection';
import CtaSection from './landing/CtaSection';
import FooterSection from './landing/FooterSection';
import { TosModal, PrivacyModal } from './landing/TosModal';
import { AboutModal, CareersModal, ContactModal } from './landing/CompanyModals';
import type { Plan } from '../shared/constants';

interface Props { 
  onStart: () => void;
  onOpenBlog: () => void;
  onCheckout: (plan: Exclude<Plan, 'free'>, isAnnual: boolean) => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onOpenBlog, onCheckout }) => {
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="landing-page">
      <NavBar onStart={onStart} onOpenBlog={onOpenBlog} />
      <HeroSection onStart={onStart} />
      <StatsSection />
      <TemplateShowcase onStart={onStart} />
      <AiFeaturesSection />
      <HowItWorksSection />
      <PricingSection onStart={onStart} onCheckout={onCheckout} />
      <TestimonialsSection />
      <FaqSection />
      <SeoContentSection />
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
