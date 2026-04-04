import React, { useRef, useEffect, useState } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import TemplateRenderer from '../templates/TemplateRenderer';

const PAGE_H = 1123; // A4 at 96 dpi

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onPageCount?: (n: number) => void;
}

const PagedPreview: React.FC<Props> = ({ resume, config, onPageCount }) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!paperRef.current) return;
    const obs = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect.height ?? 0;
      const n = Math.max(1, Math.ceil(h / PAGE_H));
      setPageCount(n);
      onPageCount?.(n);
    });
    obs.observe(paperRef.current);
    return () => obs.disconnect();
  }, [onPageCount]);

  // Build an array of page-break line positions (skip pos 0)
  const breakLines = Array.from({ length: pageCount - 1 }, (_, i) => (i + 1) * PAGE_H);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* The actual resume */}
      <div ref={paperRef}>
        <TemplateRenderer resume={resume} config={config} />
      </div>

      {/* Page break lines overlay — no-print so they don't appear in PDF */}
      <div
        className="no-print"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {breakLines.map(y => (
          <div key={y} style={{ position: 'absolute', top: `${y}px`, left: 0, right: 0 }}>
            {/* Dashed separator line */}
            <div style={{
              borderTop: '2px dashed rgba(99,102,241,0.5)',
              position: 'relative',
            }}>
              {/* "Page N" badge on the left */}
              <div style={{
                position: 'absolute', top: '-10px', left: '12px',
                background: 'rgba(99,102,241,0.85)', color: '#fff',
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '2px 8px', borderRadius: '100px',
                fontFamily: 'system-ui, sans-serif',
              }}>
                PAGE {Math.round(y / PAGE_H) + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Page counter badge — shown only when content spans >1 page */}
      {pageCount > 1 && (
        <div
          className="no-print"
          style={{
            position: 'absolute', bottom: '-32px', right: 0,
            background: 'rgba(99,102,241,0.9)', color: '#fff',
            fontSize: '10px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '100px', fontFamily: 'system-ui, sans-serif',
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
