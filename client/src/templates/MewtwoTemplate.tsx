import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const MewtwoTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, languages, custom } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#0f172a';

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div
      style={{
        fontSize: '14pt',
        fontWeight: 700,
        color: primary,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontFamily: config.fonts.heading,
      }}
    >
      <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', backgroundColor: `${primary}20` }} />
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
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: '60px 50px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `8px solid ${primary}`,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '40pt',
              fontWeight: 900,
              color: '#000000',
              margin: 0,
              fontFamily: config.fonts.heading,
              lineHeight: 0.9,
            }}
          >
            {personal.name.split(' ').map((n, i) => (
              <span key={i} style={i === 1 ? { color: primary } : {}}>{n} </span>
            ))}
          </h1>
          <h2
            style={{
              fontSize: '18pt',
              fontWeight: 500,
              color: accent,
              marginTop: '15px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            }}
          >
            {personal.title}
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '25px',
              fontSize: '10pt',
              fontWeight: 600,
              color: '#64748b',
            }}
          >
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        </div>

        {personal.photoUrl ? (
          <div
            style={{
              width: '160px',
              height: '160px',
              border: `1px solid ${primary}20`,
              padding: '8px',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <img
                src={personal.photoUrl}
                alt={personal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ) : (
          <div
            className="photo-placeholder"
            onClick={() => window.dispatchEvent(new CustomEvent('request-photo-upload'))}
            style={{
              width: '160px',
              height: '160px',
              border: `2px dashed ${primary}30`,
              padding: '8px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '24pt', color: primary, opacity: 0.4 }}>+</span>
            <span style={{ fontSize: '9pt', color: primary, fontWeight: 700, opacity: 0.4 }}>UPLOAD PHOTO</span>
          </div>
        )}
      </header>

      <div style={{ padding: '40px 50px', display: 'flex', gap: '50px' }}>
        <div style={{ flex: 2 }}>
          {personal.summary && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Executive Summary" />
              <RichContent html={personal.summary} style={{ fontSize: '11pt', lineHeight: 1.6 }} />
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeader title="Professional Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13pt', fontWeight: 700 }}>{exp.role}</div>
                      <div style={{ fontSize: '10pt', fontWeight: 700, color: primary }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <div style={{ fontSize: '11pt', fontWeight: 600, color: accent, marginBottom: '10px' }}>
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

          {/* CUSTOM SECTIONS */}
          {custom && custom.length > 0 && custom.map(sec => (
            <section key={sec.id} style={{ marginTop: '40px' }}>
              <SectionHeader title={sec.sectionTitle || 'Custom Section'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sec.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '11pt', lineHeight: 1.6 }} 
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {skills.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Core Competencies" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {skills.map((s) => (
                  <div key={s.id}>
                    <div style={{ fontSize: '10pt', fontWeight: 700, marginBottom: '6px' }}>{s.name}</div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                      <div
                        style={{
                          width: `${s.level || 85}%`,
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

          {education.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Education" />
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '10.5pt', color: '#475569' }}>{edu.school}</div>
                  <div style={{ fontSize: '9.5pt', color: primary, fontWeight: 600 }}>{edu.endDate}</div>
                </div>
              ))}
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <SectionHeader title="Languages" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {languages.map((l) => (
                  <div key={l.id}>
                    <div style={{ fontSize: '10pt', fontWeight: 700 }}>{l.language}</div>
                    <div style={{ fontSize: '9pt', color: accent }}>{l.proficiency}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MewtwoTemplate;
