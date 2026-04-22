import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const SnorlaxTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#2d3748';

  const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '11pt',
        fontWeight: 600,
        color: primary,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        borderBottom: `1px solid ${primary}30`,
        paddingBottom: '8px',
        marginBottom: '20px',
        marginTop: '35px',
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
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '50px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '28pt',
              fontWeight: 300,
              color: primary,
              margin: 0,
              fontFamily: config.fonts.heading,
              letterSpacing: '-0.02em',
            }}
          >
            {personal.name}
          </h1>
          <h2
            style={{
              fontSize: '14pt',
              fontWeight: 400,
              color: accent,
              marginTop: '5px',
              letterSpacing: '0.05em',
            }}
          >
            {personal.title}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px 30px',
              marginTop: '25px',
              fontSize: '9.5pt',
              color: '#718096',
            }}
          >
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {personal.location && <div>{personal.location}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
          </div>
        </div>

        {personal.photoUrl ? (
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#f7fafc',
              overflow: 'hidden',
              borderRadius: '8px',
              border: `1px solid ${primary}15`,
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
              border: `1px dashed ${primary}40`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#f7fafc',
            }}
          >
            <span style={{ fontSize: '20pt', color: primary, opacity: 0.5 }}>+</span>
            <span style={{ fontSize: '7pt', color: primary, fontWeight: 700, opacity: 0.5 }}>PHOTO</span>
          </div>
        )}
      </header>

      {personal.summary && (
        <section style={{ marginBottom: '40px' }}>
          <RichContent
            html={personal.summary}
            style={{
              fontSize: '11pt',
              lineHeight: 1.8,
              color: '#4a5568',
              fontStyle: 'italic',
            }}
          />
        </section>
      )}

      {/* TWO COLUMN CONTENT */}
      <div style={{ display: 'flex', gap: '60px' }}>
        <div style={{ flex: 2 }}>
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
                {experience.map((exp: any) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12pt', fontWeight: 700 }}>{exp.role}</div>
                      <div style={{ fontSize: '9pt', color: '#a0aec0' }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <div style={{ fontSize: '10pt', color: accent, fontWeight: 600, marginBottom: '12px' }}>
                      {exp.company}
                    </div>
                    <RichContent
                      html={`<ul>${exp.bullets.map((b: string) => `<li>${b}</li>`).join('')}</ul>`}
                      style={{ fontSize: '10.5pt', lineHeight: 1.7, color: '#4a5568' }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <SectionTitle title="Projects" />
              {projects.map((proj: any) => (
                <div key={proj.id} style={{ marginBottom: '25px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700, marginBottom: '6px' }}>{proj.title}</div>
                  <RichContent html={proj.description} style={{ fontSize: '10.5pt', color: '#4a5568' }} />
                </div>
              ))}
            </section>
          )}

          {custom && custom.length > 0 && custom.map((sec: any) => (
            <section key={sec.id}>
              <SectionTitle title={sec.sectionTitle || 'Custom Section'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sec.entries.filter((e: string) => e).map((entry: string, i: number) => (
                  <div key={i} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '10.5pt', color: '#4a5568', lineHeight: 1.7 }} 
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {education.length > 0 && (
            <section>
              <SectionTitle title="Education" />
              {education.map((edu: any) => (
                <div key={edu.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '10.5pt', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '10pt', color: '#4a5568' }}>{edu.school}</div>
                  <div style={{ fontSize: '9pt', color: '#a0aec0' }}>{edu.endDate}</div>
                </div>
              ))}
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section>
              <SectionTitle title="Certifications" />
              {certifications.map((cert: any) => (
                <div key={cert.id} style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '10pt', fontWeight: 700 }}>{cert.name}</div>
                  <div style={{ fontSize: '9.5pt', color: '#4a5568' }}>{cert.issuer}</div>
                  <div style={{ fontSize: '8.5pt', color: '#a0aec0' }}>{cert.date}</div>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <SectionTitle title="Expertise" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map((s: any) => (
                  <div key={s.id} style={{ fontSize: '10pt' }}>
                    <div style={{ marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ height: '2px', backgroundColor: '#edf2f7' }}>
                      <div
                        style={{
                          width: `${s.level || 70}%`,
                          height: '100%',
                          backgroundColor: primary,
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
              {languages.map((l: any) => (
                <div key={l.id} style={{ marginBottom: '12px', fontSize: '10pt' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span> —{' '}
                  <span style={{ color: '#718096' }}>{l.proficiency}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnorlaxTemplate;
