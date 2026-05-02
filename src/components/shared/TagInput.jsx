import { useState } from 'react'

export default function TagInput({ tags = [], onAdd, onRemove, placeholder }) {
  const [value, setValue] = useState('')

  const handleAdd = () => {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed)
      setValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type and press Enter or click Add'}
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
            <button onClick={() => onRemove(i)}>×</button>
          </span>
        ))}
      </div>
    </div>
  )
}
