import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const PikachuTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#1f2937';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '11pt',
        fontWeight: 800,
        textTransform: 'uppercase',
        color: primary,
        letterSpacing: '0.1em',
        borderBottom: `3px solid ${accent}`,
        display: 'inline-block',
        paddingBottom: '2px',
        marginBottom: '15px',
        marginTop: '25px',
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
        padding: '40px',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: `1px solid #e5e7eb`,
          paddingBottom: '30px',
        }}
      >
        {personal.photoUrl ? (
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={personal.photoUrl}
              alt={personal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div
            className="photo-placeholder"
            onClick={() => window.dispatchEvent(new CustomEvent('request-photo-upload'))}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              border: `2px dashed ${accent}40`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: `${accent}05`,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '24pt', color: accent }}>+</span>
            <span style={{ fontSize: '9pt', color: accent, fontWeight: 600 }}>PHOTO</span>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '36pt',
              fontWeight: 900,
              color: primary,
              margin: 0,
              fontFamily: config.fonts.heading,
              letterSpacing: '-0.02em',
            }}
          >
            {personal.name}
          </h1>
          <div
            style={{
              fontSize: '18pt',
              fontWeight: 500,
              color: accent,
              marginTop: '4px',
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px',
              marginTop: '15px',
              fontSize: '10pt',
              color: '#4b5563',
            }}
          >
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', gap: '40px' }}>
        {/* LEFT COLUMN */}
        <div style={{ flex: '0 0 250px' }}>
          {personal.summary && (
            <section>
              <SectionTitle title="About Me" />
              <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle title="Expertise" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map((s) => (
                  <div key={s.id}>
                    <div style={{ fontSize: '10pt', fontWeight: 600, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${s.level}%`,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <SectionTitle title="Languages" />
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10.5pt', fontWeight: 600 }}>{l.language}</div>
                  <div style={{ fontSize: '9.5pt', color: '#6b7280' }}>{l.proficiency}</div>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <SectionTitle title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: '12px', fontSize: '10pt' }}>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ color: '#6b7280' }}>{c.issuer}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ fontSize: '13pt', fontWeight: 700, color: primary }}>{exp.role}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: accent }}>{exp.company}</span>
                      <span style={{ fontSize: '10pt', color: '#6b7280' }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
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

          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div style={{ fontSize: '12pt', fontWeight: 700, color: primary }}>{edu.degree}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span style={{ fontWeight: 600 }}>{edu.school}</span>
                      <span style={{ fontSize: '10pt', color: '#6b7280' }}>
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                    {edu.gpa && <div style={{ fontSize: '10pt', color: accent, marginTop: '2px' }}>GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle title="Projects" />
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '12pt', fontWeight: 700, color: primary }}>{proj.title}</div>
                  <RichContent html={proj.description} style={{ fontSize: '10.5pt', marginTop: '4px' }} />
                  {proj.tech.length > 0 && (
                    <div style={{ fontSize: '9pt', color: '#6b7280', marginTop: '6px' }}>
                      <strong>Stack:</strong> {proj.tech.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PikachuTemplate;
