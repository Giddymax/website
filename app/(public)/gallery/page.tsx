import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Gallery | K.K. Danny Enterprise',
  description: 'See our yard, stock, store, and delivery vehicle at K.K. Danny Enterprise, Adeiso.',
}

const FALLBACK = [
  '/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.00.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.06.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.10.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.15.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.21.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.24.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.25.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 00.49.37.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 00.49.37 (1).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 00.49.37 (2).jpeg',
  '/images/WhatsApp Image 2026-06-04 at 00.49.38.jpeg',
  '/images/WhatsApp Image 2026-06-04 at 00.49.38 (1).jpeg',
]

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: gallery } = await supabase.from('gallery_items').select('*').eq('is_active', true).order('sort_order')

  const items = (gallery && gallery.length > 0)
    ? gallery
    : FALLBACK.map((src, i) => ({ id: String(i), image_url: src, label: null, category: null, sort_order: i, is_active: true, created_at: '', updated_at: '' }))

  return (
    <>
      <PageHero
        slug="gallery"
        defaultLabel="Our Yard & Store"
        defaultHeading="Photo Gallery"
        defaultDescription="A look inside K.K. Danny Enterprise — our stock, yard, store interior, and delivery."
      />
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {items.map(item => (
              <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={item.image_url} alt={item.label || 'K.K. Danny Enterprise'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                {item.label && (
                  <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}>
                    <span className="text-white text-sm font-medium">{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12" style={{ background: 'var(--gold)' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-extrabold text-black mb-3">Come Visit Us In Adeiso</h2>
          <p className="text-black/70 text-sm mb-5">Opp. Radiance Gas Filling Station, Near Point 3 Hotel</p>
          <Link href="/contact" className="bg-black text-white font-bold text-sm uppercase tracking-wide px-8 py-3 rounded">Get Directions</Link>
        </div>
      </section>
    </>
  )
}
