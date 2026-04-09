import React, { useRef, useState, useCallback } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import MinimalTemplate from './MinimalTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import HorizonTemplate from './HorizonTemplate';
import CompactTemplate from './CompactTemplate';
import ElegantTemplate from './ElegantTemplate';
import DeveloperTemplate from './DeveloperTemplate';
import MagazineTemplate from './MagazineTemplate';
import WarmTemplate from './WarmTemplate';
import SlateTemplate from './SlateTemplate';
import BoldTemplate from './BoldTemplate';
import LineaTemplate from './LineaTemplate';
import AcademicTemplate from './AcademicTemplate';
import ForestTemplate from './ForestTemplate';
import OceanTemplate from './OceanTemplate';
import NightTemplate from './NightTemplate';
import RiverTemplate from './RiverTemplate';
import UniverseTemplate from './UniverseTemplate';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  isPaged?: boolean;
  onSectionClick?: (sectionId: string) => void;
}

interface OverlayState {
  top: number;
  left: number;
  width: number;
  height: number;
  sectionId: string;
}

const TemplateRenderer: React.FC<Props> = ({ resume, config, isPaged = false, onSectionClick }) => {
  const templateProps = { resume, config };

  const fontSizeFactor = (config.settings?.fontSize || 100) / 100;
  const lineHeight = config.settings?.lineHeight;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSectionClick) return;
    let el = e.target as HTMLElement | null;
    while (el && el !== wrapperRef.current) {
      if (el.dataset?.section) break;
      el = el.parentElement;
    }
    if (!el || !el.dataset?.section || !wrapperRef.current) { setOverlay(null); return; }
    const rect = el.getBoundingClientRect();
    const wRect = wrapperRef.current.getBoundingClientRect();
    setOverlay({
      top: rect.top - wRect.top,
      left: rect.left - wRect.left,
      width: rect.width,
      height: rect.height,
      sectionId: el.dataset.section,
    });
  }, [onSectionClick]);

  const handleMouseLeave = useCallback(() => setOverlay(null), []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSectionClick || !overlay) return;
    e.stopPropagation();
    onSectionClick(overlay.sectionId);
    setOverlay(null);
  }, [onSectionClick, overlay]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .template-container {
          --font-scale: ${fontSizeFactor};
          font-size: calc(16px * var(--font-scale));
          width: 100%;
          background: white;
        }
        .resume-paper {
            padding: 0 !important;
            box-sizing: border-box !important;
            overflow: visible !important;
            width: 100% !important;
            background: white;
            font-size: 1em;
        }
        ${lineHeight !== undefined ? `.resume-paper, .resume-paper * { line-height: ${lineHeight} !important; }` : ''}
        
        .template-container.paged-mode {
          padding: 0;
          box-sizing: border-box;
        }

        /* Essential print safety for the container itself */
        @media print {
          .template-container {
            width: 100% !important;
            background: white !important;
          }
          .resume-paper {
            width: 100% !important;
            box-shadow: none !important;
            transform: none !important;
          }
        }
      `}} />
      <div
        ref={wrapperRef}
        style={{ position: 'relative' }}
        onMouseOver={onSectionClick ? handleMouseOver : undefined}
        onMouseLeave={onSectionClick ? handleMouseLeave : undefined}
        onClick={onSectionClick ? handleClick : undefined}
      >
        <div className={`template-container ${isPaged ? 'paged-mode' : ''}`}>
          {(() => {
            switch (config.id) {
              case 'classic': return <ClassicTemplate {...templateProps} />;
              case 'modern': return <ModernTemplate {...templateProps} />;
              case 'creative': return <CreativeTemplate {...templateProps} />;
              case 'minimal': return <MinimalTemplate {...templateProps} />;
              case 'executive': return <ExecutiveTemplate {...templateProps} />;
              case 'horizon': return <HorizonTemplate {...templateProps} />;
              case 'compact': return <CompactTemplate {...templateProps} />;
              case 'elegant': return <ElegantTemplate {...templateProps} />;
              case 'developer': return <DeveloperTemplate {...templateProps} />;
              case 'magazine': return <MagazineTemplate {...templateProps} />;
              case 'warm': return <WarmTemplate {...templateProps} />;
              case 'slate': return <SlateTemplate {...templateProps} />;
              case 'bold': return <BoldTemplate {...templateProps} />;
              case 'linea': return <LineaTemplate {...templateProps} />;
              case 'academic': return <AcademicTemplate {...templateProps} />;
              case 'forest': return <ForestTemplate {...templateProps} />;
              case 'ocean': return <OceanTemplate {...templateProps} />;
              case 'night': return <NightTemplate {...templateProps} />;
              case 'river': return <RiverTemplate {...templateProps} />;
              case 'universe': return <UniverseTemplate {...templateProps} />;
              default: return <ClassicTemplate {...templateProps} />;
            }
          })()}
        </div>

        {/* Click-to-edit overlay — only rendered when onSectionClick is wired */}
        {onSectionClick && overlay && (
          <div
            style={{
              position: 'absolute',
              top: overlay.top,
              left: overlay.left,
              width: overlay.width,
              height: overlay.height,
              border: `2px dashed ${config.colors.primary}`,
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
              zIndex: 20,
              boxSizing: 'border-box',
              transition: 'opacity 0.12s ease',
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              background: 'rgba(15,20,30,0.88)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              borderRadius: '100px',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
            }}>
              ✏ Click to edit this section
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TemplateRenderer;
