export default function CreativeTemplate({ data, level }) {
  const c = '#7c3aed'
  const ed = data.education

  const RightSection = ({ title, children }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: '10.5pt', fontWeight: 700, color: c, borderBottom: `2px solid ${c}`, paddingBottom: 3, marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  )

  return (
    <div
      id="resume-paper"
      style={{
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontSize: '10pt', lineHeight: 1.5,
        color: '#111', background: '#fff',
        minHeight: '842px', display: 'flex',
      }}
    >
      {/* Left Sidebar */}
      <div style={{ width: '220px', background: '#1e1b4b', color: '#c7d2fe', padding: '28px 16px', flexShrink: 0 }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: c,
            margin: '0 auto 10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22pt', fontWeight: 700, color: '#fff',
          }}>
            {(data.personal.name || '?')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: '12pt', fontWeight: 700, color: '#fff', wordBreak: 'break-word' }}>
            {data.personal.name || 'Your Name'}
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '8.5pt', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Contact</div>
          <div style={{ fontSize: '9pt' }}>
            {data.personal.email && <div style={{ marginBottom: 4, wordBreak: 'break-all' }}>✉ {data.personal.email}</div>}
            {data.personal.phone && <div style={{ marginBottom: 4 }}>✆ {data.personal.phone}</div>}
            {data.personal.location && <div style={{ marginBottom: 4 }}>⌖ {data.personal.location}</div>}
            {data.personal.linkedin && <div style={{ marginBottom: 4, wordBreak: 'break-all' }}>in {data.personal.linkedin}</div>}
            {data.personal.github && <div style={{ wordBreak: 'break-all' }}>⌥ {data.personal.github}</div>}
          </div>
        </div>

        {/* Technical Skills in sidebar */}
        {(data.skills.tech.length > 0 || data.skills.tools.length > 0) && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '8.5pt', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Skills</div>
            {data.skills.tech.map((s, i) => (
              <div key={i} style={{ background: '#312e81', borderRadius: 4, padding: '3px 8px', fontSize: '9pt', marginBottom: 4 }}>{s}</div>
            ))}
            {data.skills.tools.map((s, i) => (
              <div key={i} style={{ background: '#1e1b4b', border: '1px solid #4338ca', borderRadius: 4, padding: '3px 8px', fontSize: '9pt', marginBottom: 4 }}>{s}</div>
            ))}
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '8.5pt', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Languages</div>
            {data.languages.map((l, i) => <div key={i} style={{ fontSize: '9.5pt', marginBottom: 3 }}>• {l}</div>)}
          </div>
        )}

        {/* Soft Skills */}
        {data.skills.soft.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '8.5pt', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Soft Skills</div>
            {data.skills.soft.map((s, i) => (
              <div key={i} style={{ background: '#312e81', borderRadius: 4, padding: '3px 8px', fontSize: '9pt', marginBottom: 4 }}>{s}</div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Content */}
      <div style={{ flex: 1, padding: '24px 26px' }}>
        {data.personal.summary && (
          <RightSection title="ABOUT ME">
            <p style={{ margin: 0, color: '#333' }}>{data.personal.summary}</p>
          </RightSection>
        )}

        <RightSection title="EDUCATION">
          {ed.pg?.on && ed.pg?.college && (
            <div style={{ marginBottom: 9 }}>
              <strong>{ed.pg.degree}{ed.pg.field ? ` — ${ed.pg.field}` : ''}</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#444' }}>
                <span>{ed.pg.college}</span><span>{ed.pg.year}</span>
              </div>
            </div>
          )}
          {ed.grad?.college && (
            <div style={{ marginBottom: 9 }}>
              <strong>{ed.grad.degree}{ed.grad.field ? ` — ${ed.grad.field}` : ''}</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#444' }}>
                <span>{ed.grad.college}{ed.grad.univ ? ` | ${ed.grad.univ}` : ''}</span>
                <span>{ed.grad.year}</span>
              </div>
              {ed.grad.cgpa && <div style={{ fontSize: '9pt', color: '#666' }}>CGPA: {ed.grad.cgpa}</div>}
            </div>
          )}
          {ed.inter?.name && (
            <div style={{ marginBottom: 9 }}>
              <strong>Intermediate (XII)</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#444' }}>
                <span>{ed.inter.name}{ed.inter.board ? ` | ${ed.inter.board}` : ''}</span>
                <span>{ed.inter.year}</span>
              </div>
              {ed.inter.grade && <div style={{ fontSize: '9pt', color: '#666' }}>{ed.inter.grade}%</div>}
            </div>
          )}
          {ed.school?.name && (
            <div>
              <strong>Secondary (X)</strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', color: '#444' }}>
                <span>{ed.school.name}{ed.school.board ? ` | ${ed.school.board}` : ''}</span>
                <span>{ed.school.year}</span>
              </div>
              {ed.school.grade && <div style={{ fontSize: '9pt', color: '#666' }}>{ed.school.grade}%</div>}
            </div>
          )}
        </RightSection>

        {level === 'experienced' && data.experience.length > 0 && (
          <RightSection title="WORK EXPERIENCE">
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `3px solid ${c}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{exp.role}</strong>
                  <span style={{ fontSize: '9pt', color: '#666', background: '#f5f3ff', padding: '1px 8px', borderRadius: 10 }}>{exp.duration}</span>
                </div>
                <div style={{ color: '#555', fontSize: '9.5pt' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.desc && <p style={{ margin: '4px 0 0', color: '#333' }}>{exp.desc}</p>}
              </div>
            ))}
          </RightSection>
        )}

        {level === 'fresher' && data.projects.length > 0 && (
          <RightSection title="PROJECTS">
            {data.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: `3px solid ${c}` }}>
                <strong>{proj.name}</strong>
                {proj.tech && <span style={{ fontSize: '9pt', color: c, fontStyle: 'italic' }}> | {proj.tech}</span>}
                {proj.desc && <p style={{ margin: '3px 0 0', color: '#333' }}>{proj.desc}</p>}
                {proj.link && <div style={{ fontSize: '8.5pt', color: c }}>{proj.link}</div>}
              </div>
            ))}
          </RightSection>
        )}

        {data.certs.length > 0 && (
          <RightSection title="CERTIFICATIONS">
            {data.certs.map((cert, i) => <div key={i}>★ {cert}</div>)}
          </RightSection>
        )}

        {data.achievements.length > 0 && (
          <RightSection title="ACHIEVEMENTS">
            {data.achievements.map((ach, i) => <div key={i}>◆ {ach}</div>)}
          </RightSection>
        )}

        {data.hobbies.length > 0 && (
          <RightSection title="INTERESTS">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {data.hobbies.map((h, i) => (
                <span key={i} style={{ background: '#f5f3ff', color: '#5b21b6', padding: '2px 10px', borderRadius: 12, fontSize: '9.5pt' }}>{h}</span>
              ))}
            </div>
          </RightSection>
        )}
      </div>
    </div>
  )
}
