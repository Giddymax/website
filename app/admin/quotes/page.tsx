import { createClient } from '@/lib/supabase/server'
import QuotesClient from './QuotesClient'

export default async function QuotesPage() {
  const supabase = await createClient()
  const { data: quotes } = await supabase
    .from('quote_requests').select('*').order('created_at', { ascending: false })
  return <QuotesClient quotes={quotes || []} />
}
