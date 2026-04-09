import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';

const CentricTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#1A1A1B',
      padding: '60px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* CENTERED HEADER */}
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: config.fonts.heading,
          fontSize: '3.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.04em',
          color: '#111', textTransform: 'uppercase'
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ fontSize: '1.2rem', fontWeight: 600, color: primary, marginTop: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {personal.title}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px', 
          marginTop: '20px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Link2 size={14} /> {personal.linkedin}</div>}
        </div>
      </header>

      {/* CENTERED SUMMARY */}
      {personal.summary && (
        <section style={{ marginBottom: '48px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
          <RichContent html={personal.summary} style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#444' }} />
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '60px' }}>
        {/* MAIN COLUMN: EXPERIENCE */}
        <section>
          <CentricSectionTitle title="Experience" color={primary} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111' }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '1rem', color: primary, fontWeight: 700, marginBottom: '12px' }}>{exp.company}</div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.6 }}>
                        <RichContent html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SIDEBAR: SKILLS & EDUCATION */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {skills.length > 0 && (
            <section>
              <CentricSectionTitle title="Expertise" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map(skill => (
                  <div key={skill.id} style={{ fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>
                    • {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <CentricSectionTitle title="Education" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.85rem', color: primary, fontWeight: 600, marginTop: '2px' }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <CentricSectionTitle title="Languages" color={primary} />
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700 }}>{l.language}:</span> {l.proficiency}
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const CentricSectionTitle: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <h2 style={{ 
    fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', 
    color: color, marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '8px'
  }}>
    {title}
  </h2>
);

export default CentricTemplate;
