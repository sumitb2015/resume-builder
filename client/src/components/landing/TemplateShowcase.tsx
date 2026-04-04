import React, { useState } from 'react';
import { templates } from '../../templates';
import type { TemplateConfig } from '../../shared/types';

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

const TemplateMockup: React.FC<{ t: TemplateConfig }> = ({ t }) => {
  const isTwoCol = t.layout === 'two-column';
  const isDark = t.colors.background && t.colors.background.startsWith('#1');

  return (
    <div style={{
      background: t.colors.background || '#fff',
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      display: 'flex',
      minHeight: '100px',
      position: 'relative',
    }}>
      {/* Sidebar for two-column */}
      {isTwoCol && (
        <div style={{ width: '30%', background: t.colors.primary, padding: '8px 5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '60%', height: '3px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', marginBottom: '2px' }} />
          <div style={{ width: '80%', height: '2px', background: 'rgba(255,255,255,0.3)', borderRadius: '1px' }} />
          <div style={{ height: '6px' }} />
          {[80,90,70,85].map((w, i) => (
            <div key={i} style={{ height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '1px', width: `${w}%` }} />
          ))}
          <div style={{ height: '6px' }} />
          <div style={{ width: '50%', height: '2px', background: t.colors.accent + '99', borderRadius: '1px' }} />
          {[65,75,60].map((w, i) => (
            <div key={i} style={{ height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px', width: `${w}%`, marginTop: '2px' }} />
          ))}
        </div>
      )}
      {/* Main content */}
      <div style={{ flex: 1, padding: '8px 7px' }}>
        {/* Header */}
        {!isTwoCol ? (
          <div style={{ background: t.colors.primary, margin: '-8px -7px 6px', padding: '6px 7px' }}>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.85)', borderRadius: '2px', width: '55%', marginBottom: '3px' }} />
            <div style={{ height: '3px', background: t.colors.accent + 'cc', borderRadius: '1px', width: '35%' }} />
          </div>
        ) : (
          <div style={{ marginBottom: '6px' }}>
            <div style={{ height: '5px', background: t.colors.primary, borderRadius: '2px', width: '60%', marginBottom: '3px' }} />
            <div style={{ height: '2px', background: t.colors.accent, borderRadius: '1px', width: '40%' }} />
          </div>
        )}
        {/* Content lines */}
        <div style={{ height: '2px', background: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db', width: '40%', marginBottom: '4px', borderRadius: '1px' }} />
        {[100, 85, 90, 70, 95, 80].map((w, i) => (
          <div key={i} style={{
            height: '2px',
            background: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
            width: `${w}%`,
            borderRadius: '1px',
            marginBottom: '3px',
          }} />
        ))}
        <div style={{ height: '4px' }} />
        <div style={{ height: '2px', background: t.colors.accent + '80', width: '35%', borderRadius: '1px', marginBottom: '4px' }} />
        {[80, 65, 90].map((w, i) => (
          <div key={i} style={{
            height: '2px',
            background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
            width: `${w}%`,
            borderRadius: '1px',
            marginBottom: '3px',
          }} />
        ))}
      </div>
    </div>
  );
};

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
        height: '160px', padding: '14px',
        background: `linear-gradient(135deg, ${t.colors.primary}22, ${t.colors.accent}15)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ width: '75%' }}>
          <TemplateMockup t={t} />
        </div>
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(6,6,9,0.6)', backdropFilter: 'blur(2px)',
            borderRadius: '0',
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
          gridTemplateColumns: 'repeat(5, 1fr)',
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
