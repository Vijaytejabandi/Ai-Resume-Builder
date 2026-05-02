export default function ClassicTemplate({ data, level }) {
  const c = '#0f766e'
  const ed = data.education

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: '10.5pt', fontWeight: 700, color: c,
        borderBottom: `2px solid ${c}`, paddingBottom: 3,
        marginBottom: 8,
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
        fontFamily: 'Times New Roman, Georgia, serif',
        fontSize: '10pt', lineHeight: 1.5,
        color: '#111', background: '#fff', minHeight: '842px',
      }}
    >
      {/* Dark Header */}
      <div style={{ background: '#0f4c45', color: '#fff', padding: '22px 32px' }}>
        <div style={{ fontSize: '22pt', fontWeight: 700, letterSpacing: '.04em' }}>
          {data.personal.name || 'Your Name'}
        </div>
        <div style={{ fontSize: '9pt', marginTop: 6, opacity: 0.85, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && <span>{data.personal.phone}</span>}
          {data.personal.location && <span>{data.personal.location}</span>}
          {data.personal.linkedin && <span>LinkedIn: {data.personal.linkedin}</span>}
          {data.personal.github && <span>GitHub: {data.personal.github}</span>}
        </div>
      </div>

      <div style={{ padding: '18px 32px' }}>
        {data.personal.summary && (
          <Section title="CAREER OBJECTIVE">
            <p style={{ margin: 0, color: '#333' }}>{data.personal.summary}</p>
          </Section>
        )}

        <Section title="EDUCATION">
          {ed.pg?.on && ed.pg?.college && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{ed.pg.degree}{ed.pg.field ? ` in ${ed.pg.field}` : ''}</strong>
                <span style={{ color: '#666' }}>{ed.pg.year}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{ed.pg.college}{ed.pg.univ ? ` — ${ed.pg.univ}` : ''}</div>
            </div>
          )}
          {ed.grad?.college && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{ed.grad.degree}{ed.grad.field ? ` in ${ed.grad.field}` : ''}</strong>
                <span style={{ color: '#666' }}>{ed.grad.year}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{ed.grad.college}{ed.grad.univ ? ` — ${ed.grad.univ}` : ''}</div>
              {ed.grad.cgpa && <div style={{ fontSize: '9.5pt', color: '#555' }}>CGPA / Percentage: {ed.grad.cgpa}</div>}
            </div>
          )}
          {ed.inter?.name && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Intermediate / 12th Standard</strong>
                <span style={{ color: '#666' }}>{ed.inter.year}</span>
              </div>
              <div style={{ color: '#555' }}>{ed.inter.name}{ed.inter.board ? ` — ${ed.inter.board}` : ''}{ed.inter.grade ? ` | ${ed.inter.grade}%` : ''}</div>
            </div>
          )}
          {ed.school?.name && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Secondary / 10th Standard (SSC)</strong>
                <span style={{ color: '#666' }}>{ed.school.year}</span>
              </div>
              <div style={{ color: '#555' }}>{ed.school.name}{ed.school.board ? ` — ${ed.school.board}` : ''}{ed.school.grade ? ` | ${ed.school.grade}%` : ''}</div>
            </div>
          )}
        </Section>

        {(data.skills.tech.length > 0 || data.skills.tools.length > 0 || data.skills.soft.length > 0) && (
          <Section title="TECHNICAL SKILLS">
            {data.skills.tech.length > 0 && <div style={{ marginBottom: 4 }}><strong>Programming & Frameworks:</strong> {data.skills.tech.join(', ')}</div>}
            {data.skills.tools.length > 0 && <div style={{ marginBottom: 4 }}><strong>Tools & Technologies:</strong> {data.skills.tools.join(', ')}</div>}
            {data.skills.soft.length > 0 && <div><strong>Soft Skills:</strong> {data.skills.soft.join(', ')}</div>}
          </Section>
        )}

        {level === 'experienced' && data.experience.length > 0 && (
          <Section title="WORK EXPERIENCE">
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{exp.role}</strong>
                  <span style={{ color: '#666', fontSize: '9.5pt' }}>{exp.duration}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.desc && <p style={{ margin: '4px 0 0', color: '#333' }}>{exp.desc}</p>}
              </div>
            ))}
          </Section>
        )}

        {level === 'fresher' && data.projects.length > 0 && (
          <Section title="ACADEMIC PROJECTS">
            {data.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong>{proj.name}</strong>
                {proj.tech && <span style={{ color: '#555', fontSize: '9.5pt' }}> [{proj.tech}]</span>}
                {proj.desc && <p style={{ margin: '3px 0 0', color: '#333' }}>{proj.desc}</p>}
              </div>
            ))}
          </Section>
        )}

        {data.certs.length > 0 && (
          <Section title="CERTIFICATIONS">{data.certs.map((c, i) => <div key={i}>• {c}</div>)}</Section>
        )}

        {data.achievements.length > 0 && (
          <Section title="ACHIEVEMENTS & AWARDS">{data.achievements.map((a, i) => <div key={i}>• {a}</div>)}</Section>
        )}

        {(data.languages.length > 0 || data.hobbies.length > 0) && (
          <Section title="PERSONAL INFORMATION">
            {data.languages.length > 0 && <div><strong>Languages Known:</strong> {data.languages.join(', ')}</div>}
            {data.hobbies.length > 0 && <div><strong>Hobbies & Interests:</strong> {data.hobbies.join(', ')}</div>}
          </Section>
        )}
      </div>
    </div>
  )
}
