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

  // Standard resume margins are usually 12.7mm (0.5in) to 15.9mm (0.625in)
  const getPadding = () => {
    switch (config.id) {
      case 'creative':
      case 'magazine':
      case 'night':
        // These templates have full-bleed headers or sidebars, so we keep top margin 0
        // but still need side and bottom margins for the content if it's not full-bleed
        return '0 15mm 15mm 15mm';
      default:
        return '15mm 18mm';
    }
  };

  const pageMargin = getPadding();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: ${pageMargin};
          }
          .resume-paper {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          /* Ensure we don't have blank pages */
          html, body {
            background: white !important;
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
