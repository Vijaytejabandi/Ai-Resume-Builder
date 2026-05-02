export default function ModernTemplate({ data, level }) {
  const c = '#1d4ed8'
  const ed = data.education

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: '10.5pt', fontWeight: 700, color: c,
        borderBottom: `2.5px solid ${c}`, paddingBottom: 3,
        marginBottom: 8, letterSpacing: '.03em',
      }}>
        {title}
      </div>
      {children}
    </div>
  )

  return (
    <div
      id="resume-paper"
      style={{
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: '10pt', lineHeight: 1.5,
        color: '#111', background: '#fff',
        padding: '28px 32px', minHeight: '842px',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: `3px solid ${c}`, paddingBottom: 14, marginBottom: 16 }}>
        <div style={{ fontSize: '22pt', fontWeight: 700, color: c, letterSpacing: '.02em' }}>
          {data.personal.name || 'Your Name'}
        </div>
        <div style={{ fontSize: '9pt', color: '#555', marginTop: 6, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px' }}>
          {data.personal.email && <span>✉ {data.personal.email}</span>}
          {data.personal.phone && <span>✆ {data.personal.phone}</span>}
          {data.personal.location && <span>⌖ {data.personal.location}</span>}
          {data.personal.linkedin && <span>in {data.personal.linkedin}</span>}
          {data.personal.github && <span>⌥ {data.personal.github}</span>}
          {data.personal.website && <span>🌐 {data.personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <Section title="PROFESSIONAL SUMMARY">
          <p style={{ margin: 0, color: '#333', textAlign: 'justify' }}>{data.personal.summary}</p>
        </Section>
      )}

      {/* Education */}
      <Section title="EDUCATION">
        {ed.pg?.on && ed.pg?.college && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{ed.pg.degree}{ed.pg.field ? ` in ${ed.pg.field}` : ''}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
              <span>{ed.pg.college}{ed.pg.univ ? ` | ${ed.pg.univ}` : ''}</span>
              <span style={{ color: '#666' }}>{ed.pg.year}</span>
            </div>
            {ed.pg.cgpa && <div style={{ color: '#555', fontSize: '9.5pt' }}>CGPA: {ed.pg.cgpa}</div>}
          </div>
        )}
        {ed.grad?.college && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>{ed.grad.degree}{ed.grad.field ? ` in ${ed.grad.field}` : ''}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
              <span>{ed.grad.college}{ed.grad.univ ? ` | ${ed.grad.univ}` : ''}</span>
              <span style={{ color: '#666' }}>{ed.grad.year}</span>
            </div>
            {ed.grad.cgpa && <div style={{ color: '#555', fontSize: '9.5pt' }}>CGPA: {ed.grad.cgpa}</div>}
          </div>
        )}
        {ed.inter?.name && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>Intermediate (XII)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
              <span>{ed.inter.name}{ed.inter.board ? ` | ${ed.inter.board}` : ''}</span>
              <span style={{ color: '#666' }}>{ed.inter.year}</span>
            </div>
            {ed.inter.grade && <div style={{ color: '#555', fontSize: '9.5pt' }}>Marks: {ed.inter.grade}</div>}
          </div>
        )}
        {ed.school?.name && (
          <div>
            <div style={{ fontWeight: 700 }}>Secondary (X)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444' }}>
              <span>{ed.school.name}{ed.school.board ? ` | ${ed.school.board}` : ''}</span>
              <span style={{ color: '#666' }}>{ed.school.year}</span>
            </div>
            {ed.school.grade && <div style={{ color: '#555', fontSize: '9.5pt' }}>Marks: {ed.school.grade}</div>}
          </div>
        )}
      </Section>

      {/* Skills */}
      {(data.skills.tech.length > 0 || data.skills.tools.length > 0 || data.skills.soft.length > 0) && (
        <Section title="SKILLS">
          {data.skills.tech.length > 0 && <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>Technical: </span>{data.skills.tech.join(' • ')}</div>}
          {data.skills.tools.length > 0 && <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 700 }}>Tools: </span>{data.skills.tools.join(' • ')}</div>}
          {data.skills.soft.length > 0 && <div><span style={{ fontWeight: 700 }}>Soft Skills: </span>{data.skills.soft.join(' • ')}</div>}
        </Section>
      )}

      {/* Experience */}
      {level === 'experienced' && data.experience.length > 0 && (
        <Section title="WORK EXPERIENCE">
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>{exp.role}</span>
                <span style={{ color: '#666', fontSize: '9.5pt' }}>{exp.duration}</span>
              </div>
              <div style={{ color: '#444', fontSize: '9.5pt' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {exp.desc && <div style={{ marginTop: 3, color: '#333' }}>{exp.desc}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {level === 'fresher' && data.projects.length > 0 && (
        <Section title="PROJECTS">
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>
                {proj.name}
                {proj.tech && <span style={{ fontWeight: 400, color: '#555', fontSize: '9.5pt' }}> | {proj.tech}</span>}
              </div>
              {proj.link && <div style={{ color: c, fontSize: '9pt' }}>{proj.link}</div>}
              {proj.desc && <div style={{ color: '#333', marginTop: 2 }}>{proj.desc}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {data.certs.length > 0 && (
        <Section title="CERTIFICATIONS">
          {data.certs.map((cert, i) => <div key={i}>• {cert}</div>)}
        </Section>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <Section title="ACHIEVEMENTS">
          {data.achievements.map((ach, i) => <div key={i}>• {ach}</div>)}
        </Section>
      )}

      {/* Additional */}
      {(data.languages.length > 0 || data.hobbies.length > 0) && (
        <Section title="ADDITIONAL INFORMATION">
          {data.languages.length > 0 && <div><span style={{ fontWeight: 700 }}>Languages: </span>{data.languages.join(', ')}</div>}
          {data.hobbies.length > 0 && <div><span style={{ fontWeight: 700 }}>Interests: </span>{data.hobbies.join(', ')}</div>}
        </Section>
      )}
    </div>
  )
}
