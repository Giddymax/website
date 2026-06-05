'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SocialLink } from '@/types/database'

interface Props { links: SocialLink[] }

const PLATFORMS = ['Facebook', 'Instagram', 'WhatsApp', 'YouTube', 'TikTok', 'LinkedIn', 'Twitter/X']

interface FormState {
  platform: string
  url: string
  is_active: boolean
  sort_order: number
}

const EMPTY_FORM: FormState = { platform: 'Facebook', url: '', is_active: true, sort_order: 0 }

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366" />
    </svg>
  )
}

function PlatformIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase()
  if (p.includes('whatsapp')) return <WhatsAppIcon size={16} />
  if (p.includes('facebook')) return <span className="text-[#1877F2] text-xs font-extrabold">f</span>
  if (p.includes('instagram')) return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#FCAF45" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#833AB4" />
          <stop offset="100%" stopColor="#405DE6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="17.5" cy="6.5" r="1" fill="white" />
    </svg>
  )
  if (p.includes('youtube')) return <span className="text-[#FF0000] text-xs font-extrabold">▶</span>
  if (p.includes('tiktok')) return <span className="text-white text-xs font-extrabold">TT</span>
  if (p.includes('linkedin')) return <span className="text-[#0A66C2] text-xs font-extrabold">in</span>
  if (p.includes('twitter') || p.includes('/x')) return <span className="text-white text-xs font-extrabold">𝕏</span>
  return <span className="text-gray-400 text-xs font-bold">{platform.slice(0, 2).toUpperCase()}</span>
}

export default function SocialLinksClient({ links: initial }: Props) {
  const [links, setLinks] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)
  const [addSaving, setAddSaving] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [editSaving, setEditSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openEdit = (link: SocialLink) => {
    setEditingLink(link)
    setEditForm({ platform: link.platform, url: link.url, is_active: link.is_active, sort_order: link.sort_order })
  }

  const handleAdd = async () => {
    if (!addForm.url.trim()) { toast.error('URL is required'); return }
    setAddSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('social_links')
      .insert([{ platform: addForm.platform, url: addForm.url, is_active: addForm.is_active, sort_order: addForm.sort_order }])
      .select().single()
    if (error || !data) {
      toast.error('Failed to add link')
    } else {
      toast.success('Link added')
      setLinks(prev => [...prev, data as SocialLink].sort((a, b) => a.sort_order - b.sort_order))
      setShowAdd(false)
      setAddForm(EMPTY_FORM)
    }
    setAddSaving(false)
  }

  const handleEdit = async () => {
    if (!editingLink) return
    if (!editForm.url.trim()) { toast.error('URL is required'); return }
    setEditSaving(true)
    const supabase = createClient()
    const updates = { platform: editForm.platform, url: editForm.url, is_active: editForm.is_active, sort_order: editForm.sort_order }
    const { error } = await supabase.from('social_links').update(updates).eq('id', editingLink.id)
    if (error) {
      toast.error('Failed to update link')
    } else {
      toast.success('Link updated')
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...updates } : l).sort((a, b) => a.sort_order - b.sort_order))
      setEditingLink(null)
    }
    setEditSaving(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('social_links').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete link')
    } else {
      toast.success('Link deleted')
      setLinks(prev => prev.filter(l => l.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Manage the social media links shown on the public website footer.</p>
        <button type="button" onClick={() => { setShowAdd(true); setAddForm(EMPTY_FORM) }}
          className="btn-gold flex items-center gap-2 px-4 py-2 text-xs">
          <Plus size={13} /> Add Link
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {links.map(link => (
          <div key={link.id} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
              <PlatformIcon platform={link.platform} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold">{link.platform}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{link.url || <span className="italic text-gray-600">No URL set</span>}</div>
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${link.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
              {link.is_active ? 'Active' : 'Hidden'}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" onClick={() => openEdit(link)} aria-label="Edit link"
                className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-white/5 transition-colors">
                <Pencil size={13} />
              </button>
              <button type="button" onClick={() => setDeletingId(link.id)} aria-label="Delete link"
                className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <div className="rounded-xl py-10 text-center text-gray-500 text-sm" style={{ border: '1px solid #1e2e3c' }}>
            No social links yet. Click &ldquo;Add Link&rdquo; to get started.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold text-sm">Add Social Link</h2>
              <button type="button" aria-label="Close" onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label htmlFor="add-platform" className="text-[11px] text-gray-500 mb-1 block">Platform</label>
                <select id="add-platform" className="admin-select text-sm" value={addForm.platform}
                  onChange={e => setAddForm(f => ({ ...f, platform: e.target.value }))}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="add-url" className="text-[11px] text-gray-500 mb-1 block">URL</label>
                <input id="add-url" className="admin-input text-sm" placeholder="https://…" value={addForm.url}
                  onChange={e => setAddForm(f => ({ ...f, url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="add-sort" className="text-[11px] text-gray-500 mb-1 block">Sort Order</label>
                  <input id="add-sort" type="number" min={0} className="admin-input text-sm" value={addForm.sort_order}
                    onChange={e => setAddForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={addForm.is_active} className="accent-yellow-500"
                      onChange={e => setAddForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
              <button type="button" onClick={handleAdd} disabled={addSaving}
                className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50">
                <Plus size={14} /> {addSaving ? 'Adding…' : 'Add Link'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold text-sm">Edit — {editingLink.platform}</h2>
              <button type="button" aria-label="Close" onClick={() => setEditingLink(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label htmlFor="edit-platform" className="text-[11px] text-gray-500 mb-1 block">Platform</label>
                <select id="edit-platform" className="admin-select text-sm" value={editForm.platform}
                  onChange={e => setEditForm(f => ({ ...f, platform: e.target.value }))}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="edit-url" className="text-[11px] text-gray-500 mb-1 block">URL</label>
                <input id="edit-url" className="admin-input text-sm" placeholder="https://…" value={editForm.url}
                  onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-sort" className="text-[11px] text-gray-500 mb-1 block">Sort Order</label>
                  <input id="edit-sort" type="number" min={0} className="admin-input text-sm" value={editForm.sort_order}
                    onChange={e => setEditForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_active} className="accent-yellow-500"
                      onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
              <button type="button" onClick={handleEdit} disabled={editSaving}
                className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50">
                <Save size={14} /> {editSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditingLink(null)}
                className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-xl p-6 shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <h3 className="text-white font-bold mb-2">Delete Link?</h3>
            <p className="text-sm text-gray-400 mb-5">This will permanently remove the social link. This cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 text-sm rounded font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button type="button" onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
