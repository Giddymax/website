'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, generateSaleRef, PAYMENT_METHODS } from '@/lib/utils'
import { Plus, Minus, X, Search, ShoppingCart, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import ReceiptModal from '@/components/admin/ReceiptModal'
import type { InventoryItem, Sale, SaleItem } from '@/types/database'

interface CartItem extends InventoryItem {
  quantity: number
  line_total: number
}

interface Props {
  inventory: InventoryItem[]
  staffId: string
  staffName: string
}

export default function POSClient({ inventory, staffId, staffName }: Props) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [discount, setDiscount] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState<{ sale: Sale; items: SaleItem[] } | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(inventory.map(i => i.category)))]

  const filtered = inventory.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const subtotal = cart.reduce((s, i) => s + i.line_total, 0)
  const total = Math.max(0, subtotal - discount)
  const changeDue = amountPaid > total ? amountPaid - total : 0
  const balanceDue = amountPaid < total ? total - amountPaid : 0

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id)
      if (existing) {
        return prev.map(c => c.id === item.id
          ? { ...c, quantity: c.quantity + 1, line_total: (c.quantity + 1) * c.price }
          : c)
      }
      return [...prev, { ...item, quantity: 1, line_total: item.price }]
    })
  }

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setCart(prev => prev.map(c => c.id === id
      ? { ...c, quantity: qty, line_total: qty * c.price } : c))
  }

  const removeItem = (id: string) => setCart(prev => prev.filter(c => c.id !== id))

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return }
    if (amountPaid <= 0) { toast.error('Enter amount paid'); return }
    setLoading(true)
    const supabase = createClient()
    const sale_ref = generateSaleRef()

    const status = amountPaid >= total ? 'completed' : 'partial'

    const { data: saleData, error: saleError } = await supabase
      .from('sales').insert([{
        sale_ref,
        customer_name: customer.name || null,
        customer_phone: customer.phone || null,
        payment_method: payMethod,
        subtotal,
        discount,
        total,
        amount_paid: amountPaid,
        change_due: changeDue,
        balance_due: balanceDue,
        status,
        notes: notes || null,
        served_by: staffId,
      }]).select().single()

    if (saleError || !saleData) {
      toast.error('Failed to record sale')
      setLoading(false)
      return
    }

    const saleItems = cart.map(c => ({
      sale_id: saleData.id,
      inventory_item_id: c.id,
      item_name: c.name,
      unit: c.unit,
      quantity: c.quantity,
      unit_price: c.price,
      line_total: c.line_total,
    }))

    await supabase.from('sale_items').insert(saleItems)

    // Decrement stock for non-services
    for (const c of cart) {
      if (!c.is_service) {
        await supabase.from('inventory_items')
          .update({ stock_quantity: Math.max(0, c.stock_quantity - c.quantity) })
          .eq('id', c.id)
      }
    }

    toast.success(`Sale ${sale_ref} recorded!`)
    setReceipt({
      sale: { ...saleData, served_by: staffId } as Sale,
      items: saleItems.map((si, i) => ({ ...si, id: String(i), created_at: new Date().toISOString() })) as SaleItem[],
    })

    setCart([])
    setCustomer({ name: '', phone: '' })
    setDiscount(0)
    setAmountPaid(0)
    setNotes('')
    setLoading(false)
  }, [cart, amountPaid, total, customer, payMethod, subtotal, discount, changeDue, balanceDue, notes, staffId])

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[calc(100vh-8rem)] overflow-x-hidden">
      {/* Left: Product Picker */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="admin-input pl-9" placeholder="Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === cat ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              style={activeCategory === cat ? { background: 'var(--gold)' } : { background: '#1e2a35', border: '1px solid #374d5e' }}>
              {cat}
            </button>
          ))}
        </div>
        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 overflow-y-auto flex-1">
          {filtered.map(item => (
            <button key={item.id} onClick={() => addToCart(item)}
              className="rounded-lg p-3 text-left transition-all hover:ring-1 active:scale-95"
              style={{ background: '#1e2a35', border: '1px solid #2d3f4e', '--tw-ring-color': 'var(--gold)' } as React.CSSProperties}>
              <div className="text-xs font-semibold text-white mb-1 leading-tight">{item.name}</div>
              <div className="text-xs text-gray-500 mb-2">{item.category}</div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm" style={{ color: 'var(--gold)' }}>{formatCurrency(item.price)}/{item.unit}</span>
                {!item.is_service && (
                  <span className={`text-[10px] font-semibold ${item.stock_quantity <= item.low_stock_threshold ? 'text-red-400' : 'text-green-400'}`}>
                    {item.stock_quantity} {item.unit}
                  </span>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 py-12 text-center text-gray-500 text-sm">No items match</div>
          )}
        </div>
      </div>

      {/* Right: Cart + Checkout */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-3">
        <div className="rounded-xl flex flex-col flex-1" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #1e2e3c' }}>
            <ShoppingCart size={16} style={{ color: 'var(--gold)' }} />
            <span className="font-bold text-white text-sm">Cart ({cart.length})</span>
          </div>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto max-h-64 px-3 py-2 space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#0d1821' }}>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{item.name}</div>
                  <div className="text-gray-500 text-[10px]">{formatCurrency(item.price)}/{item.unit}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-white/10">
                    <Minus size={10} />
                  </button>
                  <span className="text-white text-xs w-6 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-white/10">
                    <Plus size={10} />
                  </button>
                </div>
                <div className="text-white text-xs font-bold w-16 text-right">{formatCurrency(item.line_total)}</div>
                <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 ml-1">
                  <X size={13} />
                </button>
              </div>
            ))}
            {cart.length === 0 && <p className="text-center py-8 text-gray-600 text-sm">Add items from the left</p>}
          </div>

          {/* Customer + Payment */}
          <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid #1e2e3c', paddingTop: '12px' }}>
            <div className="grid grid-cols-2 gap-2">
              <input className="admin-input text-xs" placeholder="Customer name" value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} />
              <input className="admin-input text-xs" placeholder="Phone" value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <select className="admin-select text-xs" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Discount (₵)</label>
                <input type="number" className="admin-input text-xs" value={discount || ''} onChange={e => setDiscount(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block">Amount Paid (₵)</label>
                <input type="number" className="admin-input text-xs" value={amountPaid || ''} onChange={e => setAmountPaid(Number(e.target.value))} min={0} />
              </div>
            </div>
            <textarea className="admin-input text-xs resize-none" rows={2} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />

            {/* Totals */}
            <div className="space-y-1 text-sm" style={{ borderTop: '1px solid #1e2e3c', paddingTop: '10px' }}>
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && <div className="flex justify-between text-yellow-400">
                <span>Discount</span><span>-{formatCurrency(discount)}</span>
              </div>}
              <div className="flex justify-between text-white font-bold text-base">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
              {amountPaid > 0 && (
                <>
                  <div className="flex justify-between text-green-400">
                    <span>Paid</span><span>{formatCurrency(amountPaid)}</span>
                  </div>
                  {changeDue > 0 && <div className="flex justify-between font-bold" style={{ color: 'var(--gold)' }}>
                    <span>Change Due</span><span>{formatCurrency(changeDue)}</span>
                  </div>}
                  {balanceDue > 0 && <div className="flex justify-between font-bold text-red-400">
                    <span>Balance Due</span><span>{formatCurrency(balanceDue)}</span>
                  </div>}
                </>
              )}
            </div>

            <button onClick={handleCheckout} disabled={loading || cart.length === 0}
              className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Processing…' : <><Printer size={15} /> Complete Sale & Print Receipt</>}
            </button>
          </div>
        </div>
      </div>

      {receipt && (
        <ReceiptModal
          sale={receipt.sale}
          items={receipt.items}
          staffName={staffName}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
