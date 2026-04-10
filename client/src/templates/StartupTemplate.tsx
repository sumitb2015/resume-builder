import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { 
  Mail, Phone, MapPin, Link2, Calendar, 
  Briefcase, GraduationCap, Laptop, Award, Languages, Sparkles 
} from 'lucide-react';

const StartupTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#1F2937',
      padding: '40px 50px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
    }}>
      {/* HEADER: Modern & Centered */}
      <header style={{ textAlign: 'center', borderBottom: `2px solid ${primary}20`, paddingBottom: '30px' }}>
        <h1 style={{
          fontFamily: config.fonts.heading,
          fontSize: '2.75rem',
          fontWeight: 900,
          color: '#111827',
          margin: 0,
          letterSpacing: '-0.04em',
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ 
            fontSize: '1.25rem', 
            fontWeight: 500, 
            color: primary, 
            marginTop: '8px',
            letterSpacing: '0.02em'
          }}>
            {personal.title}
          </p>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '20px',
          fontSize: '0.85rem',
          color: '#6B7280'
        }}>
          {personal.email && <ContactItem icon={<Mail size={14} />} text={personal.email} />}
          {personal.phone && <ContactItem icon={<Phone size={14} />} text={personal.phone} />}
          {personal.location && <ContactItem icon={<MapPin size={14} />} text={personal.location} />}
          {personal.linkedin && <ContactItem icon={<Link2 size={14} />} text={personal.linkedin} />}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* PROFILE */}
          {personal.summary && (
            <section>
              <SectionTitle icon={<Sparkles size={18} />} title="Profile" color={primary} />
              <RichContent html={personal.summary} style={{ 
                fontSize: '0.95rem', 
                lineHeight: 1.6, 
                color: '#4B5563' 
              }} />
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section>
              <SectionTitle icon={<Briefcase size={18} />} title="Experience" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experience.map(exp => (
                  <div key={exp.id} style={{ position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${primary}15` }}>
                    <div style={{ 
                      position: 'absolute', left: '-6px', top: '6px', 
                      width: '10px', height: '10px', borderRadius: '50%', 
                      backgroundColor: primary 
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{exp.role}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500 }}>
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: primary, fontWeight: 600, marginTop: '2px' }}>{exp.company}</div>
                    {exp.bullets.length > 0 && (
                      <ul style={{ paddingLeft: '18px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i} style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5 }}>
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
              <SectionTitle icon={<Laptop size={18} />} title="Projects" color={primary} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {projects.map(project => (
                  <div key={project.id} style={{ 
                    padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px',
                    border: '1px solid #F3F4F6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{project.title}</h3>
                      {project.url && <span style={{ fontSize: '0.75rem', color: primary, fontWeight: 600 }}>{project.url}</span>}
                    </div>
                    {project.description && (
                      <div style={{ marginTop: '8px' }}>
                        <RichContent html={project.description} style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.5 }} />
                      </div>
                    )}
                    {project.tech.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                        {project.tech.map((t, i) => (
                          <span key={i} style={{ 
                            fontSize: '0.75rem', backgroundColor: '#FFFFFF', 
                            color: '#4B5563', padding: '2px 10px', borderRadius: '6px',
                            border: '1px solid #E5E7EB', fontWeight: 500
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SKILLS - Modern Tag Cloud */}
          {skills.length > 0 && (
            <section>
              <SectionTitle icon={<Laptop size={18} />} title="Skills" color={primary} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map(skill => (
                  <div key={skill.id} style={{ 
                    padding: '6px 12px', backgroundColor: `${primary}10`, 
                    color: primary, borderRadius: '8px', fontSize: '0.85rem',
                    fontWeight: 600, border: `1px solid ${primary}20`
                  }}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section>
              <SectionTitle icon={<GraduationCap size={18} />} title="Education" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.85rem', color: primary, fontWeight: 600, marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <SectionTitle icon={<Award size={18} />} title="Awards" color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{cert.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>{cert.issuer}</div>
                    {cert.date && <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>{cert.date}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <section>
              <SectionTitle icon={<Languages size={18} />} title="Languages" color={primary} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                {languages.map(lang => (
                  <div key={lang.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    fontSize: '0.9rem', alignItems: 'center' 
                  }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>{lang.language}</span>
                    <span style={{ 
                      fontSize: '0.75rem', backgroundColor: '#F3F4F6', 
                      color: '#6B7280', padding: '2px 8px', borderRadius: '4px' 
                    }}>{lang.proficiency}</span>
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

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    marginBottom: '16px',
    color: '#111827'
  }}>
    <span style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '32px', height: '32px', borderRadius: '8px',
      backgroundColor: `${color}10`, color: color
    }}>
      {icon}
    </span>
    <h2 style={{ 
      fontSize: '1.25rem', 
      fontWeight: 800, 
      margin: 0,
      letterSpacing: '-0.02em'
    }}>
      {title}
    </h2>
  </div>
);

const ContactItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ color: '#9CA3AF' }}>{icon}</span>
    <span style={{ fontWeight: 500 }}>{text}</span>
  </div>
);

export default StartupTemplate;
