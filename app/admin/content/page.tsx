import { createClient } from '@/lib/supabase/server'
import ContentClient from './ContentClient'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data: content } = await supabase.from('site_content').select('*').order('section').order('key')
  return <ContentClient content={content || []} />
}
