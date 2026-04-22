import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const BronzorTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;
  const sidebarBg = config.colors.sidebar || '#0f172a';

  // Helper component for section titles
  const SectionTitle: React.FC<{ title: string; light?: boolean }> = ({ title, light }) => (
    <div
      style={{
        fontSize: '11pt',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: light ? '#99f6e4' : primary,
        borderBottom: `1.5px solid ${light ? 'rgba(255,255,255,0.2)' : `${accent}40`}`,
        paddingBottom: '4px',
        marginBottom: '10px',
        marginTop: '18px',
        fontFamily: "'DM Sans', sans-serif",
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
        flexDirection: 'column',
        backgroundColor: config.colors.background || '#FFFFFF',
        minHeight: '297mm', // A4 height
      }}
    >
      <style>{`
      `}</style>

      {/* HEADER */}
      <header
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}ee 60%, ${accent} 100%)`,
          padding: '28px 32px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          color: '#FFFFFF',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '28pt',
              color: '#fff',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              marginBottom: '4px',
              fontWeight: 'normal',
            }}
          >
            {personal.name || 'YOUR NAME'}
          </h1>
          <div
            style={{
              fontSize: '13pt',
              color: '#ccfbf1',
              fontWeight: 500,
              marginBottom: '12px',
              letterSpacing: '0.02em',
            }}
          >
            {personal.title}
          </div>
          {/* Contact row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
            {personal.email && (
              <span style={{ fontSize: '10.5pt', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10pt', opacity: 0.8 }}>✉</span> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span style={{ fontSize: '10.5pt', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10pt', opacity: 0.8 }}>☎</span> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span style={{ fontSize: '10.5pt', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10pt', opacity: 0.8 }}>📍</span> {personal.location}
              </span>
            )}
            {personal.linkedin && (
              <span style={{ fontSize: '10.5pt', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10pt', opacity: 0.8 }}>in</span> {personal.linkedin}
              </span>
            )}
            {personal.website && (
              <span style={{ fontSize: '10.5pt', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10pt', opacity: 0.8 }}>🌐</span> {personal.website}
              </span>
            )}
          </div>
        </div>

        {personal.photoUrl && (
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `3px solid rgba(255, 255, 255, 0.3)`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              flexShrink: 0,
            }}
          >
            <img
              src={personal.photoUrl}
              alt={personal.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* LEFT SIDEBAR */}
        <aside
          style={{
            width: '240px',
            minWidth: '240px',
            backgroundColor: sidebarBg,
            padding: '20px 18px',
            display: 'flex',
            flexDirection: 'column',
            color: '#FFFFFF',
          }}
        >
          {/* Summary */}
          {personal.summary && (
            <>
              <SectionTitle title="Summary" light />
              <RichContent
                html={personal.summary}
                style={{ fontSize: '10.5pt', color: '#cbd5e1', lineHeight: 1.65 }}
              />
            </>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <>
              <SectionTitle title="Skills" light />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {skills.map((s) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10.5pt', color: '#e2e8f0' }}>{s.name}</span>
                    <SkillDots level={Math.round(s.level / 20)} color={accent} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <>
              <SectionTitle title="Languages" light />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {languages.map((l) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10.5pt', color: '#e2e8f0' }}>{l.language}</span>
                    <span style={{ fontSize: '10pt', color: accent }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Education */}
          {education.length > 0 && (
            <>
              <SectionTitle title="Education" light />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {education.map((e) => (
                  <div key={e.id}>
                    <div style={{ fontSize: '10.5pt', fontWeight: 600, color: '#f1f5f9' }}>{e.degree}</div>
                    <div style={{ fontSize: '10pt', color: '#94a3b8', marginTop: '2px' }}>{e.school}</div>
                    <div style={{ fontSize: '10pt', color: '#64748b', marginTop: '1px' }}>
                      {e.startDate}{e.endDate ? ` — ${e.endDate}` : ''}
                    </div>
                    {e.gpa && (
                      <div style={{ fontSize: '10pt', color: accent, marginTop: '2px' }}>GPA: {e.gpa}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <>
              <SectionTitle title="Certifications" light />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {certifications.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      fontSize: '10pt',
                      color: '#cbd5e1',
                      paddingLeft: '8px',
                      borderLeft: `2px solid ${accent}`,
                      lineHeight: 1.4,
                    }}
                  >
                    {c.name} {c.issuer && `— ${c.issuer}`}
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, padding: '20px 28px' }}>
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <SectionTitle title="Professional Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                      <div>
                        <div
                          style={{
                            fontSize: '13pt',
                            fontWeight: 700,
                            color: '#111827',
                            fontFamily: "'DM Serif Display', serif",
                          }}
                        >
                          {exp.role}
                        </div>
                        <div style={{ fontSize: '11pt', color: primary, fontWeight: 600 }}>
                          {exp.company}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '10pt',
                          color: '#6b7280',
                          background: '#f3f4f6',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          marginTop: '2px',
                        }}
                      >
                        {exp.startDate}{exp.endDate || exp.isCurrent ? ` — ${exp.isCurrent ? 'Present' : exp.endDate}` : ''}
                      </div>
                    </div>
                    {exp.bullets.length > 0 && (
                      <div style={{ marginTop: '6px' }}>
                        {exp.bullets.filter(Boolean).map((bullet, i) => (
                          <BulletPoint key={i} accent={accent}>{bullet}</BulletPoint>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section style={{ marginTop: '20px' }}>
              <SectionTitle title="Projects" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {projects.map((p) => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12pt', fontWeight: 700, color: '#111827', fontFamily: "'DM Serif Display', serif" }}>
                        {p.title}
                      </span>
                      {p.url && <span style={{ fontSize: '10pt', color: accent }}>{p.url}</span>}
                    </div>
                    {p.description && (
                      <RichContent html={p.description} style={{ fontSize: '10.5pt', color: '#374151', marginTop: '4px', lineHeight: 1.55 }} />
                    )}
                    {p.tech.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {p.tech.map((t, i) => (
                          <span key={i} style={{ fontSize: '9pt', backgroundColor: '#f0fdf9', color: primary, border: `1px solid ${accent}40`, padding: '1px 6px', borderRadius: '4px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {custom && custom.length > 0 && custom.map(sec => (
            <section key={sec.id} style={{ marginTop: '20px' }}>
              <SectionTitle title={sec.sectionTitle || 'Custom Section'} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sec.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '10.5pt', color: '#374151', lineHeight: 1.55 }} 
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

const SkillDots: React.FC<{ level: number; max?: number; color: string }> = ({ level, max = 5, color }) => (
  <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
    {Array.from({ length: max }).map((_, i) => (
      <span
        key={i}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: i < level ? color : '#d1d5db',
          display: 'inline-block',
        }}
      />
    ))}
  </span>
);

const BulletPoint: React.FC<{ children: string; accent: string }> = ({ children, accent }) => (
  <div style={{ display: 'flex', gap: '7px', marginBottom: '5px', alignItems: 'flex-start' }}>
    <span
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: accent,
        marginTop: '6px',
        flexShrink: 0,
      }}
    />
    <RichContent html={children} style={{ fontSize: '11.5pt', color: '#374151', lineHeight: 1.55 }} />
  </div>
);

export default BronzorTemplate;
