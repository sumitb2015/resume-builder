import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const GlalieTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#000000';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '11pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: primary,
        borderBottom: `2px solid ${primary}`,
        paddingBottom: '2px',
        marginBottom: '15px',
        marginTop: '25px',
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
        padding: '50px',
      }}
    >
      {/* HEADER GRID */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 140px',
          gap: '30px',
          alignItems: 'start',
          marginBottom: '40px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '36pt',
              fontWeight: 800,
              color: primary,
              margin: 0,
              fontFamily: config.fonts.heading,
            }}
          >
            {personal.name}
          </h1>
          <div
            style={{
              fontSize: '18pt',
              fontWeight: 500,
              color: accent,
              marginTop: '5px',
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '20px',
              fontSize: '10pt',
            }}
          >
            {personal.email && (
              <span style={{ fontWeight: 600 }}>
                EMAIL: <span style={{ fontWeight: 400 }}>{personal.email}</span>
              </span>
            )}
            {personal.phone && (
              <span style={{ fontWeight: 600 }}>
                PHONE: <span style={{ fontWeight: 400 }}>{personal.phone}</span>
              </span>
            )}
            {personal.location && (
              <span style={{ fontWeight: 600 }}>
                LOCATION: <span style={{ fontWeight: 400 }}>{personal.location}</span>
              </span>
            )}
          </div>
        </div>
        {personal.photoUrl ? (
          <div
            style={{
              width: '140px',
              height: '140px',
              border: `1px solid ${primary}`,
              padding: '5px',
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
              width: '140px',
              height: '140px',
              border: `2px dashed ${primary}40`,
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: `${primary}05`,
            }}
          >
            <span style={{ fontSize: '24pt', color: primary }}>+</span>
            <span style={{ fontSize: '9pt', color: primary, fontWeight: 600 }}>PHOTO</span>
          </div>
        )}
      </header>

      {/* SUMMARY */}
      {personal.summary && (
        <section style={{ marginBottom: '30px' }}>
          <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section>
          <SectionTitle title="Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '12pt', fontWeight: 700 }}>{exp.role}</div>
                  <div style={{ fontSize: '10pt', fontWeight: 700 }}>
                    {exp.startDate.toUpperCase()} — {exp.isCurrent ? 'PRESENT' : exp.endDate.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontSize: '11pt', color: accent, fontWeight: 700, marginBottom: '8px' }}>
                  {exp.company.toUpperCase()}
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

      {/* TWO COLUMNS FOR EDUCATION AND SKILLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <SectionTitle title="Education" />
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '11pt', fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ fontSize: '10.5pt' }}>{edu.school}</div>
                <div style={{ fontSize: '10pt', color: '#666' }}>
                  {edu.startDate} — {edu.endDate}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section>
            <SectionTitle title="Skills" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {skills.map((s) => (
                <div key={s.id} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{s.name}</span>
                  <span style={{ fontWeight: 700, color: accent }}>{s.level}%</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section>
          <SectionTitle title="Projects" />
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '11pt', fontWeight: 700 }}>{proj.title}</div>
              <RichContent html={proj.description} style={{ fontSize: '10.5pt', marginTop: '4px' }} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default GlalieTemplate;
