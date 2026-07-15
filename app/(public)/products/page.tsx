import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 3600
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Products | K.K. Danny Enterprise',
  description: 'Browse all building materials at K.K. Danny Enterprise — cement, steel, roofing, paint, tiles, timber, hardware, tools, pipes, and more.',
}

const CATEGORIES = [
  { name: 'Cement & Concrete', slug: 'cement-concrete', img: '/images/WhatsApp Image 2026-06-03 at 17.27.10.jpeg' },
  { name: 'Steel & Reinforcement', slug: 'steel-reinforcement', img: '/images/WhatsApp Image 2026-06-03 at 17.27.00.jpeg' },
  { name: 'Roofing Materials', slug: 'roofing-materials', img: '/images/WhatsApp Image 2026-06-04 at 00.49.37 (2).jpeg' },
  { name: 'Paint & Finishes', slug: 'paint-finishes', img: '/images/WhatsApp Image 2026-06-03 at 17.27.21.jpeg' },
  { name: 'Tiles & Flooring', slug: 'tiles-flooring', img: '/images/WhatsApp Image 2026-06-03 at 17.27.15.jpeg' },
  { name: 'Timber & Lumber', slug: 'timber-lumber', img: '/images/WhatsApp Image 2026-06-04 at 00.49.37 (1).jpeg' },
  { name: 'Hardware & Fasteners', slug: 'hardware-fasteners', img: '/images/WhatsApp Image 2026-06-04 at 00.49.38.jpeg' },
  { name: 'Tools & Equipment', slug: 'tools-equipment', img: '/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg' },
  { name: 'Wire & Mesh', slug: 'wire-mesh', img: '/images/WhatsApp Image 2026-06-03 at 17.27.25.jpeg' },
  { name: 'Pipes & Plumbing', slug: 'pipes-plumbing', img: '/images/WhatsApp Image 2026-06-03 at 17.27.24.jpeg' },
  { name: 'Delivery Service', slug: 'delivery-service', img: '/images/WhatsApp Image 2026-06-04 at 00.49.38 (1).jpeg' },
]

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('inventory_items').select('*').eq('is_active', true).order('sort_order').order('name')

  return (
    <>
      <PageHero
        slug="products"
        defaultLabel="Everything You Need"
        defaultHeading="Our Products"
        defaultDescription="From foundations to finishes — fully stocked building materials for every project stage."
      />

      {/* Category Grid */}
      <section className="py-14 sm:py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold mb-8" style={{ color: 'var(--heading-dark)' }}>Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="relative h-36 overflow-hidden">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(21,33,44,0.6), transparent)' }} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: 'var(--heading-dark)' }}>{cat.name}</span>
                  <ArrowRight size={16} style={{ color: 'var(--gold)' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products List */}
      {products && products.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold mb-8" style={{ color: 'var(--heading-dark)' }}>All Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="card">
                  {p.image_url && (
                    <div className="relative h-40 overflow-hidden">
                      <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(200,150,12,0.12)', color: 'var(--gold)' }}>{p.category}</span>
                    <h3 className="font-bold mt-2 mb-1" style={{ color: 'var(--heading-dark)' }}>{p.name}</h3>
                    {p.description && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.description}</p>}
                    {p.price > 0 && <p className="mt-2 font-bold" style={{ color: 'var(--gold)' }}>₵{p.price.toFixed(2)} / {p.unit}</p>}
                    <Link href="/quote" className="mt-3 text-xs font-bold tracking-wider uppercase flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                      Request Quote <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12" style={{ background: 'var(--gold)' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-extrabold text-black mb-3">Can&apos;t find what you need?</h2>
          <p className="text-black/70 text-sm mb-5">Call us or submit a quote request — we source on demand.</p>
          <Link href="/quote" className="bg-black text-white font-bold text-sm uppercase tracking-wide px-8 py-3 rounded">Request a Quote</Link>
        </div>
      </section>
    </>
  )
}
