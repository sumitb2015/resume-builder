import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const CasteliaTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#334155';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '11pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        backgroundColor: primary,
        padding: '6px 12px',
        marginBottom: '15px',
        marginTop: '25px',
        borderRadius: '2px',
        letterSpacing: '0.05em',
        fontFamily: config.fonts.heading,
      }}
    >
      {title}
    </div>
  );

  return (
    <div
      className="resume-paper"
      style={{
        fontFamily: config.fonts.body,
        backgroundColor: config.colors.background || '#FFFFFF',
        minHeight: '297mm',
        color: textColor,
        padding: '40px 50px',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          gap: '25px',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        {personal.photoUrl && (
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '4px',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={personal.photoUrl}
              alt={personal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '28pt',
              fontWeight: 700,
              color: primary,
              margin: 0,
              fontFamily: config.fonts.heading,
            }}
          >
            {personal.name}
          </h1>
          <div
            style={{
              fontSize: '14pt',
              fontWeight: 600,
              color: accent,
              marginTop: '2px',
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '10px',
              fontSize: '9.5pt',
              color: '#64748b',
            }}
          >
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <section>
          <SectionTitle title="Executive Summary" />
          <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <SectionTitle title="Professional Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '11.5pt', fontWeight: 700, color: primary }}>{exp.role}</div>
                  <div style={{ fontSize: '9.5pt', fontWeight: 600 }}>
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                  </div>
                </div>
                <div style={{ fontSize: '10.5pt', color: accent, fontWeight: 600, marginBottom: '6px' }}>
                  {exp.company}
                </div>
                <RichContent
                  html={`<ul>${exp.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`}
                  style={{ fontSize: '10.5pt', lineHeight: 1.5 }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '10pt', fontWeight: 600, color: accent }}>{edu.school}</div>
                  <div style={{ fontSize: '9.5pt', color: '#64748b' }}>
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {skills.length > 0 && (
            <section>
              <SectionTitle title="Core Competencies" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      fontSize: '9.5pt',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '2px',
                      borderLeft: `3px solid ${accent}`,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {projects.length > 0 && (
        <section>
          <SectionTitle title="Selected Projects" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div style={{ fontSize: '11pt', fontWeight: 700 }}>{proj.title}</div>
                <RichContent html={proj.description} style={{ fontSize: '10.5pt', marginTop: '2px' }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CasteliaTemplate;
