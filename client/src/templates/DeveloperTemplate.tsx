import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { stripHtml } from '../lib/htmlUtils';

const DeveloperTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const accent = config.colors.accent || '#22D3EE';
  const primary = config.colors.primary || '#0D1117';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: '#fff', padding: 0 }}>
      {/* DARK HEADER */}
      <header style={{ backgroundColor: primary, padding: '36px 48px 28px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', color: accent, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace' }}>
              &lt;resume&gt;
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#F0F6FC', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '6px' }}>{personal.name || 'YOUR NAME'}</h1>
            {personal.title && <p style={{ fontSize: '13px', color: accent, fontWeight: 500, fontFamily: 'monospace' }}>// {personal.title}</p>}
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '11px', color: '#7D8590', lineHeight: 2 }}>
            {personal.email && <div><span style={{ color: accent }}>email</span>: {personal.email}</div>}
            {personal.phone && <div><span style={{ color: accent }}>phone</span>: {personal.phone}</div>}
            {personal.location && <div><span style={{ color: accent }}>location</span>: {personal.location}</div>}
            {personal.linkedin && <div><span style={{ color: accent }}>linkedin</span>: {personal.linkedin}</div>}
            {personal.website && <div><span style={{ color: accent }}>web</span>: {personal.website}</div>}
          </div>
        </div>
        {personal.summary && (
          <div style={{ marginTop: '18px', padding: '12px 16px', backgroundColor: 'rgba(255,255,255,0.04)', borderLeft: `3px solid ${accent}`, borderRadius: '0 6px 6px 0', fontFamily: 'monospace', fontSize: '12px', color: '#8B949E', lineHeight: 1.7 }}>
            /* {stripHtml(personal.summary)} */
          </div>
        )}
      </header>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px' }}>
        <div style={{ padding: '32px 32px' }}>
          {experience.length > 0 && (
            <DevSection title="experience" accent={accent}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', borderLeft: `3px solid ${accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{exp.role}</span>
                      <span style={{ margin: '0 8px', color: '#CBD5E1' }}>@</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: accent }}>{exp.company}</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#94A3B8', flexShrink: 0, marginLeft: '10px' }}>
                      [{exp.startDate}{exp.startDate||exp.endDate?' → ':''}{exp.isCurrent?'now':exp.endDate}]
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b=>b).map((b,i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: '#475569', lineHeight: 1.65, marginBottom: '4px', listStyle: 'none' }}>
                        <span style={{ color: accent, fontFamily: 'monospace', flexShrink: 0 }}>→</span><RichContent html={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </DevSection>
          )}
          {projects.length > 0 && (
            <DevSection title="projects" accent={accent}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '10.5px', color: accent, fontFamily: 'monospace' }}>{p.url}</span>}
                  </div>
                  {p.description && <p style={{ fontSize: '12px', color: '#64748B', margin: '6px 0' }}>{p.description}</p>}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {p.tech.map((t,i) => <span key={i} style={{ fontFamily: 'monospace', fontSize: '10.5px', backgroundColor: accent+'20', color: accent, padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </DevSection>
          )}
          {education.length > 0 && (
            <DevSection title="education" accent={accent}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94A3B8', flexShrink: 0 }}>{edu.endDate}</span>
                </div>
              ))}
            </DevSection>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ borderLeft: '1px solid #E2E8F0', padding: '32px 22px', backgroundColor: '#FAFBFC', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {skills.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <DevSideTitle title="tech_stack" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {skills.map(s => (
                  <div key={s.id} style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#334155', backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{s.name}</span>
                    <span style={{ color: accent }}>{s.level >= 75 ? '●●●●' : s.level >= 50 ? '●●●○' : s.level >= 25 ? '●●○○' : '●○○○'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {certifications.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <DevSideTitle title="certs" accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '8px', fontSize: '11.5px' }}>
                  <div style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</div>
                  {c.issuer && <div style={{ color: '#94A3B8', fontSize: '10.5px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ color: accent, fontSize: '10px', fontFamily: 'monospace' }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <DevSideTitle title="languages" accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', lineHeight: 2 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DevSection: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <h2 style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: accent }}>
        <span style={{ color: '#94A3B8' }}>fn.</span>{title}()
      </h2>
      <div style={{ flex: 1, height: '1px', background: `${accent}30` }} />
    </div>
    {children}
  </div>
);

const DevSideTitle: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <h3 style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, color: accent, textTransform: 'lowercase', letterSpacing: '0.08em', marginBottom: '10px', paddingBottom: '5px', borderBottom: `1px solid ${accent}30` }}>
    &gt; {title}
  </h3>
);

export default DeveloperTemplate;
