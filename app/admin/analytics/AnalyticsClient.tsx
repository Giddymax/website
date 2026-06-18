'use client'
import { useMemo, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Printer, TrendingUp, TrendingDown, Package, Users, ShoppingCart, DollarSign, BarChart2 } from 'lucide-react'

type SaleItem = {
  id: string
  item_name: string
  quantity: number
  unit: string
  unit_price: number
  line_total: number
  inventory_item_id: string | null
  inventory_items: { cost_price: number }[] | null
}

type Sale = {
  id: string
  sale_ref: string
  customer_name: string | null
  customer_phone: string | null
  total: number
  subtotal: number
  discount: number
  balance_due: number
  status: string
  created_at: string
  sale_items: SaleItem[]
}

interface Props { sales: Sale[] }

type Preset = '7d' | '30d' | 'month' | 'year' | 'all' | 'custom'

const PRESETS: { key: Preset; label: string }[] = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom' },
]

function startOf(preset: Preset): Date {
  const now = new Date()
  if (preset === '7d') { const d = new Date(now); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d }
  if (preset === '30d') { const d = new Date(now); d.setDate(d.getDate() - 29); d.setHours(0, 0, 0, 0); return d }
  if (preset === 'month') { return new Date(now.getFullYear(), now.getMonth(), 1) }
  if (preset === 'year') { return new Date(now.getFullYear(), 0, 1) }
  return new Date(0)
}

function presetLabel(preset: Preset, from: string, to: string) {
  if (preset === 'custom') return `${from} → ${to}`
  return PRESETS.find(p => p.key === preset)?.label ?? ''
}

function Bar({ pct, color = 'var(--gold)' }: { pct: number; color?: string }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2e3c' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(pct, 0)}%`, background: color }} />
    </div>
  )
}

