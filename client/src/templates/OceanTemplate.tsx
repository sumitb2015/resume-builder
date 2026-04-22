import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const OceanTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#0A2540';
  const accent = config.colors.accent || '#2D9CDB';
  const text = config.colors.text || '#2D3748';
  const sidebarBg = config.colors.sidebar || '#F0F6FF';

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="resume-paper" style={{
      fontFamily: '"Inter", system-ui, sans-serif',
      backgroundColor: config.colors.background || '#FFFFFF',
      color: text,
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
    }}>
      {/* FULL-WIDTH HEADER */}
      <header style={{ backgroundColor: primary, padding: '11mm 15mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, marginRight: '32px' }}>
            <h1 style={{ fontSize: '1.875em', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              {personal.name || 'YOUR NAME'}
            </h1>
            {personal.title && (
              <p style={{ fontSize: '0.75em', color: accent, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '6px 0 0' }}>
                {personal.title}
              </p>
            )}
            {personal.summary && (
              <RichContent html={personal.summary} style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '12px 0 0', maxWidth: '380px' }} />
            )}
          </div>
          {contactItems.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
              {contactItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.6875em', color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>{item}</span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* BODY: main + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', flex: 1 }}>
        {/* MAIN CONTENT */}
        <main style={{ padding: '11mm 12mm 11mm 15mm', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <OceanMainHeader title="Experience" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {experience.map(exp => (
                  <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                      <div>
                        <div style={{ fontSize: '0.8438em', fontWeight: 700, color: primary }}>{exp.role}</div>
                        <div style={{ fontSize: '0.7188em', fontWeight: 600, color: accent, marginTop: '1px' }}>{exp.company}</div>
                      </div>
                      <span style={{ fontSize: '0.6563em', color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                        {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.filter(b => b).length > 0 && (
                      <ul style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '0' }}>
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.7813em', color: text, lineHeight: 1.65, listStyle: 'none' }}>
                            <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>▸</span>
                            <RichContent html={bullet} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <OceanMainHeader title="Education" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {education.map(edu => (
                  <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.8438em', fontWeight: 700, color: primary }}>{edu.school}</div>
                      <div style={{ fontSize: '0.75em', color: '#6B7280', marginTop: '2px' }}>
                        {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                        {edu.gpa && <span style={{ marginLeft: '8px', color: text, fontWeight: 600 }}>· GPA {edu.gpa}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6563em', color: '#94A3B8', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                      {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <OceanMainHeader title="Projects" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.8125em', fontWeight: 700, color: primary }}>{p.title}</span>
                      {p.url && <span style={{ fontSize: '0.6875em', color: accent }}>{p.url}</span>}
                    </div>
                    {p.description && <RichContent html={p.description} style={{ fontSize: '0.75em', color: text, margin: '0 0 4px', lineHeight: 1.6 }} />}
                    {p.tech.length > 0 && (
                      <p style={{ fontSize: '0.6875em', color: accent, margin: 0 }}>{p.tech.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom */}
          {custom && custom.length > 0 && custom.map(section => (
            <div key={section.id}>
              <OceanMainHeader title={section.sectionTitle || 'Custom Section'} accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <span style={{ color: accent, fontWeight: 700, flexShrink: 0, fontSize: '0.7813em' }}>▸</span>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${section.id}.entries.${i}`)}
                      style={{ fontSize: '0.7813em', color: text, lineHeight: 1.65 }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ backgroundColor: sidebarBg, padding: '11mm 7mm', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Skills */}
          {skills.length > 0 && (
            <OceanSideSection title="Skills" primary={primary} accent={accent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: '0.6875em', fontWeight: 600, color: primary, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ height: '4px', backgroundColor: '#D9E8F5', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, backgroundColor: accent, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </OceanSideSection>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <OceanSideSection title="Languages" primary={primary} accent={accent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.7188em', fontWeight: 600, color: primary }}>{l.language}</span>
                    <span style={{ fontSize: '0.6563em', color: '#94A3B8' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </OceanSideSection>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <OceanSideSection title="Certifications" primary={primary} accent={accent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certifications.map(c => (
                  <div key={c.id}>
                    <div style={{ fontSize: '0.6875em', fontWeight: 700, color: primary }}>{c.name}</div>
                    {c.issuer && <div style={{ fontSize: '0.625em', color: '#94A3B8', marginTop: '1px' }}>{c.issuer}</div>}
                    {c.date && <div style={{ fontSize: '0.625em', color: accent, marginTop: '1px' }}>{c.date}</div>}
                  </div>
                ))}
              </div>
            </OceanSideSection>
          )}
        </aside>
      </div>
    </div>
  );
};

const OceanMainHeader: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ marginBottom: '14px' }}>
    <h2 style={{
      fontSize: '0.625em', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.14em', color: accent, margin: '0 0 5px',
    }}>
      {title}
    </h2>
    <div style={{ height: '1.5px', backgroundColor: `${accent}35`, width: '100%' }} />
  </div>
);

const OceanSideSection: React.FC<{ title: string; primary: string; accent: string; children: React.ReactNode }> = ({ title, primary, accent, children }) => (
  <div>
    <h2 style={{
      fontSize: '0.5625em', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.18em', color: primary,
      paddingBottom: '5px', borderBottom: `2px solid ${accent}40`,
      margin: '0 0 12px',
    }}>
      {title}
    </h2>
    {children}
  </div>
);

export default OceanTemplate;
