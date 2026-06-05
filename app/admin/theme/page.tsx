'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, RefreshCw } from 'lucide-react'

const DEFAULT_COLORS = [
  { key: '--gold', label: 'Primary Gold (CTAs, accents)', value: '#C8960C' },
  { key: '--gold-hover', label: 'Gold Hover', value: '#E8B020' },
  { key: '--gold-muted', label: 'Gold Muted', value: '#D4A017' },
  { key: '--navy', label: 'Dark Navy (background)', value: '#15212c' },
  { key: '--navy-light', label: 'Navy Light', value: '#29353f' },
  { key: '--navy-deep', label: 'Navy Deep', value: '#0d0f18' },
  { key: '--navy-alt', label: 'Navy Alt', value: '#111320' },
  { key: '--brown', label: 'Earthy Brown', value: '#6B4C2A' },
  { key: '--text-muted', label: 'Muted Text', value: '#737a80' },
  { key: '--heading-dark', label: 'Dark Heading', value: '#1a181d' },
]

export default function ThemePage() {
  const [colors, setColors] = useState(DEFAULT_COLORS.map(c => ({ ...c })))
  const [saved, setSaved] = useState(false)

  function apply() {
    colors.forEach(c => document.documentElement.style.setProperty(c.key, c.value))
    setSaved(true)
    toast.success('Theme applied to preview. Add to globals.css to make permanent.')
    setTimeout(() => setSaved(false), 3000)
  }

  function reset() {
    setColors(DEFAULT_COLORS.map(c => ({ ...c })))
    DEFAULT_COLORS.forEach(c => document.documentElement.style.setProperty(c.key, c.value))
    toast.success('Reset to defaults')
  }

  return (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm" style={{ color: '#8a9ba8' }}>
        Adjust brand colours here to preview them on this page. To make colours permanent, copy the values into <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ background: '#0d1821' }}>app/globals.css</code> under the <code>:root</code> block.
      </p>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        {colors.map((c, i) => (
          <div key={c.key} className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: i < colors.length - 1 ? '1px solid #0d1821' : undefined }}>
            <div className="w-10 h-10 rounded-lg shrink-0 ring-1 ring-white/10" style={{ background: c.value }} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{c.label}</div>
              <div className="text-xs font-mono" style={{ color: '#4a6175' }}>{c.key}</div>
            </div>
            <input
              type="color"
              value={c.value}
              onChange={e => setColors(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
              className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
            />
            <input
              type="text"
              value={c.value}
              onChange={e => setColors(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
              className="admin-input w-28 font-mono text-xs"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={apply} className="btn-gold flex items-center gap-2 text-sm px-6 py-3">
          <Save size={15} /> {saved ? 'Applied!' : 'Apply Preview'}
        </button>
        <button onClick={reset} className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm text-gray-300 hover:text-white transition-colors" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
          <RefreshCw size={15} /> Reset Defaults
        </button>
      </div>

      <div className="rounded-xl p-5 text-sm" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
        <div className="font-bold text-white mb-2">Current CSS Variables</div>
        <pre className="text-xs overflow-x-auto leading-relaxed" style={{ color: '#8a9ba8' }}>
          {`:root {\n${colors.map(c => `  ${c.key}: ${c.value};`).join('\n')}\n}`}
        </pre>
        <p className="mt-3 text-xs" style={{ color: '#4a6175' }}>Copy the above block into <code>app/globals.css</code> to persist the theme across server restarts.</p>
      </div>
    </div>
  )
}
