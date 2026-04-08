import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import TemplateRenderer from '../templates/TemplateRenderer';
import A4Page from './A4Page';

const PAGE_H = 1123; // A4 at 96 dpi (297mm)

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onPageCount?: (n: number) => void;
}

const PagedPreview: React.FC<Props> = ({ resume, config, onPageCount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number>(1);

  // We use ResizeObserver to detect how many pages we need based on total content height.
  // For a perfect implementation, we'd actually measure each section and split them,
  // but for many templates, CSS page-break-inside: avoid handles the PDF side.
  // The preview should ideally reflect the same.
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updatePageCount = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.scrollHeight;
      const count = Math.max(1, Math.ceil(height / PAGE_H));
      setPages(count);
      onPageCount?.(count);
    };

    const obs = new ResizeObserver(updatePageCount);
    obs.observe(containerRef.current);
    updatePageCount();
    
    return () => obs.disconnect();
  }, [resume, config, onPageCount]);

  // For the PREVIEW (screen), we show the continuous content but visually split into pages
  // using a container with fixed height multiples and "A4Page" wrappers for styling.
  
  return (
    <div className="paged-preview-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div 
        className="print-only-container" 
        style={{ position: 'relative' }}
      >
        {/* We render the content ONCE and let CSS handle the page breaks in PDF */}
        {/* For the SCREEN preview, we overlay the page boundaries */}
        <div ref={containerRef} style={{ width: '794px' }}>
           <TemplateRenderer resume={resume} config={config} />
        </div>

        {/* Page break indicators for Screen Preview */}
        <div className="no-print" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          pointerEvents: 'none' 
        }}>
          {Array.from({ length: pages }).map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute',
                top: i * PAGE_H,
                left: 0,
                right: 0,
                height: PAGE_H,
                border: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                marginBottom: '20px',
                pointerEvents: 'none',
                zIndex: -1,
                background: 'white'
              }}
            />
          ))}
          
          {/* Visual gaps and labels */}
          {Array.from({ length: pages - 1 }).map((_, i) => (
            <div 
              key={`break-${i}`}
              style={{
                position: 'absolute',
                top: (i + 1) * PAGE_H - 10,
                left: '-40px',
                right: '-40px',
                display: 'flex',
                alignItems: 'center',
                zIndex: 10
              }}
            >
               <div style={{ flex: 1, height: '2px', borderTop: '2px dashed rgba(99, 102, 241, 0.4)' }} />
               <div style={{ 
                 background: 'var(--color-ui-accent)', 
                 color: 'white', 
                 fontSize: '10px', 
                 fontWeight: 700, 
                 padding: '2px 8px', 
                 borderRadius: '100px',
                 margin: '0 10px'
               }}>
                 PAGE {i + 2}
               </div>
               <div style={{ flex: 1, height: '2px', borderTop: '2px dashed rgba(99, 102, 241, 0.4)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagedPreview;
export { PAGE_H };
