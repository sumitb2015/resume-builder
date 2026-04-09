import React from 'react';
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
import ProfessionalTemplate from './ProfessionalTemplate';
import StartupTemplate from './StartupTemplate';
import LeadershipTemplate from './LeadershipTemplate';
import AtsTemplate from './AtsTemplate';
import TimelineTemplate from './TimelineTemplate';
import GridTemplate from './GridTemplate';
import ContrastTemplate from './ContrastTemplate';
import MatrixTemplate from './MatrixTemplate';
import SwissTemplate from './SwissTemplate';
import BoldSidebarTemplate from './BoldSidebarTemplate';
import CentricTemplate from './CentricTemplate';
import LinearTemplate from './LinearTemplate';

interface Props {
  resume: Resume;
  config: TemplateConfig;
  isPaged?: boolean;
}

const TemplateRenderer: React.FC<Props> = ({ resume, config, isPaged = false }) => {
  const templateProps = { resume, config };

  const fontSizeFactor = (config.settings?.fontSize || 100) / 100;
  const lineHeight = config.settings?.lineHeight;

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
            case 'professional': return <ProfessionalTemplate {...templateProps} />;
            case 'startup': return <StartupTemplate {...templateProps} />;
            case 'leadership': return <LeadershipTemplate {...templateProps} />;
            case 'ats-opt': return <AtsTemplate {...templateProps} />;
            case 'timeline': return <TimelineTemplate {...templateProps} />;
            case 'grid-bento': return <GridTemplate {...templateProps} />;
            case 'contrast': return <ContrastTemplate {...templateProps} />;
            case 'matrix': return <MatrixTemplate {...templateProps} />;
            case 'swiss': return <SwissTemplate {...templateProps} />;
            case 'bold-sidebar': return <BoldSidebarTemplate {...templateProps} />;
            case 'centric': return <CentricTemplate {...templateProps} />;
            case 'linear': return <LinearTemplate {...templateProps} />;
            default: return <ClassicTemplate {...templateProps} />;
          }
        })()}
      </div>
    </>
  );
};

export default TemplateRenderer;
