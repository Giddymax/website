import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/admin')

  const { data: sales } = await supabase
    .from('sales')
    .select(`
      id, sale_ref, customer_name, customer_phone,
      total, subtotal, discount, status, created_at,
      sale_items (
        id, item_name, quantity, unit, unit_price, line_total, inventory_item_id,
        inventory_items ( cost_price )
      )
    `)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })

  return <AnalyticsClient sales={sales ?? []} />
}
