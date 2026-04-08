import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const BoldTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary || '#09090B';
  const accent = config.colors.accent || '#6366F1';

  return (
    <div className="resume-paper" style={{ fontFamily: '"Poppins", system-ui, sans-serif', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* DRAMATIC HERO */}
      <div style={{ backgroundColor: primary, padding: '12mm 15mm 10mm', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '240px', height: '240px', borderRadius: '50%', border: `2px solid ${accent}30`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: '20px', right: '20px', width: '140px', height: '140px', borderRadius: '50%', border: `2px solid ${accent}20`, opacity: 0.4 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: accent, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>
            ◆ {personal.title || 'Professional Resume'}
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: 900, color: '#FAFAFA', letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: '24px' }}>
            {(personal.name || 'YOUR NAME').split(' ').map((word, i) => (
              <div key={i}>{word}</div>
            ))}
          </h1>
          {personal.summary && (
            <RichContent html={personal.summary} style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: '480px' }} />
          )}
        </div>
      </div>

      {/* ACCENT BAR with contact */}
      <div style={{ backgroundColor: accent, padding: '4mm 15mm', display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).map((v, i) => (
          <span key={i} style={{ fontSize: '11px', fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>{v}</span>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '12mm 15mm', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '40px' }}>
        <div>
          {experience.length > 0 && (
            <BoldSec title="Experience" accent={accent} primary={primary}>
              {experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '22px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: primary, letterSpacing: '-0.02em' }}>{exp.role}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{exp.company}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#A1A1AA', backgroundColor: '#F4F4F5', padding: '3px 8px', borderRadius: '4px', flexShrink: 0, marginLeft: '10px', fontWeight: 600 }}>
                      {exp.startDate}{exp.startDate||exp.endDate?' – ':''}{exp.isCurrent?'Present':exp.endDate}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 0, margin: '8px 0 0' }}>
                    {exp.bullets.filter(b=>b).map((b,i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '12.5px', color: '#3F3F46', lineHeight: 1.7, marginBottom: '5px', listStyle: 'none' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accent, flexShrink: 0, marginTop: '7px' }} /><RichContent html={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </BoldSec>
          )}
          {projects.length > 0 && (
            <BoldSec title="Projects" accent={accent} primary={primary}>
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '14px', borderLeft: `3px solid ${accent}`, paddingLeft: '14px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: primary }}>{p.title}</span>
                    {p.url && <span style={{ fontSize: '11px', color: accent }}>{p.url}</span>}
                  </div>
                  {p.description && <RichContent html={p.description} style={{ fontSize: '12.5px', color: '#52525B', marginTop: '4px', lineHeight: 1.6 }} />}
                  {p.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {p.tech.map((t,i) => <span key={i} style={{ fontSize: '10.5px', backgroundColor: primary, color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </BoldSec>
          )}
          {education.length > 0 && (
            <BoldSec title="Education" accent={accent} primary={primary}>
              {education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: primary }}>{edu.school}</div>
                    <div style={{ fontSize: '12px', color: '#71717A', marginTop: '2px' }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#A1A1AA', flexShrink: 0 }}>{edu.endDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</span>
                </div>
              ))}
            </BoldSec>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {skills.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <BoldSideTitle title="Skills" accent={accent} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map(s => (
                  <div key={s.id}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: primary, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ height: '4px', background: '#F4F4F5', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.level}%`, backgroundColor: accent, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <BoldSideTitle title="Languages" accent={accent} />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', lineHeight: 2, color: primary }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#A1A1AA', fontSize: '11px' }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
          {certifications.length > 0 && (
            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <BoldSideTitle title="Certifications" accent={accent} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: primary }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '11px', color: '#71717A' }}>{c.issuer}</div>}
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

const BoldSec: React.FC<{ title: string; accent: string; primary: string; children: React.ReactNode }> = ({ title, accent, primary, children }) => (
  <div style={{ marginBottom: '26px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <h2 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: primary }}>{title}</h2>
      <div style={{ flex: 1, height: '2px', background: `linear-gradient(to right, ${accent}, transparent)` }} />
    </div>
    {children}
  </div>
);

const BoldSideTitle: React.FC<{ title: string; accent: string }> = ({ title, accent }) => (
  <h3 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: accent, marginBottom: '12px', paddingBottom: '5px', borderBottom: `2px solid ${accent}` }}>{title}</h3>
);

export default BoldTemplate;
