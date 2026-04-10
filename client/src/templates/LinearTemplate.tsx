import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';

const LinearTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#1A1A1B',
      padding: '60px 80px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* MINIMAL HEADER */}
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: config.fonts.heading,
          fontSize: '2.5rem', fontWeight: 400, margin: 0, letterSpacing: '0.05em',
          color: '#000', textTransform: 'uppercase'
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '16px',
          fontSize: '0.85rem',
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <span>{personal.title}</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
          </div>
        </div>
        <div style={{ height: '1px', backgroundColor: '#000', marginTop: '20px' }} />
      </header>

      {/* SUMMARY */}
      {personal.summary && (
        <section style={{ marginBottom: '40px' }}>
          <LinearSectionTitle title="About" />
          <RichContent html={personal.summary} style={{ fontSize: '1rem', lineHeight: 1.6, color: '#333' }} />
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <LinearSectionTitle title="Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000', margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: primary, marginBottom: '12px', textTransform: 'uppercase' }}>{exp.company}</div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.5 }}>
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

      {/* SKILLS */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <LinearSectionTitle title="Skills" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'x: 24px, y: 12px' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{ fontSize: '0.95rem', color: '#333' }}>
                <span style={{ fontWeight: 700 }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section>
          <LinearSectionTitle title="Education" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {education.map(edu => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#000', margin: 0 }}>{edu.school}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>{edu.endDate}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#444' }}>{edu.degree} in {edu.field}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const LinearSectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ marginBottom: '20px' }}>
    <h2 style={{ 
      fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', 
      color: '#999', marginBottom: '8px'
    }}>
      {title}
    </h2>
    <div style={{ height: '1px', backgroundColor: '#EEE' }} />
  </div>
);

export default LinearTemplate;
