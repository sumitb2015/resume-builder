import React, { useState, useEffect } from 'react';
import { Zap, MapPin, Mail } from 'lucide-react';

const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };

const ContactPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Contact Us — BespokeCV';
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--color-ui-input-bg)', border: '1px solid var(--color-ui-input-border)',
    borderRadius: '8px', color: 'var(--color-ui-input-text)', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: 'var(--color-ui-field-label)', marginBottom: '6px',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:support@bespokecv.in?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366F1, #A855F7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)' }}>
              Bespoke<span style={{ color: '#818CF8' }}>CV</span>
            </span>
          </a>
          <a href="/" style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', textDecoration: 'underline' }}>
            ← Back to Home
          </a>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '24px' }}>
          Contact Us
        </h1>

        {/* Location card */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '12px', padding: '16px 18px', marginBottom: '24px',
        }}>
          <MapPin size={18} color="#818CF8" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '3px' }}>Remote-First & Distributed</div>
            <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>
              Reach us anytime at{' '}
              <a href="mailto:support@bespokecv.in" style={{ color: '#818CF8', textDecoration: 'none' }}>
                support@bespokecv.in
              </a>
            </div>
          </div>
        </div>

        {sent ? (
          <div style={{
            textAlign: 'center', padding: '32px 24px',
            background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>✅</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px' }}>Your email client should open now</h3>
            <p style={pStyle}>
              If it didn't open automatically, email us directly at{' '}
              <a href="mailto:support@bespokecv.in" style={{ color: '#818CF8', textDecoration: 'none' }}>support@bespokecv.in</a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Your Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-ui-input-border)')}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-ui-input-border)')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us how we can help you..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-ui-input-border)')}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                border: 'none', borderRadius: '9px',
                color: 'white', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Mail size={15} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
