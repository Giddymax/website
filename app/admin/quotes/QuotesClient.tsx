'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime } from '@/lib/utils'
import { Search, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { QuoteRequest, QuoteStatus } from '@/types/database'

const STATUS_COLORS: Record<QuoteStatus, string> = {
  new: 'bg-blue-900/40 text-blue-400',
  reviewed: 'bg-yellow-900/40 text-yellow-400',
  quoted: 'bg-purple-900/40 text-purple-400',
  completed: 'bg-green-900/40 text-green-400',
  cancelled: 'bg-red-900/40 text-red-400',
}

interface Props { quotes: QuoteRequest[] }

export default function QuotesClient({ quotes: initialQuotes }: Props) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail, setDetail] = useState<QuoteRequest | null>(null)

  const filtered = quotes.filter(q => {
    const matchSearch = q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.phone.includes(search) || (q.email || '').toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search by name, phone, email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-select sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          {(['new', 'reviewed', 'quoted', 'completed', 'cancelled'] as QuoteStatus[]).map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
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
                    <select className="text-xs rounded px-2 py-1 font-semibold capitalize border-none outline-none cursor-pointer" style={{ background: 'transparent' }}
                      value={q.status} onChange={e => updateStatus(q.id, e.target.value as QuoteStatus)}>
                      {(['new', 'reviewed', 'quoted', 'completed', 'cancelled'] as QuoteStatus[]).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(q.created_at)}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => setDetail(q)} className="text-gray-400 hover:text-white"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No quotes found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">Quote Request — {detail.name}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3 overflow-y-auto max-h-[65vh] text-sm">
              {[
                ['Name', detail.name], ['Phone', detail.phone], ['Email', detail.email],
                ['Project Type', detail.project_type], ['Materials Needed', detail.materials_needed],
                ['Quantity / Volume', detail.quantity_volume], ['Delivery Address', detail.delivery_address],
                ['Deadline', detail.deadline], ['Notes', detail.notes],
                ['Submitted', formatDateTime(detail.created_at)],
              ].map(([k, v]) => v ? (
                <div key={k} className="flex gap-3">
                  <span className="text-gray-500 w-36 shrink-0">{k}</span>
                  <span className="text-gray-200 flex-1">{v}</span>
                </div>
              ) : null)}
              <div className="flex gap-3 items-center">
                <span className="text-gray-500 w-36 shrink-0">Status</span>
                <select className="admin-select flex-1" value={detail.status} onChange={e => updateStatus(detail.id, e.target.value as QuoteStatus)}>
                  {(['new', 'reviewed', 'quoted', 'completed', 'cancelled'] as QuoteStatus[]).map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#1e2e3c]">
              <a href={`tel:${detail.phone}`} className="btn-gold w-full flex items-center justify-center text-sm py-2.5">
                Call {detail.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
