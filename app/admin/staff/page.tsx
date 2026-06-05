import { createClient } from '@/lib/supabase/server'
import StaffClient from './StaffClient'

export default async function StaffPage() {
  const supabase = await createClient()
  const [{ data: staff }, { data: { user } }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])
  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  return (
    <StaffClient
      staff={staff || []}
      currentUserId={user?.id || ''}
      currentRole={profile?.role || 'staff'}
    />
  )
}
