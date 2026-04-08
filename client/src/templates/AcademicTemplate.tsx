import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const AcademicTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;

  return (
    <div className="resume-paper" style={{ fontFamily: '"EB Garamond", Georgia, serif', backgroundColor: '#fff', color: '#1A1A1A', padding: 0, lineHeight: 1.6 }}>
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>{personal.name || 'YOUR NAME'}</h1>
        {personal.title && <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#444', marginBottom: '10px' }}>{personal.title}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px', fontSize: '12px', color: '#333' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i, arr) => (
            <React.Fragment key={i}>
              <span>{v}</span>
              {i < arr.length - 1 && <span style={{ color: '#CCC' }}>|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>
      <div style={{ borderTop: '2px solid #333', borderBottom: '0.5px solid #AAA', paddingTop: '2px', marginBottom: '20px' }} />

      {personal.summary && (
        <AcadSec title="Research Interests / Profile">
          <RichContent html={personal.summary} style={{ fontSize: '12.5px', lineHeight: 1.8, color: '#333', textAlign: 'justify' }} />
        </AcadSec>
      )}

      {education.length > 0 && (
        <AcadSec title="Education">
          {education.map(edu => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: '#333' }}>{edu.school}</div>
                {edu.gpa && <div style={{ fontSize: '12px', color: '#555' }}>GPA: {edu.gpa}</div>}
              </div>
              <span style={{ fontSize: '11.5px', color: '#666', flexShrink: 0, marginLeft: '16px' }}>{edu.startDate}{edu.startDate&&edu.endDate?' – ':''}{edu.endDate}</span>
            </div>
          ))}
        </AcadSec>
      )}

      {experience.length > 0 && (
        <AcadSec title="Academic / Professional Experience">
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '16px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{exp.role}</span>
                  {exp.company && <span style={{ fontSize: '12.5px', color: '#444', fontStyle: 'italic' }}>, {exp.company}</span>}
                </div>
                <span style={{ fontSize: '11.5px', color: '#666', flexShrink: 0, marginLeft: '16px' }}>{exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}</span>
              </div>
              <ul style={{ paddingLeft: '24px', marginTop: '4px' }}>
                {exp.bullets.filter(b=>b).map((b,i) => <li key={i} style={{ fontSize: '12.5px', color: '#333', lineHeight: 1.7 }}><RichContent html={b} /></li>)}
              </ul>
            </div>
          ))}
        </AcadSec>
      )}

      {projects.length > 0 && (
        <AcadSec title="Research Projects / Publications">
          {projects.map(p => (
            <div key={p.id} style={{ marginBottom: '10px', paddingLeft: '16px', borderLeft: '2px solid #CCC', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', fontStyle: 'italic' }}>{p.title}</span>
                {p.url && <span style={{ fontSize: '11px', color: '#444' }}>{p.url}</span>}
              </div>
              {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#444', lineHeight: 1.7 }} />}
              {p.tech.length > 0 && <div style={{ fontSize: '12px', color: '#666' }}>Methods: {p.tech.join(', ')}</div>}
            </div>
          ))}
        </AcadSec>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {skills.length > 0 && (
          <AcadSec title="Skills & Methods">
            {skills.map(s => <div key={s.id} style={{ fontSize: '12.5px', lineHeight: 1.9, breakInside: 'avoid', pageBreakInside: 'avoid' }}>• {s.name}</div>)}
          </AcadSec>
        )}
        {languages.length > 0 && (
          <AcadSec title="Languages">
            {languages.map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', lineHeight: 1.9, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <span>{l.language}</span><span style={{ color: '#666', fontStyle: 'italic' }}>{l.proficiency}</span>
              </div>
            ))}
          </AcadSec>
        )}
        {certifications.length > 0 && (
          <AcadSec title="Certifications & Awards">
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '6px', fontSize: '12.5px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                {c.issuer && <div style={{ color: '#555', fontSize: '12px' }}>{c.issuer}{c.date ? `, ${c.date}` : ''}</div>}
              </div>
            ))}
          </AcadSec>
        )}
      </div>
    </div>
  );
};

const AcadSec: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '18px' }}>
    <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#111', borderBottom: '1px solid #333', paddingBottom: '3px', marginBottom: '10px' }}>{title}</h2>
    {children}
  </div>
);

export default AcademicTemplate;
