import { createClient } from '@/lib/supabase/server'
import ProductsAdminClient from './ProductsAdminClient'

export default async function ProductsAdminPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('*').order('sort_order')
  return <ProductsAdminClient products={products || []} />
}
