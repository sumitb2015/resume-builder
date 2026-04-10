import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const SwissTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: '"Inter", "Helvetica", sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#1A1A1A',
      padding: '60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
    }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{
          fontSize: '2.5rem', fontWeight: 700, margin: 0, letterSpacing: '-0.04em'
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        <div style={{ textAlign: 'right', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
        </div>
      </header>

      {/* SUMMARY */}
      {personal.summary && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
              Summary
            </div>
            <RichContent html={personal.summary} style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#333' }} />
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
              Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {experience.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{exp.company}</h3>
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: primary, marginBottom: '12px' }}>{exp.role}</div>
                  {exp.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '0', listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.5, display: 'flex', gap: '12px' }}>
                          <span style={{ color: primary, fontWeight: 800 }}>—</span>
                          <RichContent html={bullet} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
              Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{edu.school}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>{edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SwissTemplate;
