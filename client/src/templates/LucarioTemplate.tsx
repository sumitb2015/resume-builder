import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const LucarioTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const sidebarBg = config.colors.sidebar || '#f1f5f9';
  const textColor = config.colors.text || '#334155';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '12pt',
        fontWeight: 800,
        textTransform: 'uppercase',
        color: primary,
        letterSpacing: '0.05em',
        marginBottom: '15px',
        marginTop: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: config.fonts.heading,
      }}
    >
      <div style={{ width: '4px', height: '1.2em', backgroundColor: accent }} />
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
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '280px',
          backgroundColor: sidebarBg,
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${primary}10`,
        }}
      >
        {personal.photoUrl ? (
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '30px',
              border: `4px solid #ffffff`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
              width: '180px',
              height: '180px',
              borderRadius: '12px',
              border: `2px dashed ${primary}30`,
              marginBottom: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
            }}
          >
            <span style={{ fontSize: '24pt', color: primary, opacity: 0.5 }}>+</span>
            <span style={{ fontSize: '8pt', color: primary, fontWeight: 700, opacity: 0.5 }}>PHOTO</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '9.5pt' }}>
          {personal.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: primary, fontWeight: 700 }}>EMAIL</span>
              <span style={{ wordBreak: 'break-all' }}>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: primary, fontWeight: 700 }}>PHONE</span>
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: primary, fontWeight: 700 }}>LOCATION</span>
              <span>{personal.location}</span>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <>
            <SectionTitle title="Skills" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    fontSize: '8.5pt',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${primary}10`,
                    color: primary,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </>
        )}

        {languages.length > 0 && (
          <>
            <SectionTitle title="Languages" />
            {languages.map((l) => (
              <div key={l.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 700, fontSize: '10pt' }}>{l.language}</div>
                <div style={{ fontSize: '9pt', color: '#64748b' }}>{l.proficiency}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SectionTitle title="Certifications" />
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: '12px', fontSize: '9pt', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ color: '#64748b' }}>{c.issuer}</div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '50px 40px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36pt',
              fontWeight: 900,
              color: primary,
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
              fontWeight: 500,
              color: accent,
              marginTop: '10px',
              letterSpacing: '0.05em',
            }}
          >
            {personal.title}
          </h2>
        </header>

        {personal.summary && (
          <section style={{ marginBottom: '35px' }}>
            <SectionTitle title="Profile" />
            <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: '35px' }}>
            <SectionTitle title="Experience" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 800 }}>{exp.role}</div>
                    <div style={{ fontSize: '9.5pt', fontWeight: 700, color: accent }}>
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div style={{ fontSize: '11pt', fontWeight: 600, color: primary, marginBottom: '8px' }}>
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
                  <div style={{ fontSize: '11pt', fontWeight: 800 }}>{edu.degree}</div>
                  <div style={{ fontSize: '9.5pt', color: '#64748b' }}>{edu.endDate}</div>
                </div>
                <div style={{ fontSize: '10.5pt' }}>{edu.school}</div>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle title="Projects" />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11pt', fontWeight: 800 }}>{proj.title}</div>
                <RichContent html={proj.description} style={{ fontSize: '10pt', marginTop: '4px' }} />
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default LucarioTemplate;
