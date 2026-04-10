import React from 'react';
import type { Resume } from '../shared/types';
import RichContent from './RichContent';

const AtsTemplate: React.FC<{ resume: Resume }> = ({ resume }) => {
  const { personal, experience, education, skills, certifications, languages, projects } = resume;

  // ATS templates strictly use standard fonts and no complex layouts
  const fontStack = '"Arial", "Helvetica", sans-serif';

  return (
    <div className="resume-paper" style={{
      fontFamily: fontStack,
      backgroundColor: '#FFFFFF',
      color: '#000000',
      padding: '40px 60px',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.4,
    }}>
      {/* HEADER: Simple & Direct */}
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
          {personal.name || 'YOUR NAME'}
        </h1>
        <div style={{ fontSize: '10pt', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.email && <span>| {personal.email}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
          {personal.website && <span>| {personal.website}</span>}
        </div>
      </header>

      {/* SUMMARY */}
      {personal.summary && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Professional Summary
          </h2>
          <RichContent html={personal.summary} style={{ fontSize: '10pt' }} />
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Technical Skills
          </h2>
          <div style={{ fontSize: '10pt' }}>
            <strong>Relevant Skills:</strong> {skills.map(s => s.name).join(', ')}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Professional Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt' }}>
                  <span>{exp.company}</span>
                  <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '4px' }}>{exp.role}</div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                    {exp.bullets.filter(b => b).map((bullet, i) => (
                      <li key={i} style={{ fontSize: '10pt', marginBottom: '2px' }}>
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
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map(p => (
              <div key={p.id}>
                <div style={{ fontWeight: 'bold', fontSize: '10pt' }}>{p.title} {p.url && <span style={{ fontWeight: 'normal' }}>| {p.url}</span>}</div>
                {p.description && <RichContent html={p.description} style={{ fontSize: '10pt', marginTop: '2px' }} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {education.map(edu => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10pt' }}>
                  <span>{edu.school}</span>
                  <span>{edu.endDate}</span>
                </div>
                <div style={{ fontSize: '10pt' }}>
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''} {edu.gpa && `| GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Certifications
          </h2>
          <div style={{ fontSize: '10pt' }}>
            {certifications.map(c => `${c.name} (${c.issuer})`).join(' | ')}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {languages.length > 0 && (
        <section>
          <h2 style={{ fontSize: '11pt', fontWeight: 'bold', borderBottom: '1pt solid #000', marginBottom: '6px', textTransform: 'uppercase' }}>
            Languages
          </h2>
          <div style={{ fontSize: '10pt' }}>
            {languages.map(l => `${l.language} (${l.proficiency})`).join(' | ')}
          </div>
        </section>
      )}
    </div>
  );
};

export default AtsTemplate;
