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

  const margin = config.settings?.margin;
  const fontSizeFactor = (config.settings?.fontSize || 100) / 100;
  const lineHeight = config.settings?.lineHeight;

  // When margin is set, apply it as visual padding on .resume-paper for both
  // screen and print — this keeps the preview and the PDF perfectly in sync.
  const printPadding = margin !== undefined ? `${margin}mm` : '15mm';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .template-container {
          font-size: ${fontSizeFactor}em;
          width: 100%;
        }
        .resume-paper {
            padding: ${printPadding} !important;
            box-sizing: border-box !important;
            overflow: visible !important;
        }
        ${lineHeight !== undefined ? `.resume-paper, .resume-paper * { line-height: ${lineHeight} !important; }` : ''}
        @media print {
          @page { size: A4; margin: 0; }
          .resume-paper {
            padding: ${printPadding} !important;
            margin: 0 !important;
            min-height: 0 !important;
            width: 210mm !important;
            box-shadow: none !important;
            background: white !important;
          }
          html, body { background: white !important; }
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
