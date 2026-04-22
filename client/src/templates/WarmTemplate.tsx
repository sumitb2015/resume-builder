import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const WarmTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#92400E';
  const accent = config.colors.accent || '#F59E0B';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Poppins", system-ui, sans-serif', backgroundColor: '#FFFBF5', padding: 0 }}>
      {/* HEADER */}
      <header style={{ backgroundColor: primary, padding: '40px 48px 30px', borderBottom: `6px solid ${accent}` }}>
        <h1 style={{ fontSize: '2em', fontWeight: 700, color: '#FFFBF5', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '6px' }}>{personal.name || 'YOUR NAME'}</h1>
        {personal.title && <p style={{ fontSize: '0.8125em', color: accent, fontWeight: 500, marginBottom: '18px', letterSpacing: '0.04em' }}>{personal.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '0.7188em', color: 'rgba(255,251,245,0.7)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />{v}
            </span>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}>
        <div style={{ padding: '32px 32px' }}>
          {personal.summary && (
            <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: accent + '15', borderRadius: '12px', borderLeft: `4px solid ${accent}` }}>
              <RichContent 
                html={personal.summary} 
                isModified={config.modifiedFields?.includes('personal.summary')}
                style={{ fontSize: '0.8125em', color: '#78350F', lineHeight: 1.75 }} 
              />
            </div>
          )}
          {experience.length > 0 && (
            <WSection title="Experience" primary={primary} accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px', padding: '14px 16px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${accent}20` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.875em', fontWeight: 700, color: primary }}>{exp.role}</div>
                      <div style={{ fontSize: '0.75em', color: accent, fontWeight: 600 }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: '0.6563em', color: '#92400E', backgroundColor: accent + '20', padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginLeft: '8px', fontWeight: 600 }}>
                      {exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b=>b).map((b,i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.7813em', color: '#5B2C00', lineHeight: 1.65, marginBottom: '4px', listStyle: 'none' }}>
                        <span style={{ color: accent, flexShrink: 0, fontWeight: 700 }}>›</span>
                        <RichContent 
                          html={b} 
                          isModified={config.modifiedFields?.includes(`experience.${exp.id}.bullets.${i}`)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </WSection>
          )}
          {projects.length > 0 && (
            <WSection title="Projects" primary={primary} accent={accent}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '12px', padding: '12px 14px', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${accent}25` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8438em', fontWeight: 700, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '0.6875em', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && (
                    <RichContent 
                      html={p.description} 
                      isModified={config.modifiedFields?.includes(`projects.${p.id}.description`)}
                      style={{ fontSize: '0.7813em', color: '#6B3A00', marginTop: '4px', lineHeight: 1.6 }} 
                    />
                  )}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t,i) => <span key={i} style={{ fontSize: '0.6563em', backgroundColor: primary+'15', color: primary, padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </WSection>
          )}
          {education.length > 0 && (
            <WSection title="Education" primary={primary} accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.875em', fontWeight: 700, color: primary }}>{edu.school}</div>
                    <div style={{ fontSize: '0.75em', color: '#92400E', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  </div>
                  <span style={{ fontSize: '0.6875em', color: '#B45309', flexShrink: 0 }}>{edu.endDate}{edu.gpa ? ` · ${edu.gpa}` : ''}</span>
                </div>
              ))}
            </WSection>
          )}

          {/* CUSTOM SECTIONS */}
          {custom && custom.length > 0 && custom.map(sec => (
            <WSection key={sec.id} title={sec.sectionTitle || 'Custom'} primary={primary} accent={accent}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sec.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ marginBottom: '8px', padding: '12px 14px', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${accent}20` }}>
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '0.8125em', lineHeight: 1.6, color: '#5B2C00' }} 
                    />
                  </div>
                ))}
              </div>
            </WSection>
          ))}
        </div>

        {/* SIDEBAR */}
        <div style={{ padding: '32px 22px', backgroundColor: '#FFF8ED', borderLeft: `3px solid ${accent}30`, display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {skills.length > 0 && (
            <div>
              <WSideTitle title="Skills" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: '0.7188em', fontWeight: 600, color: primary, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ height: '5px', background: '#F3E0C0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, background: `linear-gradient(to right, ${primary}, ${accent})`, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <WSideTitle title="Languages" accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', lineHeight: 2, color: primary }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#B45309', fontSize: '0.6875em' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <WSideTitle title="Certifications" accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px', padding: '8px 10px', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${accent}30` }}>
                  <div style={{ fontSize: '0.7188em', fontWeight: 700, color: primary }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '0.6563em', color: '#92400E', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '0.625em', color: accent, fontWeight: 600, marginTop: '2px' }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WSection: React.FC<{ title: string; primary: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '28px', height: '3px', background: accent, borderRadius: '2px' }} />
      <h2 style={{ fontSize: '0.6875em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: accent }}>{title}</h2>
    </div>
    {children}
  </div>
);

const WSideTitle: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <h3 style={{ fontSize: '0.625em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: accent, marginBottom: '12px', paddingBottom: '5px', borderBottom: `2px solid ${accent}50` }}>{title}</h3>
);

export default WarmTemplate;
