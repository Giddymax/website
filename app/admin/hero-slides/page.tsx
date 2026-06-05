import { createClient } from '@/lib/supabase/server'
import HeroSlidesClient from './HeroSlidesClient'

export default async function HeroSlidesPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase.from('hero_slides').select('*').order('sort_order')
  return <HeroSlidesClient slides={slides || []} />
}
