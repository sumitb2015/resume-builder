import React, { useEffect } from 'react';
import NavBar from '../landing/NavBar';
import FooterSection from '../landing/FooterSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, CheckCircle, Shield, Award, Clock, ArrowRight } from 'lucide-react';

const ExpertReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = 'Expert Resume Review — BespokeCV';
    window.scrollTo(0, 0);
  }, []);

  const handleStart = () => {
    if (currentUser) {
      navigate('/hub');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <Award size={24} />,
      title: 'Human Recruiter Review',
      description: 'Get your resume reviewed by professional recruiters who know what hiring managers are looking for in 2026.'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'ATS Compatibility Check',
      description: 'We ensure your resume is perfectly formatted for the major ATS platforms like Workday, Greenhouse, and Lever.'
    },
    {
      icon: <Clock size={24} />,
      title: '48-Hour Turnaround',
      description: 'Receive detailed, actionable feedback within 48 hours so you can start applying with confidence immediately.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Industry-Specific Feedback',
      description: 'Our experts specialize in Tech, Finance, Healthcare, and Creative industries to provide relevant advice.'
    }
  ];

  return (
    <div className="landing-page" style={{ background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar onStart={handleStart} onBackToHome={() => navigate('/')} />
      
      <main style={{ flex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: '100px', color: '#818CF8', fontSize: '13px', fontWeight: 700, marginBottom: '24px' }}>
            <MessageSquare size={14} /> HUMAN EXPERTISE
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, color: 'var(--color-ui-text)', letterSpacing: '-0.04em', marginBottom: '20px', lineHeight: 1.1 }}>
            Get a <span style={{ color: '#818CF8' }}>Professional Review</span>
          </h1>
          <p style={{ fontSize: '19px', color: 'var(--color-ui-text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
            AI is great, but human insight is priceless. Let our expert recruiters polish your resume to perfection and help you land that dream interview.
          </p>
          <div style={{ marginTop: '40px' }}>
            <button 
              className="btn-primary" 
              onClick={handleStart}
              style={{ padding: '14px 32px', fontSize: '16px' }}
            >
              Get Expert Review <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '32px', background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)', borderRadius: '24px' }}>
              <div style={{ color: '#818CF8', marginBottom: '20px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div style={{ padding: '80px 24px', background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--color-ui-border)', borderBottom: '1px solid var(--color-ui-border)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px' }}>How it works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {[
                { step: '01', title: 'Upload your resume', text: 'Select your best resume draft or create one using our AI builder.' },
                { step: '02', title: 'Request review', text: 'Click "Expert Review" in your dashboard and tell us about your target roles.' },
                { step: '03', title: 'Expert analysis', text: 'A professional recruiter analyzes your resume for content, layout, and ATS score.' },
                { step: '04', title: 'Actionable feedback', text: 'Receive a detailed report with specific improvements within 48 hours.' }
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(99,102,241,0.2)', fontStyle: 'italic' }}>{s.step}</div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{s.title}</h4>
                    <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '100px 24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Ready to stand out?</h2>
          <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', marginBottom: '32px' }}>Join 10,000+ job seekers who improved their interview rate with BespokeCV.</p>
          <button 
            className="btn-primary" 
            onClick={handleStart}
            style={{ padding: '12px 28px' }}
          >
            Start Free Today
          </button>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default ExpertReviewPage;
