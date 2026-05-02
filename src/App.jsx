 // ============================================================
//  AI Resume Builder — Main App
//  API Key is loaded from .env  →  VITE_GROQ_API_KEY
// ============================================================
import { useState, useRef } from 'react'
import TagInput  from './components/shared/TagInput'
import ListInput from "./components/shared/ListInput";
import ModernTemplate  from './components/templates/ModernTemplate'
import ClassicTemplate from './components/templates/ClassicTemplate'
import CreativeTemplate from './components/templates/CreativeTemplate'

// ─── Constants ───────────────────────────────────────────────
const TEMPLATES = [
  { id: 'modern',   name: 'Modern Blue',   accent: '#1d4ed8', desc: 'Clean & ATS-Optimised' },
  { id: 'classic',  name: 'Classic Navy',  accent: '#0f766e', desc: 'Timeless Professional' },
  { id: 'creative', name: 'Bold Violet',   accent: '#7c3aed', desc: 'Stand-Out Design' },
]

const INIT_DATA = {
  personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '' },
  education: {
    school: { name: '', board: '', year: '', grade: '' },
    inter:  { name: '', board: '', year: '', grade: '' },
    grad:   { degree: 'Bachelor of Technology (B.Tech)', field: '', college: '', univ: '', year: '', cgpa: '' },
    pg:     { degree: '', field: '', college: '', univ: '', year: '', cgpa: '', on: false },
  },
  skills:       { tech: [], soft: [], tools: [] },
  experience:   [],
  projects:     [],
  certs:        [],
  achievements: [],
  hobbies:      [],
  languages:    [],
}

