import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2, Globe, Briefcase, GraduationCap, Award, Zap, Code, Star } from 'lucide-react';

const GridTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#F8FAFC',
      color: '#334155',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* TOP ROW: HEADER & CONTACT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ 
          padding: '30px', backgroundColor: primary, color: 'white', borderRadius: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <h1 style={{
            fontFamily: config.fonts.heading,
            fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em'
          }}>
            {personal.name || 'YOUR NAME'}
          </h1>
          {personal.title && (
            <p style={{ fontSize: '1.1rem', opacity: 0.9, fontWeight: 500, marginTop: '4px' }}>
              {personal.title}
            </p>
          )}
        </div>
        
        <div style={{ 
          padding: '24px', backgroundColor: 'white', borderRadius: '24px', 
          border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px',
          justifyContent: 'center'
        }}>
          {personal.email && <GridContact icon={<Mail size={14} />} text={personal.email} />}
          {personal.phone && <GridContact icon={<Phone size={14} />} text={personal.phone} />}
          {personal.location && <GridContact icon={<MapPin size={14} />} text={personal.location} />}
          {personal.linkedin && <GridContact icon={<Link2 size={14} />} text={personal.linkedin} />}
        </div>
      </div>

      {/* MIDDLE ROW: SUMMARY & SKILLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {personal.summary && (
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Professional Summary</h2>
            <RichContent html={personal.summary} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }} />
          </div>
        )}
        
        {skills.length > 0 && (
          <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Core Expertise</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map(skill => (
                <span key={skill.id} style={{ 
                  fontSize: '0.8rem', backgroundColor: '#F1F5F9', color: primary, 
                  padding: '6px 12px', borderRadius: '12px', fontWeight: 600,
                  border: '1px solid #E2E8F0'
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: EXPERIENCE & PROJECTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', flex: 1 }}>
        {/* EXPERIENCE */}
        <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={20} color={primary} /> Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: primary, fontWeight: 600, marginTop: '2px' }}>{exp.company}</div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '18px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                        <RichContent html={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR: EDUCATION, CERTS, LANGUAGES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* PROJECTS */}
          {projects.length > 0 && (
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={18} color={primary} /> Projects
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map(p => (
                  <div key={p.id}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{p.title}</div>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} color={primary} /> Education
              </h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.8rem', color: primary, fontWeight: 600 }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {/* LANGUAGES & AWARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {languages.length > 0 && (
              <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Languages</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {languages.map(l => (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>{l.language}</span>
                      <span style={{ color: '#64748B' }}>{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridContact: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#475569' }}>
    <span style={{ color: '#94A3B8' }}>{icon}</span>
    <span style={{ fontWeight: 500 }}>{text}</span>
  </div>
);

export default GridTemplate;
