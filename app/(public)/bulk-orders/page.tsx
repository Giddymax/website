import Link from 'next/link'
import type { Metadata } from 'next'
import { Package, ArrowRight } from 'lucide-react'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Bulk Orders | K.K. Danny Enterprise',
  description: 'Order building materials in bulk for large projects. Competitive pricing, delivery, and reliable supply from K.K. Danny Enterprise.',
}

export default function BulkOrdersPage() {
  return (
    <>
      <PageHero
        slug="bulk-orders"
        defaultLabel="Trade & Contractor"
        defaultHeading="Bulk Orders"
        defaultDescription="Supplying full projects — from a housing development to a large commercial build. Call for competitive bulk pricing."
      />
      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Package, title: 'Large Stock', body: 'We maintain large inventory so bulk orders ship without waiting. Ready to supply full-site quantities.' },
            { icon: ArrowRight, title: 'Trade Pricing', body: 'Contractors and developers get competitive trade pricing. Call us for a dedicated price list.' },
            { icon: ArrowRight, title: 'Phased Supply', body: 'We can schedule material deliveries in phases to match your construction timeline.' },
          ].map(item => (
            <div key={item.title} className="card p-6 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(200,150,12,0.12)' }}>
                <item.icon size={22} style={{ color: 'var(--gold)' }} />
              </div>
              <div className="font-bold mb-2" style={{ color: 'var(--heading-dark)' }}>{item.title}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.body}</div>
            </div>
          ))}
        </div>
        <div className="card p-8 text-center max-w-xl mx-auto">
          <h2 className="text-xl font-extrabold mb-3" style={{ color: 'var(--heading-dark)' }}>Ready to Place a Bulk Order?</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Submit a detailed quote request with your materials list and quantities. We&apos;ll respond with a competitive price and delivery plan.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="btn-gold">Request Bulk Quote</Link>
            <a href="tel:+233244754803" className="btn-outline-gold">Call 0244754803</a>
          </div>
        </div>
      </section>
    </>
  )
}