// ─── Deep setter utility ──────────────────────────────────────
function deepSet(obj, path, value) {
  const keys = path.split('.')
  const clone = { ...obj }
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

// ─── Sub-components ───────────────────────────────────────────
function ScoreBar({ label, value }) {
  const color = value >= 70 ? '#22c55e' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: '#94a3b8' }}>{label}</span>
        <span style={{ color: '#fff', fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="ats-bar">
        <div className="ats-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

function ExpCard({ exp, onChange, onRemove }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Work Experience</span>
        <button className="btn-danger" onClick={onRemove}>Remove</button>
      </div>
      <div className="grid-2">
        <div className="field-group"><label className="field-label">Job Title / Role</label><input value={exp.role} onChange={e => onChange('role', e.target.value)} placeholder="Software Engineer" /></div>
        <div className="field-group"><label className="field-label">Company Name</label><input value={exp.company} onChange={e => onChange('company', e.target.value)} placeholder="ABC Technologies" /></div>
        <div className="field-group"><label className="field-label">Duration</label><input value={exp.duration} onChange={e => onChange('duration', e.target.value)} placeholder="Jan 2022 – Dec 2023" /></div>
        <div className="field-group"><label className="field-label">Location</label><input value={exp.location} onChange={e => onChange('location', e.target.value)} placeholder="Hyderabad, India" /></div>
      </div>
      <div className="field-group">
        <label className="field-label">Responsibilities & Achievements</label>
        <textarea value={exp.desc} onChange={e => onChange('desc', e.target.value)} rows={3} placeholder="Describe responsibilities, technologies used, and key achievements..." />
      </div>
    </div>
  )
}

function ProjCard({ proj, onChange, onRemove }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>Project</span>
        <button className="btn-danger" onClick={onRemove}>Remove</button>
      </div>
      <div className="grid-2">
        <div className="field-group"><label className="field-label">Project Name</label><input value={proj.name} onChange={e => onChange('name', e.target.value)} placeholder="E-Commerce Platform" /></div>
        <div className="field-group"><label className="field-label">Technologies Used</label><input value={proj.tech} onChange={e => onChange('tech', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
      </div>
      <div className="field-group"><label className="field-label">GitHub / Live Link</label><input value={proj.link} onChange={e => onChange('link', e.target.value)} placeholder="https://github.com/yourname/project" /></div>
      <div className="field-group">
        <label className="field-label">Description</label>
        <textarea value={proj.desc} onChange={e => onChange('desc', e.target.value)} rows={3} placeholder="What it does, your role, key features, impact..." />
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [step,      setStep]      = useState(0)
  const [template,  setTemplate]  = useState('modern')
  const [level,     setLevel]     = useState('fresher')
  const [data,      setData]      = useState(INIT_DATA)
  const [jobDesc,   setJobDesc]   = useState('')
  const [ats,       setAts]       = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [atsErr,    setAtsErr]    = useState('')

  const resumeRef = useRef(null)

  // Generic deep field updater
  const upField = (path, value) => setData(d => deepSet(d, path, value))

  // Tag helpers
  const addTag = (path, val) => {
    const keys = path.split('.')
    setData(d => {
      const clone = { ...d }
      let cur = clone
      for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = { ...cur[keys[i]] }; cur = cur[keys[i]] }
      const arr = cur[keys[keys.length - 1]]
      if (!arr.includes(val)) cur[keys[keys.length - 1]] = [...arr, val]
      return clone
    })
  }
  const removeTag = (path, idx) => {
    const keys = path.split('.')
    setData(d => {
      const clone = { ...d }
      let cur = clone
      for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = { ...cur[keys[i]] }; cur = cur[keys[i]] }
      cur[keys[keys.length - 1]] = cur[keys[keys.length - 1]].filter((_, j) => j !== idx)
      return clone
    })
  }

  // Experience helpers
  const addExp    = () => setData(d => ({ ...d, experience: [...d.experience, { role: '', company: '', duration: '', location: '', desc: '' }] }))
  const removeExp = i  => setData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))
  const upExp     = (i, k, v) => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], [k]: v }; return { ...d, experience: e } })

  // Project helpers
  const addProj    = () => setData(d => ({ ...d, projects: [...d.projects, { name: '', tech: '', link: '', desc: '' }] }))
  const removeProj = i  => setData(d => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }))
  const upProj     = (i, k, v) => setData(d => { const p = [...d.projects]; p[i] = { ...p[i], [k]: v }; return { ...d, projects: p } })

  // List helpers (certs / achievements)
  const addList    = (key, val) => { if (val.trim()) addTag(key, val) }
  const removeList = (key, idx) => removeTag(key, idx)

  // Build plain-text resume for ATS analysis
  const buildResumeText = () => {
    const d = data; const ed = d.education; let t = ''
    t += `Name: ${d.personal.name}\nEmail: ${d.personal.email}\nPhone: ${d.personal.phone}\nLocation: ${d.personal.location}\n`
    if (d.personal.linkedin) t += `LinkedIn: ${d.personal.linkedin}\n`
    if (d.personal.github)   t += `GitHub: ${d.personal.github}\n`
    if (d.personal.summary)  t += `\nSUMMARY:\n${d.personal.summary}\n`
    t += `\nEDUCATION:\n`
    if (ed.pg.on && ed.pg.college) t += `- ${ed.pg.degree} in ${ed.pg.field} | ${ed.pg.college} | ${ed.pg.year} | CGPA: ${ed.pg.cgpa}\n`
    if (ed.grad.college)           t += `- ${ed.grad.degree} in ${ed.grad.field} | ${ed.grad.college} | ${ed.grad.year} | CGPA/Marks: ${ed.grad.cgpa}\n`
    if (ed.inter.name)             t += `- Intermediate | ${ed.inter.name} | ${ed.inter.board} | ${ed.inter.year} | ${ed.inter.grade}%\n`
    if (ed.school.name)            t += `- Secondary | ${ed.school.name} | ${ed.school.board} | ${ed.school.year} | ${ed.school.grade}%\n`
    if (d.skills.tech.length)   t += `\nTechnical Skills: ${d.skills.tech.join(', ')}\n`
    if (d.skills.tools.length)  t += `Tools & Technologies: ${d.skills.tools.join(', ')}\n`
    if (d.skills.soft.length)   t += `Soft Skills: ${d.skills.soft.join(', ')}\n`
    if (level === 'experienced' && d.experience.length) {
      t += `\nWORK EXPERIENCE:\n`
      d.experience.forEach(e => t += `- ${e.role} at ${e.company} (${e.duration}): ${e.desc}\n`)
    }
    if (level === 'fresher' && d.projects.length) {
      t += `\nPROJECTS:\n`
      d.projects.forEach(p => t += `- ${p.name} [${p.tech}]: ${p.desc}\n`)
    }
    if (d.certs.length)        t += `\nCertifications: ${d.certs.join(', ')}\n`
    if (d.achievements.length) t += `Achievements: ${d.achievements.join('; ')}\n`
    return t
  }

  // ─── ATS Analysis via Groq API ────────────────────────────
  const analyzeATS = async () => {
    if (!jobDesc.trim()) { setAtsErr('Please enter a job description first.'); return }

    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) {
      setAtsErr('API key not found. Add VITE_GROQ_API_KEY to your .env file.')
      return
    }

    setAnalyzing(true); setAts(null); setAtsErr('')

    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) analyzer.
