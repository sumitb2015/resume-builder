import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';

const CompactTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent || '#2563EB';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Inter", system-ui, sans-serif', color: '#1E293B', backgroundColor: '#fff', padding: '40px 48px', fontSize: '11.5px', lineHeight: 1.55 }}>
      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${accent}`, paddingBottom: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0F172A', lineHeight: 1.1, marginBottom: '3px' }}>{personal.name || 'YOUR NAME'}</h1>
            {personal.title && <p style={{ fontSize: '12px', color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{personal.title}</p>}
          </div>
          <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#64748B', lineHeight: 1.8 }}>
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
            {personal.linkedin && <div style={{ color: accent }}>{personal.linkedin}</div>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <div style={{ marginBottom: '14px', fontSize: '11.5px', lineHeight: 1.7, color: '#475569', borderLeft: `3px solid ${accent}`, paddingLeft: '10px' }}>
          {personal.summary}
        </div>
      )}

      {experience.length > 0 && (
        <CSection title="Experience" accent={accent}>
          {experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>{exp.role}</span>
                <span style={{ fontSize: '10px', color: '#94A3B8', flexShrink: 0, marginLeft: '8px' }}>{exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}</span>
              </div>
              {exp.company && <div style={{ fontSize: '10.5px', color: accent, fontWeight: 600, marginBottom: '4px' }}>{exp.company}</div>}
              <ul style={{ paddingLeft: '12px', margin: 0 }}>
                {exp.bullets.filter(b => b).map((b, i) => <li key={i} style={{ fontSize: '11px', color: '#475569', lineHeight: 1.6, marginBottom: '2px' }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </CSection>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {education.length > 0 && (
            <CSection title="Education" accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11.5px', color: '#0F172A' }}>{edu.school}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </CSection>
          )}
          {projects.length > 0 && (
            <CSection title="Projects" accent={accent}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '11.5px' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '10px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0' }}>{p.description}</p>}
                  {p.tech.length > 0 && <div style={{ fontSize: '10px', color: '#94A3B8' }}>{p.tech.join(' · ')}</div>}
                </div>
              ))}
            </CSection>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <CSection title="Skills" accent={accent}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: accent + '15', color: accent }}>{s.name}</span>
                ))}
              </div>
            </CSection>
          )}
          {languages.length > 0 && (
            <CSection title="Languages" accent={accent}>
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', lineHeight: 1.9 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span><span style={{ color: '#94A3B8' }}>{l.proficiency}</span>
                </div>
              ))}
            </CSection>
          )}
          {certifications.length > 0 && (
            <CSection title="Certifications" accent={accent}>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '11px' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '10px', color: '#64748B' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
                </div>
              ))}
            </CSection>
          )}
        </div>
      </div>
    </div>
  );
};

const CSection: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div style={{ marginBottom: '14px' }}>
    <h2 style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: accent, marginBottom: '8px', paddingBottom: '3px', borderBottom: `1px solid ${accent}40` }}>{title}</h2>
    {children}
  </div>
);

export default CompactTemplate;
