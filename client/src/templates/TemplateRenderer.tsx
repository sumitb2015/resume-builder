import React, { Suspense, useMemo } from 'react';
import type { Resume, TemplateConfig } from '../shared/types';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  isPaged?: boolean;
  isMeasurement?: boolean;
  minHeight?: string | number;
}

// Lazy load templates for better performance and code splitting
const templates = {
  classic: React.lazy(() => import('./ClassicTemplate')),
  modern: React.lazy(() => import('./ModernTemplate')),
  creative: React.lazy(() => import('./CreativeTemplate')),
  minimal: React.lazy(() => import('./MinimalTemplate')),
  executive: React.lazy(() => import('./ExecutiveTemplate')),
  horizon: React.lazy(() => import('./HorizonTemplate')),
  compact: React.lazy(() => import('./CompactTemplate')),
  elegant: React.lazy(() => import('./ElegantTemplate')),
  developer: React.lazy(() => import('./DeveloperTemplate')),
  magazine: React.lazy(() => import('./MagazineTemplate')),
  warm: React.lazy(() => import('./WarmTemplate')),
  slate: React.lazy(() => import('./SlateTemplate')),
  bold: React.lazy(() => import('./BoldTemplate')),
  linea: React.lazy(() => import('./LineaTemplate')),
  academic: React.lazy(() => import('./AcademicTemplate')),
  forest: React.lazy(() => import('./ForestTemplate')),
  ocean: React.lazy(() => import('./OceanTemplate')),
  night: React.lazy(() => import('./NightTemplate')),
  river: React.lazy(() => import('./RiverTemplate')),
  universe: React.lazy(() => import('./UniverseTemplate')),
  professional: React.lazy(() => import('./ProfessionalTemplate')),
  startup: React.lazy(() => import('./StartupTemplate')),
  leadership: React.lazy(() => import('./LeadershipTemplate')),
  'ats-opt': React.lazy(() => import('./AtsTemplate')),
  timeline: React.lazy(() => import('./TimelineTemplate')),
  'grid-bento': React.lazy(() => import('./GridTemplate')),
  contrast: React.lazy(() => import('./ContrastTemplate')),
  matrix: React.lazy(() => import('./MatrixTemplate')),
  swiss: React.lazy(() => import('./SwissTemplate')),
  'bold-sidebar': React.lazy(() => import('./BoldSidebarTemplate')),
  centric: React.lazy(() => import('./CentricTemplate')),
  linear: React.lazy(() => import('./LinearTemplate')),
  bronzor: React.lazy(() => import('./BronzorTemplate')),
  onyx: React.lazy(() => import('./OnyxTemplate')),
  pikachu: React.lazy(() => import('./PikachuTemplate')),
  gengar: React.lazy(() => import('./GengarTemplate')),
  castelia: React.lazy(() => import('./CasteliaTemplate')),
  glalie: React.lazy(() => import('./GlalieTemplate')),
  charizard: React.lazy(() => import('./CharizardTemplate')),
  snorlax: React.lazy(() => import('./SnorlaxTemplate')),
  eevee: React.lazy(() => import('./EeveeTemplate')),
  mewtwo: React.lazy(() => import('./MewtwoTemplate')),
  lucario: React.lazy(() => import('./LucarioTemplate')),
};

const TemplateRenderer: React.FC<Props> = ({ resume, config, isPaged = false, isMeasurement = false, minHeight }) => {
  const templateProps = { resume, config };

  const fontSizeFactor = (config.settings?.fontSize || 100) / 100;
  const lineHeight = config.settings?.lineHeight;

  const TemplateComponent = useMemo(() => {
    return templates[config.id as keyof typeof templates] || templates.classic;
  }, [config.id]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .template-container {
          --font-scale: ${fontSizeFactor};
          font-size: calc(16px * var(--font-scale));
          width: 100%;
          background: white;
          display: flex;
          flex-direction: column;
        }
        .template-container > div {
            flex: 1;
            width: 100% !important;
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

        /* Override hardcoded min-height from individual templates ONLY during measurement to prevent blank pages.
           In the actual preview, we want the min-height to allow sidebars to reach the bottom. */
        ${isMeasurement ? `
        .template-container.paged-mode div {
          min-height: auto !important;
        }
        ` : ''}

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
          .photo-placeholder {
            display: none !important;
          }
        }
      `}} />
      <div 
        className={`template-container ${isPaged ? 'paged-mode' : ''}`}
        style={minHeight ? { minHeight } : undefined}
      >
        <Suspense fallback={<div style={{ height: '100%', background: 'white' }} />}>
          <TemplateComponent {...templateProps} />
        </Suspense>
      </div>
    </>
  );
};

export default TemplateRenderer;
