import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const RiverTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#000000';
  const text = config.colors.text || '#1A1A1A';

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="resume-paper" style={{
      fontFamily: 'Georgia, "Times New Roman", serif',
      backgroundColor: config.colors.background || '#FFFFFF',
      color: text,
      padding: 0,
      lineHeight: 1.5,
    }}>
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, margin: 0 }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '0.8125em', fontStyle: 'italic', color: '#444', margin: '4px 0 0' }}>
            {personal.title}
          </p>
        )}
        {contactItems.length > 0 && (
          <p style={{ fontSize: '0.7188em', color: '#333', margin: '10px 0 0', lineHeight: 1.8 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {item}
                {i < contactItems.length - 1 && <span style={{ color: '#AAA', margin: '0 8px' }}>·</span>}
              </React.Fragment>
            ))}
          </p>
        )}
        <div style={{ borderTop: '1.5px solid #000', marginTop: '12px', marginBottom: '2px' }} />
        <div style={{ borderTop: '0.5px solid #888', marginBottom: '6px' }} />
      </header>

      {/* CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Summary */}
        {personal.summary && (
          <RiverSection title="Profile">
            <RichContent html={personal.summary} style={{ fontSize: '0.7813em', textAlign: 'justify', lineHeight: 1.8, color: text }} />
          </RiverSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <RiverSection title="Experience">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experience.map(exp => (
                <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.8125em', fontWeight: 700, color: primary }}>
                      {exp.role}{exp.role && exp.company ? ' — ' : ''}{exp.company}
                    </span>
                    <span style={{ fontSize: '0.7188em', color: '#555', flexShrink: 0, marginLeft: '12px' }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ paddingLeft: '22px', marginTop: '6px', marginBottom: 0 }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '0.7813em', lineHeight: 1.7, color: text, marginBottom: '2px' }}><RichContent html={bullet} /></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </RiverSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <RiverSection title="Education">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.8125em', fontWeight: 700, color: primary }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </span>
                    {edu.school && (
                      <div style={{ fontSize: '0.7813em', fontStyle: 'italic', color: '#444', marginTop: '1px' }}>
                        {edu.school}{edu.gpa ? <span style={{ fontStyle: 'normal', color: '#333', marginLeft: '8px' }}>· GPA {edu.gpa}</span> : ''}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7188em', color: '#555', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </RiverSection>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <RiverSection title="Skills">
            <p style={{ fontSize: '0.7813em', lineHeight: 1.8, color: text }}>
              {skills.map((s, i) => (
                <React.Fragment key={s.id}>
                  {s.name}
                  {i < skills.length - 1 && <span style={{ color: '#999', margin: '0 6px' }}>·</span>}
                </React.Fragment>
              ))}
            </p>
          </RiverSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <RiverSection title="Projects">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map(p => (
                <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <span style={{ fontSize: '0.8125em', fontWeight: 700, fontStyle: 'italic', color: primary }}>{p.title}</span>
                  {p.url && <span style={{ fontSize: '0.7188em', color: '#666', marginLeft: '10px' }}>{p.url}</span>}
                  {p.description && <RichContent html={p.description} style={{ fontSize: '0.7813em', color: text, marginTop: '3px', lineHeight: 1.7 }} />}
                  {p.tech.length > 0 && (
                    <p style={{ fontSize: '0.7188em', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                      Technologies: {p.tech.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RiverSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <RiverSection title="Certifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {certifications.map(c => (
                <p key={c.id} style={{ fontSize: '0.75em', color: text, margin: 0 }}>
                  <strong>{c.name}</strong>
                  {c.issuer && <span style={{ color: '#555' }}> · {c.issuer}</span>}
                  {c.date && <span style={{ color: '#555' }}> · {c.date}</span>}
                </p>
              ))}
            </div>
          </RiverSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <RiverSection title="Languages">
            <p style={{ fontSize: '0.7813em', color: text, lineHeight: 1.8 }}>
              {languages.map((l, i) => (
                <React.Fragment key={l.id}>
                  {l.language}{l.proficiency ? ` (${l.proficiency})` : ''}
                  {i < languages.length - 1 && <span style={{ color: '#999', margin: '0 6px' }}>,</span>}
                </React.Fragment>
              ))}
            </p>
          </RiverSection>
        )}

        {/* Custom */}
        {custom.map(section => (
          <RiverSection key={section.id} title={section.sectionTitle}>
            <ul style={{ paddingLeft: '22px', margin: 0 }}>
              {section.entries.filter(e => e).map((entry, i) => (
                <li key={i} style={{ fontSize: '0.7813em', lineHeight: 1.7, color: text, marginBottom: '2px' }}>{entry}</li>
              ))}
            </ul>
          </RiverSection>
        ))}
      </div>
    </div>
  );
};

const RiverSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: '16px' }}>
    <div style={{ borderTop: '1px solid #000', paddingTop: '3px', marginBottom: '2px' }} />
    <h2 style={{
      fontSize: '0.75em', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.12em', textAlign: 'center',
      fontFamily: 'Georgia, "Times New Roman", serif',
      color: '#000', margin: '0 0 2px',
    }}>
      {title}
    </h2>
    <div style={{ borderTop: '0.5px solid #666', marginBottom: '10px' }} />
    {children}
  </section>
);

export default RiverTemplate;
