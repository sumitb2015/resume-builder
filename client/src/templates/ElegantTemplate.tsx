import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ElegantTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: config.colors.background || '#FFFEF9',
      color: '#2C2C2C',
      padding: 0,
    }}>
      {/* DECORATIVE TOP BORDER */}
      <div style={{ height: '3px', background: `linear-gradient(to right, transparent, ${accent}, transparent)`, marginBottom: '32px' }} />

      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: config.fonts.heading, fontSize: '2.375em', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: config.colors.primary, marginBottom: '6px', lineHeight: 1.1 }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '0.8125em', fontStyle: 'italic', color: accent, letterSpacing: '0.08em', marginBottom: '16px' }}>{personal.title}</p>
        )}
        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ height: '1px', width: '80px', background: `linear-gradient(to right, transparent, ${accent})` }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accent }} />
          <div style={{ height: '1px', width: '80px', background: `linear-gradient(to left, transparent, ${accent})` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 20px', fontSize: '0.75em', color: '#555', letterSpacing: '0.04em' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      </header>

      {personal.summary && (
        <div style={{ marginBottom: '28px', textAlign: 'center', maxWidth: '80%', margin: '0 auto 28px' }}>
          <RichContent html={personal.summary} style={{ fontSize: '0.8438em', lineHeight: 1.9, color: '#555', fontStyle: 'italic' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: '48px' }}>
        {/* LEFT COLUMN */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <ESection title="Professional Experience" accent={accent} config={config}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '18px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.875em', fontWeight: 700, color: '#1A1A1A' }}>{exp.role}</span>
                    <span style={{ fontSize: '0.6875em', color: '#888', fontStyle: 'italic' }}>{exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}</span>
                  </div>
                  {exp.company && <div style={{ fontSize: '0.75em', color: accent, fontStyle: 'italic', marginBottom: '6px' }}>{exp.company}</div>}
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {exp.bullets.filter(b=>b).map((b,i) => <li key={i} style={{ fontSize: '0.7813em', color: '#444', lineHeight: 1.75, marginBottom: '3px' }}><RichContent html={b} /></li>)}
                  </ul>
                </div>
              ))}
            </ESection>
          )}
          {projects.length > 0 && (
            <ESection title="Notable Projects" accent={accent} config={config}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '12px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8125em', fontWeight: 700 }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '0.6875em', color: accent, fontStyle: 'italic' }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '0.75em', color: '#555', lineHeight: 1.7, marginTop: '3px' }} />}
                  {p.tech.length > 0 && <div style={{ fontSize: '0.7188em', color: '#888', fontStyle: 'italic', marginTop: '2px' }}>{p.tech.join(' · ')}</div>}
                </div>
              ))}
            </ESection>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: '180px', flexShrink: 0 }}>
          {education.length > 0 && (
            <ESection title="Education" accent={accent} config={config}>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '14px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ fontSize: '0.7813em', fontWeight: 700, color: '#1A1A1A' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.7188em', color: '#666', fontStyle: 'italic', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  <div style={{ fontSize: '0.6875em', color: '#888', marginTop: '2px' }}>{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </ESection>
          )}
          {skills.length > 0 && (
            <ESection title="Expertise" accent={accent} config={config}>
              {skills.map(s => (
                <div key={s.id} style={{ fontSize: '0.75em', color: '#444', lineHeight: 1.9, display: 'flex', alignItems: 'center', gap: '6px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <span style={{ color: accent, fontSize: '0.625em' }}>✦</span>{s.name}
                </div>
              ))}
            </ESection>
          )}
          {languages.length > 0 && (
            <ESection title="Languages" accent={accent} config={config}>
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', lineHeight: 1.9, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <span>{l.language}</span><span style={{ color: '#888', fontStyle: 'italic', fontSize: '0.6875em' }}>{l.proficiency}</span>
                </div>
              ))}
            </ESection>
          )}
          {certifications.length > 0 && (
            <ESection title="Certifications" accent={accent} config={config}>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '8px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ fontSize: '0.75em', fontWeight: 700 }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '0.6875em', color: '#888', fontStyle: 'italic' }}>{c.issuer}</div>}
                </div>
              ))}
            </ESection>
          )}
        </div>
      </div>

      {/* DECORATIVE BOTTOM */}
      <div style={{ height: '3px', background: `linear-gradient(to right, transparent, ${accent}, transparent)`, marginTop: '32px' }} />
    </div>
  );
};

const ESection: React.FC<{ title: string; accent: string; config: TemplateConfig; children: React.ReactNode }> = ({ title, accent, config, children }) => (
  <div style={{ marginBottom: '22px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <h2 style={{ fontFamily: config.fonts.heading, fontSize: '0.625em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em', color: accent, whiteSpace: 'nowrap' }}>{title}</h2>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${accent}60, transparent)` }} />
    </div>
    {children}
  </div>
);

export default ElegantTemplate;
