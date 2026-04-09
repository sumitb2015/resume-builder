import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2, Globe, Calendar, Award } from 'lucide-react';

const ProfessionalTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;
  const accent = config.colors.accent;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#1A1A1B',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* HEADER SECTION */}
      <header style={{ 
        padding: '40px 50px', 
        backgroundColor: '#F3F4F6', 
        borderBottom: `4px solid ${primary}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontFamily: config.fonts.heading,
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            textTransform: 'uppercase'
          }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              color: primary, 
              marginTop: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {personal.title}
            </p>
          )}
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px 24px',
          fontSize: '0.8rem',
          color: '#4B5563'
        }}>
          {personal.email && <ContactItem icon={<Mail size={12} />} text={personal.email} />}
          {personal.phone && <ContactItem icon={<Phone size={12} />} text={personal.phone} />}
          {personal.location && <ContactItem icon={<MapPin size={12} />} text={personal.location} />}
          {personal.linkedin && <ContactItem icon={<Link2 size={12} />} text={personal.linkedin} />}
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* SIDEBAR (35%) */}
        <aside style={{ 
          width: '32%', 
          backgroundColor: '#F9FAFB', 
          padding: '30px 40px',
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          {/* SKILLS */}
          {skills.length > 0 && (
            <section>
              <SidebarTitle title="Skills" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {skills.map(skill => (
                  <div key={skill.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{skill.name}</span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${skill.level}%`, backgroundColor: primary, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section>
              <SidebarTitle title="Education" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.75rem', color: primary, fontWeight: 600, marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={10} /> {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <section>
              <SidebarTitle title="Languages" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {languages.map(lang => (
                  <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{lang.language}</span>
                    <span style={{ color: '#6B7280' }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <SidebarTitle title="Certifications" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{cert.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '2px' }}>{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* MAIN CONTENT (65%) */}
        <main style={{ flex: 1, padding: '30px 50px' }}>
          {/* PROFILE SUMMARY */}
          {personal.summary && (
            <section style={{ marginBottom: '32px' }}>
              <MainTitle title="Professional Summary" />
              <RichContent html={personal.summary} style={{ 
                fontSize: '0.9rem', 
                lineHeight: 1.6, 
                color: '#374151' 
              }} />
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <MainTitle title="Employment History" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>{exp.role}</h3>
                        <div style={{ fontSize: '0.9rem', color: primary, fontWeight: 600, marginTop: '2px' }}>{exp.company}</div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: '4px', fontWeight: 500 }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul style={{ paddingLeft: '18px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i} style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
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
              <MainTitle title="Key Projects" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {projects.map(project => (
                  <div key={project.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>{project.title}</h3>
                      {project.url && <span style={{ fontSize: '0.75rem', color: primary }}>{project.url}</span>}
                    </div>
                    {project.description && (
                      <div style={{ marginTop: '6px' }}>
                        <RichContent html={project.description} style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }} />
                      </div>
                    )}
                    {project.tech.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {project.tech.map((t, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#F3F4F6', color: '#4B5563', padding: '2px 8px', borderRadius: '100px' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '0.75rem', 
    fontWeight: 800, 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em', 
    color: '#9CA3AF', 
    marginBottom: '16px',
    borderBottom: '2px solid #E5E7EB',
    paddingBottom: '4px'
  }}>
    {title}
  </h2>
);

const MainTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '1.1rem', 
    fontWeight: 700, 
    color: '#111827', 
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }}>
    {title}
    <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
  </h2>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ color: '#9CA3AF' }}>{icon}</span>
    <span>{text}</span>
  </div>
);

export default ProfessionalTemplate;
