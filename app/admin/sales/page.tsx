import { createClient } from '@/lib/supabase/server'
import SalesClient from './SalesClient'

export default async function SalesPage() {
  const supabase = await createClient()

  const [{ data: sales }, { data: { user } }] = await Promise.all([
    supabase.from('sales').select('*, sale_items(*)').order('created_at', { ascending: false }).limit(200),
    supabase.auth.getUser(),
  ])

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  return <SalesClient sales={sales || []} role={profile?.role || 'staff'} />
}
