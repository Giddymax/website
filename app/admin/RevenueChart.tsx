'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  data: { month: string; revenue: number }[]
}

export default function RevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2e3c" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#4a6175', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#4a6175', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₵${(v/1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ background: '#15212c', border: '1px solid #1e2e3c', borderRadius: '8px', color: '#e8edf2' }}
          formatter={(value: number) => [`₵${value.toLocaleString()}`, 'Revenue']}
          cursor={{ fill: 'rgba(200,150,12,0.08)' }}
        />
        <Bar dataKey="revenue" fill="#C8960C" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}
