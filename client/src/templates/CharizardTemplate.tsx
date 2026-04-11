import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const CharizardTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const sidebarBg = config.colors.sidebar || '#f8fafc';
  const textColor = config.colors.text || '#1e293b';

  const SectionTitle: React.FC<{ title: string; color?: string }> = ({ title, color }) => (
    <div
      style={{
        fontSize: '13pt',
        fontWeight: 800,
        textTransform: 'uppercase',
        color: color || primary,
        letterSpacing: '0.05em',
        borderBottom: `3px solid ${color || primary}20`,
        paddingBottom: '6px',
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER SECTION */}
      <header
        style={{
          backgroundColor: primary,
          color: '#FFFFFF',
          padding: '40px 50px',
          display: 'flex',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        {personal.photoUrl ? (
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '6px solid rgba(255,255,255,0.2)',
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
        ) : (
          <div
            className="photo-placeholder"
            onClick={() => window.dispatchEvent(new CustomEvent('request-photo-upload'))}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '3px dashed rgba(255,255,255,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.1)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '24pt', fontWeight: 300 }}>+</span>
            <span style={{ fontSize: '8pt', fontWeight: 600 }}>PHOTO</span>
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '36pt',
              fontWeight: 900,
              margin: 0,
              lineHeight: 1,
              fontFamily: config.fonts.heading,
            }}
          >
            {personal.name}
          </h1>
          <h2
            style={{
              fontSize: '18pt',
              fontWeight: 400,
              margin: '8px 0 0',
              opacity: 0.9,
              letterSpacing: '0.02em',
            }}
          >
            {personal.title}
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '20px',
              fontSize: '10pt',
              opacity: 0.85,
            }}
          >
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>☎ {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && <span>in {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: '280px',
            backgroundColor: sidebarBg,
            padding: '30px 40px',
            borderRight: '1px solid #e2e8f0',
          }}
        >
          {personal.summary && (
            <section style={{ marginBottom: '30px' }}>
              <SectionTitle title="Profile" />
              <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
            </section>
          )}

          {skills.length > 0 && (
            <section style={{ marginBottom: '30px' }}>
              <SectionTitle title="Skills" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {skills.map((s) => (
                  <div key={s.id}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '9.5pt',
                        fontWeight: 600,
                        marginBottom: '4px',
                      }}
                    >
                      <span>{s.name}</span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${s.level || 80}%`,
                          height: '100%',
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
            <section style={{ marginBottom: '30px' }}>
              <SectionTitle title="Languages" />
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '10.5pt' }}>{l.language}</div>
                  <div style={{ fontSize: '9pt', color: '#64748b' }}>{l.proficiency}</div>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <SectionTitle title="Certifications" />
              {certifications.map((c) => (
                <div key={c.id} style={{ marginBottom: '12px', fontSize: '10pt' }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: '9pt', color: '#64748b' }}>{c.issuer}</div>
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: '30px 40px' }}>
          {experience.length > 0 && (
            <section style={{ marginBottom: '35px' }}>
              <SectionTitle title="Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontSize: '13pt', fontWeight: 800, color: primary }}>{exp.role}</div>
                      <div style={{ fontSize: '10pt', fontWeight: 600, color: '#64748b' }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <div style={{ fontSize: '11pt', fontWeight: 700, color: accent, marginBottom: '10px' }}>
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

          {education.length > 0 && (
            <section style={{ marginBottom: '35px' }}>
              <SectionTitle title="Education" />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 800 }}>{edu.degree}</div>
                    <div style={{ fontSize: '10pt', fontWeight: 600, color: '#64748b' }}>
                      {edu.startDate} — {edu.endDate}
                    </div>
                  </div>
                  <div style={{ fontSize: '11pt', fontWeight: 600 }}>{edu.school}</div>
                  {edu.gpa && <div style={{ fontSize: '10pt', color: accent }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle title="Projects" />
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12pt', fontWeight: 800 }}>{proj.title}</div>
                  <RichContent html={proj.description} style={{ fontSize: '10.5pt', marginTop: '6px' }} />
                  {proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {proj.tech.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '8pt',
                            fontWeight: 700,
                            padding: '2px 8px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '12px',
                            color: '#475569',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CharizardTemplate;
