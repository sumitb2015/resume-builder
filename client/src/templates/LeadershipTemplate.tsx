import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const LeadershipTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.heading, // Using heading font for a prestigious look
      backgroundColor: '#FFFFFF',
      color: '#111111',
      padding: '50px 60px',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.5,
    }}>
      {/* HEADER: Authoritative & Centered */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: primary,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ 
            fontSize: '1.1rem', 
            fontWeight: 500, 
            color: accent, 
            margin: '0 0 20px 0',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            {personal.title}
          </p>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px',
          fontSize: '0.85rem',
          color: '#555',
          fontFamily: config.fonts.body,
          borderTop: '1px solid #EEE',
          borderBottom: '1px solid #EEE',
          padding: '12px 0',
        }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• &nbsp; {personal.phone}</span>}
          {personal.location && <span>• &nbsp; {personal.location}</span>}
          {personal.linkedin && <span>• &nbsp; {personal.linkedin}</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {personal.summary && (
        <section style={{ marginBottom: '40px' }}>
          <RichContent html={personal.summary} style={{ 
            fontSize: '1.05rem', 
            lineHeight: 1.7, 
            textAlign: 'center',
            color: '#333',
            fontStyle: 'italic',
            maxWidth: '90%',
            margin: '0 auto'
          }} />
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <LeadershipSectionTitle title="Executive Experience" color={primary} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000', margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: '1rem', color: accent, fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{exp.company}</div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.6, fontFamily: config.fonts.body }}>
                        <RichContent html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <LeadershipSectionTitle title="Strategic Initiatives" color={primary} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {projects.map(p => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', margin: 0 }}>{p.title}</h3>
                  {p.url && <span style={{ fontSize: '0.85rem', color: accent }}>{p.url}</span>}
                </div>
                {p.description && <div style={{ marginTop: '6px' }}><RichContent html={p.description} style={{ fontSize: '0.95rem', color: '#444', fontFamily: config.fonts.body }} /></div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TWO COLUMNS FOR SMALLER SECTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div>
          {/* SKILLS */}
          {skills.length > 0 && (
            <section style={{ marginBottom: '30px' }}>
              <LeadershipSectionTitle title="Expertise" color={primary} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'x: 15px, y: 10px', fontSize: '0.9rem', fontFamily: config.fonts.body }}>
                {skills.map((s, i) => (
                  <span key={s.id} style={{ fontWeight: 600, color: '#333' }}>
                    {s.name}{i < skills.length - 1 ? ' \u00A0\u2022\u00A0 ' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <section>
              <LeadershipSectionTitle title="Languages" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', fontFamily: config.fonts.body }}>
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>{l.language}</span>
                    <span style={{ color: '#666' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          {/* EDUCATION */}
          {education.length > 0 && (
            <section style={{ marginBottom: '30px' }}>
              <LeadershipSectionTitle title="Education" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#000' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.9rem', color: accent, fontWeight: 600 }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <LeadershipSectionTitle title="Certifications" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {certifications.map(c => (
                  <div key={c.id}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{c.issuer}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const LeadershipSectionTitle: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <div style={{ marginBottom: '20px', borderBottom: `2px solid ${color}`, paddingBottom: '6px' }}>
    <h2 style={{ 
      fontSize: '1.2rem', 
      fontWeight: 800, 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em', 
      color: color,
      margin: 0
    }}>
      {title}
    </h2>
  </div>
);

export default LeadershipTemplate;
