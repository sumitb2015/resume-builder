import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import TemplateRenderer from '../templates/TemplateRenderer';

const MM_TO_PX = 96 / 25.4;
const PAGE_H = 297 * MM_TO_PX; // ≈ 1122.5px at 96dpi
const PAGE_GAP = 20; // visible gap between pages in the preview

// Minimum px of content that must appear on a page before a smart break is allowed,
// prevents near-empty pages when an element starts very near the top of a page.
const MIN_PAGE_CONTENT_PX = 100;

interface Props {
  resume: Resume;
  config: TemplateConfig;
  onPageCount?: (n: number) => void;
  forcePageCount?: number;
}

const PagedPreview: React.FC<Props> = ({ resume, config, onPageCount, forcePageCount }) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [internalPageCount, setInternalPageCount] = useState(1);
  // pageBreaks[i] = y-offset (px) within the full content where page i starts
  const [pageBreaks, setPageBreaks] = useState<number[]>([0]);

  const pageCount = forcePageCount !== undefined ? forcePageCount : internalPageCount;

  const marginMm = config.settings?.margin ?? 15;
  const marginPx = marginMm * MM_TO_PX;

  const SAFE_THRESHOLD = 5 * MM_TO_PX;
  // Vertical pixels available for content on one A4 page (after margins + safe zone)
  const USABLE_PAGE_H = PAGE_H - marginPx * 2 - SAFE_THRESHOLD;

  /**
   * Walk the off-screen measurement div's DOM to find smart page break positions.
   * For each ideal break at pageStart + USABLE_PAGE_H, we detect any element that
   * would be visually clipped and move the break to just before that element so
   * the full element is pushed to the next page.
   */
  const computeBreaks = useCallback(() => {
    const container = measureRef.current;
    if (!container) return;

    const totalH = container.scrollHeight;
    if (totalH === 0) return;

    const containerRect = container.getBoundingClientRect();

    // --- Build candidate set ---
    // Semantic block elements that must not be split mid-render
    const semanticEls = Array.from(
      container.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, tr')
    );

    // Divs / sections that have break-inside:avoid inline (resume entry wrappers),
    // filtered to those that are small enough to actually be "atomic" entries
    // (large section containers are intentionally excluded).
    const noBreakDivs = Array.from(
      container.querySelectorAll('div, section')
    ).filter(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.breakInside !== 'avoid') return false;
      const h = el.getBoundingClientRect().height;
      return h > 0 && h < USABLE_PAGE_H * 0.75;
    });

    // Deduplicate and drop zero-height elements
    const seen = new Set<Element>();
    const candidates: Element[] = [];
    for (const el of [...semanticEls, ...noBreakDivs]) {
      if (!seen.has(el) && el.getBoundingClientRect().height > 0) {
        seen.add(el);
        candidates.push(el);
      }
    }

    // --- Compute break positions ---
    const breaks: number[] = [0];
    let pageStart = 0;

    while (true) {
      const idealEnd = pageStart + USABLE_PAGE_H;
      if (idealEnd >= totalH) break;

      // Default: clip at the ideal boundary
      let bestBreak = idealEnd;
      let foundSmartBreak = false;

      for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        // Position relative to the top of the measurement container
        const elTop = rect.top - containerRect.top;
        const elBottom = rect.bottom - containerRect.top;

        // Element straddles the page boundary AND has meaningful content above it
        if (
          elTop < idealEnd &&
          elBottom > idealEnd &&
          elTop > pageStart + MIN_PAGE_CONTENT_PX
        ) {
          // Among all straddling elements, take the one that starts LATEST
          // (keeps maximum content on this page while avoiding the clip).
          if (!foundSmartBreak || elTop > bestBreak) {
            bestBreak = elTop;
            foundSmartBreak = true;
          }
        }
      }

      // Safety: never regress (would cause an infinite loop)
      if (bestBreak <= pageStart) {
        bestBreak = idealEnd;
      }

      breaks.push(bestBreak);
      pageStart = bestBreak;
    }

    setPageBreaks(breaks);
    const n = breaks.length;
    setInternalPageCount(n);
    onPageCount?.(n);
  }, [USABLE_PAGE_H, onPageCount]);

  // Re-run whenever the off-screen content resizes (covers resume/config changes too)
  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;
    const obs = new ResizeObserver(() => {
      computeBreaks();
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, [computeBreaks]);

  return (
    <div
      className="paged-preview-root"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: `${PAGE_GAP}px`, 
        alignItems: 'center',
        width: '210mm',
        minWidth: '210mm',
        flexShrink: 0,
      }}
    >
      {/* Off-screen measurement render — no padding so scrollHeight = raw content height */}
      <div
        ref={measureRef}
        style={{
          position: 'absolute',
          top: 0,
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          width: `calc(210mm - ${marginPx * 2}px)`,
        }}
      >
        <TemplateRenderer resume={resume} config={config} isPaged={true} isMeasurement={true} />
      </div>

      {/* Individual A4 page clips */}
      {Array.from({ length: pageCount }, (_, i) => {
        // Use smart break position; fall back to uniform division for pages beyond
        // what computeBreaks has returned (e.g. when forcePageCount > computed count).
        const pageTop = pageBreaks[i] ?? i * USABLE_PAGE_H;
        return (
          <div
            key={i}
            className="preview-page"
            style={{
              width: '210mm',
              minWidth: '210mm',
              height: '297mm',
              overflow: 'hidden',
              position: 'relative',
              background: 'white',
              boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.2)',
              padding: `${marginMm}mm`,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Content area — explicitly clamped to USABLE_PAGE_H so the clip boundary
                matches the smart break positions exactly. The remaining SAFE_THRESHOLD
                pixels in the padding box appear as whitespace above the bottom margin. */}
            <div style={{
              height: `${USABLE_PAGE_H}px`,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}>
              <div style={{
                position: 'absolute',
                top: `${-pageTop}px`,
                left: 0,
                right: 0,
              }}>
                <TemplateRenderer 
                  resume={resume} 
                  config={config} 
                  isPaged={true} 
                  minHeight={`${pageTop + USABLE_PAGE_H}px`}
                />
              </div>
            </div>

            {/* Visual safe-threshold zone — screen only, not printed */}
            <div
              className="no-print"
              style={{
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
                pointerEvents: 'none',
              }}
            >
              <span style={{
                fontSize: '7px',
                color: 'rgba(99,102,241,0.4)',
                textTransform: 'uppercase',
                fontWeight: 800,
                letterSpacing: '0.15em',
              }}>Safe Threshold</span>
            </div>
          </div>
        );
      })}

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
