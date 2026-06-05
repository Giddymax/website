'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDateTime, PAYMENT_METHODS } from '@/lib/utils'
import { Printer, Search, Pencil, Trash2, X, Save, CreditCard } from 'lucide-react'
import ReceiptModal from '@/components/admin/ReceiptModal'
import toast from 'react-hot-toast'
import type { Sale, SaleItem } from '@/types/database'

type SaleWithItems = Sale & { sale_items: SaleItem[] }

interface EditForm {
  customer_name: string
  customer_phone: string
  payment_method: string
  amount_paid: number
  discount: number
  notes: string
  status: string
}

interface Props {
  sales: SaleWithItems[]
  role: string
}

export default function SalesClient({ sales: initialSales, role }: Props) {
  const [sales, setSales] = useState(initialSales)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [receipt, setReceipt] = useState<{ sale: Sale; items: SaleItem[] } | null>(null)
  const [editingSale, setEditingSale] = useState<SaleWithItems | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [payingSale, setPayingSale] = useState<SaleWithItems | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')
  const [payingSaving, setPayingSaving] = useState(false)

  const isAdmin = role === 'admin'

  const filtered = sales.filter(s => {
    const matchSearch = s.sale_ref.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered.reduce((sum, s) => sum + (s.total || 0), 0)

  const openEdit = (sale: SaleWithItems) => {
    setEditingSale(sale)
    setEditForm({
      customer_name: sale.customer_name || '',
      customer_phone: sale.customer_phone || '',
      payment_method: sale.payment_method,
      amount_paid: sale.amount_paid,
      discount: sale.discount,
      notes: sale.notes || '',
      status: sale.status,
    })
  }

  const handleSave = async () => {
    if (!editingSale || !editForm) return
    setSaving(true)
    const supabase = createClient()

    const total = Math.max(0, editingSale.subtotal - editForm.discount)
    const change_due = editForm.amount_paid > total ? editForm.amount_paid - total : 0
    const balance_due = editForm.amount_paid < total ? total - editForm.amount_paid : 0
    const status = editForm.status === 'cancelled'
      ? 'cancelled'
      : editForm.amount_paid >= total ? 'completed' : 'partial'

    const updates = {
      customer_name: editForm.customer_name || null,
      customer_phone: editForm.customer_phone || null,
      payment_method: editForm.payment_method,
      amount_paid: editForm.amount_paid,
      discount: editForm.discount,
      total,
      change_due,
      balance_due,
      status,
      notes: editForm.notes || null,
    }

    const { error } = await supabase.from('sales').update(updates).eq('id', editingSale.id)
    if (error) {
      toast.error('Failed to update sale')
    } else {
      toast.success('Sale updated')
      setSales(prev => prev.map(s => s.id === editingSale.id ? { ...s, ...updates } as SaleWithItems : s))
      setEditingSale(null)
      setEditForm(null)
    }
    setSaving(false)
  }

  const openPay = (sale: SaleWithItems) => {
    setPayingSale(sale)
    setPayAmount(sale.balance_due)
    setPayMethod('cash')
  }

  const handlePay = async () => {
    if (!payingSale) return
    if (payAmount <= 0) { toast.error('Enter a payment amount'); return }
    setPayingSaving(true)
    const supabase = createClient()

    const new_amount_paid = payingSale.amount_paid + payAmount
    const new_balance_due = Math.max(0, payingSale.total - new_amount_paid)
    const new_change_due = new_amount_paid > payingSale.total ? new_amount_paid - payingSale.total : 0
    const new_status = new_balance_due === 0 ? 'completed' : 'partial'

    const updates = {
      amount_paid: new_amount_paid,
      balance_due: new_balance_due,
      change_due: new_change_due,
      status: new_status,
      payment_method: payMethod,
    }

    const { error } = await supabase.from('sales').update(updates).eq('id', payingSale.id)
    if (error) {
      toast.error('Failed to record payment')
    } else {
      toast.success(new_status === 'completed' ? 'Paid in full!' : 'Payment recorded')
      setSales(prev => prev.map(s => s.id === payingSale.id ? { ...s, ...updates } as SaleWithItems : s))
      setPayingSale(null)
    }
    setPayingSaving(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    await supabase.from('sale_items').delete().eq('sale_id', id)
    const { error } = await supabase.from('sales').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete sale')
    } else {
      toast.success('Sale deleted')
      setSales(prev => prev.filter(s => s.id !== id))
    }
    setDeletingId(null)
  }

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
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setReceipt({ sale, items: sale.sale_items || [] })}
                        className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded transition-colors hover:bg-white/10 text-gray-400 hover:text-white">
                        <Printer size={12} /> Print
                      </button>
                      {sale.status === 'partial' && (
                        <button type="button" onClick={() => openPay(sale)}
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded transition-colors text-green-400 hover:bg-green-900/20"
                          aria-label="Record payment">
                          <CreditCard size={12} /> Pay
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          <button type="button" onClick={() => openEdit(sale)}
                            className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded transition-colors hover:bg-white/10 text-gray-400 hover:text-blue-400"
                            aria-label="Edit sale">
                            <Pencil size={12} />
                          </button>
                          <button type="button" onClick={() => setDeletingId(sale.id)}
                            className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded transition-colors hover:bg-white/10 text-gray-400 hover:text-red-400"
                            aria-label="Delete sale">
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
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

      {/* Edit Modal */}
      {editingSale && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold text-sm">Edit Sale — {editingSale.sale_ref}</h2>
              <button type="button" aria-label="Close" onClick={() => setEditingSale(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-customer-name" className="text-[11px] text-gray-500 mb-1 block">Customer Name</label>
                  <input id="edit-customer-name" className="admin-input text-sm" placeholder="Walk-in" value={editForm.customer_name}
                    onChange={e => setEditForm(f => f ? { ...f, customer_name: e.target.value } : f)} />
                </div>
                <div>
                  <label htmlFor="edit-customer-phone" className="text-[11px] text-gray-500 mb-1 block">Phone</label>
                  <input id="edit-customer-phone" className="admin-input text-sm" placeholder="Phone number" value={editForm.customer_phone}
                    onChange={e => setEditForm(f => f ? { ...f, customer_phone: e.target.value } : f)} />
                </div>
              </div>
              <div>
                <label htmlFor="edit-payment-method" className="text-[11px] text-gray-500 mb-1 block">Payment Method</label>
                <select id="edit-payment-method" className="admin-select text-sm" value={editForm.payment_method}
                  onChange={e => setEditForm(f => f ? { ...f, payment_method: e.target.value } : f)}>
                  {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-discount" className="text-[11px] text-gray-500 mb-1 block">Discount (₵)</label>
                  <input id="edit-discount" type="number" min={0} className="admin-input text-sm" value={editForm.discount}
                    onChange={e => setEditForm(f => f ? { ...f, discount: Number(e.target.value) } : f)} />
                </div>
                <div>
                  <label htmlFor="edit-amount-paid" className="text-[11px] text-gray-500 mb-1 block">Amount Paid (₵)</label>
                  <input id="edit-amount-paid" type="number" min={0} className="admin-input text-sm" value={editForm.amount_paid}
                    onChange={e => setEditForm(f => f ? { ...f, amount_paid: Number(e.target.value) } : f)} />
                </div>
              </div>
              <div>
                <label htmlFor="edit-status" className="text-[11px] text-gray-500 mb-1 block">Status</label>
                <select id="edit-status" className="admin-select text-sm" value={editForm.status}
                  onChange={e => setEditForm(f => f ? { ...f, status: e.target.value } : f)}>
                  <option value="completed">Completed</option>
                  <option value="partial">Partial</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-notes" className="text-[11px] text-gray-500 mb-1 block">Notes</label>
                <textarea id="edit-notes" className="admin-input text-sm resize-none" rows={2} value={editForm.notes}
                  onChange={e => setEditForm(f => f ? { ...f, notes: e.target.value } : f)} />
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
              <button type="button" onClick={handleSave} disabled={saving}
                className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50">
                <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditingSale(null)}
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
            <h3 className="text-white font-bold mb-2">Delete Sale?</h3>
            <p className="text-sm text-gray-400 mb-5">This cannot be undone. The sale and all its line items will be permanently removed.</p>
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

      {/* Record Payment Modal */}
      {payingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold text-sm">Record Payment — {payingSale.sale_ref}</h2>
              <button type="button" aria-label="Close" onClick={() => setPayingSale(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="rounded-lg px-4 py-3 flex items-center justify-between" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
                <span className="text-sm text-gray-400">Balance Owed</span>
                <span className="text-lg font-extrabold text-red-400">{formatCurrency(payingSale.balance_due)}</span>
              </div>
              <div>
                <label htmlFor="pay-method" className="text-[11px] text-gray-500 mb-1 block">Payment Method</label>
                <select id="pay-method" className="admin-select text-sm" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                  {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="pay-amount" className="text-[11px] text-gray-500 mb-1 block">
                  Amount Received (₵)
                  <button type="button" onClick={() => setPayAmount(payingSale.balance_due)}
                    className="ml-2 text-[10px] font-bold underline" style={{ color: 'var(--gold)' }}>
                    Full balance
                  </button>
                </label>
                <input id="pay-amount" type="number" min={0} max={payingSale.balance_due} className="admin-input text-sm"
                  value={payAmount || ''} onChange={e => setPayAmount(Number(e.target.value))} />
              </div>
            </div>
            <div className="flex gap-3 px-5 py-4" style={{ borderTop: '1px solid #1e2e3c' }}>
              <button type="button" onClick={handlePay} disabled={payingSaving || payAmount <= 0}
                className="btn-gold flex-1 flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-50">
                <CreditCard size={14} /> {payingSaving ? 'Saving…' : 'Confirm Payment'}
              </button>
              <button type="button" onClick={() => setPayingSale(null)}
                className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white transition-colors"
                style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {receipt && (
        <ReceiptModal sale={receipt.sale} items={receipt.items} onClose={() => setReceipt(null)} />
      )}
    </div>
  )
}
