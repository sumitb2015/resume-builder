import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const EeveeTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, languages, custom } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const textColor = config.colors.text || '#1f2937';

  const Card: React.FC<{ title: string; children: React.ReactNode; icon?: string }> = ({ title, children, icon }) => (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid #f3f4f6',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
          color: primary,
          fontSize: '12pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {icon && <span>{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  );

  return (
    <div
      className="resume-paper"
      style={{
        fontFamily: config.fonts.body,
        backgroundColor: '#f9fafb',
        minHeight: '297mm',
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          padding: '50px 40px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${primary}08 0%, ${accent}08 100%)`,
        }}
      >
        {personal.photoUrl ? (
          <div
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '30px',
              overflow: 'hidden',
              marginBottom: '25px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transform: 'rotate(-3deg)',
              border: `4px solid #ffffff`,
            }}
          >
            <img
              src={personal.photoUrl}
              alt={personal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'rotate(3deg)' }}
            />
          </div>
        ) : (
          <div
            className="photo-placeholder"
            onClick={() => window.dispatchEvent(new CustomEvent('request-photo-upload'))}
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '30px',
              border: `3px dashed ${primary}30`,
              marginBottom: '25px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#ffffff',
              transform: 'rotate(-3deg)',
            }}
          >
            <span style={{ fontSize: '24pt', color: primary, opacity: 0.5 }}>+</span>
            <span style={{ fontSize: '8pt', color: primary, fontWeight: 700, opacity: 0.5 }}>ADD PHOTO</span>
          </div>
        )}

        <h1
          style={{
            fontSize: '32pt',
            fontWeight: 900,
            color: '#111827',
            margin: 0,
            fontFamily: config.fonts.heading,
          }}
        >
          {personal.name}
        </h1>
        <h2
          style={{
            fontSize: '16pt',
            fontWeight: 500,
            color: primary,
            marginTop: '8px',
          }}
        >
          {personal.title}
        </h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '25px',
            fontSize: '10pt',
            color: '#6b7280',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '25px', padding: '0 40px 40px' }}>
        <div style={{ flex: 1.5 }}>
          {personal.summary && (
            <Card title="About Me" icon="👤">
              <RichContent html={personal.summary} style={{ fontSize: '10.5pt', lineHeight: 1.7 }} />
            </Card>
          )}

          {experience.length > 0 && (
            <Card title="Experience" icon="💼">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${primary}15` }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-6px',
                        top: '6px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: primary,
                      }}
                    />
                    <div style={{ fontSize: '12pt', fontWeight: 700, color: '#111827' }}>{exp.role}</div>
                    <div style={{ fontSize: '10pt', color: primary, fontWeight: 600, margin: '4px 0' }}>{exp.company}</div>
                    <div style={{ fontSize: '9pt', color: '#9ca3af', marginBottom: '10px' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                    <RichContent
                      html={`<ul>${exp.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>`}
                      style={{ fontSize: '10pt', lineHeight: 1.6 }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CUSTOM SECTIONS */}
          {custom && custom.length > 0 && custom.map((sec) => (
            <Card key={sec.id} title={sec.sectionTitle || 'Custom Section'} icon="✨">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sec.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '10pt', lineHeight: 1.6 }} 
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {skills.length > 0 && (
            <Card title="Skills" icon="⚡">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    style={{
                      fontSize: '9pt',
                      fontWeight: 600,
                      padding: '6px 12px',
                      backgroundColor: `${primary}08`,
                      color: primary,
                      borderRadius: '8px',
                      border: `1px solid ${primary}15`,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {education.length > 0 && (
            <Card title="Education" icon="🎓">
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11pt', fontWeight: 700 }}>{edu.degree}</div>
                  <div style={{ fontSize: '10pt', color: '#4b5563' }}>{edu.school}</div>
                  <div style={{ fontSize: '9pt', color: '#9ca3af' }}>{edu.endDate}</div>
                </div>
              ))}
            </Card>
          )}

          {languages.length > 0 && (
            <Card title="Languages" icon="🌐">
              {languages.map((l) => (
                <div key={l.id} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '10pt' }}>{l.language}</span>
                  <span style={{ fontSize: '9pt', color: primary, backgroundColor: `${primary}10`, padding: '2px 8px', borderRadius: '4px' }}>
                    {l.proficiency}
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EeveeTemplate;
