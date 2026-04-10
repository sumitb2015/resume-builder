import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';

const BoldSidebarTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, languages, projects } = resume;

  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#333',
      padding: 0,
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      minHeight: '1120px',
    }}>
      {/* SIDEBAR */}
      <aside style={{ 
        backgroundColor: primary, 
        color: 'white', 
        padding: '50px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        {/* PERSONAL INFO */}
        <section>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, lineHeight: 1.1, color: 'white' }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && <p style={{ fontSize: '1rem', marginTop: '12px', opacity: 0.9, fontWeight: 500 }}>{personal.title}</p>}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}><Mail size={16} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}><Phone size={16} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}><MapPin size={16} /> {personal.location}</div>}
        </section>

        {/* SKILLS */}
        {skills.length > 0 && (
          <section>
            <SidebarTitle title="Skills" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(skill => (
                <span key={skill.id} style={{ 
                  fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.15)', 
                  padding: '4px 10px', borderRadius: '4px', fontWeight: 600 
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {languages.length > 0 && (
          <section>
            <SidebarTitle title="Languages" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {languages.map(lang => (
                <div key={lang.id} style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700 }}>{lang.language}</div>
                  <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ padding: '60px 50px' }}>
        {/* SUMMARY */}
        {personal.summary && (
          <section style={{ marginBottom: '40px' }}>
            <SectionHeader title="Profile" color={primary} />
            <RichContent html={personal.summary} style={{ fontSize: '1rem', lineHeight: 1.6, color: '#444' }} />
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <SectionHeader title="Experience" color={primary} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {experience.map(exp => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111' }}>{exp.role}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '1rem', color: primary, fontWeight: 700, margin: '2px 0 10px 0' }}>{exp.company}</div>
                  {exp.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {exp.bullets.filter(b => b).map((bullet, i) => (
                        <li key={i} style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.5 }}>
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
            <SectionHeader title="Projects" color={primary} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.map(p => (
                <div key={p.id}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111' }}>{p.title}</h3>
                  {p.description && <div style={{ marginTop: '4px' }}><RichContent html={p.description} style={{ fontSize: '0.9rem', color: '#555' }} /></div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <SectionHeader title="Education" color={primary} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111' }}>{edu.school}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>{edu.endDate}</span>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#555', marginTop: '2px' }}>{edu.degree} in {edu.field}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>
    {title}
  </h2>
);

const SectionHeader: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', marginBottom: '20px', borderBottom: `3px solid ${color}`, paddingBottom: '4px', display: 'inline-block' }}>
    {title}
  </h2>
);

export default BoldSidebarTemplate;
