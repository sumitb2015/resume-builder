import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const ModernTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary || '#1B2A4A';
  const accent = config.colors.accent || '#3B82F6';

  return (
    <div
      className="resume-paper"
      style={{ fontFamily: '"Inter", system-ui, sans-serif', display: 'flex', backgroundColor: '#FFFFFF', minHeight: '1123px' }}
    >
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: primary,
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        minHeight: '1123px',
      }}>
        {/* Name & Title */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '11px', fontWeight: 500, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.4 }}>
              {personal.title}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

        {/* Contact */}
        <SideSection title="Contact" accent={accent}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {personal.email && <ContactRow label="Email" value={personal.email} />}
            {personal.phone && <ContactRow label="Phone" value={personal.phone} />}
            {personal.location && <ContactRow label="Location" value={personal.location} />}
            {personal.linkedin && <ContactRow label="LinkedIn" value={personal.linkedin} />}
            {personal.website && <ContactRow label="Website" value={personal.website} />}
          </div>
        </SideSection>

        {/* Skills */}
        {skills.length > 0 && (
          <SideSection title="Skills" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {skills.map(s => (
                <div key={s.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{s.name}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.level}%`, backgroundColor: accent, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{l.language}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, color: primary,
                    backgroundColor: accent, padding: '1px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </SideSection>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <SideSection title="Certifications" accent={accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {certifications.map(c => (
                <div key={c.id}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', marginTop: '1px' }}>{c.issuer}</div>}
                </div>
              ))}
            </div>
          </SideSection>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '24px', overflow: 'hidden' }}>
        {/* Summary */}
        {personal.summary && (
          <div>
            <MainSectionTitle title="Professional Summary" accent={accent} />
            <RichContent html={personal.summary} style={{ fontSize: '13px', lineHeight: 1.75, color: '#374151' }} />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <MainSectionTitle title="Work Experience" accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>{exp.role}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: accent, marginTop: '1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{exp.company}</div>
                    </div>
                    <div style={{
                      fontSize: '10.5px', fontWeight: 600, color: '#6B7280', whiteSpace: 'nowrap',
                      backgroundColor: '#F3F4F6', padding: '3px 10px', borderRadius: '20px', flexShrink: 0, marginLeft: '10px', marginTop: '2px'
                    }}>
                      {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.bullets.filter(b => b).length > 0 && (
                    <ul style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px', paddingLeft: '0' }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: '#4B5563', lineHeight: 1.65, listStyle: 'none' }}>
                          <span style={{ color: accent, fontWeight: 700, marginTop: '0px', flexShrink: 0 }}>›</span>
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
            <MainSectionTitle title="Education" accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                      {edu.gpa && <span style={{ marginLeft: '8px', color: '#374151', fontWeight: 600 }}>· GPA {edu.gpa}</span>}
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
            <MainSectionTitle title="Projects" accent={accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {projects.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#4B5563', marginTop: '4px', lineHeight: 1.6 }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: '10.5px', backgroundColor: '#EEF2FF', color: accent, padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SideSection: React.FC<{ title: string; accent: string; children: React.ReactNode }> = ({ title, accent, children }) => (
  <div>
    <h2 style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: accent, marginBottom: '12px' }}>
      {title}
    </h2>
    {children}
  </div>
);

const ContactRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '9.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', wordBreak: 'break-word' }}>{value}</div>
  </div>
);

const MainSectionTitle: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
    <h2 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: accent, whiteSpace: 'nowrap' }}>
      {title}
    </h2>
    <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${accent}60, transparent)` }} />
  </div>
);

export default ModernTemplate;
