import React, { useState } from 'react';
import { MapPin, Mail, Clock, Tag, Briefcase, Rocket, Heart, Users } from 'lucide-react';
import { LegalModal } from './TosModal';

// Shared styles that respect CSS variables (light/dark mode)
const h2Style: React.CSSProperties = { fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '10px', marginTop: '28px' };
const pStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8, marginBottom: '14px' };

// ─── About Modal ──────────────────────────────────────────────────────────────

export const AboutModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const statCard = (icon: React.ReactNode, value: string, label: string) => (
    <div style={{
      background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
      borderRadius: '12px', padding: '20px', textAlign: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: '#818CF8' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>{label}</div>
    </div>
  );

  return (
    <LegalModal onClose={onClose} title="About BespokeCV">
      <p style={pStyle}>
        BespokeCV is an AI-powered resume builder built for the modern job seeker. We combine cutting-edge AI with beautiful design to help you create resumes that stand out — and get past ATS filters.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '8px' }}>
        {statCard(<Rocket size={18} />, '20+', 'Resume Templates')}
        {statCard(<Users size={18} />, '10k+', 'Resumes Created')}
        {statCard(<Heart size={18} />, '4.9★', 'User Rating')}
      </div>

      <h2 style={h2Style}>Our Mission</h2>
      <p style={pStyle}>
        We believe every job seeker deserves a professional, well-crafted resume — regardless of their design skills or budget. Our mission is to democratize access to career tools that were previously only available through expensive resume services.
      </p>

      <h2 style={h2Style}>Where We're From</h2>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '10px', padding: '14px 18px', marginBottom: '14px',
      }}>
        <MapPin size={18} color="#818CF8" />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>Pune, Maharashtra, India</div>
          <div style={{ fontSize: '12px', color: 'var(--color-ui-text)' }}>Proudly built in India, serving job seekers worldwide</div>
        </div>
      </div>
      <p style={pStyle}>
        We're a small, passionate team based in Pune — one of India's fastest-growing tech hubs. We understand the unique challenges Indian job seekers face, from navigating competitive markets to tailoring resumes for both domestic and international opportunities.
      </p>

      <h2 style={h2Style}>What Makes Us Different</h2>
      <p style={pStyle}>
        Unlike generic resume builders, BespokeCV uses AI to understand context. Our AI doesn't just rephrase your bullet points — it analyzes job descriptions, identifies relevant keywords, and helps you tell your career story in a way that resonates with hiring managers and ATS systems alike.
      </p>

      <h2 style={h2Style}>Get in Touch</h2>
      <p style={pStyle}>
        Have questions or feedback? We'd love to hear from you. Reach us at{' '}
        <a href="mailto:support@bespokecv.in" style={{ color: '#818CF8', textDecoration: 'none' }}>support@bespokecv.in</a>
      </p>
    </LegalModal>
  );
};

// ─── Blog Modal ───────────────────────────────────────────────────────────────

const blogPosts = [
  {
    tag: 'ATS Tips',
    title: 'How to Write ATS-Friendly Resume Bullets',
    date: 'March 28, 2026',
    readTime: '5 min read',
    excerpt: 'Applicant Tracking Systems scan your resume before a human ever sees it. Learn the exact formula for writing bullet points that sail through ATS filters — strong action verbs, quantified results, and keyword placement that feels natural, not stuffed.',
  },
  {
    tag: 'Common Mistakes',
    title: 'Top 5 Resume Mistakes That Cost You Interviews',
    date: 'March 15, 2026',
    readTime: '4 min read',
    excerpt: 'From using the wrong file format to burying your most impressive achievements on page two, we break down the five most common resume blunders and show you exactly how to fix them. Small changes, big impact.',
  },
  {
    tag: 'Job Search Strategy',
    title: 'Tailoring Your Resume for Each Job Application',
    date: 'February 22, 2026',
    readTime: '6 min read',
    excerpt: "Sending the same resume to every job? That's leaving interviews on the table. Discover how to quickly customize your resume for each role — focusing on the right keywords, reordering sections, and tweaking your summary to mirror the job description.",
  },
  {
    tag: 'Resume Writing',
    title: 'The Perfect Resume Summary: A Step-by-Step Guide',
    date: 'February 8, 2026',
    readTime: '5 min read',
    excerpt: "Your resume summary is prime real estate — it's the first thing a recruiter reads. We'll walk you through crafting a 3–4 line summary that packs your years of experience, top skills, and career goal into a punchy opening that demands attention.",
  },
];

const tagColors: Record<string, string> = {
  'ATS Tips': '#6366F1',
  'Common Mistakes': '#EC4899',
  'Job Search Strategy': '#10B981',
  'Resume Writing': '#F59E0B',
};

