import { createClient } from '@/lib/supabase/server'
import InvoicesClient from './InvoicesClient'

export default async function InvoicesPage() {
  const supabase = await createClient()

  const [{ data: invoices }, { data: { user } }] = await Promise.all([
    supabase
      .from('invoices')
      .select('*, invoice_items(*), profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(300),
    supabase.auth.getUser(),
  ])

  const { data: profile } = user
    ? await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
    : { data: null }

  return (
    <InvoicesClient
      invoices={invoices || []}
      currentUserId={user?.id || ''}
      currentUserName={profile?.full_name || user?.email || ''}
      role={profile?.role || 'staff'}
    />
  )
}