Analyze the following resume against the job description.
Return ONLY valid JSON — no markdown, no extra text, no explanation.

JSON structure:
{
  "overall_score": 75,
  "keyword_score": 70,
  "format_score": 85,
  "experience_score": 72,
  "verdict": "Good Match",
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"]
}

RESUME:
${buildResumeText()}

JOB DESCRIPTION:
${jobDesc}`

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
        }),
      })

      const json = await res.json()
      console.log('FULL RESPONSE:', json)

      const raw = json.choices?.[0]?.message?.content ?? ''
      console.log('RAW RESPONSE:', raw)

      if (!raw) {
        setAtsErr('No response from API. Check your API key.')
        setAnalyzing(false)
        return
      }

      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAts(parsed)

    } catch (err) {
      setAtsErr('Analysis failed. Check your API key or network, then try again.')
      console.error(err)
    }

    setAnalyzing(false)
  }

  // ─── PDF Download ─────────────────────────────────────────
  const downloadPDF = () => {
    const el = document.getElementById('resume-paper')
    if (!el) { alert('Resume not visible. Make sure you are on the Preview step.'); return }
    import('html2pdf.js').then(({ default: html2pdf }) => {
      html2pdf()
        .set({
          margin: 0,
          filename: `${data.personal.name || 'resume'}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save()
    })
  }

  // Template accent colour
  const accent = TEMPLATES.find(t => t.id === template)?.accent ?? '#6366f1'

  const stepNames = [
    'Setup',
    'Personal Info',
    'Education',
    'Skills',
    level === 'experienced' ? 'Experience' : 'Projects',
    'Extras',
    'Preview & Export',
  ]

  const renderResume = () => {
    if (template === 'modern')  return <ModernTemplate  data={data} level={level} />
    if (template === 'classic') return <ClassicTemplate data={data} level={level} />
    return <CreativeTemplate data={data} level={level} />
  }

  // ─── Render ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>

      {/* ── Top Header ── */}
      <header style={{
        background: '#0f172a', borderBottom: '1px solid #1e293b',
        padding: '14px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: accent, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18,
          }}>📄</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>AI Resume Builder</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Powered by VIJAY TEJA</div>
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {stepNames.map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
              {i < stepNames.length - 1 && (
                <div style={{ width: 18, height: 1, background: i < step ? '#22c55e' : '#1e293b' }} />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* ── Page Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>

        {/* Step heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: accent, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 700,
          }}>
            {step + 1}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9' }}>{stepNames[step]}</h2>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
            Step {step + 1} of {stepNames.length}
          </span>
        </div>

        {/* ═══════════════════════════ STEP 0 — SETUP ═══════════════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div className="section-title">🎨 Choose Your Template</div>
              <div className="grid-3">
                {TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    style={{
                      cursor: 'pointer', borderRadius: 14,
                      border: `2px solid ${template === t.id ? t.accent : '#334155'}`,
                      background: '#1e293b', padding: 18,
                      transition: 'all .2s',
                      transform: template === t.id ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    {/* Mini preview */}
                    <div style={{
                      height: 82, borderRadius: 8, overflow: 'hidden',
                      marginBottom: 12, border: '1px solid #334155',
                      background: '#fff', display: 'flex', flexDirection: 'column',
                    }}>
                      {t.id === 'modern' && (
                        <>
                          <div style={{ height: 18, background: t.accent, display: 'flex', alignItems: 'center', paddingLeft: 7 }}>
                            <div style={{ width: 44, height: 3, background: 'rgba(255,255,255,.7)', borderRadius: 2 }} />
                          </div>
                          <div style={{ padding: '7px 9px', flex: 1 }}>
                            <div style={{ width: '80%', height: 3, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '60%', height: 2, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '70%', height: 2, background: t.accent + '50', borderRadius: 2 }} />
                          </div>
                        </>
                      )}
                      {t.id === 'classic' && (
                        <>
                          <div style={{ height: 24, background: '#0f4c45', display: 'flex', alignItems: 'center', paddingLeft: 7 }}>
                            <div style={{ width: 52, height: 3, background: 'rgba(255,255,255,.7)', borderRadius: 2 }} />
                          </div>
                          <div style={{ padding: '7px 9px', flex: 1 }}>
                            <div style={{ width: '100%', height: 2, background: t.accent + '60', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '70%', height: 2, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '90%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
                          </div>
                        </>
                      )}
                      {t.id === 'creative' && (
                        <div style={{ display: 'flex', flex: 1 }}>
                          <div style={{ width: 28, background: '#1e1b4b', flexShrink: 0 }} />
                          <div style={{ flex: 1, padding: '7px 9px' }}>
                            <div style={{ width: '80%', height: 3, background: t.accent + '80', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '60%', height: 2, background: '#e2e8f0', borderRadius: 2, marginBottom: 4 }} />
                            <div style={{ width: '90%', height: 2, background: '#e2e8f0', borderRadius: 2 }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{t.desc}</div>
                    {template === t.id && <div style={{ marginTop: 8, fontSize: 12, color: t.accent, fontWeight: 600 }}>✓ Selected</div>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-title">👤 Experience Level</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 480 }}>
                {['fresher', 'experienced'].map(lv => (
                  <div
                    key={lv}
                    onClick={() => setLevel(lv)}
                    style={{
                      cursor: 'pointer', borderRadius: 14,
                      border: `2px solid ${level === lv ? accent : '#334155'}`,
                      background: '#1e293b', padding: 22,
                      textAlign: 'center', transition: 'all .2s',
                    }}
                  >
                    <div style={{ fontSize: 30, marginBottom: 8 }}>{lv === 'fresher' ? '🎓' : '💼'}</div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15, textTransform: 'capitalize' }}>{lv}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                      {lv === 'fresher' ? '0–1 year / Student' : '1+ years of experience'}
                    </div>
                    {level === lv && <div style={{ marginTop: 8, fontSize: 12, color: accent, fontWeight: 600 }}>✓ Selected</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 1 — PERSONAL INFO ═══════════════════════ */}
        {step === 1 && (
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">👤 Basic Information</div>
              <div className="grid-2">
                <div className="field-group"><label className="field-label">Full Name *</label><input value={data.personal.name}     onChange={e => upField('personal.name',     e.target.value)} placeholder="Ravi Kumar Sharma" /></div>
                <div className="field-group"><label className="field-label">Email Address *</label><input value={data.personal.email}    onChange={e => upField('personal.email',    e.target.value)} placeholder="ravi@example.com" type="email" /></div>
                <div className="field-group"><label className="field-label">Phone Number *</label><input value={data.personal.phone}    onChange={e => upField('personal.phone',    e.target.value)} placeholder="+91 98765 43210" /></div>
                <div className="field-group"><label className="field-label">Location / City</label><input value={data.personal.location} onChange={e => upField('personal.location', e.target.value)} placeholder="Hyderabad, Andhra Pradesh" /></div>
                <div className="field-group"><label className="field-label">LinkedIn Profile</label><input value={data.personal.linkedin} onChange={e => upField('personal.linkedin', e.target.value)} placeholder="linkedin.com/in/ravikumar" /></div>
                <div className="field-group"><label className="field-label">GitHub Profile</label><input value={data.personal.github}   onChange={e => upField('personal.github',   e.target.value)} placeholder="github.com/ravikumar" /></div>
              </div>
              <div className="field-group"><label className="field-label">Portfolio / Website</label><input value={data.personal.website} onChange={e => upField('personal.website', e.target.value)} placeholder="https://ravikumar.dev" /></div>
            </div>

            <div className="card">
              <div className="section-title">📝 Professional Summary / Objective</div>
              <div className="field-group">
                <textarea
                  value={data.personal.summary}
                  onChange={e => upField('personal.summary', e.target.value)}
                  rows={4}
                  placeholder="Write a 2–3 sentence summary about your skills, goals, and what makes you unique. E.g. 'Final year B.Tech student passionate about full-stack development with hands-on experience in React and Node.js...'"
                />
              </div>
              <p style={{ fontSize: 12, color: '#64748b' }}>💡 Tip: Keep it 3–4 lines. Include keywords from your target job description.</p>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 2 — EDUCATION ═══════════════════════════ */}
        {step === 2 && (
          <div>
            {/* Graduation */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🎓 Graduation / Degree Level</div>
              <div className="grid-2">
                <div className="field-group">
                  <label className="field-label">Degree / Program *</label>
                  <select value={data.education.grad.degree} onChange={e => upField('education.grad.degree', e.target.value)}>
                    <option>Bachelor of Technology (B.Tech)</option>
                    <option>Bachelor of Engineering (B.E.)</option>
                    <option>Bachelor of Science (B.Sc)</option>
                    <option>Bachelor of Commerce (B.Com)</option>
                    <option>Bachelor of Arts (B.A.)</option>
                    <option>Bachelor of Computer Applications (BCA)</option>
                    <option>Bachelor of Business Administration (BBA)</option>
                    <option>Master of Technology (M.Tech)</option>
                    <option>Master of Science (M.Sc)</option>
                    <option>Master of Business Administration (MBA)</option>
                    <option>Master of Computer Applications (MCA)</option>
                    <option>Ph.D.</option>
                    <option>Diploma</option>
                  </select>
                </div>
                <div className="field-group"><label className="field-label">Field / Specialization *</label><input value={data.education.grad.field}    onChange={e => upField('education.grad.field',   e.target.value)} placeholder="Computer Science Engineering" /></div>
                <div className="field-group"><label className="field-label">College / Institute *</label>  <input value={data.education.grad.college}  onChange={e => upField('education.grad.college', e.target.value)} placeholder="JNTUK College of Engineering" /></div>
                <div className="field-group"><label className="field-label">University / Board</label>     <input value={data.education.grad.univ}     onChange={e => upField('education.grad.univ',    e.target.value)} placeholder="JNTUK University" /></div>
                <div className="field-group"><label className="field-label">Year of Passing</label>        <input value={data.education.grad.year}     onChange={e => upField('education.grad.year',    e.target.value)} placeholder="2024 (or Expected 2025)" /></div>
                <div className="field-group"><label className="field-label">CGPA / Percentage</label>      <input value={data.education.grad.cgpa}     onChange={e => upField('education.grad.cgpa',    e.target.value)} placeholder="8.5 / 10  or  78%" /></div>
              </div>
            </div>

            {/* PG */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.education.pg.on ? 16 : 0 }}>
                <div className="section-title" style={{ margin: 0 }}>🏛️ Post Graduation (Optional)</div>
                <button
                  onClick={() => upField('education.pg.on', !data.education.pg.on)}
                  style={{
                    background: data.education.pg.on ? '#7f1d1d' : '#1e3a5f',
                    color: data.education.pg.on ? '#fca5a5' : '#93c5fd',
                    padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  {data.education.pg.on ? 'Remove PG' : '+ Add PG'}
                </button>
              </div>
              {data.education.pg.on && (
                <div className="grid-2">
                  <div className="field-group"><label className="field-label">PG Degree</label>      <input value={data.education.pg.degree}  onChange={e => upField('education.pg.degree',  e.target.value)} placeholder="M.Tech / MBA / M.Sc" /></div>
                  <div className="field-group"><label className="field-label">Specialization</label> <input value={data.education.pg.field}   onChange={e => upField('education.pg.field',   e.target.value)} placeholder="Data Science" /></div>
                  <div className="field-group"><label className="field-label">College</label>         <input value={data.education.pg.college} onChange={e => upField('education.pg.college', e.target.value)} placeholder="IIT Hyderabad" /></div>
                  <div className="field-group"><label className="field-label">University</label>      <input value={data.education.pg.univ}    onChange={e => upField('education.pg.univ',    e.target.value)} placeholder="IIT Hyderabad" /></div>
                  <div className="field-group"><label className="field-label">Year</label>            <input value={data.education.pg.year}    onChange={e => upField('education.pg.year',    e.target.value)} placeholder="2026" /></div>
                  <div className="field-group"><label className="field-label">CGPA</label>            <input value={data.education.pg.cgpa}    onChange={e => upField('education.pg.cgpa',    e.target.value)} placeholder="9.0 / 10" /></div>
                </div>
              )}
            </div>

            {/* Intermediate */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🏫 Intermediate / 12th Standard</div>
              <div className="grid-2">
                <div className="field-group"><label className="field-label">School / College Name</label><input value={data.education.inter.name}  onChange={e => upField('education.inter.name',  e.target.value)} placeholder="Sri Chaitanya Junior College" /></div>
                <div className="field-group">
                  <label className="field-label">Board</label>
                  <select value={data.education.inter.board} onChange={e => upField('education.inter.board', e.target.value)}>
                    <option value="">Select Board</option>
                    <option>AP Board (BIEAP)</option><option>TS Board (BIETS)</option>
                    <option>CBSE</option><option>ICSE</option><option>State Board</option><option>NIOS</option><option>Other</option>
                  </select>
                </div>
                <div className="field-group"><label className="field-label">Year of Passing</label>    <input value={data.education.inter.year}  onChange={e => upField('education.inter.year',  e.target.value)} placeholder="2021" /></div>
                <div className="field-group"><label className="field-label">Percentage / Grade</label> <input value={data.education.inter.grade} onChange={e => upField('education.inter.grade', e.target.value)} placeholder="92.5% or A1" /></div>
              </div>
            </div>

            {/* School */}
            <div className="card">
              <div className="section-title">🏫 Secondary / 10th Standard (SSC)</div>
              <div className="grid-2">
                <div className="field-group"><label className="field-label">School Name</label>         <input value={data.education.school.name}  onChange={e => upField('education.school.name',  e.target.value)} placeholder="Zilla Parishad High School" /></div>
                <div className="field-group">
                  <label className="field-label">Board</label>
                  <select value={data.education.school.board} onChange={e => upField('education.school.board', e.target.value)}>
                    <option value="">Select Board</option>
                    <option>AP Board (BSE)</option><option>TS Board (BSE)</option>
                    <option>CBSE</option><option>ICSE</option><option>State Board</option><option>NIOS</option><option>Other</option>
                  </select>
                </div>
                <div className="field-group"><label className="field-label">Year of Passing</label>    <input value={data.education.school.year}  onChange={e => upField('education.school.year',  e.target.value)} placeholder="2019" /></div>
                <div className="field-group"><label className="field-label">Percentage / Grade</label> <input value={data.education.school.grade} onChange={e => upField('education.school.grade', e.target.value)} placeholder="85% or 9.5 GPA" /></div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 3 — SKILLS ═══════════════════════════════ */}
        {step === 3 && (
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">💻 Technical Skills</div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Programming languages, frameworks, databases, libraries…</p>
              <TagInput tags={data.skills.tech} onAdd={v => addTag('skills.tech', v)} onRemove={i => removeTag('skills.tech', i)} placeholder="e.g. Python — press Enter to add" />
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🛠️ Tools & Technologies</div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>IDEs, cloud platforms, version control, DevOps, design tools…</p>
              <TagInput tags={data.skills.tools} onAdd={v => addTag('skills.tools', v)} onRemove={i => removeTag('skills.tools', i)} placeholder="e.g. Git, VS Code, AWS, Figma" />
            </div>
            <div className="card">
              <div className="section-title">🤝 Soft Skills</div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Communication, leadership, teamwork, problem-solving…</p>
              <TagInput tags={data.skills.soft} onAdd={v => addTag('skills.soft', v)} onRemove={i => removeTag('skills.soft', i)} placeholder="e.g. Leadership, Team Player" />
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 4 — EXPERIENCE ═══════════════════════════ */}
        {step === 4 && level === 'experienced' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Add your work history, internships, and freelance work.</p>
              <button className="btn-add" onClick={addExp}>+ Add Experience</button>
            </div>
            {data.experience.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💼</div>
                <div>No entries yet. Click "+ Add Experience" to begin.</div>
              </div>
            )}
            {data.experience.map((exp, i) => (
              <ExpCard key={i} exp={exp} onChange={(k, v) => upExp(i, k, v)} onRemove={() => removeExp(i)} />
            ))}
          </div>
        )}

        {/* ═══════════════════════ STEP 4 — PROJECTS ═════════════════════════════ */}
        {step === 4 && level === 'fresher' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Showcase academic projects, personal builds, and open-source work.</p>
              <button className="btn-add" onClick={addProj}>+ Add Project</button>
            </div>
            {data.projects.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
                <div>No projects yet. Click "+ Add Project" to begin.</div>
              </div>
            )}
            {data.projects.map((proj, i) => (
              <ProjCard key={i} proj={proj} onChange={(k, v) => upProj(i, k, v)} onRemove={() => removeProj(i)} />
            ))}
          </div>
        )}

        {/* ═══════════════════════ STEP 5 — EXTRAS ═══════════════════════════════ */}
        {step === 5 && (
          <div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🏆 Certifications</div>
              <ListInput items={data.certs} onAdd={v => addList('certs', v)} onRemove={i => removeList('certs', i)} placeholder="e.g. AWS Certified Cloud Practitioner — 2024" />
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🌟 Achievements & Awards</div>
              <ListInput items={data.achievements} onAdd={v => addList('achievements', v)} onRemove={i => removeList('achievements', i)} placeholder="e.g. 1st Place — State Level Hackathon 2023" />
            </div>
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="section-title">🌐 Languages Known</div>
              <TagInput tags={data.languages} onAdd={v => addTag('languages', v)} onRemove={i => removeTag('languages', i)} placeholder="e.g. Telugu, Hindi, English" />
            </div>
            <div className="card">
              <div className="section-title">🎯 Hobbies & Interests</div>
              <TagInput tags={data.hobbies} onAdd={v => addTag('hobbies', v)} onRemove={i => removeTag('hobbies', i)} placeholder="e.g. Photography, Chess, Open Source" />
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 6 — PREVIEW ══════════════════════════════ */}
        {step === 6 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 22, alignItems: 'start' }}>

            {/* Resume Preview */}
            <div>
              <div style={{ background: '#64748b', padding: 16, borderRadius: 14 }} ref={resumeRef}>
                <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', marginBottom: -200 }}>
                  {renderResume()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                <button className="btn-success" onClick={downloadPDF}>📥 Download PDF</button>
                <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print</button>
              </div>
            </div>

            {/* ATS Checker */}
            <div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="section-title">🔍 ATS Score Checker</div>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  Paste the job description below. AI will analyse how well your resume matches.
                </p>
                <div className="field-group">
                  <label className="field-label">Job Description *</label>
                  <textarea
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    rows={6}
                    placeholder="Paste the complete job description here — requirements, responsibilities, and preferred skills…"
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={analyzeATS}
                  disabled={analyzing}
                  style={{ width: '100%' }}
                >
                  {analyzing ? '⏳ Analysing with Groq AI…' : '⚡ Analyse ATS Score'}
                </button>
                {atsErr && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{atsErr}</p>}
              </div>

              {/* ATS Results */}
              {ats && (
                <div className="card">
                  <div style={{ textAlign: 'center', marginBottom: 18 }}>
                    <div style={{
                      fontSize: 46, fontWeight: 700,
                      color: ats.overall_score >= 70 ? '#22c55e' : ats.overall_score >= 50 ? '#f59e0b' : '#ef4444',
                    }}>
                      {ats.overall_score}%
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>ATS Match Score</div>
                    <span style={{
                      display: 'inline-block', marginTop: 8, padding: '3px 16px',
                      borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: ats.overall_score >= 70 ? '#14532d' : ats.overall_score >= 50 ? '#78350f' : '#7f1d1d',
                      color: ats.overall_score >= 70 ? '#86efac' : ats.overall_score >= 50 ? '#fde68a' : '#fca5a5',
                    }}>
                      {ats.verdict}
                    </span>
                  </div>

                  <ScoreBar label="Keyword Match"    value={ats.keyword_score} />
                  <ScoreBar label="Format Score"     value={ats.format_score} />
                  <ScoreBar label="Experience Match" value={ats.experience_score} />

                  {ats.matched_keywords?.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#22c55e', marginBottom: 6 }}>✅ Matched Keywords</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {ats.matched_keywords.map((kw, i) => (
                          <span key={i} style={{ background: '#14532d', color: '#86efac', padding: '2px 9px', borderRadius: 12, fontSize: 11, margin: 2 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {ats.missing_keywords?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 6 }}>⚠️ Missing Keywords</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {ats.missing_keywords.map((kw, i) => (
                          <span key={i} style={{ background: '#78350f', color: '#fde68a', padding: '2px 9px', borderRadius: 12, fontSize: 11, margin: 2 }}>{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {ats.strengths?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa', marginBottom: 6 }}>💪 Strengths</div>
                      {ats.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>• {s}</div>)}
                    </div>
                  )}
                  {ats.improvements?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f87171', marginBottom: 6 }}>🔧 Improvements</div>
                      {ats.improvements.map((s, i) => <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>• {s}</div>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Bottom Navigation ── */}
        <div style={{
          marginTop: 28, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: 18,
        }}>
          <button className="btn-secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            ← Back
          </button>
          <span style={{ fontSize: 12, color: '#475569' }}>{step + 1} / {stepNames.length}</span>
          {step < 6
            ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="btn-success" onClick={downloadPDF}>📥 Download PDF</button>
          }
        </div>

      </div>
    </div>
  )
}