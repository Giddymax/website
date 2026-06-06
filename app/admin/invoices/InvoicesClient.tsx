'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, generateInvoiceRef } from '@/lib/utils'
import { Plus, Pencil, Trash2, Search, Printer, X, PlusCircle, MinusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Invoice, InvoiceItem, InvoiceStatus, InventoryItem } from '@/types/database'
import InvoicePrintModal from './InvoicePrintModal'

interface Props {
  invoices: Invoice[]
  inventoryItems: Pick<InventoryItem, 'id' | 'name' | 'price' | 'unit' | 'category'>[]
  currentUserId: string
  currentUserName: string
  role: string
}

type DraftItem = Omit<InvoiceItem, 'id' | 'invoice_id'> & { _key: string }

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: 'bg-gray-700 text-gray-300',
  sent: 'bg-blue-900/50 text-blue-300',
  paid: 'bg-green-900/50 text-green-300',
  cancelled: 'bg-red-900/50 text-red-400',
}

const UNITS = ['piece', 'bag', 'sheet', 'roll', 'tin', 'kg', 'metre', 'bundle', 'set', 'lot']

const EMPTY_ITEM = (): DraftItem => ({
  _key: Math.random().toString(36).slice(2),
  description: '',
  quantity: 1,
  unit: 'piece',
  unit_price: 0,
  line_total: 0,
})

interface FormState {
  invoice_number: string
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  due_date: string
  notes: string
  discount: number
  status: InvoiceStatus
  items: DraftItem[]
}

function emptyForm(): FormState {
  return {
    invoice_number: generateInvoiceRef(),
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    due_date: '',
    notes: '',
    discount: 0,
    status: 'draft',
    items: [EMPTY_ITEM()],
  }
}

function formFromInvoice(inv: Invoice): FormState {
  return {
    invoice_number: inv.invoice_number,
    customer_name: inv.customer_name,
    customer_phone: inv.customer_phone || '',
    customer_email: inv.customer_email || '',
    customer_address: inv.customer_address || '',
    due_date: inv.due_date || '',
    notes: inv.notes || '',
    discount: inv.discount,
    status: inv.status,
    items: (inv.invoice_items || []).map(it => ({ ...it, _key: it.id })),
  }
}

function numVal(val: number): string | number {
  return val === 0 ? '' : val
}

