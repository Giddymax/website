import { createClient } from '@/lib/supabase/server'
import StaffClient from './StaffClient'

export default async function StaffPage() {
  const supabase = await createClient()
  const { data: staff } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  const { data: { user } } = await supabase.auth.getUser()
  return <StaffClient staff={staff || []} currentUserId={user?.id || ''} />
}
