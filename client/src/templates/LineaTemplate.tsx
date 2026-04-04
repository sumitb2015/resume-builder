import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';

const LineaTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent || '#4F46E5';

  return (
    <div className="resume-paper" style={{ fontFamily: '"DM Sans", system-ui, sans-serif', backgroundColor: '#fff', padding: '56px 64px' }}>
      {/* HEADER */}
      <header style={{ marginBottom: '36px' }}>
        <div style={{ borderBottom: '3px solid #111', paddingBottom: '20px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 300, letterSpacing: '-0.04em', color: '#111', lineHeight: 1.05 }}>{personal.name || 'YOUR NAME'}</h1>
          {personal.title && <p style={{ fontSize: '14px', fontWeight: 500, color: accent, letterSpacing: '0.06em', marginTop: '6px' }}>{personal.title}</p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <div key={i} style={{ borderTop: `2px solid ${accent}`, paddingTop: '6px' }}>
              <span style={{ fontSize: '10.5px', color: '#555', display: 'block', lineHeight: 1.4 }}>{v}</span>
            </div>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '48px' }}>
        {/* MAIN */}
        <div>
          {personal.summary && (
            <div style={{ marginBottom: '28px' }}>
              <LineaSec title="Profile" accent={accent} />
              <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.85 }}>{personal.summary}</p>
            </div>
          )}
          {experience.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <LineaSec title="Experience" accent={accent} />
              {experience.map(exp => (
                <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '16px', paddingTop: '2px' }}>
                    <div style={{ fontSize: '10.5px', color: '#9CA3AF', lineHeight: 1.6 }}>
                      {exp.startDate && <div>{exp.startDate}</div>}
                      <div style={{ color: accent, fontWeight: 600 }}>{exp.isCurrent ? 'Present' : exp.endDate}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>{exp.role}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: accent, marginBottom: '6px' }}>{exp.company}</div>
                    <ul style={{ paddingLeft: 0, margin: 0 }}>
                      {exp.bullets.filter(b=>b).map((b,i) => (
                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: '#555', lineHeight: 1.7, marginBottom: '4px', listStyle: 'none' }}>
                          <span style={{ color: '#CCC', flexShrink: 0 }}>—</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          {projects.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <LineaSec title="Projects" accent={accent} />
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <p style={{ fontSize: '12.5px', color: '#555', marginTop: '4px', lineHeight: 1.65 }}>{p.description}</p>}
                  {p.tech.length > 0 && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{p.tech.join(' · ')}</div>}
                </div>
              ))}
            </div>
          )}
          {education.length > 0 && (
            <div>
              <LineaSec title="Education" accent={accent} />
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ borderRight: '1px solid #E5E7EB', paddingRight: '16px' }}>
                    <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>{edu.endDate}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '1px solid #E5E7EB', paddingLeft: '24px' }}>
          {skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, marginBottom: '14px', borderBottom: `2px solid ${accent}`, paddingBottom: '5px' }}>Skills</h3>
              {skills.map(s => (
                <div key={s.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#111', marginBottom: '4px' }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1,2,3,4,5].map(d => (
                      <div key={d} style={{ height: '3px', flex: 1, borderRadius: '2px', backgroundColor: d * 20 <= s.level ? accent : '#E5E7EB' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, marginBottom: '12px', borderBottom: `2px solid ${accent}`, paddingBottom: '5px' }}>Languages</h3>
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{l.language}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{l.proficiency}</div>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: accent, marginBottom: '12px', borderBottom: `2px solid ${accent}`, paddingBottom: '5px' }}>Certifications</h3>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '10.5px', color: accent, fontWeight: 600 }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LineaSec: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
    <h2 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#111', whiteSpace: 'nowrap' }}>{title}</h2>
    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
    <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: `2px solid ${accent}`, flexShrink: 0 }} />
  </div>
);

export default LineaTemplate;
