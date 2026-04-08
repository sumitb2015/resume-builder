import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ForestTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary || '#1B4332';
  const accent = config.colors.accent || '#52B788';
  const text = config.colors.text || '#1C1C1C';

  return (
    <div className="resume-paper" style={{
      fontFamily: '"DM Sans", system-ui, sans-serif',
      display: 'flex',
      backgroundColor: config.colors.background || '#FFFFFF',
      minHeight: '1123px',
    }}>
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: '220px',
        minWidth: '220px',
        backgroundColor: primary,
        padding: '36px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        minHeight: '1123px',
      }}>
        {/* Name & Title */}
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.02em', margin: 0 }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '10.5px', color: accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '5px', marginBottom: 0 }}>
              {personal.title}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

        {/* Contact */}
        <ForestSideSection title="Contact" accent={accent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {personal.email && <ForestContactRow label="Email" value={personal.email} />}
            {personal.phone && <ForestContactRow label="Phone" value={personal.phone} />}
            {personal.location && <ForestContactRow label="Location" value={personal.location} />}
            {personal.linkedin && <ForestContactRow label="LinkedIn" value={personal.linkedin} />}
            {personal.website && <ForestContactRow label="Website" value={personal.website} />}
          </div>
        </ForestSideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <ForestSideSection title="Skills" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {skills.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>{s.name}</span>
                  <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                    {[1,2,3,4,5].map(d => (
                      <div key={d} style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: (d * 20) <= s.level ? accent : 'rgba(255,255,255,0.2)',
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ForestSideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <ForestSideSection title="Languages" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>{l.language}</span>
                  {l.proficiency && (
                    <span style={{
                      backgroundColor: 'rgba(255,255,255,0.12)', color: accent, fontSize: '9.5px',
                      padding: '1px 7px', borderRadius: '10px', fontWeight: 600, flexShrink: 0,
                    }}>
                      {l.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ForestSideSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <ForestSideSection title="Certifications" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {certifications.map(c => (
                <div key={c.id}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>{c.date}</div>}
                </div>
              ))}
            </div>
          </ForestSideSection>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: '22px', overflow: 'hidden' }}>
        {/* Summary */}
        {personal.summary && (
          <div>
            <ForestMainHeader title="Profile" primary={primary} accent={accent} />
            <RichContent html={personal.summary} style={{ fontSize: '12.5px', lineHeight: 1.8, color: text, margin: 0 }} />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <ForestMainHeader title="Experience" primary={primary} accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {experience.map(exp => (
                <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{exp.role}</div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: primary, marginTop: '1px' }}>{exp.company}</div>
                    </div>
                    <span style={{
                      backgroundColor: '#F0FDF4', color: '#166534', fontSize: '10px',
                      padding: '2px 9px', borderRadius: '10px', flexShrink: 0, marginLeft: '10px', marginTop: '2px', fontWeight: 600,
                    }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '0' }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: text, lineHeight: 1.65, listStyle: 'none' }}>
                          <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>›</span>
                          <RichContent html={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <ForestMainHeader title="Education" primary={primary} accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                      {edu.gpa && <span style={{ marginLeft: '8px', color: text, fontWeight: 600 }}>· GPA {edu.gpa}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <ForestMainHeader title="Projects" primary={primary} accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map(p => (
                <div key={p.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12px', color: '#4B5563', margin: '0 0 4px', lineHeight: 1.6 }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {p.tech.map((t, i) => (
                        <span key={i} style={{ backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom */}
        {custom.map(section => (
          <div key={section.id}>
            <ForestMainHeader title={section.sectionTitle} primary={primary} accent={accent} />
            <ul style={{ paddingLeft: '0', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {section.entries.filter(e => e).map((entry, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12px', color: text, lineHeight: 1.65, listStyle: 'none' }}>
                  <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>›</span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </div>
  );
};

const ForestSideSection: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div>
    <h2 style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: accent, marginBottom: '10px', margin: '0 0 10px' }}>
      {title}
    </h2>
    {children}
  </div>
);

const ForestContactRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-word' }}>{value}</div>
  </div>
);

const ForestMainHeader: React.FC<{ title: string; primary: string; accent: string }> = ({ title, primary, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
    <h2 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: primary, whiteSpace: 'nowrap', margin: 0 }}>
      {title}
    </h2>
    <div style={{ flex: 1, height: '2px', backgroundColor: `${accent}50` }} />
  </div>
);

export default ForestTemplate;
