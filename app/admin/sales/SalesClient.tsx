'use client'
import { useState } from 'react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Printer, Search, Eye } from 'lucide-react'
import ReceiptModal from '@/components/admin/ReceiptModal'
import type { Sale, SaleItem } from '@/types/database'

interface Props { sales: (Sale & { sale_items: SaleItem[] })[] }

export default function SalesClient({ sales }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [receipt, setReceipt] = useState<{ sale: Sale; items: SaleItem[] } | null>(null)

  const filtered = sales.filter(s => {
    const matchSearch = s.sale_ref.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered.reduce((sum, s) => sum + (s.total || 0), 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Showing', value: String(filtered.length) },
          { label: 'Revenue', value: formatCurrency(totalRevenue) },
          { label: 'Completed', value: String(filtered.filter(s => s.status === 'completed').length) },
          { label: 'Partial', value: String(filtered.filter(s => s.status === 'partial').length) },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-lg font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search by ref or customer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="admin-select sm:w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="partial">Partial</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Ref', 'Customer', 'Phone', 'Method', 'Total', 'Paid', 'Balance', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-3 py-3 font-mono text-xs" style={{ color: 'var(--gold)' }}>{sale.sale_ref}</td>
                  <td className="px-3 py-3 text-gray-300">{sale.customer_name || 'Walk-in'}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{sale.customer_phone || '—'}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs capitalize">{sale.payment_method?.replace('_', ' ')}</td>
                  <td className="px-3 py-3 font-bold text-white">{formatCurrency(sale.total)}</td>
                  <td className="px-3 py-3 text-green-400">{formatCurrency(sale.amount_paid)}</td>
                  <td className="px-3 py-3 text-red-400">{sale.balance_due > 0 ? formatCurrency(sale.balance_due) : '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${sale.status === 'completed' ? 'bg-green-900/40 text-green-400' : sale.status === 'partial' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-red-900/40 text-red-400'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDateTime(sale.created_at)}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => setReceipt({ sale, items: sale.sale_items || [] })}
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded transition-colors hover:bg-white/10 text-gray-400 hover:text-white">
                      <Printer size={12} /> Print
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-500">No sales found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {receipt && (
        <ReceiptModal sale={receipt.sale} items={receipt.items} onClose={() => setReceipt(null)} />
      )}
    </div>
  )
}
