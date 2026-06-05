'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, PRODUCT_CATEGORIES, STOCK_UNITS } from '@/lib/utils'
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { InventoryItem } from '@/types/database'

interface Props { items: InventoryItem[] }

const EMPTY: Partial<InventoryItem> = {
  name: '', category: 'Cement & Concrete', price: 0,
  unit: 'bag', stock_quantity: 0, low_stock_threshold: 5,
  is_service: false, is_active: true,
}

export default function InventoryClient({ items: initialItems }: Props) {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; item: Partial<InventoryItem> }>({ open: false, item: EMPTY })
  const [loading, setLoading] = useState(false)

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => setModal({ open: true, item: { ...EMPTY } })
  const openEdit = (item: InventoryItem) => setModal({ open: true, item: { ...item } })
  const closeModal = () => setModal({ open: false, item: EMPTY })

  const set = (k: keyof InventoryItem, v: unknown) =>
    setModal(m => ({ ...m, item: { ...m.item, [k]: v } }))

  async function save() {
    const { item } = modal
    if (!item.name) { toast.error('Name is required'); return }
    setLoading(true)
    const supabase = createClient()
    if (item.id) {
      const { error } = await supabase.from('inventory_items').update({
        name: item.name, category: item.category, price: item.price,
        unit: item.unit, stock_quantity: item.stock_quantity,
        low_stock_threshold: item.low_stock_threshold,
        is_service: item.is_service, is_active: item.is_active,
      }).eq('id', item.id)
      if (error) { toast.error('Update failed'); setLoading(false); return }
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...item } as InventoryItem : i))
      toast.success('Updated')
    } else {
      const { data, error } = await supabase.from('inventory_items').insert([{
        name: item.name, category: item.category, price: item.price,
        unit: item.unit, stock_quantity: item.stock_quantity,
        low_stock_threshold: item.low_stock_threshold,
        is_service: item.is_service, is_active: item.is_active,
      }]).select().single()
      if (error || !data) { toast.error('Create failed'); setLoading(false); return }
      setItems(prev => [...prev, data])
      toast.success('Created')
    }
    setLoading(false)
    closeModal()
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item?')) return
    const supabase = createClient()
    await supabase.from('inventory_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={15} /> Add Item
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Name', 'Category', 'Price', 'Unit', 'Stock', 'Min', 'Service', 'Active', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 text-white font-medium">
                    {item.name}
                    {item.stock_quantity <= item.low_stock_threshold && !item.is_service && (
                      <AlertTriangle size={12} className="inline ml-1 text-red-400" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{item.category}</td>
                  <td className="px-3 py-3 font-bold" style={{ color: 'var(--gold)' }}>{formatCurrency(item.price)}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">{item.unit}</td>
                  <td className="px-3 py-3">
                    <span className={`font-bold text-sm ${item.stock_quantity <= item.low_stock_threshold && !item.is_service ? 'text-red-400' : 'text-green-400'}`}>
                      {item.stock_quantity}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{item.low_stock_threshold}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${item.is_service ? 'text-blue-400' : 'text-gray-600'}`}>{item.is_service ? '✓' : '—'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${item.is_active ? 'text-green-400' : 'text-gray-600'}`}>{item.is_active ? '✓' : '✗'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-white"><Pencil size={13} /></button>
                      <button onClick={() => deleteItem(item.id)} className="text-gray-600 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500">No items found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{modal.item.id ? 'Edit Item' : 'Add Item'}</h2>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Name *</label>
                <input className="admin-input" value={modal.item.name || ''} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                  <select className="admin-select" value={modal.item.category || ''} onChange={e => set('category', e.target.value)}>
                    {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Unit</label>
                  <select className="admin-select" value={modal.item.unit || 'piece'} onChange={e => set('unit', e.target.value)}>
                    {STOCK_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Price (₵)</label>
                  <input type="number" className="admin-input" value={modal.item.price || ''} onChange={e => set('price', Number(e.target.value))} min={0} step="0.01" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Stock Qty</label>
                  <input type="number" className="admin-input" value={modal.item.stock_quantity ?? ''} onChange={e => set('stock_quantity', Number(e.target.value))} min={0} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Low Stock Alert</label>
                  <input type="number" className="admin-input" value={modal.item.low_stock_threshold ?? ''} onChange={e => set('low_stock_threshold', Number(e.target.value))} min={0} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={!!modal.item.is_service} onChange={e => set('is_service', e.target.checked)} className="accent-yellow-500" />
                  Is a Service
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={!!modal.item.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-yellow-500" />
                  Active
                </label>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">
                {loading ? 'Saving…' : 'Save'}
              </button>
              <button onClick={closeModal} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
