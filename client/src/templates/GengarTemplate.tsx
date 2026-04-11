import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const GengarTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#1f2937';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '14pt',
        fontWeight: 700,
        color: primary,
        marginBottom: '15px',
        marginTop: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: config.fonts.heading,
      }}
    >
      <div style={{ flex: 1, height: '2px', backgroundColor: `${accent}30` }} />
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      <div style={{ flex: 1, height: '2px', backgroundColor: `${accent}30` }} />
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
        padding: '50px',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '34pt',
              fontWeight: 800,
              color: primary,
              margin: 0,
              lineHeight: 1,
              fontFamily: config.fonts.heading,
            }}
          >
            {personal.name}
          </h1>
          <div
            style={{
              fontSize: '16pt',
              fontWeight: 500,
              color: accent,
              marginTop: '8px',
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              marginTop: '20px',
              fontSize: '10pt',
              color: '#6b7280',
            }}
          >
            {personal.email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: accent }}>✉</span> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: accent }}>☎</span> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: accent }}>📍</span> {personal.location}
              </span>
            )}
            {personal.linkedin && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: accent }}>in</span> {personal.linkedin}
              </span>
            )}
          </div>
        </div>
        {personal.photoUrl && (
          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `5px solid #f3f4f6`,
              flexShrink: 0,
              marginLeft: '30px',
            }}
          >
            <img
              src={personal.photoUrl}
              alt={personal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </header>

      {personal.summary && (
        <section style={{ marginBottom: '20px' }}>
          <RichContent
            html={personal.summary}
            style={{ fontSize: '11pt', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic', color: '#4b5563' }}
          />
        </section>
      )}

      {/* TWO COLUMN CONTENT FOR SKILLS/LANGS AND EXPERIENCE */}
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: '13pt', fontWeight: 700, color: primary }}>{exp.role}</div>
                      <div style={{ fontSize: '10pt', color: '#9ca3af', fontWeight: 600 }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <div style={{ fontSize: '11pt', color: accent, fontWeight: 600, marginBottom: '8px' }}>
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
        </div>

        <div style={{ width: '240px', flexShrink: 0 }}>
          {skills.length > 0 && (
            <section>
              <SectionTitle title="Skills" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      fontSize: '9.5pt',
                      border: `1px solid ${accent}40`,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      color: '#4b5563',
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700, color: primary }}>{edu.degree}</div>
                  <div style={{ fontSize: '10pt', color: '#6b7280' }}>{edu.school}</div>
                  <div style={{ fontSize: '9pt', color: '#9ca3af' }}>
                    {edu.startDate} — {edu.endDate}
                  </div>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <SectionTitle title="Languages" />
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: '8px', fontSize: '10pt' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}:</span>{' '}
                  <span style={{ color: '#6b7280' }}>{l.proficiency}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {projects.length > 0 && (
        <section>
          <SectionTitle title="Key Projects" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11pt', fontWeight: 700, color: primary, marginBottom: '5px' }}>{proj.title}</div>
                <RichContent html={proj.description} style={{ fontSize: '10pt', lineHeight: 1.4 }} />
                {proj.tech.length > 0 && (
                  <div style={{ fontSize: '9pt', color: accent, marginTop: '8px', fontWeight: 600 }}>
                    {proj.tech.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GengarTemplate;
