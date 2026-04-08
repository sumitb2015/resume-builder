import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const MagazineTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary || '#18181B';
  const accent = config.colors.accent || '#DC2626';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Poppins", system-ui, sans-serif', backgroundColor: '#fff', padding: 0 }}>
      {/* DRAMATIC HEADER */}
      <header style={{ padding: '0' }}>
        <div style={{ background: primary, padding: '13mm 16mm 11mm', position: 'relative' }}>
          {/* Big accent letter */}
          <div style={{ position: 'absolute', right: '32px', top: '-10px', fontSize: '160px', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em' }}>
            {(personal.name || 'Y')[0]}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-block', backgroundColor: accent, padding: '3px 10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{personal.title || 'Professional'}</span>
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.0, marginBottom: '0' }}>
              {(personal.name || 'YOUR NAME').split(' ').map((word, i) => (
                <span key={i} style={{ display: 'block', color: i === 0 ? '#fff' : accent }}>{word}</span>
              ))}
            </h1>
          </div>
        </div>
        {/* Contact strip */}
        <div style={{ backgroundColor: accent, padding: '3mm 16mm', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '11px', fontWeight: 600, color: '#fff', letterSpacing: '0.03em' }}>{v}</span>
          ))}
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px' }}>
        <div style={{ padding: '12mm 11mm', borderRight: `3px solid ${primary}` }}>
          {personal.summary && (
            <div style={{ marginBottom: '28px' }}>
              <RichContent html={personal.summary} style={{ fontSize: '14px', lineHeight: 1.8, color: '#27272A', borderLeft: `4px solid ${accent}`, paddingLeft: '16px', fontStyle: 'italic' }} />
            </div>
          )}
          {experience.length > 0 && (
            <MagSection title="Experience" primary={primary} accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>{exp.role}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#71717A', backgroundColor: '#F4F4F5', padding: '3px 8px', borderRadius: '4px', flexShrink: 0, marginLeft: '10px' }}>
                      {exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b=>b).map((b,i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: '#52525B', lineHeight: 1.65, marginBottom: '4px', listStyle: 'none' }}>
                        <span style={{ color: accent, fontWeight: 900, flexShrink: 0 }}>—</span><RichContent html={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </MagSection>
          )}
          {projects.length > 0 && (
            <MagSection title="Projects" primary={primary} accent={accent}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px', padding: '12px', border: `2px solid ${primary}10`, borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#52525B', margin: '4px 0' }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t,i) => <span key={i} style={{ fontSize: '10.5px', backgroundColor: primary, color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </MagSection>
          )}
          {education.length > 0 && (
            <MagSection title="Education" primary={primary} accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: primary }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#71717A' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#A1A1AA', flexShrink: 0 }}>{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</span>
                </div>
              ))}
            </MagSection>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ padding: '12mm 8mm', backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {skills.length > 0 && (
            <div>
              <MagSideTitle title="Skills" primary={primary} accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map(s => (
                  <div key={s.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: primary }}>{s.name}</span>
                    </div>
                    <div style={{ height: '4px', background: '#E4E4E7', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, backgroundColor: accent, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <MagSideTitle title="Certifications" primary={primary} accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: primary }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '11px', color: '#71717A', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '10.5px', color: accent, marginTop: '2px', fontWeight: 600 }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <MagSideTitle title="Languages" primary={primary} accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: 2 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#A1A1AA', fontSize: '11px' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MagSection: React.FC<{ title: string; primary: string; accent: string; children: React.ReactNode }> = ({ title, primary, accent, children }) => (
  <div style={{ marginBottom: '24px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '6px', height: '22px', backgroundColor: accent, borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: primary }}>{title}</h2>
    </div>
    {children}
  </div>
);

const MagSideTitle: React.FC<{ title: string; primary: string; accent: string }> = ({ title, accent }) => (
  <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.16em', color: accent, marginBottom: '12px', paddingBottom: '5px', borderBottom: `2px solid ${accent}` }}>{title}</h3>
);

export default MagazineTemplate;
