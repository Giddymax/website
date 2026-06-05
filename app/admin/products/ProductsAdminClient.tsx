'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PRODUCT_CATEGORIES, STOCK_UNITS, slugify } from '@/lib/utils'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types/database'
import ImageUpload from '@/components/admin/ImageUpload'

const EMPTY: Partial<Product> = {
  name: '', slug: '', category: 'Cement & Concrete', description: '',
  image_url: '', unit: 'piece', price: undefined, sort_order: 1, is_active: true,
}

interface Props { products: Product[] }

export default function ProductsAdminClient({ products: initial }: Props) {
  const [products, setProducts] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; p: Partial<Product> }>({ open: false, p: EMPTY })
  const [loading, setLoading] = useState(false)

  const open = (p?: Product) => setModal({ open: true, p: p ? { ...p } : { ...EMPTY, sort_order: products.length + 1 } })
  const close = () => setModal({ open: false, p: EMPTY })
  const set = (k: keyof Product, v: unknown) => setModal(m => ({ ...m, p: { ...m.p, [k]: v } }))

  async function save() {
    const { p } = modal
    if (!p.name) { toast.error('Name required'); return }
    const slug = p.slug || slugify(p.name)
    setLoading(true)
    const supabase = createClient()
    const payload = {
      name: p.name, slug, category: p.category, description: p.description || null,
      image_url: p.image_url || null, unit: p.unit, price: p.price || null,
      sort_order: p.sort_order || 1, is_active: p.is_active,
    }
    if (p.id) {
      await supabase.from('products').update(payload).eq('id', p.id)
      setProducts(prev => prev.map(x => x.id === p.id ? { ...x, ...payload } as Product : x))
    } else {
      const { data } = await supabase.from('products').insert([payload]).select().single()
      if (data) setProducts(prev => [...prev, data])
    }
    toast.success('Saved')
    setLoading(false)
    close()
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => open()} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5"><Plus size={15} /> Add Product</button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Name', 'Category', 'Unit', 'Price', 'Order', 'Active', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{p.category}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{p.unit}</td>
                  <td className="px-3 py-3 text-sm" style={{ color: 'var(--gold)' }}>{p.price ? `₵${p.price}` : '—'}</td>
                  <td className="px-3 py-3 text-gray-500">{p.sort_order}</td>
                  <td className="px-3 py-3"><span className={`text-xs ${p.is_active ? 'text-green-400' : 'text-gray-600'}`}>{p.is_active ? '✓' : '✗'}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open(p)} className="text-gray-400 hover:text-white"><Pencil size={13} /></button>
                      <button onClick={() => del(p.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No products yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{modal.p.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={close} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Name *</label>
                <input className="admin-input" value={modal.p.name || ''} onChange={e => { set('name', e.target.value); if (!modal.p.id) set('slug', slugify(e.target.value)) }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Slug</label>
                  <input className="admin-input font-mono text-xs" value={modal.p.slug || ''} onChange={e => set('slug', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                  <select className="admin-select" value={modal.p.category || ''} onChange={e => set('category', e.target.value)}>
                    {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
                <textarea className="admin-input resize-none" rows={3} value={modal.p.description || ''} onChange={e => set('description', e.target.value)} />
              </div>
              <ImageUpload
                label="Image"
                folder="products"
                value={modal.p.image_url}
                onChange={url => set('image_url', url)}
              />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unit</label>
                  <select className="admin-select" value={modal.p.unit || 'piece'} onChange={e => set('unit', e.target.value)}>
                    {STOCK_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Price (₵)</label>
                  <input type="number" className="admin-input" value={modal.p.price || ''} onChange={e => set('price', Number(e.target.value) || undefined)} min={0} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Sort Order</label>
                  <input type="number" className="admin-input" value={modal.p.sort_order || 1} onChange={e => set('sort_order', Number(e.target.value))} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" checked={!!modal.p.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-yellow-500" />
                Active / Visible on public site
              </label>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">{loading ? 'Saving…' : 'Save Product'}</button>
              <button onClick={close} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
