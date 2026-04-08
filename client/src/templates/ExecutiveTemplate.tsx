import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ExecutiveTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: config.colors.background || '#FAFAF8',
      color: '#1a1a1a',
      padding: 0,
    }}>
      {/* TOP ACCENT BAR */}
      <div style={{ height: '6px', background: `linear-gradient(to right, ${primary}, ${accent}, ${primary})`, margin: '0 0 32px' }} />

      <div>
        {/* HEADER */}
        <header style={{ marginBottom: '32px', paddingBottom: '28px', borderBottom: `1px solid ${accent}40` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{
                fontFamily: config.fonts.heading,
                fontSize: '46px', fontWeight: 700, color: primary,
                letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: '8px',
              }}>
                {personal.name || 'YOUR NAME'}
              </h1>
              {personal.title && (
                <p style={{ fontSize: '13px', fontWeight: 400, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {personal.title}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {personal.email && <ContactLine value={personal.email} accent={accent} />}
              {personal.phone && <ContactLine value={personal.phone} accent={accent} />}
              {personal.location && <ContactLine value={personal.location} accent={accent} />}
              {personal.linkedin && <ContactLine value={personal.linkedin} accent={accent} />}
            </div>
          </div>

          {/* GOLD RULE */}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D4D4D4' }} />
            <div style={{ width: '40px', height: '3px', backgroundColor: accent }} />
            <div style={{ flex: 1, height: '1px', backgroundColor: '#D4D4D4' }} />
          </div>
        </header>

        {/* SUMMARY (full-width) */}
        {personal.summary && (
          <div style={{ marginBottom: '32px', padding: '20px 28px', backgroundColor: primary + '06', borderLeft: `4px solid ${accent}`, borderRadius: '0 6px 6px 0' }}>
            <RichContent html={personal.summary} style={{
              fontFamily: config.fonts.heading,
              fontSize: '15px', fontStyle: 'italic', color: '#2a2a2a',
              lineHeight: 1.8, fontWeight: 500,
            }} />
          </div>
        )}

        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '40px' }}>

          {/* LEFT MAIN COLUMN */}
          <div>
            {/* Experience */}
            {experience.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <ExecSectionTitle title="Professional Experience" primary={primary} accent={accent} config={config} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {experience.map(exp => (
                    <div key={exp.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                        <div>
                          <div style={{
                            fontFamily: config.fonts.heading,
                            fontSize: '18px', fontWeight: 700, color: primary, letterSpacing: '-0.01em', lineHeight: 1.2,
                          }}>{exp.role}</div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>{exp.company}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#888', flexShrink: 0, marginLeft: '12px', backgroundColor: '#F0EDE6', padding: '3px 10px', borderRadius: '12px' }}>
                          {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets.filter(b => b).length > 0 && (
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '0', marginTop: '8px' }}>
                          {exp.bullets.filter(b => b).map((bullet, i) => (
                            <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: '#444', lineHeight: 1.7, listStyle: 'none' }}>
                              <span style={{ color: accent, flexShrink: 0, fontWeight: 700 }}>◆</span>
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

            {/* Projects */}
            {projects.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <ExecSectionTitle title="Key Projects" primary={primary} accent={accent} config={config} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {projects.map(p => (
                    <div key={p.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{
                          fontFamily: config.fonts.heading,
                          fontSize: '15px', fontWeight: 700, color: primary
                        }}>{p.title}</span>
                        {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                      </div>
                      {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#555', marginTop: '4px', lineHeight: 1.65 }} />}
                      {p.tech.length > 0 && (
                        <p style={{ fontSize: '11.5px', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>{p.tech.join(' · ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Education */}
            {education.length > 0 && (
              <div>
                <ExecSectionTitle title="Education" primary={primary} accent={accent} config={config} />
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '14px' }}>
                    <div style={{
                      fontFamily: config.fonts.heading,
                      fontSize: '15px', fontWeight: 700, color: primary, lineHeight: 1.3,
                    }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '3px', lineHeight: 1.5 }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                      {edu.gpa && <span style={{ fontSize: '11.5px', color: accent, fontWeight: 700 }}>GPA {edu.gpa}</span>}
                      <span style={{ fontSize: '11px', color: '#aaa' }}>{edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <ExecSectionTitle title="Core Expertise" primary={primary} accent={accent} config={config} />
                {skills.map(s => (
                  <div key={s.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#2a2a2a' }}>{s.name}</span>
                    </div>
                    <div style={{ height: '3px', backgroundColor: '#E8E4DA', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, background: `linear-gradient(to right, ${primary}, ${accent})`, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <ExecSectionTitle title="Languages" primary={primary} accent={accent} config={config} />
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', lineHeight: 2 }}>
                    <span style={{ fontWeight: 600 }}>{l.language}</span>
                    <span style={{ color: '#888', fontSize: '12px' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <ExecSectionTitle title="Certifications" primary={primary} accent={accent} config={config} />
                {certifications.map(c => (
                  <div key={c.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #EDE8DE' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: primary }}>{c.name}</div>
                    {c.issuer && <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{c.issuer}</div>}
                    {c.date && <div style={{ fontSize: '11px', color: accent, marginTop: '2px' }}>{c.date}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExecSectionTitle: React.FC<{ title: string; primary: string; accent: string; config: TemplateConfig }> = ({ title, primary, accent, config }) => (
  <div style={{ marginBottom: '14px', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
    <h2 style={{
      fontFamily: config.fonts.heading,
      fontSize: '9.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em',
      color: primary,
    }}>
      {title}
    </h2>
    <div style={{ marginTop: '5px', height: '1px', background: `linear-gradient(to right, ${accent}80, transparent)` }} />
  </div>
);

const ContactLine: React.FC<{ value: string; accent: string }> = ({ value, accent }) => (
  <span style={{ fontSize: '11.5px', color: '#555', fontWeight: 400, borderBottom: `1px solid ${accent}30`, paddingBottom: '2px' }}>
    {value}
  </span>
);

export default ExecutiveTemplate;
