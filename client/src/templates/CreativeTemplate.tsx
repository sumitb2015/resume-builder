import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const CreativeTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary || '#7C3AED';
  const accent = config.colors.accent || '#F59E0B';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Poppins", system-ui, sans-serif', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>

      {/* BOLD HEADER BAND */}
      <header style={{ backgroundColor: primary, padding: '36px 48px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '34px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '6px' }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '14px', fontWeight: 500, color: accent, marginBottom: '18px', letterSpacing: '0.01em' }}>
              {personal.title}
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {personal.email && <ContactPill value={personal.email} accent={accent} icon="✉" />}
            {personal.phone && <ContactPill value={personal.phone} accent={accent} icon="✆" />}
            {personal.location && <ContactPill value={personal.location} accent={accent} icon="◎" />}
            {personal.linkedin && <ContactPill value={personal.linkedin} accent={accent} icon="in" />}
            {personal.website && <ContactPill value={personal.website} accent={accent} icon="⌘" />}
          </div>
        </div>
      </header>

      {/* ACCENT STRIPE */}
      <div style={{ height: '4px', background: `linear-gradient(to right, ${accent}, ${primary})` }} />

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', minHeight: '900px' }}>

        {/* LEFT MAIN */}
        <div style={{ padding: '32px 32px', borderRight: '1px solid #F3F4F6' }}>
          {personal.summary && (
            <div style={{ marginBottom: '28px' }}>
              <CreativeSectionTitle title="About Me" primary={primary} />
              <RichContent html={personal.summary} style={{ fontSize: '12.5px', lineHeight: 1.8, color: '#374151' }} />
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <CreativeSectionTitle title="Experience" primary={primary} />
              <div style={{ position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#F3F4F6' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {experience.map((exp, idx) => (
                    <div key={exp.id} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-20px', top: '5px',
                        width: '14px', height: '14px', borderRadius: '50%',
                        backgroundColor: idx === 0 ? primary : '#E5E7EB',
                        border: `3px solid ${idx === 0 ? accent : '#E5E7EB'}`,
                        boxSizing: 'border-box',
                      }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em' }}>{exp.role}</div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: primary, marginTop: '1px' }}>{exp.company}</div>
                        </div>
                        <span style={{ fontSize: '10.5px', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '8px', backgroundColor: '#F9FAFB', padding: '2px 8px', borderRadius: '12px', flexShrink: 0 }}>
                          {exp.startDate}{(exp.startDate || exp.endDate) ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets.filter(b => b).length > 0 && (
                        <ul style={{ paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {exp.bullets.filter(b => b).map((bullet, i) => (
                            <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#4B5563', lineHeight: 1.65, listStyle: 'none' }}>
                              <span style={{ color: accent, flexShrink: 0 }}>▸</span>
                              <RichContent html={bullet} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <CreativeSectionTitle title="Projects" primary={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ padding: '12px 14px', backgroundColor: '#F9FAFB', borderRadius: '10px', borderLeft: `3px solid ${primary}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{p.title}</span>
                      {p.url && <span style={{ fontSize: '11px', color: primary }}>{p.url}</span>}
                    </div>
                    {p.description && <RichContent html={p.description} style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', lineHeight: 1.6 }} />}
                    {p.tech.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {p.tech.map((t, i) => (
                          <span key={i} style={{ fontSize: '10px', backgroundColor: primary + '15', color: primary, padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <CreativeSectionTitle title="Education" primary={primary} />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>{edu.school}</div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{edu.startDate}{(edu.startDate || edu.endDate) ? ' – ' : ''}{edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    {edu.gpa && <span style={{ marginLeft: '6px', fontWeight: 600, color: '#374151' }}>· GPA {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ padding: '32px 22px', backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {skills.length > 0 && (
            <div>
              <CreativeSectionTitle title="Skills" primary={primary} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.map(s => (
                  <span key={s.id} style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '4px 10px', borderRadius: '20px',
                    backgroundColor: s.level >= 75 ? primary : s.level >= 50 ? primary + 'CC' : '#E5E7EB',
                    color: s.level >= 50 ? '#FFFFFF' : '#374151',
                  }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <CreativeSectionTitle title="Certifications" primary={primary} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px', padding: '8px 10px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '10px', color: primary, marginTop: '2px', fontWeight: 600 }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <CreativeSectionTitle title="Languages" primary={primary} />
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{l.language}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '10.5px' }}>{l.proficiency}</span>
                  </div>
                  <div style={{ height: '3px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px', backgroundColor: primary,
                      width: l.proficiency === 'Native' ? '100%' : l.proficiency === 'Fluent' ? '90%' : l.proficiency === 'Advanced' ? '75%' : l.proficiency === 'Intermediate' ? '55%' : '35%'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreativeSectionTitle: React.FC<{ title: string; primary: string }> = ({ title, primary }) => (
  <h2 style={{
    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em',
    color: primary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px',
    fontFamily: '"Poppins", system-ui, sans-serif',
  }}>
    <span style={{ display: 'inline-block', width: '18px', height: '3px', backgroundColor: primary, borderRadius: '2px', flexShrink: 0 }} />
    {title}
  </h2>
);

const ContactPill: React.FC<{ value: string; accent: string; icon: string }> = ({ value, accent, icon }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(255,255,255,0.15)',
  }}>
    <span style={{ color: accent, fontSize: '10px', fontWeight: 700 }}>{icon}</span>
    <span>{value}</span>
  </div>
);

export default CreativeTemplate;
