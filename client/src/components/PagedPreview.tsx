import React, { useRef, useEffect, useState } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import TemplateRenderer from '../templates/TemplateRenderer';

const MM_TO_PX = 96 / 25.4;
const PAGE_H = 297 * MM_TO_PX; // ≈ 1122.5px at 96dpi
const PAGE_GAP = 20; // visible gap between pages in the preview

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onPageCount?: (n: number) => void;
}

const PagedPreview: React.FC<Props> = ({ resume, config, onPageCount }) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // Extract margin from config settings (default to 15mm)
  const marginMm = config.settings?.margin ?? 15;
  const marginPx = marginMm * MM_TO_PX;
  
  // THE FIX:
  // USABLE_PAGE_H is the vertical space available for content on one A4 page.
  // We subtract top margin, bottom margin, and a 5mm "Safe Threshold" buffer.
  const SAFE_THRESHOLD = 5 * MM_TO_PX; 
  const USABLE_PAGE_H = PAGE_H - (marginPx * 2) - SAFE_THRESHOLD; 

  useEffect(() => {
    if (!measureRef.current) return;
    const obs = new ResizeObserver(entries => {
      // scrollHeight of the raw, un-padded template
      const h = entries[0]?.target.scrollHeight ?? 0;
      const n = Math.max(1, Math.ceil(h / USABLE_PAGE_H));
      setPageCount(n);
      onPageCount?.(n);
    });
    obs.observe(measureRef.current);
    return () => obs.disconnect();
  }, [onPageCount, USABLE_PAGE_H, resume, config]);

  return (
    <div className="paged-preview-root" style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP}px`, alignItems: 'center' }}>
      {/* Off-screen measurement render — NO PADDING HERE */}
      <div
        ref={measureRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: `calc(210mm - ${marginPx * 2}px)`, // Measure at the actual content width
        }}
      >
        <TemplateRenderer resume={resume} config={config} isPaged={true} />
      </div>

      {/* Individual A4 page clips */}
      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          className=\"preview-page\"
          style={{
            width: '210mm',
            height: '297mm',
            overflow: 'hidden',
            position: 'relative',
            background: 'white',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.2)',
            // padding removed, TemplateRenderer handles it via .paged-mode
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Content area within the margins */}
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            overflow: 'hidden',
            width: '100%'
          }}>
             <div style={{ 
                position: 'absolute', 
                top: `${-i * PAGE_H}px`, // Use full page height for clipping
                left: 0,
                right: 0
              }}>
                <TemplateRenderer resume={resume} config={config} isPaged={true} />
              </div>
          </div>

          {/* Visual threshold line in preview only */}
          <div className="no-print" style={{
            position: 'absolute',
            bottom: `${marginPx}px`,
            left: `${marginPx}px`,
            right: `${marginPx}px`,
            height: `${SAFE_THRESHOLD}px`,
            borderTop: '1px dashed rgba(99,102,241,0.2)',
            background: 'rgba(99,102,241,0.02)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ 
                fontSize: '7px', 
                color: 'rgba(99,102,241,0.4)', 
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.15em'
            }}>Safe Threshold</span>
          </div>
        </div>
      ))}

      {/* Page count badge */}
      {pageCount > 1 && (
        <div
          className="no-print"
          style={{
            alignSelf: 'flex-end',
            background: 'rgba(99,102,241,0.9)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '100px',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.06em',
          }}
        >
          {pageCount} pages
        </div>
      )}
    </div>
  );
};

export default PagedPreview;
export { PAGE_H };
