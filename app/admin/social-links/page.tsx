import { createClient } from '@/lib/supabase/server'
import SocialLinksClient from './SocialLinksClient'

export default async function SocialLinksPage() {
  const supabase = await createClient()
  const { data: links } = await supabase.from('social_links').select('*').order('sort_order')
  return <SocialLinksClient links={links || []} />
}
