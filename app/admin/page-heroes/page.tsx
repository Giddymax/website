import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PageHeroesClient from './PageHeroesClient'

export default async function PageHeroesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/admin')

  const { data: heroes } = await supabase
    .from('page_heroes')
    .select('*')
    .order('label')

  return <PageHeroesClient heroes={heroes || []} />
}
