import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/public/HeroSlider'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Truck, Package, Star, ChevronDown, Phone, ArrowRight } from 'lucide-react'

const CATEGORIES = [
  { name: 'Cement & Concrete', slug: 'cement-concrete', icon: '🏗️', img: '/images/WhatsApp Image 2026-06-03 at 17.27.00.jpeg', desc: 'Ghacem bags, concrete mix, aggregates' },
  { name: 'Steel & Reinforcement', slug: 'steel-reinforcement', icon: '🔩', img: '/images/WhatsApp Image 2026-06-03 at 17.27.06.jpeg', desc: 'Rebar, BRC mesh, binding wire, Star Steels' },
  { name: 'Roofing Materials', slug: 'roofing-materials', icon: '🏠', img: '/images/WhatsApp Image 2026-06-04 at 00.49.37.jpeg', desc: 'Zinc, aluminium, coloured sheets, fittings' },
  { name: 'Paint & Finishes', slug: 'paint-finishes', icon: '🎨', img: '/images/WhatsApp Image 2026-06-04 at 00.49.38.jpeg', desc: 'De-Luxy acrylic paint, primers, solvents' },
  { name: 'Tiles & Flooring', slug: 'tiles-flooring', icon: '🪟', img: '/images/WhatsApp Image 2026-06-04 at 00.49.37 (1).jpeg', desc: 'Ceramic, porcelain floor & wall tiles' },
  { name: 'Hardware & Tools', slug: 'hardware-fasteners', icon: '🔧', img: '/images/WhatsApp Image 2026-06-03 at 17.27.10.jpeg', desc: 'Nails, screws, hand tools, wheelbarrows' },
]

const WHY_REASONS = [
  { icon: CheckCircle, title: 'Always In Stock', body: 'Large ready inventory so your project never stalls. From one bag to a full-site order.' },
  { icon: Star, title: 'Competitive Prices', body: 'Transparent pricing, no hidden costs. We source directly and pass the savings to you.' },
  { icon: Truck, title: 'Fast Same-Day Delivery', body: 'Delivery within Adeiso and nearby communities via our branded cargo tricycle.' },
  { icon: Package, title: 'Trusted & Reliable', body: 'Years of service to the Adeiso community. Your project success is our reputation.' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: slides }, { data: gallery }, { data: faqs }] = await Promise.all([
    supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('gallery_items').select('*').eq('is_active', true).order('sort_order').limit(8),
    supabase.from('site_content').select('*').eq('section', 'faq').order('key'),
  ])

  const faqPairs: { q: string; a: string }[] = []
  if (faqs) {
    const qItems = faqs.filter(f => f.key.endsWith('_q')).sort((a, b) => a.key.localeCompare(b.key))
    qItems.forEach(q => {
      const aKey = q.key.replace('_q', '_a')
      const answer = faqs.find(f => f.key === aKey)
      if (answer) faqPairs.push({ q: q.value || '', a: answer.value || '' })
    })
  }

  return (
    <>
      {/* HERO */}
      <HeroSlider slides={slides ?? []} />

      {/* PRODUCT CATEGORIES */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">What We Carry</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>
              Our Product Categories
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-base" style={{ color: 'var(--text-muted)' }}>
              Everything for your construction project, stocked and ready at our Adeiso yard.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="relative h-44 overflow-hidden">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(21,33,44,0.7), transparent)' }} />
                  <span className="absolute bottom-3 left-3 text-2xl">{cat.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1" style={{ color: 'var(--heading-dark)' }}>{cat.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{cat.desc}</p>
                  <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                    View Products <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products" className="btn-gold px-10">Browse All Products</Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--navy)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Why K.K. Danny</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-white">Why Choose Us</h2>
            <p className="mt-3 max-w-xl mx-auto text-base" style={{ color: '#8a9ba8' }}>
              The trusted choice for builders, contractors, and homeowners across Adeiso and the Eastern Region.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_REASONS.map(reason => (
              <div key={reason.title} className="rounded-lg p-6 text-center" style={{ background: 'var(--navy-light)', border: '1px solid #1e2e3c' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(200,150,12,0.12)' }}>
                  <reason.icon size={26} style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="text-white font-bold mb-2">{reason.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8a9ba8' }}>{reason.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="section-label">Our Yard & Store</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>
                See What We Stock
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden aspect-square group">
                  <Image src={item.image_url} alt={item.label || 'Gallery'} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                  {item.label && (
                    <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/gallery" className="btn-outline-gold">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY STRIP (fallback with real photos) */}
      {(!gallery || gallery.length === 0) && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="section-label">Our Yard & Store</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>See What We Stock</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                '/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.00.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.06.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.10.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.15.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.21.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.24.jpeg',
                '/images/WhatsApp Image 2026-06-03 at 17.27.25.jpeg',
              ].map((src, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square group">
                  <Image src={src} alt={`Gallery photo ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 25vw" />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/gallery" className="btn-outline-gold">View Full Gallery</Link>
            </div>
          </div>
        </section>
      )}

      {/* QUOTE CTA BAND */}
      <section className="py-14 sm:py-16" style={{ background: 'var(--gold)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-3">Ready to Start Your Project?</h2>
          <p className="text-black/70 mb-6 text-base max-w-xl mx-auto">
            Get a free written price quote for all your building materials. Fast turnaround, honest pricing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="bg-black text-white font-bold text-sm uppercase tracking-wide px-8 py-3 rounded hover:bg-gray-900 transition-colors">
              Request a Quote
            </Link>
            <a href="tel:+233244754803" className="bg-white text-black font-bold text-sm uppercase tracking-wide px-8 py-3 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Phone size={15} /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqPairs.length > 0 && (
        <section className="py-16 sm:py-20" style={{ background: 'var(--surface)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="section-label">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqPairs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT BAND */}
      <section style={{ background: 'var(--navy-deep)' }} className="py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">📍</div>
            <div className="text-white font-bold mb-1">Visit Us</div>
            <div className="text-sm" style={{ color: '#8a9ba8' }}>Opp. Radiance Gas Filling Station, Near Point 3 Hotel, Adeiso, Eastern Region</div>
          </div>
          <div>
            <div className="text-3xl mb-2">📞</div>
            <div className="text-white font-bold mb-1">Call Us</div>
            <div className="space-y-1">
              {['02444754803', '0249986118', '0240268125'].map(n => (
                <a key={n} href={`tel:+233${n.slice(1)}`} className="block text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>{n}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-white font-bold mb-1">Opening Hours</div>
            <div className="text-sm" style={{ color: '#8a9ba8' }}>Mon – Sat: 7am – 6pm<br />Sunday: 9am – 3pm</div>
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group card p-5 cursor-pointer">
      <summary className="flex items-center justify-between gap-4 font-semibold text-sm list-none" style={{ color: 'var(--heading-dark)' }}>
        {q}
        <ChevronDown size={16} style={{ color: 'var(--gold)' }} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a}</p>
    </details>
  )
}
