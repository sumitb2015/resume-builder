import React, { useState } from 'react';
import { templates } from '../../templates';
import type { TemplateConfig, Resume } from '../../shared/types';
import TemplateRenderer from '../../templates/TemplateRenderer';

const SAMPLE_RESUME: Resume = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    website: 'alexchen.design',
    summary: 'Results-driven designer with 8+ years crafting intuitive digital experiences. Led design teams at Fortune 500 companies delivering products used by millions worldwide.',
  },
  experience: [
    {
      id: '1',
      company: 'Stripe',
      role: 'Senior Product Designer',
      startDate: 'Jan 2021',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Led redesign of core payment flow, increasing conversion by 23%',
        'Managed team of 4 designers across 3 product lines',
        'Established design system adopted by 40+ engineers',
      ],
    },
    {
      id: '2',
      company: 'Airbnb',
      role: 'Product Designer',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      isCurrent: false,
      bullets: [
        'Redesigned host onboarding flow reducing drop-off by 35%',
        'Collaborated with PMs and engineers to ship 12 major features',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'B.S.',
      field: 'Computer Science',
      startDate: '2011',
      endDate: '2015',
      gpa: '3.9',
    },
  ],
  skills: [
    { id: '1', name: 'Figma', level: 95 },
    { id: '2', name: 'React', level: 75 },
    { id: '3', name: 'User Research', level: 88 },
    { id: '4', name: 'Prototyping', level: 90 },
    { id: '5', name: 'TypeScript', level: 72 },
  ],
  projects: [],
  certifications: [],
  languages: [],
  custom: [],
};

interface Props { onStart: () => void }

type Filter = 'all' | 'professional' | 'creative' | 'minimal';

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'professional', label: 'Professional' },
  { key: 'creative', label: 'Creative' },
  { key: 'minimal', label: 'Minimal' },
];

function getAtsBadgeColor(score: number): string {
  if (score >= 95) return '#4ADE80';
  if (score >= 88) return '#38BDF8';
  if (score >= 80) return '#F59E0B';
  return '#FB923C';
}

function getAtsBadgeBg(score: number): string {
  if (score >= 95) return 'rgba(74,222,128,0.1)';
  if (score >= 88) return 'rgba(56,189,248,0.1)';
  if (score >= 80) return 'rgba(245,158,11,0.1)';
  return 'rgba(251,146,60,0.1)';
}

const SCALE = 0.3;
const TEMPLATE_W = 794;
const TEMPLATE_H = 1123;

const TemplatePreview: React.FC<{ t: TemplateConfig }> = ({ t }) => (
  <div style={{
    width: `${TEMPLATE_W * SCALE}px`,
    height: `${TEMPLATE_H * SCALE}px`,
    overflow: 'hidden',
    margin: '0 auto',
    flexShrink: 0,
  }}>
    <div style={{
      width: `${TEMPLATE_W}px`,
      transformOrigin: 'top left',
      transform: `scale(${SCALE})`,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <TemplateRenderer resume={SAMPLE_RESUME} config={t} />
    </div>
  </div>
);

const TemplateCard: React.FC<{ t: TemplateConfig; onStart: () => void }> = ({ t, onStart }) => {
  const [hovered, setHovered] = useState(false);
  const badgeColor = getAtsBadgeColor(t.atsScore);
  const badgeBg = getAtsBadgeBg(t.atsScore);

  return (
    <div
      onClick={onStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '14px', overflow: 'hidden',
        border: hovered ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        background: hovered ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.03)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.45)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Preview area */}
      <div style={{
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
      }}>
        <TemplatePreview t={t} />
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(6,6,9,0.65)', backdropFilter: 'blur(2px)',
            borderRadius: '4px',
          }}>
            <span style={{
              padding: '8px 18px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white', fontSize: '13px', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
            }}>
              Use Template →
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'white' }}>{t.name}</span>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: badgeColor,
            background: badgeBg, padding: '2px 7px', borderRadius: '5px',
          }}>
            {t.atsScore}% ATS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '10.5px', fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'capitalize',
            background: 'rgba(255,255,255,0.05)',
            padding: '2px 7px', borderRadius: '4px',
          }}>
            {t.category}
          </span>
          <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.2)' }}>
            {t.layout === 'two-column' ? '2-col' : '1-col'}
          </span>
        </div>
      </div>
    </div>
  );
};

const TemplateShowcase: React.FC<Props> = ({ onStart }) => {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = {
    all: templates.length,
    professional: templates.filter(t => t.category === 'professional').length,
    creative: templates.filter(t => t.category === 'creative').length,
    minimal: templates.filter(t => t.category === 'minimal').length,
  };

  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);

  return (
    <section id="templates" style={{ padding: '100px 48px', background: 'rgba(0,0,0,0.15)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.04em' }}>15 TEMPLATES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'white', marginBottom: '14px' }}>
            A template for every career
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', maxWidth: '500px', margin: '0 auto' }}>
            From minimalist to creative — each template is ATS-optimized and fully customizable with 10 color palettes.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '48px' }}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 20px', borderRadius: '100px',
                border: filter === tab.key ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                background: filter === tab.key ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: filter === tab.key ? '#A78BFA' : 'rgba(255,255,255,0.45)',
                fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label} <span style={{ marginLeft: '4px', opacity: 0.6, fontSize: '12px' }}>({counts[tab.key]})</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {filtered.map(t => (
            <TemplateCard key={t.id} t={t} onStart={onStart} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '56px' }}>
          <button
            onClick={onStart}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', color: 'white', fontSize: '14.5px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Building Free — No Signup Required
          </button>
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
