import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const HorizonTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: config.colors.background || '#FFFFFF',
      padding: 0,
    }}>
      {/* GRADIENT HEADER */}
      <header style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`, padding: '40px 48px 36px', position: 'relative', overflow: 'hidden', margin: 0 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(100px,-100px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '40%', width: '200px', height: '200px', background: 'rgba(0,0,0,0.06)', borderRadius: '50%', transform: 'translateY(80px)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: config.fonts.heading, fontSize: '2.125em', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px' }}>{personal.name || 'YOUR NAME'}</h1>
            {personal.title && <p style={{ fontSize: '0.875em', color: 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: '0.04em' }}>{personal.title}</p>}
          </div>
          {personal.summary && (
            <div style={{ maxWidth: '260px', background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '14px 16px', backdropFilter: 'blur(4px)' }}>
              <RichContent html={personal.summary} style={{ fontSize: '0.7188em', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }} />
            </div>
          )}
        </div>
        {/* Contact row */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '6px 20px', marginTop: '20px' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '0.6875em', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accent, display: 'inline-block', flexShrink: 0 }} />{v}
            </span>
          ))}
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}>
        {/* MAIN */}
        <div style={{ padding: '10mm 15mm 15mm 15mm', borderRight: `3px solid ${accent}20` }}>
          {experience.length > 0 && (
            <HSection title="Experience" accent={accent} config={config}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontSize: '0.875em', fontWeight: 700, color: '#0F172A' }}>{exp.role}</span>
                      <span style={{ marginLeft: '8px', fontSize: '0.75em', color: accent, fontWeight: 600 }}>{exp.company}</span>
                    </div>
                    <span style={{ fontSize: '0.6563em', color: '#94A3B8', backgroundColor: '#F8FAFC', padding: '2px 8px', borderRadius: '10px', flexShrink: 0, marginLeft: '8px' }}>
                      {exp.startDate}{exp.startDate || exp.endDate ? ' – ' : ''}{exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b => b).map((b, i) => (
                      <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.7813em', color: '#475569', lineHeight: 1.65, marginBottom: '4px', listStyle: 'none' }}>
                        <span style={{ color: accent, flexShrink: 0, fontWeight: 700, marginTop: '1px' }}>▸</span><RichContent html={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </HSection>
          )}
          {projects.length > 0 && (
            <HSection title="Projects" accent={accent} config={config}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8438em', fontWeight: 700, color: '#0F172A' }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '0.6875em', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '0.7813em', color: '#64748B', marginTop: '3px', lineHeight: 1.6 }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t, i) => <span key={i} style={{ fontSize: '0.6563em', color: accent, background: accent + '15', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </HSection>
          )}
          {education.length > 0 && (
            <HSection title="Education" accent={accent} config={config}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.8438em', fontWeight: 700, color: '#0F172A' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.75em', color: '#64748B', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</div>
                  </div>
                  <span style={{ fontSize: '0.6875em', color: '#94A3B8', flexShrink: 0, marginLeft: '10px' }}>{edu.endDate}</span>
                </div>
              ))}
            </HSection>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ padding: '36px 24px', background: '#FAFBFF', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {skills.length > 0 && (
            <div>
              <HSideTitle title="Skills" accent={accent} config={config} />
              {skills.map(s => (
                <div key={s.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.7188em', fontWeight: 600, color: '#334155' }}>{s.name}</span>
                  </div>
                  <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.level}%`, background: `linear-gradient(to right, ${primary}, ${accent})`, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div>
              <HSideTitle title="Certifications" accent={accent} config={config} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.7188em', fontWeight: 700, color: '#1E293B' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '0.6563em', color: '#94A3B8', marginTop: '1px' }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '0.625em', color: accent, marginTop: '2px', fontWeight: 600 }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <HSideTitle title="Languages" accent={accent} config={config} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', lineHeight: 2, color: '#334155' }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.6875em' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HSection: React.FC<{ title: string; accent: string; config: TemplateConfig; children: React.ReactNode }> = ({ title, accent, config, children }) => (
  <div style={{ marginBottom: '28px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <div style={{ width: '20px', height: '3px', background: accent, borderRadius: '2px' }} />
      <h2 style={{ fontFamily: config.fonts.heading, fontSize: '0.6875em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: accent }}>{title}</h2>
    </div>
    {children}
  </div>
);

const HSideTitle: React.FC<{ title: string; accent: string; config: TemplateConfig }> = ({ title, accent, config }) => (
  <h3 style={{ fontFamily: config.fonts.heading, fontSize: '0.5938em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', color: accent, marginBottom: '12px', paddingBottom: '6px', borderBottom: `2px solid ${accent}30` }}>{title}</h3>
);

export default HorizonTemplate;
