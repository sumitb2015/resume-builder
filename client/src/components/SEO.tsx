import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  canonical, 
  ogType = 'website',
  ogImage = 'https://bespokecv.in/og-image.png',
  noindex = false
}) => {
  const siteTitle = 'BespokeCV — AI-Powered Resume Builder';
  const fullTitle = title ? `${title} | BespokeCV` : siteTitle;
  
  const siteDescription = 'Build ATS-optimized resumes in minutes with AI. 40+ professional templates, AI writing suggestions, and PDF export. Trusted by 50,000+ job seekers.';
  const fullDescription = description || siteDescription;

  const defaultKeywords = 'AI resume builder, ATS resume builder, free resume builder online, resume maker for freshers, CV builder, professional resume templates, ATS optimized resume, job application resume, best ATS resume builder, resume builder with AI suggestions, resume writing tool, resume builder India, resume maker India';
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  
  const baseUrl = 'https://bespokecv.in';
  const fullCanonical = canonical 
    ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`)
    : baseUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
