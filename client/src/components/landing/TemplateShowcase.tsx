import React, { useState, useEffect, useRef } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const badgeColor = getAtsBadgeColor(t.atsScore);
  const badgeBg = getAtsBadgeBg(t.atsScore);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px' }); // Load when within 400px of viewport

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '14px', overflow: 'hidden',
        border: hovered ? '1px solid rgba(99,102,241,0.35)' : '1px solid var(--color-ui-border)',
        cursor: 'pointer',
        background: hovered ? 'rgba(99,102,241,0.05)' : 'var(--color-ui-surface)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        minHeight: `${TEMPLATE_H * SCALE + 80}px`, // Placeholder height
      }}
    >
      {/* Preview area */}
      <div style={{
        position: 'relative',
        borderBottom: '1px solid var(--color-ui-border)',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
        minHeight: `${TEMPLATE_H * SCALE + 20}px`
      }}>
        {isVisible ? (
          <>
            <TemplatePreview t={t} />
            {hovered && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
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
          </>
        ) : (
          <div style={{ 
            width: `${TEMPLATE_W * SCALE}px`, 
            height: `${TEMPLATE_H * SCALE}px`,
            background: 'var(--color-ui-surface-2)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="spin" style={{ width: '20px', height: '20px', border: '2px solid var(--color-ui-border)', borderTopColor: 'var(--color-ui-accent)', borderRadius: '50%' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-ui-text)' }}>{t.name}</span>
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
            color: 'var(--color-ui-text-dim)',
            textTransform: 'capitalize',
            background: 'var(--color-ui-surface-2)',
            padding: '2px 7px', borderRadius: '4px',
          }}>
            {t.category}
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--color-ui-text-dim)' }}>
            {t.layout === 'two-column' ? '2-col' : '1-col'}
          </span>
        </div>
      </div>
    </div>
  );
};

const TemplateShowcase: React.FC<Props> = ({ onStart }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const counts = {
    all: templates.length,
    professional: templates.filter(t => t.category === 'professional').length,
    creative: templates.filter(t => t.category === 'creative').length,
    minimal: templates.filter(t => t.category === 'minimal').length,
  };

  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter);

  return (
    <section id="templates" style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: 'var(--color-ui-surface-2)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .template-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .template-scroll-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .template-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        .template-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(99, 102, 241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: '20px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.04em' }}>{templates.length} TEMPLATES</span>
          </div>
          <h2 style={{ fontSize: isMobile ? '28px' : 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
            A template for every career
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'var(--color-ui-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            From minimalist to creative — each template is ATS-optimized and fully customizable with 10 color palettes.
          </p>
        </div>

        {/* Filter tabs — segmented control */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '32px' : '48px',
          overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '10px' : '0'
        }}>
          <div style={{
            display: 'inline-flex', gap: '2px', padding: '4px',
            background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
            borderRadius: '100px',
          }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: isMobile ? '6px 14px' : '7px 20px', borderRadius: '100px',
                  border: 'none',
                  background: filter === tab.key ? 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))' : 'transparent',
                  color: filter === tab.key ? 'white' : 'var(--color-ui-text-muted)',
                  fontSize: isMobile ? '12px' : '13px', fontWeight: filter === tab.key ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  whiteSpace: 'nowrap',
                  boxShadow: filter === tab.key ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
                }}
                onMouseEnter={e => { if (filter !== tab.key) e.currentTarget.style.color = 'var(--color-ui-text)'; }}
                onMouseLeave={e => { if (filter !== tab.key) e.currentTarget.style.color = 'var(--color-ui-text-muted)'; }}
              >
                {tab.label}
                <span style={{ marginLeft: '6px', fontSize: '11px', opacity: filter === tab.key ? 0.8 : 0.5, fontWeight: 500 }}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Grid */}
        <div 
          className="template-scroll-container"
          style={{
            display: 'grid',
            gridTemplateRows: isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)',
            gridAutoFlow: 'column',
            gridAutoColumns: isMobile ? 'calc(100% - 40px)' : 'calc((100% - (3 * 16px)) / 4)',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '24px',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
          }}
        >
          {filtered.map(t => (
            <div key={t.id} style={{ scrollSnapAlign: 'start' }}>
              <TemplateCard t={t} onStart={onStart} />
            </div>
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
            Start Building For Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
