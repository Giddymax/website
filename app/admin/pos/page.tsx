import { createClient } from '@/lib/supabase/server'
import POSClient from './POSClient'

export default async function POSPage() {
  const supabase = await createClient()
  const { data: inventory } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name')
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user!.id).single()

  return <POSClient inventory={inventory || []} staffId={user!.id} staffName={profile?.full_name || user!.email || ''} />
}
