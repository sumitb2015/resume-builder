import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ClassicTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;

  return (
    <div
      className="resume-paper"
      style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        color: '#1a1a1a',
        backgroundColor: '#FFFFFF',
        padding: '15mm 18mm',
        lineHeight: 1.5,
      }}
    >
      {/* HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '2.5px solid #1a1a1a' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', lineHeight: 1.1 }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#444', marginBottom: '14px', fontWeight: 400 }}>
            {personal.title}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 20px', fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.04em' }}>
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
        <Section title="Professional Summary">
          <RichContent html={personal.summary} style={{ fontSize: '13px', lineHeight: 1.75, textAlign: 'justify', color: '#2a2a2a' }} />
        </Section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <Section title="Professional Experience">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.01em' }}>{exp.role}</span>
                    {exp.company && (
                      <>
                        <span style={{ margin: '0 6px', color: '#999' }}>—</span>
                        <span style={{ fontSize: '13.5px', fontStyle: 'italic', color: '#555' }}>{exp.company}</span>
                      </>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px' }}>
                    {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(b => b).length > 0 && (
                  <ul style={{ marginTop: '6px', paddingLeft: '18px', listStyleType: 'disc' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#333', marginBottom: '3px' }}><RichContent html={bullet} /></li>
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
        <Section title="Education">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{edu.school}</div>
                  <div style={{ fontSize: '12.5px', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' · ')}
                    {edu.gpa && <span style={{ marginLeft: '8px', fontStyle: 'normal', fontWeight: 600, color: '#333' }}>GPA: {edu.gpa}</span>}
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: '#777', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
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
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <SectionTitle title="Core Competencies" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize: '12px', color: '#2a2a2a', lineHeight: 2 }}>• {s.name}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {certifications.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <SectionTitle title="Certifications" />
                {certifications.map(c => (
                  <div key={c.id} style={{ fontSize: '12px', marginBottom: '4px', lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    {c.issuer && <span style={{ color: '#666' }}> · {c.issuer}</span>}
                    {c.date && <span style={{ color: '#999', fontSize: '11px' }}> ({c.date})</span>}
                  </div>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <SectionTitle title="Languages" />
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: 1.9 }}>
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
        <Section title="Selected Projects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {projects.map(p => (
              <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700 }}>{p.title}</span>
                  {p.url && <span style={{ fontSize: '11px', color: '#777' }}>{p.url}</span>}
                </div>
                {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#444', marginTop: '3px', lineHeight: 1.6 }} />}
                {p.tech.length > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '11.5px', color: '#666', fontStyle: 'italic' }}>
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

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#1a1a1a',
    borderBottom: '1px solid #ccc',
    paddingBottom: '4px',
    marginBottom: '10px',
    fontFamily: '"EB Garamond", Georgia, serif',
  }}>
    {title}
  </h2>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: '20px' }}>
    <SectionTitle title={title} />
    {children}
  </section>
);

export default ClassicTemplate;
