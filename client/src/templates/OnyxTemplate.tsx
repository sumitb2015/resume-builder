import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const OnyxTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const sidebarBg = config.colors.sidebar || '#1a1a1a';
  const textColor = config.colors.text || '#333333';

  const SectionTitle: React.FC<{ title: string; light?: boolean }> = ({ title, light }) => (
    <div
      style={{
        fontSize: '12pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: light ? '#FFFFFF' : primary,
        borderBottom: `2px solid ${light ? 'rgba(255,255,255,0.2)' : `${accent}40`}`,
        paddingBottom: '4px',
        marginBottom: '12px',
        marginTop: '20px',
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
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: config.colors.background || '#FFFFFF',
        minHeight: '297mm',
        color: textColor,
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: '260px',
          backgroundColor: sidebarBg,
          color: '#FFFFFF',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {personal.photoUrl ? (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 30px',
              border: `4px solid rgba(255, 255, 255, 0.1)`,
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
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: `2px dashed rgba(255, 255, 255, 0.3)`,
              margin: '0 auto 30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <span style={{ fontSize: '28pt', color: '#FFFFFF', opacity: 0.7 }}>+</span>
            <span style={{ fontSize: '9pt', color: '#FFFFFF', fontWeight: 600, opacity: 0.7 }}>PHOTO</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {personal.email && (
            <div style={{ fontSize: '10pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: accent }}>✉</span>
              <span style={{ wordBreak: 'break-all' }}>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div style={{ fontSize: '10pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: accent }}>☎</span>
              <span>{personal.phone}</span>
            </div>
          )}
          {personal.location && (
            <div style={{ fontSize: '10pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: accent }}>📍</span>
              <span>{personal.location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div style={{ fontSize: '10pt', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: accent }}>in</span>
              <span style={{ wordBreak: 'break-all' }}>{personal.linkedin}</span>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <>
            <SectionTitle title="Skills" light />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {skills.map((s) => (
                <span
                  key={s.id}
                  style={{
                    fontSize: '9pt',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
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
            <SectionTitle title="Languages" light />
            {languages.map((l) => (
              <div key={l.id} style={{ fontSize: '10pt', marginBottom: '6px' }}>
                <div style={{ fontWeight: 600 }}>{l.language}</div>
                <div style={{ fontSize: '9pt', opacity: 0.8 }}>{l.proficiency}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SectionTitle title="Certifications" light />
            {certifications.map((c) => (
              <div key={c.id} style={{ fontSize: '9pt', marginBottom: '10px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ opacity: 0.8 }}>{c.issuer}</div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px 35px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1
            style={{
              fontSize: '32pt',
              fontWeight: 800,
              color: primary,
              margin: 0,
              lineHeight: 1.1,
              fontFamily: config.fonts.heading,
            }}
          >
            {personal.name}
          </h1>
          <h2
            style={{
              fontSize: '16pt',
              fontWeight: 500,
              color: accent,
              marginTop: '5px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {personal.title}
          </h2>
        </header>

        {personal.summary && (
          <section style={{ marginBottom: '25px' }}>
            <SectionTitle title="Professional Summary" />
            <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.6 }} />
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <SectionTitle title="Experience" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 700 }}>{exp.role}</div>
                    <div style={{ fontSize: '10pt', color: '#666' }}>
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
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

        {education.length > 0 && (
          <section style={{ marginBottom: '25px' }}>
            <SectionTitle title="Education" />
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '10pt', color: '#666' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                <div style={{ fontSize: '10.5pt' }}>{edu.school}</div>
                {edu.gpa && <div style={{ fontSize: '10pt', color: accent }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle title="Projects" />
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '11pt', fontWeight: 700 }}>{proj.title}</div>
                <RichContent html={proj.description} style={{ fontSize: '10.5pt', marginTop: '4px' }} />
                {proj.tech.length > 0 && (
                  <div style={{ fontSize: '9pt', color: '#666', marginTop: '6px' }}>
                    <strong>Technologies:</strong> {proj.tech.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default OnyxTemplate;