export default function InvoicesClient({ invoices: initial, inventoryItems, currentUserId, currentUserName, role }: Props) {
  const router = useRouter()
  const [invoices, setInvoices] = useState(initial)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')
  const [modal, setModal] = useState<{ open: boolean; editId: string | null; form: FormState }>({
    open: false, editId: null, form: emptyForm(),
  })
  const [saving, setSaving] = useState(false)
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null)

  const filtered = invoices.filter(inv => {
    const matchSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const openCreate = () => setModal({ open: true, editId: null, form: emptyForm() })
  const openEdit = (inv: Invoice) => setModal({ open: true, editId: inv.id, form: formFromInvoice(inv) })
  const closeModal = () => setModal(m => ({ ...m, open: false }))

  const setF = (k: keyof FormState, v: unknown) =>
    setModal(m => ({ ...m, form: { ...m.form, [k]: v } }))

  const updateItem = (key: string, patch: Partial<DraftItem>) =>
    setModal(m => ({
      ...m,
      form: {
        ...m.form,
        items: m.form.items.map(it => {
          if (it._key !== key) return it
          const merged = { ...it, ...patch }
          merged.line_total = Number((merged.quantity * merged.unit_price).toFixed(2))
          return merged
        }),
      },
    }))

  const pickInventoryItem = (itemKey: string, invId: string) => {
    const inv = inventoryItems.find(i => i.id === invId)
    if (!inv) return
    updateItem(itemKey, {
      description: inv.name,
      unit: inv.unit,
      unit_price: inv.price,
    })
  }

  const addItem = () =>
    setModal(m => ({ ...m, form: { ...m.form, items: [...m.form.items, EMPTY_ITEM()] } }))

  const removeItem = (key: string) =>
    setModal(m => ({ ...m, form: { ...m.form, items: m.form.items.filter(it => it._key !== key) } }))

  const { form } = modal
  const subtotal = form.items.reduce((s, it) => s + it.line_total, 0)
  const total = Math.max(0, subtotal - (form.discount || 0))

  async function save() {
    if (!form.customer_name.trim()) { toast.error('Customer name is required'); return }
    if (form.items.every(it => !it.description.trim())) {
      toast.error('Add at least one line item'); return
    }
    setSaving(true)
    const supabase = createClient()

    const invoicePayload = {
      invoice_number: form.invoice_number,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      customer_email: form.customer_email || null,
      customer_address: form.customer_address || null,
      due_date: form.due_date || null,
      notes: form.notes || null,
      discount: form.discount || 0,
      status: form.status,
      subtotal,
      total,
      created_by: currentUserId || null,
    }

    const validItems = form.items.filter(it => it.description.trim())

    if (modal.editId) {
      const { error } = await supabase.from('invoices').update(invoicePayload).eq('id', modal.editId)
      if (error) { toast.error('Update failed: ' + error.message); setSaving(false); return }
      await supabase.from('invoice_items').delete().eq('invoice_id', modal.editId)
      await supabase.from('invoice_items').insert(
        validItems.map(it => ({
          invoice_id: modal.editId,
          description: it.description,
          quantity: it.quantity,
          unit: it.unit,
          unit_price: it.unit_price,
          line_total: it.line_total,
        }))
      )
      toast.success('Invoice updated')
    } else {
      const { data: newInv, error } = await supabase
        .from('invoices').insert([invoicePayload]).select().single()
      if (error || !newInv) { toast.error('Create failed: ' + (error?.message || '')); setSaving(false); return }
      await supabase.from('invoice_items').insert(
        validItems.map(it => ({
          invoice_id: newInv.id,
          description: it.description,
          quantity: it.quantity,
          unit: it.unit,
          unit_price: it.unit_price,
          line_total: it.line_total,
        }))
      )
      toast.success('Invoice created')
    }

    setSaving(false)
    closeModal()
    router.refresh()
  }

  async function deleteInvoice(id: string) {
    if (!confirm('Delete this invoice permanently?')) return
    const supabase = createClient()
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) { toast.error('Delete failed'); return }
    setInvoices(prev => prev.filter(inv => inv.id !== id))
    toast.success('Deleted')
  }

  async function updateStatus(id: string, status: InvoiceStatus) {
    const supabase = createClient()
    const { error } = await supabase.from('invoices').update({ status }).eq('id', id)
    if (error) { toast.error('Status update failed'); return }
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv))
    toast.success('Status updated')
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap flex-1">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              className="admin-input pl-9 w-56"
              placeholder="Search invoices…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by status"
            className="admin-select w-36"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="button" onClick={openCreate} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5 shrink-0">
          <Plus size={15} /> New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Invoice #', 'Customer', 'Date', 'Due Date', 'Total', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-white">{inv.invoice_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-medium">{inv.customer_name}</div>
                    {inv.customer_phone && <div className="text-gray-500 text-xs">{inv.customer_phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(inv.created_at)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {inv.due_date ? formatDate(inv.due_date) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--gold)' }}>{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="Invoice status"
                      value={inv.status}
                      onChange={e => updateStatus(inv.id, e.target.value as InvoiceStatus)}
                      className={`text-xs font-semibold px-2 py-1 rounded border-0 outline-none cursor-pointer ${STATUS_STYLES[inv.status]}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <button type="button" aria-label="Print invoice" onClick={() => setPrintInvoice(inv)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Printer size={13} /> Print
                      </button>
                      <button type="button" aria-label="Edit invoice" onClick={() => openEdit(inv)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        <Pencil size={13} /> Edit
                      </button>
                      {role === 'admin' && (
                        <button type="button" aria-label="Delete invoice" onClick={() => deleteInvoice(inv.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                          <Trash2 size={13} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No invoices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/75 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl my-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <div>
                <h2 className="text-white font-bold">{modal.editId ? 'Edit Invoice' : 'New Invoice'}</h2>
                <div className="text-xs text-gray-500 mt-0.5">{form.invoice_number}</div>
              </div>
              <button type="button" aria-label="Close" onClick={closeModal} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Invoice meta */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inv-num" className="block text-xs font-semibold text-gray-400 mb-1.5">Invoice #</label>
                  <input id="inv-num" className="admin-input font-mono text-xs" value={form.invoice_number} onChange={e => setF('invoice_number', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="inv-status" className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                  <select id="inv-status" aria-label="Invoice status" className="admin-select" value={form.status} onChange={e => setF('status', e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--gold)' }}>Customer Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label htmlFor="inv-cust" className="block text-xs font-semibold text-gray-400 mb-1.5">Customer Name *</label>
                    <input id="inv-cust" className="admin-input" placeholder="John Mensah" value={form.customer_name} onChange={e => setF('customer_name', e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="inv-phone" className="block text-xs font-semibold text-gray-400 mb-1.5">Phone</label>
                    <input id="inv-phone" className="admin-input" placeholder="024XXXXXXX" value={form.customer_phone} onChange={e => setF('customer_phone', e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="inv-email" className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                    <input id="inv-email" type="email" className="admin-input" placeholder="customer@email.com" value={form.customer_email} onChange={e => setF('customer_email', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="inv-addr" className="block text-xs font-semibold text-gray-400 mb-1.5">Delivery / Site Address</label>
                    <input id="inv-addr" className="admin-input" placeholder="Site or delivery address" value={form.customer_address} onChange={e => setF('customer_address', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Line Items</h3>
                  <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--gold)' }}>
                    <PlusCircle size={13} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {form.items.map((it, idx) => (
                    <div key={it._key} className="rounded-lg p-3 space-y-2" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
                      {/* Row 1: inventory select + description + remove */}
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1.5">
                          <select
                            aria-label="Select from inventory"
                            className="admin-select text-xs w-full"
                            defaultValue=""
                            onChange={e => pickInventoryItem(it._key, e.target.value)}
                          >
                            <option value="">— Select from inventory —</option>
                            {inventoryItems.map(inv => (
                              <option key={inv.id} value={inv.id}>
                                {inv.name} · {formatCurrency(inv.price)}/{inv.unit}
                              </option>
                            ))}
                          </select>
                          <input
                            className="admin-input text-xs w-full"
                            placeholder={`Item ${idx + 1} description`}
                            value={it.description}
                            onChange={e => updateItem(it._key, { description: e.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeItem(it._key)}
                          disabled={form.items.length === 1}
                          className="text-gray-600 hover:text-red-400 disabled:opacity-30 mt-1 shrink-0"
                        >
                          <MinusCircle size={16} />
                        </button>
                      </div>

                      {/* Row 2: qty, unit, price, total */}
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Qty</label>
                          <input
                            type="number"
                            className="admin-input text-xs"
                            placeholder="1"
                            value={numVal(it.quantity)}
                            min={0}
                            step="any"
                            onChange={e => {
                              const n = e.target.value === '' ? 0 : parseFloat(e.target.value)
                              updateItem(it._key, { quantity: isNaN(n) ? 0 : n })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Unit</label>
                          <select
                            aria-label="Unit"
                            className="admin-select text-xs"
                            value={it.unit}
                            onChange={e => updateItem(it._key, { unit: e.target.value })}
                          >
                            {UNITS.map(u => <option key={u}>{u}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Price (₵)</label>
                          <input
                            type="number"
                            className="admin-input text-xs"
                            placeholder="0.00"
                            value={numVal(it.unit_price)}
                            min={0}
                            step="any"
                            onChange={e => {
                              const n = e.target.value === '' ? 0 : parseFloat(e.target.value)
                              updateItem(it._key, { unit_price: isNaN(n) ? 0 : n })
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 mb-1">Total</label>
                          <div className="text-sm font-bold pt-1.5" style={{ color: 'var(--gold)' }}>
                            {formatCurrency(it.line_total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals + extras */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="inv-due" className="block text-xs font-semibold text-gray-400 mb-1.5">Due Date</label>
                    <input id="inv-due" type="date" className="admin-input text-xs" value={form.due_date} onChange={e => setF('due_date', e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="inv-notes" className="block text-xs font-semibold text-gray-400 mb-1.5">Notes / Terms</label>
                    <textarea
                      id="inv-notes"
                      className="admin-input resize-none text-xs"
                      rows={3}
                      placeholder="Payment terms, delivery notes…"
                      value={form.notes}
                      onChange={e => setF('notes', e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-lg p-4 space-y-2" style={{ background: '#0d1821', border: '1px solid #1e2e3c' }}>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400 gap-3">
                    <span className="shrink-0">Discount (₵)</span>
                    <input
                      type="number"
                      aria-label="Discount amount"
                      className="admin-input text-xs w-28 text-right"
                      placeholder="0.00"
                      value={numVal(form.discount)}
                      min={0}
                      step="any"
                      onChange={e => {
                        const n = e.target.value === '' ? 0 : parseFloat(e.target.value)
                        setF('discount', isNaN(n) ? 0 : n)
                      }}
                    />
                  </div>
                  <div className="flex justify-between font-bold text-white" style={{ borderTop: '1px solid #1e2e3c', paddingTop: '8px' }}>
                    <span>Total</span><span style={{ color: 'var(--gold)' }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #1e2e3c' }}>
              <button type="button" onClick={save} disabled={saving} className="btn-gold flex-1 py-2.5 text-sm">
                {saving ? 'Saving…' : modal.editId ? 'Update Invoice' : 'Create Invoice'}
              </button>
              <button type="button" onClick={closeModal} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300 hover:text-white" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {printInvoice && (
        <InvoicePrintModal
          invoice={printInvoice}
          createdByName={currentUserName}
          onClose={() => setPrintInvoice(null)}
        />
      )}
    </div>
  )
}
