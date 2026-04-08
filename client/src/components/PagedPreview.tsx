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

  useEffect(() => {
    if (!measureRef.current) return;
    const obs = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect.height ?? 0;
      const n = Math.max(1, Math.ceil(h / PAGE_H));
      setPageCount(n);
      onPageCount?.(n);
    });
    obs.observe(measureRef.current);
    return () => obs.disconnect();
  }, [onPageCount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${PAGE_GAP}px`, alignItems: 'flex-start' }}>
      {/* Off-screen measurement render — invisible, not printed */}
      <div
        ref={measureRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <TemplateRenderer resume={resume} config={config} />
      </div>

      {/* Individual A4 page clips — each shows only its vertical slice */}
      {Array.from({ length: pageCount }, (_, i) => (
        <div
          key={i}
          style={{
            width: '794px',
            height: `${PAGE_H}px`,
            overflow: 'hidden',
            position: 'relative',
            background: 'white',
            boxShadow:
              '0 4px 6px -1px rgba(0,0,0,0.3), 0 20px 40px -5px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)',
          }}
        >
          {/* Shift the full template up so this page's slice is visible */}
          <div style={{ position: 'absolute', top: `${-i * PAGE_H}px`, left: 0 }}>
            <TemplateRenderer resume={resume} config={config} />
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
