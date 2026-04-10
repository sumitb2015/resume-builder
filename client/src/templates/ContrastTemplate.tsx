import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2, Briefcase, GraduationCap, Laptop, Award } from 'lucide-react';

const ContrastTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#334155',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* FULL WIDTH DARK HEADER */}
      <header style={{ 
        backgroundColor: '#0F172A', 
        color: 'white', 
        padding: '50px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontFamily: config.fonts.heading,
            fontSize: '3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em',
            color: 'white'
          }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '1.25rem', color: accent, fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {personal.title}
            </p>
          )}
        </div>
        
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#94A3B8' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.email} <Mail size={14} /></div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.phone} <Phone size={14} /></div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.location} <MapPin size={14} /></div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.linkedin} <Link2 size={14} /></div>}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '0', flex: 1 }}>
        {/* MAIN CONTENT */}
        <main style={{ padding: '40px 60px', borderRight: '1px solid #F1F5F9' }}>
          {/* SUMMARY */}
          {personal.summary && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Professional Profile" />
              <RichContent html={personal.summary} style={{ fontSize: '1rem', lineHeight: 1.7, color: '#475569' }} />
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SectionHeader title="Experience" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{exp.role}</h3>
                      <span style={{ fontSize: '0.85rem', color: primary, fontWeight: 700 }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600, marginBottom: '12px' }}>{exp.company}</div>
                    {exp.bullets.length > 0 && (
                      <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i} style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
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
            <section>
              <SectionHeader title="Key Projects" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {projects.map(p => (
                  <div key={p.id}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{p.title}</h3>
                    {p.description && <div style={{ marginTop: '6px' }}><RichContent html={p.description} style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }} /></div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* SIDEBAR */}
        <aside style={{ backgroundColor: '#F8FAFC', padding: '40px 30px' }}>
          {/* SKILLS */}
          {skills.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SidebarHeader title="Expertise" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {skills.map(skill => (
                  <div key={skill.id}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>{skill.name}</div>
                    <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${skill.level}%`, backgroundColor: primary }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SidebarHeader title="Education" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.8rem', color: primary, fontWeight: 600, marginTop: '2px' }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <SidebarHeader title="Languages" />
              {languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{l.language}</span>
                  <span style={{ color: '#64748B' }}>{l.proficiency}</span>
                </div>
              ))}
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <SidebarHeader title="Certifications" />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: '#1E293B' }}>{c.name}</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{c.issuer}</div>
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', 
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '12px'
  }}>
    {title}
    <div style={{ flex: 1, height: '2px', backgroundColor: '#F1F5F9' }} />
  </h2>
);

const SidebarHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', 
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' 
  }}>
    {title}
  </h2>
);

export default ContrastTemplate;
