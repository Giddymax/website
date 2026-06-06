import { createClient } from '@/lib/supabase/server'
import QuotesClient from './QuotesClient'

export default async function QuotesPage() {
  const supabase = await createClient()

  const [{ data: quotes }, { data: { user } }] = await Promise.all([
    supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  return <QuotesClient quotes={quotes || []} role={profile?.role || 'staff'} />
}
