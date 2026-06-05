import { createClient } from '@/lib/supabase/server'
import InventoryClient from './InventoryClient'

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('inventory_items').select('*').order('category').order('name')
  return <InventoryClient items={items || []} />
}