export default function AnalyticsClient({ sales }: Props) {
  const [preset, setPreset] = useState<Preset>('month')
  const [customFrom, setCustomFrom] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10)
  })
  const [customTo, setCustomTo] = useState(() => new Date().toISOString().slice(0, 10))

  const { filtered, stats } = useMemo(() => {
    const start = preset === 'custom' ? new Date(customFrom + 'T00:00:00') : startOf(preset)
    const end = preset === 'custom' ? new Date(customTo + 'T23:59:59') : new Date()

    const filtered = sales.filter(s => {
      const d = new Date(s.created_at)
      return d >= start && d <= end
    })

    let totalRevenue = 0
    let totalCost = 0
    let totalUnsettled = 0
    let totalItemsSold = 0
    const itemMap = new Map<string, { name: string; qty: number; revenue: number; cost: number; profit: number }>()
    const custMap = new Map<string, { name: string; count: number; spend: number; phone: string }>()

    for (const sale of filtered) {
      totalRevenue += sale.total
      totalUnsettled += sale.balance_due ?? 0

      const custKey = sale.customer_name?.trim() || 'Walk-in'
      const cust = custMap.get(custKey) ?? { name: custKey, count: 0, spend: 0, phone: sale.customer_phone || '' }
      cust.count++
      cust.spend += sale.total
      custMap.set(custKey, cust)

      for (const item of sale.sale_items) {
        const costPrice = item.inventory_items?.[0]?.cost_price || item.unit_price
        const cost = item.quantity * costPrice
        const profit = item.line_total - cost
        totalCost += cost
        totalItemsSold += item.quantity

        const existing = itemMap.get(item.item_name) ?? { name: item.item_name, qty: 0, revenue: 0, cost: 0, profit: 0 }
        existing.qty += item.quantity
        existing.revenue += item.line_total
        existing.cost += cost
        existing.profit += profit
        itemMap.set(item.item_name, existing)
      }
    }

    const collectedRevenue = totalRevenue - totalUnsettled
    const totalProfit = totalRevenue - totalCost
    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const items = Array.from(itemMap.values())
    const customers = Array.from(custMap.values())

    return {
      filtered,
      stats: {
        totalRevenue,
        collectedRevenue,
        totalUnsettled,
        totalCost,
        totalProfit,
        margin,
        salesCount: filtered.length,
        totalItemsSold,
        mostSold: [...items].sort((a, b) => b.qty - a.qty).slice(0, 10),
        leastSold: [...items].sort((a, b) => a.qty - b.qty).slice(0, 10),
        highestProfit: [...items].sort((a, b) => b.profit - a.profit).slice(0, 10),
        bestCustomers: [...customers].sort((a, b) => b.spend - a.spend).slice(0, 10),
      },
    }
  }, [sales, preset, customFrom, customTo])

  function handlePrint() {
    const periodStr = presetLabel(preset, customFrom, customTo)
    const now = new Date().toLocaleString('en-GH')
    const base = window.location.origin

    const rows = (arr: { name: string; qty?: number; revenue?: number; cost?: number; profit?: number; margin?: number; spend?: number; count?: number }[], cols: string[]) =>
      arr.map((r, i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
          <td>${i + 1}</td>
          <td>${r.name}</td>
          ${r.qty !== undefined ? `<td style="text-align:right">${r.qty.toFixed(1)}</td>` : ''}
          ${r.revenue !== undefined ? `<td style="text-align:right">${formatCurrency(r.revenue)}</td>` : ''}
          ${r.cost !== undefined ? `<td style="text-align:right">${formatCurrency(r.cost)}</td>` : ''}
          ${r.profit !== undefined ? `<td style="text-align:right;color:${(r.profit ?? 0) >= 0 ? '#065f46' : '#991b1b'}">${formatCurrency(r.profit ?? 0)}</td>` : ''}
          ${r.spend !== undefined ? `<td style="text-align:right">${formatCurrency(r.spend)}</td>` : ''}
          ${r.count !== undefined ? `<td style="text-align:right">${r.count}</td>` : ''}
        </tr>`).join('')

    const tableStyle = 'width:100%;border-collapse:collapse;margin-bottom:24px;font-size:11px'
    const thStyle = 'background:#1e293b;color:#fff;padding:6px 8px;text-align:left;font-size:10px;text-transform:uppercase'
    const tdStyle = 'padding:6px 8px;border-bottom:1px solid #e5e7eb'

    const win = window.open('', '_blank', 'width=900,height=750')
    if (!win) return
    win.document.write(`<html><head>
      <title>Analytics — K.K. Danny Enterprise</title>
      <base href="${base}/">
      <style>
        * { box-sizing: border-box; }
        @page { size: A4; margin: 15mm 18mm; }
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000; background: #fff; margin: 0; padding: 0; }
        .cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 24px; }
        .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; }
        .card-label { font-size: 9px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; }
        .card-value { font-size: 18px; font-weight: bold; margin-top: 4px; }
        table { ${tableStyle} }
        th { ${thStyle} }
        td { ${tdStyle} }
        h2 { font-size: 13px; font-weight: bold; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 2px solid #1e293b; }
        .profit-pos { color: #065f46; }
        .profit-neg { color: #991b1b; }
      </style>
    </head><body>
      <table style="width:100%;margin-bottom:16px;border:none"><tbody><tr>
        <td style="vertical-align:top;border:none;padding:0">
          <img src="/logo.png" style="max-width:56px;height:auto;margin-bottom:6px;display:block" />
          <div style="font-weight:bold;font-size:16px">K.K. DANNY ENTERPRISE</div>
          <div style="color:#6b7280;font-size:11px">Business Analytics Report</div>
        </td>
        <td style="text-align:right;vertical-align:top;border:none;padding:0">
          <div style="font-size:11px;color:#6b7280">Period: <strong>${periodStr}</strong></div>
          <div style="font-size:11px;color:#6b7280">Generated: ${now}</div>
          <div style="font-size:11px;color:#6b7280">Sales analysed: ${stats.salesCount}</div>
        </td>
      </tr></tbody></table>

      <div class="cards">
        <div class="card"><div class="card-label">Total Revenue</div><div class="card-value">${formatCurrency(stats.totalRevenue)}</div></div>
        <div class="card"><div class="card-label">Collected Revenue</div><div class="card-value profit-pos">${formatCurrency(stats.collectedRevenue)}</div>${stats.totalUnsettled > 0 ? `<div style="font-size:9px;color:#991b1b;margin-top:2px">${formatCurrency(stats.totalUnsettled)} unsettled</div>` : ''}</div>
        <div class="card"><div class="card-label">Cost of Goods</div><div class="card-value">${formatCurrency(stats.totalCost)}</div></div>
        <div class="card"><div class="card-label">Gross Profit</div><div class="card-value ${stats.totalProfit >= 0 ? 'profit-pos' : 'profit-neg'}">${formatCurrency(stats.totalProfit)}</div></div>
        <div class="card"><div class="card-label">Profit Margin</div><div class="card-value">${stats.margin.toFixed(1)}%</div></div>
        <div class="card"><div class="card-label">Total Sales</div><div class="card-value">${stats.salesCount}</div></div>
        <div class="card"><div class="card-label">Items Sold</div><div class="card-value">${stats.totalItemsSold.toFixed(0)}</div></div>
      </div>

      <h2>Most Sold Items (by quantity)</h2>
      <table><thead><tr>
        <th style="${thStyle}">#</th><th style="${thStyle}">Item</th><th style="${thStyle};text-align:right">Qty Sold</th><th style="${thStyle};text-align:right">Revenue</th><th style="${thStyle};text-align:right">Cost</th><th style="${thStyle};text-align:right">Profit/Loss</th>
      </tr></thead><tbody>${rows(stats.mostSold, [])}</tbody></table>

      <h2>Highest Profit Items</h2>
      <table><thead><tr>
        <th style="${thStyle}">#</th><th style="${thStyle}">Item</th><th style="${thStyle};text-align:right">Qty Sold</th><th style="${thStyle};text-align:right">Revenue</th><th style="${thStyle};text-align:right">Cost</th><th style="${thStyle};text-align:right">Profit/Loss</th>
      </tr></thead><tbody>${rows(stats.highestProfit, [])}</tbody></table>

      <h2>Lowest Sold Items (by quantity)</h2>
      <table><thead><tr>
        <th style="${thStyle}">#</th><th style="${thStyle}">Item</th><th style="${thStyle};text-align:right">Qty Sold</th><th style="${thStyle};text-align:right">Revenue</th><th style="${thStyle};text-align:right">Cost</th><th style="${thStyle};text-align:right">Profit/Loss</th>
      </tr></thead><tbody>${rows(stats.leastSold, [])}</tbody></table>

      <h2>Best Customers (by total spend)</h2>
      <table><thead><tr>
        <th style="${thStyle}">#</th><th style="${thStyle}">Customer</th><th style="${thStyle};text-align:right">Total Spend</th><th style="${thStyle};text-align:right">Purchases</th>
      </tr></thead><tbody>${rows(stats.bestCustomers, [])}</tbody></table>
    </body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const maxQty = Math.max(...stats.mostSold.map(i => i.qty), 1)
  const maxProfit = Math.max(...stats.highestProfit.map(i => i.profit), 1)
  const maxSpend = Math.max(...stats.bestCustomers.map(c => c.spend), 1)
  const maxLeastQty = Math.max(...stats.leastSold.map(i => i.qty), 1)

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${preset === p.key ? 'text-black' : 'text-gray-400 hover:text-white'}`}
              style={preset === p.key ? { background: 'var(--gold)' } : { background: '#1e2a35', border: '1px solid #374d5e' }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="btn-gold flex items-center gap-2 text-sm px-5 py-2 shrink-0"
        >
          <Printer size={14} /> Print Report
        </button>
      </div>

      {/* Custom date range */}
      {preset === 'custom' && (
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>From</span>
            <input
              type="date"
              aria-label="From date"
              className="admin-input text-xs"
              value={customFrom}
              onChange={e => setCustomFrom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>To</span>
            <input
              type="date"
              aria-label="To date"
              className="admin-input text-xs"
              value={customTo}
              onChange={e => setCustomTo(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'var(--gold)' },
          { label: 'Collected', value: formatCurrency(stats.collectedRevenue), icon: DollarSign, color: '#4ade80', sub: stats.totalUnsettled > 0 ? `${formatCurrency(stats.totalUnsettled)} unsettled` : undefined },
          { label: 'Cost of Goods', value: formatCurrency(stats.totalCost), icon: Package, color: '#94a3b8' },
          { label: 'Gross Profit', value: formatCurrency(stats.totalProfit), icon: TrendingUp, color: stats.totalProfit >= 0 ? '#4ade80' : '#f87171' },
          { label: 'Profit Margin', value: `${stats.margin.toFixed(1)}%`, icon: BarChart2, color: stats.margin >= 20 ? '#4ade80' : stats.margin >= 10 ? '#fbbf24' : '#f87171' },
          { label: 'Total Sales', value: String(stats.salesCount), icon: ShoppingCart, color: '#60a5fa' },
          { label: 'Items Sold', value: stats.totalItemsSold.toFixed(0), icon: Package, color: '#a78bfa' },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={14} style={{ color: card.color }} />
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#4a6175' }}>{card.label}</span>
            </div>
            <div className="text-lg font-extrabold text-white">{card.value}</div>
            {'sub' in card && card.sub && <div className="text-[10px] text-red-400 mt-0.5">{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Most Sold */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#0d1821', borderBottom: '1px solid #1e2e3c' }}>
            <TrendingUp size={14} style={{ color: 'var(--gold)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>Most Sold Items</span>
          </div>
          <div className="divide-y divide-[#0d1821]">
            {stats.mostSold.length === 0 && <div className="px-5 py-8 text-center text-gray-500 text-sm">No data</div>}
            {stats.mostSold.map((item, i) => (
              <div key={item.name} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold w-5 text-right shrink-0" style={{ color: '#4a6175' }}>{i + 1}</span>
                    <span className="text-sm text-white font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex gap-4 shrink-0 ml-3 text-xs">
                    <span className="text-gray-400">{item.qty.toFixed(1)} units</span>
                    <span className="font-semibold" style={{ color: 'var(--gold)' }}>{formatCurrency(item.revenue)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Bar pct={(item.qty / maxQty) * 100} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Profit */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#0d1821', borderBottom: '1px solid #1e2e3c' }}>
            <DollarSign size={14} className="text-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">Highest Profit Items</span>
          </div>
          <div className="divide-y divide-[#0d1821]">
            {stats.highestProfit.length === 0 && <div className="px-5 py-8 text-center text-gray-500 text-sm">No data</div>}
            {stats.highestProfit.map((item, i) => (
              <div key={item.name} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold w-5 text-right shrink-0" style={{ color: '#4a6175' }}>{i + 1}</span>
                    <span className="text-sm text-white font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex gap-4 shrink-0 ml-3 text-xs">
                    <span className="text-gray-400">{item.qty.toFixed(1)} units</span>
                    <span className={`font-bold ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.profit >= 0 ? '+' : ''}{formatCurrency(item.profit)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Bar pct={(Math.max(item.profit, 0) / maxProfit) * 100} color="#4ade80" />
                </div>
                {item.cost > 0 && (
                  <div className="pl-7 mt-1 text-[10px] text-gray-500">
                    Revenue {formatCurrency(item.revenue)} · Cost {formatCurrency(item.cost)} · Margin {item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : '0'}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lowest Sold */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#0d1821', borderBottom: '1px solid #1e2e3c' }}>
            <TrendingDown size={14} className="text-red-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Lowest Sold Items</span>
          </div>
          <div className="divide-y divide-[#0d1821]">
            {stats.leastSold.length === 0 && <div className="px-5 py-8 text-center text-gray-500 text-sm">No data</div>}
            {stats.leastSold.map((item, i) => (
              <div key={item.name} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold w-5 text-right shrink-0" style={{ color: '#4a6175' }}>{i + 1}</span>
                    <span className="text-sm text-white font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex gap-4 shrink-0 ml-3 text-xs">
                    <span className="text-gray-400">{item.qty.toFixed(1)} units</span>
                    <span style={{ color: 'var(--gold)' }} className="font-semibold">{formatCurrency(item.revenue)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Bar pct={(item.qty / maxLeastQty) * 100} color="#f87171" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Customers */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: '#0d1821', borderBottom: '1px solid #1e2e3c' }}>
            <Users size={14} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Best Customers</span>
          </div>
          <div className="divide-y divide-[#0d1821]">
            {stats.bestCustomers.length === 0 && <div className="px-5 py-8 text-center text-gray-500 text-sm">No data</div>}
            {stats.bestCustomers.map((cust, i) => (
              <div key={cust.name} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-bold w-5 text-right shrink-0" style={{ color: '#4a6175' }}>{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">{cust.name}</div>
                      {cust.phone && <div className="text-[10px] text-gray-500">{cust.phone}</div>}
                    </div>
                  </div>
                  <div className="flex gap-4 shrink-0 ml-3 text-xs">
                    <span className="text-gray-400">{cust.count} purchase{cust.count !== 1 ? 's' : ''}</span>
                    <span className="font-bold text-blue-400">{formatCurrency(cust.spend)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Bar pct={(cust.spend / maxSpend) * 100} color="#60a5fa" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer note */}
      <p className="text-[10px] text-gray-600 text-center pb-2">
        Profit calculations use current inventory cost prices. Items without a cost price default to their selling price (0% margin).
      </p>
    </div>
  )
}
