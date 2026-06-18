'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import type { PageHero } from '@/types/database'
import ImageUpload from '@/components/admin/ImageUpload'

const PAGES = [
  { slug: 'about', label: 'About' },
  { slug: 'gallery', label: 'Gallery' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'delivery', label: 'Delivery' },
  { slug: 'products', label: 'Products' },
  { slug: 'bulk-orders', label: 'Bulk Orders' },
  { slug: 'quote', label: 'Quote' },
]

const EMPTY: Partial<PageHero> = {
  page_slug: '', label: '', subtitle: '', heading: '',
  description: '', image_url: null, is_active: true,
}

interface Props { heroes: PageHero[] }

export default function PageHeroesClient({ heroes: initial }: Props) {
  const [heroes, setHeroes] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; hero: Partial<PageHero> }>({ open: false, hero: EMPTY })
  const [loading, setLoading] = useState(false)

  const usedSlugs = new Set(heroes.map(h => h.page_slug))

  const openCreate = () => setModal({ open: true, hero: { ...EMPTY } })
  const openEdit = (h: PageHero) => setModal({ open: true, hero: { ...h } })
  const close = () => setModal({ open: false, hero: EMPTY })
  const set = (k: keyof PageHero, v: unknown) =>
    setModal(m => ({ ...m, hero: { ...m.hero, [k]: v } }))

  async function save() {
    const { hero } = modal
    if (!hero.page_slug) { toast.error('Select a page'); return }
    if (!hero.heading) { toast.error('Heading is required'); return }
    setLoading(true)
    const supabase = createClient()
    const pageLabel = PAGES.find(p => p.slug === hero.page_slug)?.label || hero.page_slug
    const payload = {
      page_slug: hero.page_slug,
      label: pageLabel,
      subtitle: hero.subtitle || null,
      heading: hero.heading,
      description: hero.description || null,
      image_url: hero.image_url || null,
      is_active: hero.is_active,
    }
    if (hero.id) {
      const { error } = await supabase.from('page_heroes').update(payload).eq('id', hero.id)
      if (error) { toast.error('Update failed'); setLoading(false); return }
      setHeroes(prev => prev.map(h => h.id === hero.id ? { ...h, ...payload } as PageHero : h))
    } else {
      const { data, error } = await supabase.from('page_heroes').insert([payload]).select().single()
      if (error || !data) { toast.error(error?.message?.includes('duplicate') ? 'This page already has a hero' : 'Create failed'); setLoading(false); return }
      setHeroes(prev => [...prev, data])
    }
    toast.success('Saved')
    setLoading(false)
    close()
  }

  async function del(id: string) {
    if (!confirm('Delete this page hero?')) return
    const supabase = createClient()
    await supabase.from('page_heroes').delete().eq('id', id)
    setHeroes(prev => prev.filter(h => h.id !== id))
    toast.success('Deleted')
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('page_heroes').update({ is_active: !current }).eq('id', id)
    setHeroes(prev => prev.map(h => h.id === id ? { ...h, is_active: !current } : h))
  }

  const { hero } = modal
  const isEditing = !!hero.id
  const availablePages = PAGES.filter(p => !usedSlugs.has(p.slug) || p.slug === hero.page_slug)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={15} /> Add Page Hero
        </button>
      </div>

      <div className="space-y-3">
        {heroes.map(h => (
          <div key={h.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
              {h.image_url ? (
                <img src={h.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={16} className="text-gray-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: '#0d1821', color: 'var(--gold)' }}>/{h.page_slug}</span>
                <span className="text-white font-semibold text-sm truncate">{h.heading}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${h.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {h.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {h.subtitle && <span>{h.subtitle} &middot; </span>}
                {h.description?.slice(0, 80) || 'No description'}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(h.id, h.is_active)} className="text-xs px-3 py-1.5 rounded font-semibold transition-colors" style={{ background: '#1e2a35', color: '#8a9ba8', border: '1px solid #374d5e' }}>
                {h.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(h)} className="text-gray-400 hover:text-white p-1.5"><Pencil size={14} /></button>
              <button onClick={() => del(h.id)} className="text-gray-600 hover:text-red-400 p-1.5"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {heroes.length === 0 && (
          <div className="rounded-xl py-12 text-center text-gray-500" style={{ border: '1px solid #1e2e3c' }}>
            No page heroes yet. Add one to set a hero image for a sub-page.
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{isEditing ? 'Edit Page Hero' : 'Add Page Hero'}</h2>
              <button onClick={close} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Page *</label>
                <select
                  className="admin-select"
                  value={hero.page_slug || ''}
                  onChange={e => set('page_slug', e.target.value)}
                  disabled={isEditing}
                >
                  <option value="">Select a page…</option>
                  {availablePages.map(p => (
                    <option key={p.slug} value={p.slug}>/{p.slug} — {p.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Label / Tag</label>
                  <input className="admin-input" value={hero.subtitle || ''} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. About Us" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Heading *</label>
                  <input className="admin-input" value={hero.heading || ''} onChange={e => set('heading', e.target.value)} placeholder="Page title" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
                <textarea className="admin-input resize-none" rows={3} value={hero.description || ''} onChange={e => set('description', e.target.value)} placeholder="Short description below the heading" />
              </div>
              <ImageUpload
                label="Hero Background Image"
                folder="page-heroes"
                value={hero.image_url}
                onChange={url => set('image_url', url)}
              />
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={!!hero.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-yellow-500" />
                Active / Visible
              </label>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">{loading ? 'Saving…' : 'Save'}</button>
              <button onClick={close} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
