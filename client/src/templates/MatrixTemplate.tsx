import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2, Briefcase, GraduationCap, Laptop, Award, CheckCircle2 } from 'lucide-react';

const MatrixTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#334155',
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
    }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{
            fontFamily: config.fonts.heading,
            fontSize: '3.5rem', fontWeight: 900, margin: 0, letterSpacing: '-0.04em',
            color: '#0F172A', lineHeight: 1
          }}>
            {personal.name?.split(' ')[0]}<br/>
            <span style={{ color: primary }}>{personal.name?.split(' ').slice(1).join(' ')}</span>
          </h1>
          {personal.title && (
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#64748B', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {personal.title}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#475569', textAlign: 'right' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.email} <Mail size={14} color={primary} /></div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.phone} <Phone size={14} color={primary} /></div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.location} <MapPin size={14} color={primary} /></div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.linkedin} <Link2 size={14} color={primary} /></div>}
        </div>
      </header>

      {/* SKILLS MATRIX - THE HERO SECTION */}
      {skills.length > 0 && (
        <section style={{ backgroundColor: '#F8FAFC', padding: '30px', borderRadius: '24px', border: `1px solid #E2E8F0` }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px', textAlign: 'center' }}>
            Core Competencies & Expertise
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {skills.map(skill => (
              <div key={skill.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', 
                padding: '12px 16px', backgroundColor: 'white', borderRadius: '12px',
                border: '1px solid #F1F5F9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <CheckCircle2 size={16} color={primary} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' }}>{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
        {/* EXPERIENCE */}
        <section>
          <SectionHeader title="Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.8rem', color: primary, fontWeight: 700 }}>{exp.startDate} — {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{exp.company}</div>
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
        </section>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SUMMARY */}
          {personal.summary && (
            <section>
              <SectionHeader title="About" />
              <RichContent html={personal.summary} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }} />
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section>
              <SectionHeader title="Education" />
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{edu.school}</div>
                  <div style={{ fontSize: '0.85rem', color: primary, fontWeight: 600 }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{edu.endDate}</div>
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section>
              <SectionHeader title="Projects" />
              {projects.map(p => (
                <div key={p.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{p.title}</div>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{p.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', 
    textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px',
    paddingBottom: '8px', borderBottom: '2px solid #F1F5F9'
  }}>
    {title}
  </h2>
);

export default MatrixTemplate;
