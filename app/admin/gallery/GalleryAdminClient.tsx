'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { GalleryItem } from '@/types/database'

const EMPTY: Partial<GalleryItem> = { label: '', image_url: '', category: '', sort_order: 1, is_active: true }

interface Props { items: GalleryItem[] }

export default function GalleryAdminClient({ items: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; item: Partial<GalleryItem> }>({ open: false, item: EMPTY })
  const [loading, setLoading] = useState(false)

  const openCreate = () => setModal({ open: true, item: { ...EMPTY, sort_order: items.length + 1 } })
  const openEdit = (item: GalleryItem) => setModal({ open: true, item: { ...item } })
  const close = () => setModal({ open: false, item: EMPTY })
  const set = (k: keyof GalleryItem, v: unknown) => setModal(m => ({ ...m, item: { ...m.item, [k]: v } }))

  async function save() {
    const { item } = modal
    if (!item.image_url) { toast.error('Image URL required'); return }
    setLoading(true)
    const supabase = createClient()
    const payload = { label: item.label || null, image_url: item.image_url, category: item.category || null, sort_order: item.sort_order || 1, is_active: item.is_active }
    if (item.id) {
      await supabase.from('gallery_items').update(payload).eq('id', item.id)
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...payload } as GalleryItem : i))
    } else {
      const { data } = await supabase.from('gallery_items').insert([payload]).select().single()
      if (data) setItems(prev => [...prev, data])
    }
    toast.success('Saved')
    setLoading(false)
    close()
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return
    const supabase = createClient()
    await supabase.from('gallery_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5"><Plus size={15} /> Add Photo</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="rounded-xl overflow-hidden group relative" style={{ border: '1px solid #1e2e3c' }}>
            <div className="relative aspect-square">
              <Image src={item.image_url} alt={item.label || 'Gallery'} fill className="object-cover" sizes="25vw" onError={() => {}} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white"><Pencil size={13} /></button>
                <button onClick={() => del(item.id)} className="w-8 h-8 rounded-full bg-red-500/30 hover:bg-red-500/60 flex items-center justify-center text-white"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="px-3 py-2" style={{ background: 'var(--navy)' }}>
              <div className="text-xs text-white truncate">{item.label || '(no label)'}</div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">{item.category || '—'}</span>
                <span className={`text-[10px] font-semibold ${item.is_active ? 'text-green-400' : 'text-gray-600'}`}>
                  {item.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-4 py-16 text-center text-gray-500 rounded-xl" style={{ border: '1px solid #1e2e3c' }}>No gallery images yet</div>}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{modal.item.id ? 'Edit Photo' : 'Add Photo'}</h2>
              <button onClick={close} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Image URL *</label>
                <input className="admin-input" value={modal.item.image_url || ''} onChange={e => set('image_url', e.target.value)} placeholder="https://…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Label</label>
                <input className="admin-input" value={modal.item.label || ''} onChange={e => set('label', e.target.value)} placeholder="Photo caption" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                  <input className="admin-input" value={modal.item.category || ''} onChange={e => set('category', e.target.value)} placeholder="e.g. Stock, Delivery" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort Order</label>
                  <input type="number" className="admin-input" value={modal.item.sort_order || 1} onChange={e => set('sort_order', Number(e.target.value))} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={!!modal.item.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-yellow-500" />
                Active / Visible
              </label>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">{loading ? 'Saving…' : 'Save'}</button>
              <button onClick={close} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
