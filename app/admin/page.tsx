import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { BarChart3, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react'
import RevenueChart from './RevenueChart'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { data: salesData },
    { data: pendingQuotes },
    { data: allInventory },
    { data: recentSales },
  ] = await Promise.all([
    supabase.from('sales').select('total, status').neq('status', 'cancelled'),
    supabase.from('quote_requests').select('id').eq('status', 'new'),
    supabase.from('inventory_items').select('id, name, stock_quantity, low_stock_threshold, is_service').eq('is_active', true),
    supabase.from('sales').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(8),
  ])

  const lowStock = (allInventory || []).filter(
    item => !item.is_service && item.stock_quantity <= item.low_stock_threshold
  )

  const totalRevenue = salesData?.reduce((sum, s) => sum + (s.total || 0), 0) || 0
  const totalSales = salesData?.length || 0
  const pendingCount = pendingQuotes?.length || 0
  const lowStockCount = lowStock?.length || 0

  // Build 6-month chart data manually if RPC unavailable
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { month: months[d.getMonth()], revenue: 0 }
  })
  if (recentSales) {
    recentSales.forEach(sale => {
      const d = new Date(sale.created_at)
      const key = months[d.getMonth()]
      const idx = chartData.findIndex(c => c.month === key)
      if (idx >= 0) chartData[idx].revenue += sale.total || 0
    })
  }

  const STATS = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: '#C8960C', bg: 'rgba(200,150,12,0.1)' },
    { label: 'Total Sales', value: String(totalSales), icon: BarChart3, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    { label: 'Pending Quotes', value: String(pendingCount), icon: MessageSquare, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { label: 'Low Stock Items', value: String(lowStockCount), icon: AlertTriangle, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl p-5" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8a9ba8' }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <h2 className="text-white font-bold mb-4">Revenue — Last 6 Months</h2>
          <RevenueChart data={chartData} />
        </div>
        <div className="rounded-xl p-5 space-y-3" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <h2 className="text-white font-bold mb-2">Quick Actions</h2>
          {[
            { label: 'New Sale (POS)', href: '/admin/pos', color: 'var(--gold)', textColor: '#000' },
            { label: 'View Quotes', href: '/admin/quotes', color: '#1e2e3c', textColor: '#e8edf2' },
            { label: 'Manage Inventory', href: '/admin/inventory', color: '#1e2e3c', textColor: '#e8edf2' },
            { label: 'Add Blog Post', href: '/admin/blog', color: '#1e2e3c', textColor: '#e8edf2' },
            { label: 'Manage Hero Slides', href: '/admin/hero-slides', color: '#1e2e3c', textColor: '#e8edf2' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center justify-between px-4 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ background: a.color, color: a.textColor }}>
              {a.label} <span>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStock && lowStock.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: '#f87171' }} />
            <h2 className="font-bold text-sm" style={{ color: '#f87171' }}>Low Stock Alert</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm" style={{ background: '#0d1821' }}>
                <span className="text-gray-300">{item.name}</span>
                <span className="font-bold" style={{ color: '#f87171' }}>{item.stock_quantity} left</span>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="mt-3 inline-block text-xs font-bold uppercase tracking-wide" style={{ color: '#f87171' }}>
            Manage Inventory →
          </Link>
        </div>
      )}

      {/* Recent Sales */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
          <h2 className="text-white font-bold">Recent Sales</h2>
          <Link href="/admin/sales" className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--gold)' }}>View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Ref', 'Customer', 'Method', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSales?.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--gold)' }}>{sale.sale_ref}</td>
                  <td className="px-4 py-3 text-gray-300">{sale.customer_name || 'Walk-in'}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{sale.payment_method?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-bold text-white">{formatCurrency(sale.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${sale.status === 'completed' ? 'bg-green-900/40 text-green-400' : sale.status === 'partial' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-red-900/40 text-red-400'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(sale.created_at)}</td>
                </tr>
              ))}
              {(!recentSales || recentSales.length === 0) && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No sales yet. <Link href="/admin/pos" className="underline" style={{ color: 'var(--gold)' }}>Create your first sale</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
