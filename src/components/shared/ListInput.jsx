import { useState } from 'react'

export default function ListInput({ items = [], onAdd, onRemove, placeholder }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          placeholder={placeholder}
        />
        <button
          onClick={handleAdd}
          style={{
            background: '#6366f1', color: '#fff',
            padding: '8px 16px', borderRadius: 8,
            fontSize: 13, flexShrink: 0, fontWeight: 600,
          }}
        >
          Add
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0f172a', border: '1px solid #334155',
            borderRadius: 8, padding: '8px 13px',
            marginBottom: 6, fontSize: 13,
          }}
        >
          <span style={{ color: '#cbd5e1' }}>• {item}</span>
          <button
            onClick={() => onRemove(i)}
            style={{ background: 'none', color: '#ef4444', fontSize: 18, padding: '0 4px' }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
