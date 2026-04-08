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

interface Props {
  resume: Resume;
  config: TemplateConfig;
}

const TemplateRenderer: React.FC<Props> = ({ resume, config }) => {
  const templateProps = { resume, config };

  const margin = config.settings?.margin ?? 15;
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
        
        @media print {
          @page { 
            size: A4; 
            margin: 0 !important; 
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
            background: white !important;
          }
          .template-container {
            width: 100% !important;
            padding: ${margin}mm !important;
            box-sizing: border-box !important;
          }
          .resume-paper {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            background: white !important;
            transform: none !important;
          }
        }
      `}} />
      <div className="template-container">
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
    </>
  );
};

export default TemplateRenderer;
