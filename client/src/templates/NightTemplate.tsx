import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const NightTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#000000';
  const text = config.colors.text || '#1A1A1A';

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="resume-paper" style={{
      fontFamily: '"Inter", system-ui, sans-serif',
      backgroundColor: config.colors.background || '#FFFFFF',
      color: text,
      padding: 0,
    }}>
      {/* FULL-BLEED BLACK HEADER */}
      <header style={{ backgroundColor: primary, padding: '36px 52px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: '"Poppins", system-ui, sans-serif', margin: 0 }}>
              {personal.name || 'YOUR NAME'}
            </h1>
            {personal.title && (
              <p style={{ fontSize: '12px', color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '6px 0 0' }}>
                {personal.title}
              </p>
            )}
          </div>
        </div>
        {contactItems.length > 0 && (
          <div style={{ marginTop: '16px', fontSize: '10.5px', color: '#CCCCCC', lineHeight: 1.8 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {item}
                {i < contactItems.length - 1 && <span style={{ color: '#555555', margin: '0 10px' }}>|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* BODY */}
      <div style={{ padding: '36px 52px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Summary */}
        {personal.summary && (
          <NightSection title="Summary" primary={primary}>
            <RichContent html={personal.summary} style={{ fontSize: '12.5px', lineHeight: 1.8, color: text, margin: 0 }} />
          </NightSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <NightSection title="Experience" primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {experience.map(exp => (
                <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: primary }}>{exp.role}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#555555', marginTop: '1px' }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#888888', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ paddingLeft: '18px', marginTop: '6px', marginBottom: 0 }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: text, lineHeight: 1.65, marginBottom: '3px' }}><RichContent html={bullet} /></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </NightSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <NightSection title="Education" primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: primary }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#555555', marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                      {edu.gpa && <span style={{ fontStyle: 'normal', color: text, marginLeft: '8px' }}>· GPA {edu.gpa}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#888888', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </NightSection>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <NightSection title="Skills" primary={primary}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map(s => (
                <span key={s.id} style={{
                  border: '1.5px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  color: text,
                  fontWeight: 500,
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </NightSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <NightSection title="Projects" primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map(p => (
                <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: '#666' }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: text, margin: '0 0 3px', lineHeight: 1.65 }} />}
                  {p.tech.length > 0 && (
                    <p style={{ fontSize: '11px', color: '#555555', margin: 0, fontStyle: 'italic' }}>
                      ({p.tech.join(', ')})
                    </p>
                  )}
                </div>
              ))}
            </div>
          </NightSection>
        )}

        {/* Bottom row: Languages + Certifications */}
        {(languages.length > 0 || certifications.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: languages.length > 0 && certifications.length > 0 ? '1fr 1fr' : '1fr', gap: '36px' }}>
            {languages.length > 0 && (
              <NightSection title="Languages" primary={primary}>
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', lineHeight: 2 }}>
                    <span style={{ fontWeight: 500, color: text }}>{l.language}</span>
                    <span style={{ fontStyle: 'italic', color: '#888888' }}>{l.proficiency}</span>
                  </div>
                ))}
              </NightSection>
            )}
            {certifications.length > 0 && (
              <NightSection title="Certifications" primary={primary}>
                {certifications.map(c => (
                  <div key={c.id} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: primary }}>{c.name}</div>
                    {(c.issuer || c.date) && (
                      <div style={{ fontSize: '11.5px', color: '#888888', marginTop: '1px' }}>
                        {c.issuer}{c.issuer && c.date ? ' · ' : ''}{c.date}
                      </div>
                    )}
                  </div>
                ))}
              </NightSection>
            )}
          </div>
        )}

        {/* Custom */}
        {custom.map(section => (
          <NightSection key={section.id} title={section.sectionTitle} primary={primary}>
            <ul style={{ paddingLeft: '18px', margin: 0 }}>
              {section.entries.filter(e => e).map((entry, i) => (
                <li key={i} style={{ fontSize: '12.5px', color: text, lineHeight: 1.65, marginBottom: '3px' }}>{entry}</li>
              ))}
            </ul>
          </NightSection>
        ))}
      </div>
    </div>
  );
};

const NightSection: React.FC<{ title: string; primary: string; children: React.ReactNode }> = ({ title, primary, children }) => (
  <section style={{ marginBottom: '20px' }}>
    <div style={{ marginBottom: '12px' }}>
      <h2 style={{
        fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
        letterSpacing: '0.25em', color: primary, margin: '0 0 5px',
        fontFamily: '"Poppins", system-ui, sans-serif',
      }}>
        {title}
      </h2>
      <div style={{ height: '3px', backgroundColor: primary, width: '100%' }} />
    </div>
    {children}
  </section>
);

export default NightTemplate;
