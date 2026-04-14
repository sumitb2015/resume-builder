import React from 'react';
import NavBar from './landing/NavBar';
import HeroSection from './landing/HeroSection';
import LogosSection from './landing/LogosSection';
import StatsSection from './landing/StatsSection';
import TemplateShowcase from './landing/TemplateShowcase';
import AiFeaturesSection from './landing/AiFeaturesSection';
import AdvancedFeaturesSection from './landing/AdvancedFeaturesSection';
import HowItWorksSection from './landing/HowItWorksSection';
import PricingSection from './landing/PricingSection';
import TestimonialsSection from './landing/TestimonialsSection';
import BlogPreviewSection from './landing/BlogPreviewSection';
import FaqSection from './landing/FaqSection';
import SeoContentSection from './landing/SeoContentSection';
import CtaSection from './landing/CtaSection';
import FooterSection from './landing/FooterSection';
import type { Plan } from '../shared/constants';

interface Props { 
  onStart: () => void;
  onOpenBlog: () => void;
  onCheckout: (plan: Exclude<Plan, 'free'>, isAnnual: boolean) => void;
  onShowProfile: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onOpenBlog, onCheckout, onShowProfile }) => {
  return (
    <div className="landing-page">
      <NavBar onStart={onStart} onOpenBlog={onOpenBlog} onShowProfile={onShowProfile} />
      <HeroSection onStart={onStart} />
      <LogosSection />
      <StatsSection />
      <AiFeaturesSection />
      <TemplateShowcase onStart={onStart} />
      <AdvancedFeaturesSection />
      <HowItWorksSection />
      <PricingSection onStart={onStart} onCheckout={onCheckout} />
      <TestimonialsSection />
      <BlogPreviewSection onOpenBlog={onOpenBlog} />
      <FaqSection />
      <SeoContentSection />
      <CtaSection onStart={onStart} />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
