import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CheckCircle, Truck } from 'lucide-react'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Delivery Service | K.K. Danny Enterprise',
  description: 'Same-day delivery of building materials in Adeiso and nearby communities. K.K. Danny Enterprise.',
}

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        slug="delivery"
        defaultLabel="Fast & Reliable"
        defaultHeading="Delivery Service"
        defaultDescription="Same-day delivery of building materials to your construction site in Adeiso and surrounding communities."
      />
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="section-label">How It Works</span>
          <h2 className="text-2xl font-extrabold mt-2 mb-5" style={{ color: 'var(--heading-dark)' }}>Simple, Fast, Reliable</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Place Your Order', body: 'Visit us in-store, call, or submit a quote request online. Tell us what you need and your delivery address.' },
              { step: '02', title: 'We Prepare Your Materials', body: 'Our team loads and prepares your materials. We confirm quantity, quality, and condition before dispatch.' },
              { step: '03', title: 'Same-Day Delivery', body: 'Our branded cargo tricycle delivers to your site within Adeiso. For larger loads, we arrange suitable transport.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="text-2xl font-extrabold shrink-0 w-10" style={{ color: 'var(--gold)' }}>{s.step}</div>
                <div>
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--heading-dark)' }}>{s.title}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/quote" className="btn-gold mr-3">Request Delivery Quote</Link>
            <a href="tel:+233244754803" className="btn-outline-gold">Call Now</a>
          </div>
        </div>
        <div className="relative h-72 lg:h-96 rounded-xl overflow-hidden shadow-xl">
          <Image src="/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg" alt="Delivery" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </section>
      <section className="py-12 sm:py-14" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="section-label">Coverage</span>
            <h2 className="text-2xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>Delivery Areas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Adeiso town (same-day)', 'Nsawam', 'Suhum', 'Akropong-Akuapem', 'Aburi', 'Nearby villages & communities'].map(area => (
              <div key={area} className="flex items-center gap-3 p-4 rounded-lg bg-white" style={{ border: '1px solid var(--border)' }}>
                <CheckCircle size={16} style={{ color: 'var(--gold)' }} className="shrink-0" />
                <span className="text-sm font-medium" style={{ color: 'var(--heading-dark)' }}>{area}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            For deliveries outside these areas, please call us for a custom quote: <a href="tel:+233244754803" className="font-bold" style={{ color: 'var(--gold)' }}>0244754803</a>
          </p>
        </div>
      </section>
    </>
  )
}
