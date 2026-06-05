'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SocialLink } from '@/types/database'

interface Props { links: SocialLink[] }

const PLATFORMS = ['Facebook', 'Instagram', 'Twitter/X', 'WhatsApp', 'YouTube', 'TikTok', 'LinkedIn']

export default function SocialLinksClient({ links: initial }: Props) {
  const [links, setLinks] = useState(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, Partial<SocialLink>>>({})

  const getField = (link: SocialLink, field: keyof SocialLink) => {
    const edit = edits[link.id]
    return edit && field in edit ? edit[field] : link[field]
  }

  const setEdit = (id: string, field: keyof SocialLink, value: unknown) =>
    setEdits(e => ({ ...e, [id]: { ...e[id], [field]: value } }))

  async function save(link: SocialLink) {
    const edit = edits[link.id] || {}
    setSaving(link.id)
    const supabase = createClient()
    const update = { url: (edit.url ?? link.url) as string, is_active: (edit.is_active ?? link.is_active) as boolean }
    const { error } = await supabase.from('social_links').update(update).eq('id', link.id)
    if (error) { toast.error('Save failed'); setSaving(null); return }
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, ...update } : l))
    setEdits(e => { const n = { ...e }; delete n[link.id]; return n })
    toast.success('Saved')
    setSaving(null)
  }

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm text-gray-500 mb-4">Manage the social media links shown on the public website footer and contact page.</p>
      {links.map(link => (
        <div key={link.id} className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="w-28 shrink-0 font-bold text-sm text-white">{link.platform}</div>
          <div className="flex-1 min-w-0">
            <input
              className="admin-input text-sm w-full"
              value={(getField(link, 'url') as string) || ''}
              onChange={e => setEdit(link.id, 'url', e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={!!(getField(link, 'is_active') as boolean)} onChange={e => setEdit(link.id, 'is_active', e.target.checked)} className="accent-yellow-500" />
              Active
            </label>
            <button onClick={() => save(link)} disabled={saving === link.id}
              className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold" style={{ background: edits[link.id] ? 'var(--gold)' : '#1e2a35', color: edits[link.id] ? '#000' : '#8a9ba8', border: '1px solid #374d5e' }}>
              <Save size={12} /> {saving === link.id ? '…' : 'Save'}
            </button>
          </div>
        </div>
      ))}
      {links.length === 0 && (
        <div className="rounded-xl py-8 text-center text-gray-500" style={{ border: '1px solid #1e2e3c' }}>
          No social links. They will be added when you run the seed SQL.
        </div>
      )}
    </div>
  )
}