export const BlogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <LegalModal onClose={onClose} title="Blog — Resume Tips & Insights">
    <p style={pStyle}>
      Practical advice from our team to help you craft a resume that gets results.
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
      {blogPosts.map((post) => (
        <div
          key={post.title}
          style={{
            background: 'var(--color-ui-surface-2)',
            border: '1px solid var(--color-ui-border)',
            borderRadius: '12px',
            padding: '20px 22px',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-ui-text-dim)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-ui-border)')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
              color: tagColors[post.tag] ?? '#818CF8',
              background: `${tagColors[post.tag] ?? '#818CF8'}18`,
              border: `1px solid ${tagColors[post.tag] ?? '#818CF8'}33`,
              borderRadius: '6px', padding: '3px 8px',
            }}>
              <Tag size={9} />
              {post.tag}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)' }}>
              <Clock size={11} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
              {post.readTime}
            </span>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '8px', lineHeight: 1.4 }}>
            {post.title}
          </h3>
          <p style={{ fontSize: '13.5px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, marginBottom: '12px' }}>
            {post.excerpt}
          </p>

          <div style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>{post.date}</div>
        </div>
      ))}
    </div>

    <p style={{ ...pStyle, marginTop: '24px', textAlign: 'center' as const, fontSize: '13px' }}>
      More articles coming soon. Follow us or check back regularly for new resume tips.
    </p>
  </LegalModal>
);

// ─── Careers Modal ────────────────────────────────────────────────────────────

const upcomingRoles = [
  { role: 'Full Stack Engineer', team: 'Product' },
  { role: 'AI / ML Engineer', team: 'AI' },
  { role: 'Product Designer (UI/UX)', team: 'Design' },
  { role: 'Growth & Marketing Manager', team: 'Growth' },
];

export const CareersModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <LegalModal onClose={onClose} title="Careers at BespokeCV">
    {/* Hero banner */}
    <div style={{
      background: 'rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.2)',
      borderRadius: '14px', padding: '28px 24px', textAlign: 'center', marginBottom: '8px',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</div>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>
        We're Hiring Soon!
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.7, margin: 0 }}>
        We're growing fast and will be opening positions shortly. If you're passionate about helping people land their dream jobs, we'd love to meet you.
      </p>
    </div>

    <h2 style={h2Style}>Our Culture</h2>
    <p style={pStyle}>
      At BespokeCV, we move fast, care deeply about our users, and believe the best products come from small, empowered teams. We're based in Pune, India — and we're building something that matters: giving every job seeker a fair shot.
    </p>

    <h2 style={h2Style}>Roles We're Planning to Open</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
      {upcomingRoles.map(({ role, team }) => (
        <div key={role} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
          borderRadius: '10px', padding: '14px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#818CF8' }}><Briefcase size={15} /></span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)' }}>{role}</span>
          </div>
          <span style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: '#818CF8', background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.2)', borderRadius: '6px', padding: '3px 8px',
          }}>
            {team}
          </span>
        </div>
      ))}
    </div>

    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      background: 'var(--color-ui-surface-2)', border: '1px solid var(--color-ui-border)',
      borderRadius: '10px', padding: '16px 18px', marginTop: '20px',
    }}>
      <MapPin size={16} color="#818CF8" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ui-text)', marginBottom: '2px' }}>Pune, Maharashtra, India</div>
        <div style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)' }}>Roles will be a mix of in-office and remote-friendly</div>
      </div>
    </div>

    <h2 style={h2Style}>Interested? Say Hello.</h2>
    <p style={pStyle}>
      Even though positions aren't open yet, we'd love to hear from exceptional people. Send us a brief intro and we'll reach out when roles go live.
    </p>
    <a
      href="mailto:support@bespokecv.in?subject=Career Interest — BespokeCV"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '10px 20px', borderRadius: '8px',
        background: 'linear-gradient(135deg, #6366F1, #A855F7)',
        color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <Mail size={14} />
      Send an intro to support@bespokecv.in
    </a>
  </LegalModal>
);

// ─── Contact Modal ────────────────────────────────────────────────────────────

export const ContactModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
    <LegalModal onClose={onClose} title="Contact Us">
      {/* Location card */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)',
        borderRadius: '12px', padding: '16px 18px', marginBottom: '24px',
      }}>
        <MapPin size={18} color="#818CF8" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '3px' }}>Pune, Maharashtra, India</div>
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
              placeholder="Rahul Sharma"
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
              placeholder="rahul@example.com"
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
              cursor: 'pointer', transition: 'opacity 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <Mail size={15} />
            Send Message
          </button>
        </form>
      )}
    </LegalModal>
  );
};
