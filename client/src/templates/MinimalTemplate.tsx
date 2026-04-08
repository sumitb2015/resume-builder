import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const MinimalTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent || '#111827';

  return (
    <div className="resume-paper" style={{
      fontFamily: '"DM Sans", system-ui, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#1a1a1a',
      padding: '44px 52px',
    }}>
      {/* HEADER */}
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 300, letterSpacing: '-0.03em', color: '#0a0a0a', marginBottom: '8px', lineHeight: 1.1 }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '15px', fontWeight: 400, color: '#888', letterSpacing: '0.01em', marginBottom: '24px' }}>
            {personal.title}
          </p>
        )}
        <div style={{ height: '1px', backgroundColor: '#E5E5E5', marginBottom: '24px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '11.5px', color: '#777', letterSpacing: '0.02em' }}>{v}</span>
          ))}
        </div>
      </header>

      {/* CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Summary */}
        {personal.summary && (
          <MinimalSection title="Profile" accent={accent}>
            <RichContent html={personal.summary} style={{ fontSize: '13px', lineHeight: 1.85, color: '#444', fontWeight: 400 }} />
          </MinimalSection>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <MinimalSection title="Experience" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {experience.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.01em' }}>{exp.company}</span>
                      {exp.role && <span style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{exp.role}</span>}
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#aaa', flexShrink: 0, marginLeft: '12px' }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '0', marginTop: '8px' }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ display: 'flex', gap: '12px', fontSize: '12.5px', color: '#555', lineHeight: 1.7, listStyle: 'none' }}>
                          <span style={{ color: '#ccc', flexShrink: 0 }}>–</span>
                          <RichContent html={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MinimalSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MinimalSection title="Education" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a' }}>{edu.school}</div>
                    <div style={{ fontSize: '12.5px', color: '#777', marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                      {edu.gpa && <span style={{ marginLeft: '8px', color: '#444', fontWeight: 500 }}>· GPA {edu.gpa}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#aaa', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </MinimalSection>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <MinimalSection title="Skills" accent={accent}>
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '32px', rowGap: '8px' }}>
              {skills.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#222', fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1,2,3,4,5].map(d => (
                      <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: (d * 20) <= s.level ? accent : '#E5E5E5' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MinimalSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MinimalSection title="Projects" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {projects.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0a0a0a' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11.5px', color: '#aaa' }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#555', marginTop: '4px', lineHeight: 1.7 }} />}
                  {p.tech.length > 0 && (
                    <p style={{ fontSize: '11.5px', color: '#999', marginTop: '3px' }}>{p.tech.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </MinimalSection>
        )}

        {/* Bottom row: Languages + Certifications */}
        {(languages.length > 0 || certifications.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: languages.length > 0 && certifications.length > 0 ? '1fr 1fr' : '1fr', gap: '36px' }}>
            {languages.length > 0 && (
              <MinimalSection title="Languages" accent={accent}>
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', lineHeight: 2 }}>
                    <span style={{ fontWeight: 500 }}>{l.language}</span>
                    <span style={{ color: '#aaa', fontSize: '12px' }}>{l.proficiency}</span>
                  </div>
                ))}
              </MinimalSection>
            )}
            {certifications.length > 0 && (
              <MinimalSection title="Certifications" accent={accent}>
                {certifications.map(c => (
                  <div key={c.id} style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.name}</div>
                    {c.issuer && <div style={{ fontSize: '12px', color: '#888' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
                  </div>
                ))}
              </MinimalSection>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MinimalSection: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <section style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
      <h2 style={{
        fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em',
        color: accent, whiteSpace: 'nowrap', fontFamily: '"DM Sans", system-ui, sans-serif',
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#EBEBEB' }} />
    </div>
    {children}
  </section>
);

export default MinimalTemplate;
