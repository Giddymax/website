import { createClient } from '@/lib/supabase/server'
import InvoicesClient from './InvoicesClient'

export default async function InvoicesPage() {
  const supabase = await createClient()

  const [{ data: invoices }, { data: inventory }, { data: { user } }] = await Promise.all([
    supabase
      .from('invoices')
      .select('*, invoice_items(*), profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(300),
    supabase
      .from('inventory_items')
      .select('id, name, price, unit, category')
      .eq('is_active', true)
      .eq('is_service', false)
      .order('name'),
    supabase.auth.getUser(),
  ])

  const { data: profile } = user
    ? await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
    : { data: null }

  return (
    <InvoicesClient
      invoices={invoices || []}
      inventoryItems={inventory || []}
      currentUserId={user?.id || ''}
      currentUserName={profile?.full_name || user?.email || ''}
      role={profile?.role || 'staff'}
    />
  )
}
