import React from 'react';
import type { Resume, TemplateConfig } from '../shared/types';
import RichContent from './RichContent';
import { Mail, Phone, MapPin, Link2, Briefcase, GraduationCap, Award, Sparkles } from 'lucide-react';

const TimelineTemplate: React.FC<{ resume: Resume; config: TemplateConfig }> = ({ resume, config }) => {
  const { personal, experience, education, skills, certifications, languages, projects, custom } = resume;
  const primary = config.colors.primary;

  return (
    <div className="resume-paper" style={{
      fontFamily: config.fonts.body,
      backgroundColor: '#FFFFFF',
      color: '#334155',
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* HEADER */}
      <header style={{ marginBottom: '40px', borderLeft: `8px solid ${primary}`, paddingLeft: '24px' }}>
        <h1 style={{
          fontFamily: config.fonts.heading,
          fontSize: '3rem',
          fontWeight: 800,
          color: '#0F172A',
          margin: 0,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        {personal.title && (
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: 600, 
            color: primary, 
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {personal.title}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px', 
          marginTop: '16px',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Link2 size={14} /> {personal.linkedin}</div>}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '50px' }}>
        {/* MAIN COLUMN: TIMELINE */}
        <div style={{ position: 'relative' }}>
          {/* Vertical Timeline Line */}
          <div style={{ 
            position: 'absolute', left: '11px', top: '10px', bottom: '20px', 
            width: '2px', backgroundColor: `${primary}20` 
          }} />

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <TimelineHeader title="Professional Path" icon={<Briefcase size={16} />} color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {experience.map(exp => (
                  <div key={exp.id} style={{ position: 'relative', paddingLeft: '45px' }}>
                    <div style={{ 
                      position: 'absolute', left: '6px', top: '6px', 
                      width: '12px', height: '12px', borderRadius: '50%', 
                      backgroundColor: primary, border: '3px solid white', zIndex: 1
                    }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: primary, marginBottom: '4px' }}>
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{exp.role}</h3>
                    <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{exp.company}</div>
                    {exp.bullets.length > 0 && (
                      <ul style={{ paddingLeft: '18px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i} style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6 }}>
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

          {/* EDUCATION */}
          {education.length > 0 && (
            <section>
              <TimelineHeader title="Academic Foundation" icon={<GraduationCap size={16} />} color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {education.map(edu => (
                  <div key={edu.id} style={{ position: 'relative', paddingLeft: '45px' }}>
                    <div style={{ 
                      position: 'absolute', left: '6px', top: '6px', 
                      width: '12px', height: '12px', borderRadius: '50%', 
                      backgroundColor: primary, border: '3px solid white', zIndex: 1
                    }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: primary, marginBottom: '4px' }}>{edu.endDate}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A' }}>{edu.school}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '2px' }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM SECTIONS */}
          {custom && custom.length > 0 && custom.map(sec => (
            <section key={sec.id} style={{ marginBottom: '40px' }}>
              <TimelineHeader title={sec.sectionTitle || 'Additional Info'} icon={<Sparkles size={16} />} color={primary} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sec.entries.filter(e => e).map((entry, i) => (
                  <div key={i} style={{ position: 'relative', paddingLeft: '45px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div style={{ 
                      position: 'absolute', left: '6px', top: '6px', 
                      width: '12px', height: '12px', borderRadius: '50%', 
                      backgroundColor: primary, border: '3px solid white', zIndex: 1
                    }} />
                    <RichContent 
                      html={entry} 
                      isModified={config.modifiedFields?.includes(`custom.${sec.id}.entries.${i}`)}
                      style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }} 
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* PROFILE */}
          {personal.summary && (
            <section>
              <SidebarTitle title="Summary" />
              <RichContent html={personal.summary} style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }} />
            </section>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <section>
              <SidebarTitle title="Expertise" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map(skill => (
                  <span key={skill.id} style={{ 
                    fontSize: '0.8rem', backgroundColor: '#F1F5F9', color: '#1E293B', 
                    padding: '4px 10px', borderRadius: '6px', fontWeight: 600,
                    border: '1px solid #E2E8F0'
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section>
              <SidebarTitle title="Key Projects" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.map(p => (
                  <div key={p.id}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{p.title}</div>
                    {p.description && <RichContent html={p.description} style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }} />}
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
                {languages.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>{l.language}</span>
                    <span style={{ color: '#64748B' }}>{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <section>
              <SidebarTitle title="Awards & Certs" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {certifications.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '10px' }}>
                    <Award size={14} style={{ color: primary, flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.name}</div>
                      <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{c.issuer}</div>
                    </div>
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

const TimelineHeader: React.FC<{ title: string; icon: React.ReactNode; color: string }> = ({ title, icon, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
    <div style={{ 
      width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' 
    }}>
      {icon}
    </div>
    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
      {title}
    </h2>
  </div>
);

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 style={{ 
    fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', 
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px',
    borderBottom: '1px solid #F1F5F9', paddingBottom: '4px'
  }}>
    {title}
  </h2>
);

export default TimelineTemplate;
