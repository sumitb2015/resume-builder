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
  
  // THE FIX: We add a small 5mm "buffer" to the usable height.
  // This ensures that if a line of text is right on the edge, 
  // it gets pushed to the next page in the preview rather than being cut.
  // We subtract it from the total PAGE_H (297mm) because TemplateRenderer
  // already applies marginPx as padding inside the 297mm height.
  const SAFE_THRESHOLD = 5 * MM_TO_PX; 
  const USABLE_PAGE_H = PAGE_H - SAFE_THRESHOLD; 

  useEffect(() => {
    if (!measureRef.current) return;
    const obs = new ResizeObserver(entries => {
      const h = entries[0]?.target.scrollHeight ?? 0;
      const n = Math.max(1, Math.ceil(h / USABLE_PAGE_H));
      setPageCount(n);
      onPageCount?.(n);
    });
    obs.observe(measureRef.current);
    return () => obs.disconnect();
  }, [onPageCount, USABLE_PAGE_H, resume, config]); // Re-run on config change

  return (
    <div className="paged-preview-root" style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP}px`, alignItems: 'center' }}>
      {/* Off-screen measurement render */}
      <div
        ref={measureRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
          width: '210mm',
        }}
      >
        <TemplateRenderer resume={resume} config={config} />
      </div>

      {/* Individual A4 page clips */}
      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          className="preview-page"
          style={{
            width: '210mm',
            height: '297mm',
            overflow: 'hidden',
            position: 'relative',
            background: 'white',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.2)',
          }}
        >
          {/* Shift the full template up so this page's slice is visible */}
          <div style={{ 
            position: 'absolute', 
            top: `${-i * USABLE_PAGE_H}px`, 
            left: 0,
            right: 0
          }}>
            <TemplateRenderer resume={resume} config={config} />
          </div>

          {/* Visual threshold line in preview only */}
          <div className="no-print" style={{
            position: 'absolute',
            bottom: `${marginPx}px`,
            left: 0,
            right: 0,
            borderTop: '1px dashed rgba(99,102,241,0.15)',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ 
                fontSize: '7px', 
                color: 'rgba(99,102,241,0.3)', 
                background: 'white',
                padding: '0 8px',
                marginTop: '-5px',
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.15em'
            }}>Page {i + 1} Bottom Margin</span>
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
