import { createClient } from '@/lib/supabase/server'
import GalleryAdminClient from './GalleryAdminClient'

export default async function GalleryAdminPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('gallery_items').select('*').order('sort_order')
  return <GalleryAdminClient items={items || []} />
}
