import { useState, useEffect } from 'react';
import { X, Sparkles, ZoomIn, ZoomOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { stripHtml } from '../lib/htmlUtils';
import TemplateRenderer from '../templates/TemplateRenderer';
import type { Resume, TemplateConfig } from '../shared/types';

interface Props {
  originalResume: Resume;
  tailoredResume: Resume;
  config: TemplateConfig;
  totalSuggestions: number;
  onClose: () => void;
}

type MobileTab = 'original' | 'tailored';

const MM_TO_PX = 96 / 25.4;
const RESUME_NATURAL_W = 210 * MM_TO_PX;  // ~794px

// App layout constants — must match DashboardLayout
const SIDEBAR_W = 72;
const TOPBAR_H = 56;

const MODAL_MARGIN = 16;

// Wrap changed HTML content in a highlighted span.
// Uses a Set of original bullet texts for O(1) lookup.
function applyChangeHighlights(original: Resume, tailored: Resume): Resume {
  const result: Resume = JSON.parse(JSON.stringify(tailored));
  const GREEN = 'background:#fef08a;color:#15803d;font-weight:600;border-radius:2px;';

  // Summary
  const origSummary = stripHtml(original.personal.summary || '').trim();
  const tailSummary = stripHtml(tailored.personal.summary || '').trim();
  if (origSummary !== tailSummary && tailSummary) {
    result.personal.summary = `<div style="${GREEN}">${tailored.personal.summary}</div>`;
  }

  // Bullets — build a set of all original bullet texts for fast lookup
  const origBulletSet = new Set(
    original.experience.flatMap(e => e.bullets.map(b => stripHtml(b).trim()))
  );
  result.experience = result.experience.map(exp => ({
    ...exp,
    bullets: exp.bullets.map(b => {
      const plain = stripHtml(b).trim();
      if (plain && !origBulletSet.has(plain)) {
        return `<div style="${GREEN}">${b}</div>`;
      }
      return b;
    }),
  }));

  return result;
}

export default function ResumeComparisonModal({
  originalResume,
  tailoredResume,
  config,
  totalSuggestions,
  onClose,
}: Props) {
  const [mobileTab, setMobileTab] = useState<MobileTab>('tailored');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Offset to leave app header + sidebar visible
  const leftOffset = isMobile ? 0 : SIDEBAR_W;
  const topOffset = isMobile ? 0 : TOPBAR_H;

  const ZOOM_STEP = 0.1;
  const ZOOM_MIN = 0.3;
  const ZOOM_MAX = 1.5;
  const [zoom, setZoom] = useState(1.0);

  const zoomIn = () => setZoom(z => parseFloat(Math.min(ZOOM_MAX, z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom(z => parseFloat(Math.max(ZOOM_MIN, z - ZOOM_STEP).toFixed(2)));

  // Pre-compute highlighted version of the tailored resume
  const highlightedTailored = applyChangeHighlights(originalResume, tailoredResume);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: topOffset,
        left: leftOffset,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Modal shell */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          margin: `${MODAL_MARGIN}px`,
          background: 'var(--color-ui-surface)',
          borderRadius: '14px',
          border: '1px solid var(--color-ui-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--color-ui-border)',
            flexShrink: 0,
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <Sparkles size={15} style={{ color: '#A855F7', flexShrink: 0 }} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-ui-text)', whiteSpace: 'nowrap' }}>
              Resume Comparison
            </span>
            <span style={{
              padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
              background: 'rgba(74,222,128,0.12)', color: '#4ADE80',
              border: '1px solid rgba(74,222,128,0.25)', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {totalSuggestions} improvement{totalSuggestions !== 1 ? 's' : ''} applied
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Zoom controls */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              background: 'var(--color-ui-bg)', border: '1px solid var(--color-ui-border)',
              borderRadius: '8px', padding: '3px',
            }}>
              <button
                onClick={zoomOut}
                disabled={zoom <= ZOOM_MIN}
                title="Zoom out"
                style={{
                  display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: '5px',
                  border: 'none', cursor: zoom <= ZOOM_MIN ? 'not-allowed' : 'pointer',
                  background: 'transparent', color: 'var(--color-ui-text)',
                  opacity: zoom <= ZOOM_MIN ? 0.35 : 1,
                }}
              >
                <ZoomOut size={13} />
              </button>
              <span style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--color-ui-text-muted)',
                minWidth: '34px', textAlign: 'center', userSelect: 'none',
              }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoom >= ZOOM_MAX}
                title="Zoom in"
                style={{
                  display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: '5px',
                  border: 'none', cursor: zoom >= ZOOM_MAX ? 'not-allowed' : 'pointer',
                  background: 'transparent', color: 'var(--color-ui-text)',
                  opacity: zoom >= ZOOM_MAX ? 0.35 : 1,
                }}
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {isMobile && (
              <MobileTabSwitcher activeTab={mobileTab} onTabChange={setMobileTab} />
            )}

            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--color-ui-text-muted)', padding: '4px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', lineHeight: 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '10px 16px', borderTop: '1px solid var(--color-ui-border)',
          background: 'var(--color-ui-surface)', flexShrink: 0,
        }}>
          <button
            className="btn-secondary"
            style={{ gap: '6px', fontSize: '12.5px' }}
            onClick={() => { onClose(); navigate('/builder'); }}
          >
            <ArrowLeft size={13} /> Back to Builder
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
          {(!isMobile || mobileTab === 'original') && (
            <ResumePanel
              label="Original"
              badge={null}
              resume={originalResume}
              config={config}
              zoom={zoom}
              accent={false}
            />
          )}

          {!isMobile && (
            <div style={{ width: '1px', background: 'var(--color-ui-border)', flexShrink: 0 }} />
          )}

          {(!isMobile || mobileTab === 'tailored') && (
            <ResumePanel
              label="AI Tailored"
              badge={`All ${totalSuggestions} suggestion${totalSuggestions !== 1 ? 's' : ''} applied`}
              resume={highlightedTailored}
              config={config}
              zoom={zoom}
              accent={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ResumePanel({
  label,
  badge,
  resume,
  config,
  zoom,
  accent,
}: {
  label: string;
  badge: string | null;
  resume: Resume;
  config: TemplateConfig;
  zoom: number;
  accent: boolean;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-ui-bg)', minWidth: 0 }}>
      {/* Panel label */}
      <div style={{
        padding: '9px 16px',
        borderBottom: `2px solid ${accent ? '#4ADE80' : 'var(--color-ui-border)'}`,
        display: 'flex', alignItems: 'center', gap: '8px',
        background: accent ? 'rgba(74,222,128,0.04)' : 'var(--color-ui-surface)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: accent ? '#4ADE80' : 'var(--color-ui-text-muted)',
        }}>
          {label}
        </span>
        {badge && (
          <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 400, opacity: 0.75 }}>
            — {badge}
          </span>
        )}
      </div>

      {/* Scrollable resume — CSS zoom scales layout correctly for multi-page scroll */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          // zoom scales both visuals AND layout dimensions, unlike transform:scale
          zoom: zoom,
          width: `${RESUME_NATURAL_W}px`,
          flexShrink: 0,
          background: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          borderRadius: '2px',
          pointerEvents: 'none',
          userSelect: 'none',
        } as React.CSSProperties}>
          <TemplateRenderer resume={resume} config={config} />
        </div>
      </div>
    </div>
  );
}

function MobileTabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: MobileTab;
  onTabChange: (t: MobileTab) => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: '2px',
      background: 'var(--color-ui-bg)', border: '1px solid var(--color-ui-border)',
      borderRadius: '8px', padding: '3px',
    }}>
      {(['original', 'tailored'] as const).map(t => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          style={{
            padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: activeTab === t
              ? t === 'tailored' ? 'rgba(74,222,128,0.15)' : 'var(--color-ui-surface)'
              : 'transparent',
            color: activeTab === t
              ? t === 'tailored' ? '#4ADE80' : 'var(--color-ui-text)'
              : 'var(--color-ui-text-muted)',
            fontSize: '11px', fontWeight: activeTab === t ? 700 : 400,
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}
        >
          {t === 'original' ? 'Original' : 'AI Tailored'}
        </button>
      ))}
    </div>
  );
}
