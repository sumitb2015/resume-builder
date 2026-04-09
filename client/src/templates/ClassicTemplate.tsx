import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ClassicTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;

  return (
    <div
      className="resume-paper"
      style={{
        fontFamily: config.fonts.body,
        color: '#1a1a1a',
        backgroundColor: config.colors.background || '#FFFFFF',
        padding: 0,
        lineHeight: 1.5,
      }}
    >
      {/* HEADER */}
      <header data-section="personal" style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: `2.5px solid ${primary}` }}>
        <h1 style={{ fontFamily: config.fonts.heading, fontSize: '1.875em', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', lineHeight: 1.1, color: primary }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '0.875em', fontStyle: 'italic', color: '#444', marginBottom: '14px', fontWeight: 400 }}>
            {personal.title}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 20px', fontSize: '0.7188em', fontWeight: 500, letterSpacing: '0.04em' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && (
            <>
              <span style={{ color: '#ccc' }}>·</span>
              <span>{personal.phone}</span>
            </>
          )}
          {personal.location && (
            <>
              <span style={{ color: '#ccc' }}>·</span>
              <span>{personal.location}</span>
            </>
          )}
          {personal.linkedin && (
            <>
              <span style={{ color: '#ccc' }}>·</span>
              <span>{personal.linkedin}</span>
            </>
          )}
          {personal.website && (
            <>
              <span style={{ color: '#ccc' }}>·</span>
              <span>{personal.website}</span>
            </>
          )}
        </div>
      </header>

      {/* PROFESSIONAL SUMMARY */}
      {personal.summary && (
        <Section title="Professional Summary" config={config} sectionId="personal">
          <RichContent html={personal.summary} style={{ fontSize: '0.8125em', lineHeight: 1.75, textAlign: 'justify', color: '#2a2a2a' }} />
        </Section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <Section title="Professional Experience" config={config} sectionId="experience">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <div>
                    <span style={{ fontSize: '0.875em', fontWeight: 700, letterSpacing: '0.01em' }}>{exp.role}</span>
                    {exp.company && (
                      <>
                        <span style={{ margin: '0 6px', color: '#999' }}>—</span>
                        <span style={{ fontSize: '0.8438em', fontStyle: 'italic', color: '#555' }}>{exp.company}</span>
                      </>
                    )}
                  </div>
                  <span style={{ fontSize: '0.6875em', fontWeight: 600, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px' }}>
                    {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(b => b).length > 0 && (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px', listStyleType: 'disc' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '0.7813em', lineHeight: 1.7, color: '#333', marginBottom: '3px' }}><RichContent html={bullet} /></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <Section title="Education" config={config} sectionId="education">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '0.875em', fontWeight: 700 }}>{edu.school}</div>
                  <div style={{ fontSize: '0.7813em', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                    {edu.gpa && <span style={{ marginLeft: '8px', fontStyle: 'normal', fontWeight: 600, color: '#333' }}>GPA: {edu.gpa}</span>}
                  </div>
                </div>
                <span style={{ fontSize: '0.6875em', color: '#777', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                  {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* TWO COLUMN: SKILLS + LANGUAGES/CERTS */}
      {(skills.length > 0 || certifications.length > 0 || languages.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '20px' }}>
          {skills.length > 0 && (
            <div data-section="skills" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <SectionTitle title="Core Competencies" config={config} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize: '0.75em', color: '#2a2a2a', lineHeight: 2 }}>• {s.name}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {certifications.length > 0 && (
              <div data-section="certifications" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <SectionTitle title="Certifications" config={config} />
                {certifications.map(c => (
                  <div key={c.id} style={{ fontSize: '0.75em', marginBottom: '4px', lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    {c.issuer && <span style={{ color: '#666' }}> · {c.issuer}</span>}
                    {c.date && <span style={{ color: '#999', fontSize: '0.6875em' }}> ({c.date})</span>}
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div data-section="languages" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <SectionTitle title="Languages" config={config} />
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', lineHeight: 1.9 }}>
                    <span style={{ fontWeight: 600 }}>{l.language}</span>
                    <span style={{ color: '#666', fontStyle: 'italic' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Section title="Selected Projects" config={config} sectionId="projects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.8438em', fontWeight: 700 }}>{p.title}</span>
                  {p.url && <span style={{ fontSize: '0.6875em', color: '#777' }}>{p.url}</span>}
                </div>
                {p.description && <RichContent html={p.description} style={{ fontSize: '0.7813em', color: '#444', marginTop: '3px', lineHeight: 1.6 }} />}
                {p.tech.length > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '0.7188em', color: '#666', fontStyle: 'italic' }}>
                    {p.tech.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; config: TemplateConfig }> = ({ title, config }) => (
  <h2 style={{
    fontSize: '0.625em',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: config.colors.primary,
    borderBottom: `1px solid ${config.colors.primary}40`,
    paddingBottom: '4px',
    marginBottom: '10px',
    fontFamily: config.fonts.heading,
  }}>
    {title}
  </h2>
);

const Section: React.FC<{ title: string; config: TemplateConfig; children: React.ReactNode; sectionId?: string }> = ({ title, config, children, sectionId }) => (
  <section data-section={sectionId} style={{ marginBottom: '20px' }}>
    <SectionTitle title={title} config={config} />
    {children}
  </section>
);

export default ClassicTemplate;
