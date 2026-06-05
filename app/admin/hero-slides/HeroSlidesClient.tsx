'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import type { HeroSlide } from '@/types/database'

const EMPTY: Partial<HeroSlide> = {
  title: '', subtitle: '', heading: '', body: '',
  button1_text: 'Get a Quote', button1_href: '/quote',
  button2_text: 'Browse Products', button2_href: '/products',
  image_url: '', sort_order: 1, is_active: true,
}

interface Props { slides: HeroSlide[] }

export default function HeroSlidesClient({ slides: initial }: Props) {
  const [slides, setSlides] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; slide: Partial<HeroSlide> }>({ open: false, slide: EMPTY })
  const [loading, setLoading] = useState(false)

  const openCreate = () => setModal({ open: true, slide: { ...EMPTY, sort_order: slides.length + 1 } })
  const openEdit = (s: HeroSlide) => setModal({ open: true, slide: { ...s } })
  const close = () => setModal({ open: false, slide: EMPTY })
  const set = (k: keyof HeroSlide, v: unknown) => setModal(m => ({ ...m, slide: { ...m.slide, [k]: v } }))

  async function save() {
    const { slide } = modal
    if (!slide.heading || !slide.body) { toast.error('Heading and body are required'); return }
    setLoading(true)
    const supabase = createClient()
    const payload = {
      title: slide.title, subtitle: slide.subtitle, heading: slide.heading,
      body: slide.body, button1_text: slide.button1_text, button1_href: slide.button1_href,
      button2_text: slide.button2_text, button2_href: slide.button2_href,
      image_url: slide.image_url || null, sort_order: slide.sort_order || 1, is_active: slide.is_active,
    }
    if (slide.id) {
      const { error } = await supabase.from('hero_slides').update(payload).eq('id', slide.id)
      if (error) { toast.error('Update failed'); setLoading(false); return }
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, ...payload } as HeroSlide : s))
    } else {
      const { data, error } = await supabase.from('hero_slides').insert([payload]).select().single()
      if (error || !data) { toast.error('Create failed'); setLoading(false); return }
      setSlides(prev => [...prev, data])
    }
    toast.success('Saved')
    setLoading(false)
    close()
  }

  async function del(id: string) {
    if (!confirm('Delete this slide?')) return
    const supabase = createClient()
    await supabase.from('hero_slides').delete().eq('id', id)
    setSlides(prev => prev.filter(s => s.id !== id))
    toast.success('Deleted')
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('hero_slides').update({ is_active: !current }).eq('id', id)
    setSlides(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={15} /> Add Slide
        </button>
      </div>

      <div className="space-y-3">
        {slides.map(slide => (
          <div key={slide.id} className="rounded-xl p-4 flex items-center gap-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <GripVertical size={16} className="text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm truncate">{slide.heading}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${slide.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {slide.is_active ? 'Active' : 'Hidden'}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--gold)' }}>#{slide.sort_order}</span>
              </div>
              <div className="text-xs text-gray-500 truncate">{slide.title} · {slide.body?.slice(0, 60)}…</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(slide.id, slide.is_active)} className="text-xs px-3 py-1.5 rounded font-semibold transition-colors" style={{ background: '#1e2a35', color: '#8a9ba8', border: '1px solid #374d5e' }}>
                {slide.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => openEdit(slide)} className="text-gray-400 hover:text-white p-1.5"><Pencil size={14} /></button>
              <button onClick={() => del(slide.id)} className="text-gray-600 hover:text-red-400 p-1.5"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <div className="rounded-xl py-12 text-center text-gray-500" style={{ border: '1px solid #1e2e3c' }}>No slides yet</div>}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{modal.slide.id ? 'Edit Slide' : 'Add Slide'}</h2>
              <button onClick={close} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tag / Title</label>
                  <input className="admin-input" value={modal.slide.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Cement · Steel · Roofing" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Subtitle</label>
                  <input className="admin-input" value={modal.slide.subtitle || ''} onChange={e => set('subtitle', e.target.value)} placeholder="Short phrase" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Heading *</label>
                <input className="admin-input" value={modal.slide.heading || ''} onChange={e => set('heading', e.target.value)} placeholder="Large headline" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Body Text *</label>
                <textarea className="admin-input resize-none" rows={3} value={modal.slide.body || ''} onChange={e => set('body', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Button 1 Text</label>
                  <input className="admin-input" value={modal.slide.button1_text || ''} onChange={e => set('button1_text', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Button 1 Link</label>
                  <input className="admin-input" value={modal.slide.button1_href || ''} onChange={e => set('button1_href', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Button 2 Text</label>
                  <input className="admin-input" value={modal.slide.button2_text || ''} onChange={e => set('button2_text', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Button 2 Link</label>
                  <input className="admin-input" value={modal.slide.button2_href || ''} onChange={e => set('button2_href', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Image URL (Supabase storage URL)</label>
                <input className="admin-input" value={modal.slide.image_url || ''} onChange={e => set('image_url', e.target.value)} placeholder="https://…supabase.co/storage/…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort Order</label>
                  <input type="number" className="admin-input" value={modal.slide.sort_order || 1} onChange={e => set('sort_order', Number(e.target.value))} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pb-2">
                    <input type="checkbox" checked={!!modal.slide.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-yellow-500" />
                    Active / Visible
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">{loading ? 'Saving…' : 'Save Slide'}</button>
              <button onClick={close} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
