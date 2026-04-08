import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const UniverseTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#0F172A';
  const accent = config.colors.accent || '#2563EB';
  const text = config.colors.text || '#374151';

  const contactItems = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean);

  return (
    <div className="resume-paper" style={{
      fontFamily: '"Inter", system-ui, sans-serif',
      backgroundColor: config.colors.background || '#FFFFFF',
      color: text,
      padding: 0,
    }}>
      {/* HEADER */}
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2.125em', fontWeight: 700, color: primary, letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        <div style={{ width: '48px', height: '2px', backgroundColor: accent, margin: '8px 0' }} />
        {personal.title && (
          <p style={{ fontSize: '0.875em', fontWeight: 400, color: '#6B7280', margin: '0 0 8px' }}>
            {personal.title}
          </p>
        )}
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
            {contactItems.map((item, i) => (
              <span key={i} style={{ fontSize: '0.7188em', color: '#6B7280' }}>{item}</span>
            ))}
          </div>
        )}
      </header>

      {/* CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Summary */}
        {personal.summary && (
          <UniverseSection title="Summary" accent={accent} primary={primary}>
            <RichContent html={personal.summary} style={{ fontSize: '0.8125em', lineHeight: 1.8, color: text, margin: 0 }} />
          </UniverseSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <UniverseSection title="Experience" accent={accent} primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experience.map(exp => (
                <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ fontSize: '0.8438em', fontWeight: 700, color: primary, marginBottom: '2px' }}>{exp.role}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75em', fontWeight: 600, color: accent }}>{exp.company}</span>
                    <span style={{ fontSize: '0.6875em', color: '#9CA3AF', flexShrink: 0, marginLeft: '12px' }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '0.7813em', color: text, lineHeight: 1.65, marginBottom: '3px' }}><RichContent html={bullet} /></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <UniverseSection title="Education" accent={accent} primary={primary}>
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
                  <span style={{ fontSize: '0.6875em', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <UniverseSection title="Skills" accent={accent} primary={primary}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 0' }}>
              {skills.map((s, i) => (
                <React.Fragment key={s.id}>
                  <span style={{ fontSize: '0.7813em', color: text }}>{s.name}</span>
                  {i < skills.length - 1 && <span style={{ color: '#D1D5DB', margin: '0 10px' }}>·</span>}
                </React.Fragment>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <UniverseSection title="Projects" accent={accent} primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map(p => (
                <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.8438em', fontWeight: 700, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '0.6875em', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '0.7813em', color: text, margin: '0 0 4px', lineHeight: 1.65 }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                      {p.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: '0.6563em', backgroundColor: '#EFF6FF', color: accent, padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <UniverseSection title="Certifications" accent={accent} primary={primary}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {certifications.map(c => (
                <div key={c.id}>
                  <div style={{ fontSize: '0.7813em', fontWeight: 700, color: primary }}>{c.name}</div>
                  {(c.issuer || c.date) && (
                    <div style={{ fontSize: '0.7188em', color: '#9CA3AF', marginTop: '1px' }}>
                      {c.issuer}{c.issuer && c.date ? ' · ' : ''}{c.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <UniverseSection title="Languages" accent={accent} primary={primary}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7813em' }}>
                  <span style={{ color: text }}>{l.language}</span>
                  <span style={{ color: '#9CA3AF' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </UniverseSection>
        )}

        {/* Custom */}
        {custom.map(section => (
          <UniverseSection key={section.id} title={section.sectionTitle} accent={accent} primary={primary}>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {section.entries.filter(e => e).map((entry, i) => (
                <li key={i} style={{ fontSize: '0.7813em', color: text, lineHeight: 1.65, marginBottom: '3px' }}>{entry}</li>
              ))}
            </ul>
          </UniverseSection>
        ))}
      </div>
    </div>
  );
};

const UniverseSection: React.FC<{ title: string; accent: string; primary: string; children: React.ReactNode }> = ({ title, accent, primary, children }) => (
  <section style={{ paddingLeft: '12px', borderLeft: `3px solid ${accent}` }}>
    <h2 style={{
      fontSize: '0.6563em', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.18em', color: primary, margin: '0 0 12px',
      fontFamily: '"Inter", system-ui, sans-serif',
    }}>
      {title}
    </h2>
    {children}
  </section>
);

export default UniverseTemplate;
