import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';

const SlateTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent || '#0EA5E9';
  const primary = config.colors.primary || '#0F172A';

  return (
    <div className="resume-paper" style={{ fontFamily: '"DM Sans", system-ui, sans-serif', backgroundColor: '#F8FAFC' }}>
      {/* HEADER */}
      <header style={{ backgroundColor: '#fff', padding: '36px 48px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 700, color: primary, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px' }}>{personal.name || 'YOUR NAME'}</h1>
          {personal.title && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: accent }} />
              <p style={{ fontSize: '13px', color: accent, fontWeight: 600, letterSpacing: '0.04em' }}>{personal.title}</p>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {v}<div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
            </span>
          ))}
        </div>
      </header>

      {personal.summary && (
        <div style={{ backgroundColor: primary, padding: '18px 48px' }}>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, fontStyle: 'italic' }}>{personal.summary}</p>
        </div>
      )}

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px', minHeight: '750px', padding: '0' }}>
        <div style={{ padding: '32px 32px', backgroundColor: '#fff', borderRight: '1px solid #E2E8F0' }}>
          {experience.length > 0 && (
            <SlateSec title="Work Experience" accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: primary }}>{exp.role}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: accent, marginTop: '1px' }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#94A3B8', whiteSpace: 'nowrap', fontWeight: 500, padding: '3px 8px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                      {exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b=>b).map((b,i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: '#475569', lineHeight: 1.65, marginBottom: '5px', listStyle: 'none' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0, marginTop: '6px' }} />{b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </SlateSec>
          )}
          {projects.length > 0 && (
            <SlateSec title="Projects" accent={accent}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', lineHeight: 1.6 }}>{p.description}</p>}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t,i) => <span key={i} style={{ fontSize: '10.5px', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </SlateSec>
          )}
          {education.length > 0 && (
            <SlateSec title="Education" accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: primary }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', flexShrink: 0, marginLeft: '10px' }}>{edu.endDate}</span>
                </div>
              ))}
            </SlateSec>
          )}
        </div>

        <div style={{ padding: '32px 22px', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {skills.length > 0 && (
            <div>
              <SlateSideTitle title="Skills" accent={accent} />
              {skills.map(s => (
                <div key={s.id} style={{ marginBottom: '9px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: primary }}>{s.name}</span>
                  </div>
                  <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.level}%`, backgroundColor: accent, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <SlateSideTitle title="Certifications" accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px', padding: '8px 10px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: primary }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '10px', color: accent, fontWeight: 600, marginTop: '2px' }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <SlateSideTitle title="Languages" accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: 2, color: primary }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#94A3B8', fontSize: '11px' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SlateSec: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div style={{ marginBottom: '24px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <h2 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: accent }}>{title}</h2>
      <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
    </div>
    {children}
  </div>
);

const SlateSideTitle: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: accent, marginBottom: '12px', paddingBottom: '5px', borderBottom: `2px solid ${accent}40` }}>{title}</h3>
);

export default SlateTemplate;
