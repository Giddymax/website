'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime } from '@/lib/utils'
import { Search, Eye, X, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { QuoteRequest, QuoteStatus } from '@/types/database'

const STATUS_COLORS: Record<QuoteStatus, string> = {
  new: 'bg-blue-900/40 text-blue-400',
  reviewed: 'bg-yellow-900/40 text-yellow-400',
  quoted: 'bg-purple-900/40 text-purple-400',
  completed: 'bg-green-900/40 text-green-400',
  cancelled: 'bg-red-900/40 text-red-400',
}

const STATUSES: QuoteStatus[] = ['new', 'reviewed', 'quoted', 'completed', 'cancelled']

interface Props { quotes: QuoteRequest[]; role: string }

type EditForm = Pick<QuoteRequest,
  'name' | 'phone' | 'email' | 'project_type' | 'materials_needed' |
  'quantity_volume' | 'delivery_address' | 'deadline' | 'notes' | 'status'
>

function formFromQuote(q: QuoteRequest): EditForm {
  return {
    name: q.name,
    phone: q.phone,
    email: q.email || '',
    project_type: q.project_type || '',
    materials_needed: q.materials_needed || '',
    quantity_volume: q.quantity_volume || '',
    delivery_address: q.delivery_address || '',
    deadline: q.deadline || '',
    notes: q.notes || '',
    status: q.status,
  }
}

export default function QuotesClient({ quotes: initialQuotes, role }: Props) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail, setDetail] = useState<QuoteRequest | null>(null)
  const [editModal, setEditModal] = useState<{ open: boolean; id: string; form: EditForm } | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = quotes.filter(q => {
    const matchSearch =
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.phone.includes(search) ||
      (q.email || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || q.status === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(id: string, status: QuoteStatus) {
    const supabase = createClient()
    const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id)
    if (error) { toast.error('Update failed'); return }
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q))
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d)
    toast.success('Status updated')
  }

  function openEdit(q: QuoteRequest) {
    setDetail(null)
    setEditModal({ open: true, id: q.id, form: formFromQuote(q) })
  }

  const setF = (k: keyof EditForm, v: string) =>
    setEditModal(m => m ? { ...m, form: { ...m.form, [k]: v } } : m)

  async function saveEdit() {
    if (!editModal) return
    if (!editModal.form.name.trim() || !editModal.form.phone.trim()) {
      toast.error('Name and phone are required'); return
    }
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: editModal.form.name,
      phone: editModal.form.phone,
      email: editModal.form.email || null,
      project_type: editModal.form.project_type || null,
      materials_needed: editModal.form.materials_needed || null,
      quantity_volume: editModal.form.quantity_volume || null,
      delivery_address: editModal.form.delivery_address || null,
      deadline: editModal.form.deadline || null,
      notes: editModal.form.notes || null,
      status: editModal.form.status,
    }
    const { error } = await supabase.from('quote_requests').update(payload).eq('id', editModal.id)
    if (error) { toast.error('Update failed'); setSaving(false); return }
    setQuotes(prev => prev.map(q => q.id === editModal.id ? { ...q, ...payload } as QuoteRequest : q))
    toast.success('Quote updated')
    setSaving(false)
    setEditModal(null)
  }

  async function deleteQuote(id: string) {
    if (!confirm('Delete this quote request permanently?')) return
    const supabase = createClient()
    const { error } = await supabase.from('quote_requests').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setQuotes(prev => prev.filter(q => q.id !== id))
    if (detail?.id === id) setDetail(null)
    toast.success('Deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search by name, phone, email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-select sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Name', 'Phone', 'Project', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 text-white font-medium">{q.name}</td>
                  <td className="px-3 py-3 text-gray-400">{q.phone}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{q.project_type || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(q.created_at)}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="View quote"
                        onClick={() => setDetail(q)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        type="button"
                        aria-label="Edit quote"
                        onClick={() => openEdit(q)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        aria-label="Delete quote"
                        onClick={() => deleteQuote(q.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No quotes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">Quote — {detail.name}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(detail)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  style={{ background: '#1e2a35', border: '1px solid #374d5e' }}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button type="button" aria-label="Close" onClick={() => setDetail(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
              </div>
            </div>
            <div className="p-6 space-y-3 overflow-y-auto max-h-[65vh] text-sm">
              {([
                ['Name', detail.name], ['Phone', detail.phone], ['Email', detail.email],
                ['Project Type', detail.project_type], ['Materials Needed', detail.materials_needed],
                ['Quantity / Volume', detail.quantity_volume], ['Delivery Address', detail.delivery_address],
                ['Deadline', detail.deadline], ['Notes', detail.notes],
                ['Submitted', formatDateTime(detail.created_at)],
              ] as [string, string | null | undefined][]).map(([k, v]) => v ? (
                <div key={k} className="flex gap-3">
                  <span className="text-gray-500 w-36 shrink-0">{k}</span>
                  <span className="text-gray-200 flex-1">{v}</span>
                </div>
              ) : null)}
              <div className="flex gap-3 items-center">
                <span className="text-gray-500 w-36 shrink-0">Status</span>
                <select className="admin-select flex-1" value={detail.status} onChange={e => updateStatus(detail.id, e.target.value as QuoteStatus)}>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#1e2e3c] flex gap-2">
              <a href={`tel:${detail.phone}`} className="btn-gold flex-1 flex items-center justify-center text-sm py-2.5">
                Call {detail.phone}
              </a>
              <button
                type="button"
                onClick={() => deleteQuote(detail.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded text-sm font-semibold text-red-400 hover:text-white hover:bg-red-900/30 transition-colors"
                style={{ border: '1px solid #7f1d1d' }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal?.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/75 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl my-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">Edit Quote Request</h2>
              <button type="button" aria-label="Close" onClick={() => setEditModal(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="eq-name" className="block text-xs font-semibold text-gray-400 mb-1.5">Name *</label>
                  <input id="eq-name" className="admin-input" placeholder="Customer name" value={editModal.form.name} onChange={e => setF('name', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="eq-phone" className="block text-xs font-semibold text-gray-400 mb-1.5">Phone *</label>
                  <input id="eq-phone" className="admin-input" placeholder="024XXXXXXX" value={editModal.form.phone} onChange={e => setF('phone', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="eq-email" className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                  <input id="eq-email" type="email" className="admin-input" placeholder="email@example.com" value={editModal.form.email} onChange={e => setF('email', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="eq-status" className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                  <select id="eq-status" aria-label="Quote status" className="admin-select" value={editModal.form.status} onChange={e => setF('status', e.target.value)}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="eq-project" className="block text-xs font-semibold text-gray-400 mb-1.5">Project Type</label>
                <input id="eq-project" className="admin-input" placeholder="e.g. Residential build" value={editModal.form.project_type} onChange={e => setF('project_type', e.target.value)} />
              </div>
              <div>
                <label htmlFor="eq-materials" className="block text-xs font-semibold text-gray-400 mb-1.5">Materials Needed</label>
                <textarea id="eq-materials" className="admin-input resize-none" rows={2} placeholder="e.g. 50 bags cement, 10 sheets roofing" value={editModal.form.materials_needed} onChange={e => setF('materials_needed', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="eq-qty" className="block text-xs font-semibold text-gray-400 mb-1.5">Quantity / Volume</label>
                  <input id="eq-qty" className="admin-input" placeholder="e.g. Full house build" value={editModal.form.quantity_volume} onChange={e => setF('quantity_volume', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="eq-deadline" className="block text-xs font-semibold text-gray-400 mb-1.5">Deadline</label>
                  <input id="eq-deadline" className="admin-input" placeholder="e.g. End of June" value={editModal.form.deadline} onChange={e => setF('deadline', e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="eq-address" className="block text-xs font-semibold text-gray-400 mb-1.5">Delivery Address</label>
                <input id="eq-address" className="admin-input" placeholder="Site or delivery address" value={editModal.form.delivery_address} onChange={e => setF('delivery_address', e.target.value)} />
              </div>
              <div>
                <label htmlFor="eq-notes" className="block text-xs font-semibold text-gray-400 mb-1.5">Notes</label>
                <textarea id="eq-notes" className="admin-input resize-none" rows={3} placeholder="Any additional notes" value={editModal.form.notes} onChange={e => setF('notes', e.target.value)} />
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button type="button" onClick={saveEdit} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
