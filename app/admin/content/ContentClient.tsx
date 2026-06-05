'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SiteContent } from '@/types/database'

interface Props { content: SiteContent[] }

export default function ContentClient({ content: initial }: Props) {
  const [content, setContent] = useState(initial)
  const [search, setSearch] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, string>>({})

  const sections = ['all', ...Array.from(new Set(initial.map(c => c.section)))]

  const filtered = content.filter(c => {
    const matchSearch = c.key.toLowerCase().includes(search.toLowerCase()) ||
      (c.value || '').toLowerCase().includes(search.toLowerCase())
    const matchSection = sectionFilter === 'all' || c.section === sectionFilter
    return matchSearch && matchSection
  })

  const getValue = (item: SiteContent) => edits[item.id] !== undefined ? edits[item.id] : (item.value || '')
  const setEdit = (id: string, value: string) => setEdits(e => ({ ...e, [id]: value }))

  async function saveItem(item: SiteContent) {
    const value = getValue(item)
    setSaving(item.id)
    const supabase = createClient()
    const { error } = await supabase.from('site_content').update({ value }).eq('id', item.id)
    if (error) { toast.error('Save failed'); setSaving(null); return }
    setContent(prev => prev.map(c => c.id === item.id ? { ...c, value } : c))
    setEdits(e => { const n = { ...e }; delete n[item.id]; return n })
    toast.success('Saved')
    setSaving(null)
  }

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.section]) acc[c.section] = []
    acc[c.section].push(c)
    return acc
  }, {} as Record<string, SiteContent[]>)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search content keys…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-select sm:w-44" value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
          {sections.map(s => <option key={s} value={s}>{s === 'all' ? 'All Sections' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="px-5 py-3 font-bold text-xs uppercase tracking-widest" style={{ background: '#0d1821', color: 'var(--gold)', borderBottom: '1px solid #1e2e3c' }}>
            {section}
          </div>
          <div className="divide-y divide-[#0d1821]">
            {items.map(item => {
              const isLong = (item.value || '').length > 80
              const isDirty = edits[item.id] !== undefined
              return (
                <div key={item.id} className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-start">
                  <div className="sm:w-48 shrink-0">
                    <div className="text-xs font-mono text-gray-400">{item.key}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {isLong ? (
                      <textarea
                        className="admin-input resize-none text-xs w-full"
                        rows={3}
                        value={getValue(item)}
                        onChange={e => setEdit(item.id, e.target.value)}
                      />
                    ) : (
                      <input
                        className="admin-input text-xs w-full"
                        value={getValue(item)}
                        onChange={e => setEdit(item.id, e.target.value)}
                      />
                    )}
                  </div>
                  <button onClick={() => saveItem(item)} disabled={saving === item.id}
                    className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded text-xs font-bold transition-colors ${isDirty ? 'text-black' : 'text-gray-500 hover:text-white'}`}
                    style={isDirty ? { background: 'var(--gold)' } : { background: '#1e2a35' }}>
                    <Save size={12} /> {saving === item.id ? '…' : 'Save'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
