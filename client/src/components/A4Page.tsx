import React from 'react';

interface Props {
  children: React.ReactNode;
  pageNumber?: number;
  total?: number;
}

const A4Page: React.FC<Props> = ({ children, pageNumber, total }) => {
  return (
    <div className="resume-paper" style={{ 
      position: 'relative',
      marginBottom: '32px', // Gap between pages in preview
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 20px 40px -5px rgba(0,0,0,0.4)',
    }}>
      {children}
      
      {/* Page indicator (preview only) */}
      {pageNumber && total && (
        <div className="no-print" style={{
          position: 'absolute',
          bottom: '-24px',
          right: '0',
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--color-ui-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Page {pageNumber} of {total}
        </div>
      )}
    </div>
  );
};

export default A4Page;
