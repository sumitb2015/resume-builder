import React from 'react';

const SeoContentSection: React.FC = () => {
  return (
    <section 
      id="seo-content" 
      style={{ 
        padding: '100px 24px', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        background: 'var(--color-ui-bg)',
        color: 'var(--color-ui-text)',
        lineHeight: '1.7',
        fontSize: '16px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em' }}>
          The Ultimate Free AI Resume Builder for India
        </h2>
        <p style={{ fontSize: '18px', color: 'var(--color-ui-text-muted)', maxWidth: '700px', margin: '0 auto' }}>
          Empowering Indian job seekers with cutting-edge AI technology to beat the ATS and land interviews at top product and service companies.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#818CF8' }}>
            Why ATS Optimization Matters in India
          </h3>
          <p>
            In India's highly competitive job market, a single role at a company like TCS, Infosys, or Wipro can attract thousands of applications. To manage this volume, 98% of Fortune 500 companies and top Indian corporates use <strong>Applicant Tracking Systems (ATS)</strong>. If your resume isn't optimized with the right keywords and formatting, it may never reach a human recruiter.
          </p>
          <p style={{ marginTop: '12px' }}>
            BespokeCV is built specifically to handle these automated gatekeepers. Our AI analyzes your profile against the job descriptions of top Indian employers, ensuring your skills in Java, Python, React, Cloud Computing, or Project Management are highlighted exactly where they need to be.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#A78BFA' }}>
            Tailored for Indian Freshers and Professionals
          </h3>
          <p>
            Whether you are a <strong>fresher</strong> graduating from an IIT, NIT, or regional college, or a <strong>senior professional</strong> looking to switch from service-based to product-based firms, BespokeCV offers the tools you need. Our AI Bullet Writer uses industry-standard frameworks like the Google XYZ formula to turn your responsibilities into high-impact achievements.
          </p>
          <p style={{ marginTop: '12px' }}>
            We understand the nuances of the Indian job market—from the importance of CGPA for campus placements to the specific certifications valued in Finance and IT. Our 15 professional templates are designed to be clean, modern, and 100% ATS-friendly.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '60px', borderTop: '1px solid var(--color-ui-border)', paddingTop: '60px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
          Master the 2026 Indian Job Hunt with AI
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div style={{ background: 'var(--color-ui-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-ui-border)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Resume Tailoring for Naukri & LinkedIn</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>
              Stop using the same generic resume for every application. Our Job Tailor tool analyzes job descriptions from Naukri.com and LinkedIn to suggest specific rewrites that increase your match score.
            </p>
          </div>
          <div style={{ background: 'var(--color-ui-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-ui-border)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>AI-Powered Skill Discovery</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>
              Not sure which skills are trending in the Indian IT sector? Our AI scans thousands of job postings to identify the high-demand keywords you should add to your profile today.
            </p>
          </div>
          <div style={{ background: 'var(--color-ui-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-ui-border)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Pixel-Perfect PDF Export</h4>
            <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)' }}>
              Say goodbye to formatting headaches in Word. Build your resume once and export as a professional A4 PDF that maintains its integrity across all devices and ATS platforms.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))', padding: '40px', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.1)' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Ready to Land Your Dream Job in Bangalore, Mumbai, or Delhi?</h3>
        <p style={{ marginBottom: '24px', color: 'var(--color-ui-text-muted)' }}>
          Join over 50,000 successful job seekers who have used BespokeCV to build professional, ATS-optimized resumes. Start building for free today.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text-dim)' }}>✓ Free to Start</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text-dim)' }}>✓ 15+ ATS Templates</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text-dim)' }}>✓ AI Writing Assistant</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text-dim)' }}>✓ 98% ATS Pass Rate</span>
        </div>
      </div>
    </section>
  );
};

export default SeoContentSection;
