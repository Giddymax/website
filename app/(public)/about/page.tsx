import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | K.K. Danny Enterprise',
  description: 'Learn about K.K. Danny Enterprise — Adeiso\'s trusted building materials and hardware supplier.',
}

const VALUES = [
  'Quality products sourced from trusted manufacturers',
  'Transparent, competitive pricing with no hidden charges',
  'Personalised service — we know your project needs',
  'Fast, reliable same-day delivery to your site',
  'Honest advice from experienced staff',
  'Community-focused — proud to serve Adeiso',
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('*')
    .in('section', ['about', 'contact'])

  const c = (key: string, fallback = '') =>
    siteContent?.find(x => x.key === key)?.value || fallback

  return (
    <>
      {/* Page Header */}
      <div style={{ background: 'var(--navy)' }} className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">About Us</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">K.K. Danny Enterprise</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#8a9ba8' }}>
            Adeiso&apos;s most dependable building materials and hardware partner since day one.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Our Story</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-5" style={{ color: 'var(--heading-dark)' }}>
              {c('about_heading', 'Built on Trust, Stocked for Your Project')}
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {c('about_body', 'K.K. Danny Enterprise is a trusted building materials and hardware supply company based in Adeiso, Eastern Region, Ghana.')
                .split('\n').filter(Boolean).map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </div>
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden shadow-xl">
            <Image src="/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg" alt="K.K. Danny Enterprise yard" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-16" style={{ background: 'var(--navy)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Our Mission</span>
          <p className="text-xl sm:text-2xl font-bold text-white mt-4 leading-relaxed">
            &ldquo;{c('about_mission', 'To be Adeiso\'s most dependable building materials partner — delivering quality, honest pricing, and fast service on every order.')}&rdquo;
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Our Values</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ color: 'var(--heading-dark)' }}>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(v => (
              <div key={v} className="flex items-start gap-3 p-4 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <span className="text-sm" style={{ color: 'var(--heading-dark)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            '/images/WhatsApp Image 2026-06-03 at 17.27.21.jpeg',
            '/images/WhatsApp Image 2026-06-03 at 17.27.15.jpeg',
            '/images/WhatsApp Image 2026-06-04 at 00.49.38 (1).jpeg',
            '/images/WhatsApp Image 2026-06-04 at 00.49.38.jpeg',
          ].map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={src} alt={`Store photo ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: 'var(--gold)' }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-extrabold text-black mb-3">Ready to order materials?</h2>
          <p className="text-black/70 mb-6 text-sm">Visit us in Adeiso or get a free written quote for your project today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quote" className="bg-black text-white font-bold text-sm uppercase tracking-wide px-8 py-3 rounded hover:bg-gray-900 transition-colors">
              Get a Quote
            </Link>
            <Link href="/contact" className="bg-white text-black font-bold text-sm uppercase tracking-wide px-8 py-3 rounded hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
