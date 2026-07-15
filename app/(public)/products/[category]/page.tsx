import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

const CATEGORY_MAP: Record<string, string> = {
  'cement-concrete': 'Cement & Concrete',
  'steel-reinforcement': 'Steel & Reinforcement',
  'roofing-materials': 'Roofing Materials',
  'paint-finishes': 'Paint & Finishes',
  'tiles-flooring': 'Tiles & Flooring',
  'timber-lumber': 'Timber & Lumber',
  'hardware-fasteners': 'Hardware & Fasteners',
  'tools-equipment': 'Tools & Equipment',
  'wire-mesh': 'Wire & Mesh',
  'pipes-plumbing': 'Pipes & Plumbing',
  'delivery-service': 'Delivery Service',
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const name = CATEGORY_MAP[category] || category
  return {
    title: `${name} | K.K. Danny Enterprise`,
    description: `Browse ${name} products at K.K. Danny Enterprise in Adeiso, Ghana.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const categoryName = CATEGORY_MAP[category] || category.replace(/-/g, ' ')
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('inventory_items').select('*')
    .ilike('category', `%${categoryName}%`)
    .eq('is_active', true)
    .order('sort_order')
    .order('name')

  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: '#8a9ba8' }}>
            <ArrowLeft size={14} /> All Products
          </Link>
          <span className="section-label">{categoryName}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">{categoryName}</h1>
        </div>
      </div>
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="card">
                {p.image_url && (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--heading-dark)' }}>{p.name}</h3>
                  {p.description && <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{p.description}</p>}
                  {p.price > 0 && <p className="font-bold text-sm mb-3" style={{ color: 'var(--gold)' }}>₵{p.price.toFixed(2)} / {p.unit}</p>}
                  <Link href="/quote" className="btn-gold text-xs px-5 py-2.5 w-full flex items-center justify-center gap-1">
                    Request Quote <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>No products listed yet for this category.</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>We carry a wide range — call us for availability and pricing.</p>
            <div className="flex gap-3 justify-center">
              <a href="tel:+233244754803" className="btn-gold">Call 0244754803</a>
              <Link href="/quote" className="btn-outline-gold">Request a Quote</Link>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
