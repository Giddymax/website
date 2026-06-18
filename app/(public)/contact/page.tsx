import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, MapPin, Mail, Clock } from 'lucide-react'
import PageHero from '@/components/public/PageHero'

export const metadata: Metadata = {
  title: 'Contact Us | K.K. Danny Enterprise',
  description: 'Contact K.K. Danny Enterprise in Adeiso, Eastern Region, Ghana. Call, WhatsApp, or visit us.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', 'contact')

  const c = (key: string, fallback = '') =>
    siteContent?.find(x => x.key === key)?.value || fallback

  const phones = [
    c('phone1', '0244754803'),
    c('phone2', '0249986118'),
    c('phone3', '0240268125'),
  ].filter(Boolean)

  const address = c('address', 'Opp. Radiance Gas Filling Station, Near Point 3 Hotel, Adeiso, Eastern Region, Ghana')
  const email = c('email', 'info@kkdannyenterprise.com')

  return (
    <>
      <PageHero
        slug="contact"
        defaultLabel="Get In Touch"
        defaultHeading="Contact Us"
        defaultDescription="Walk in, call, or WhatsApp. We're here to help with your building materials needs."
      />

      <section className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--heading-dark)' }}>Find Us</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(200,150,12,0.12)' }}>
                <MapPin size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--heading-dark)' }}>Address</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{address}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(200,150,12,0.12)' }}>
                <Phone size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-2" style={{ color: 'var(--heading-dark)' }}>Phone Numbers</div>
                {phones.map(n => (
                  <a key={n} href={`tel:+233${n.slice(1)}`} className="block text-sm font-medium hover:underline" style={{ color: 'var(--gold)' }}>{n}</a>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(200,150,12,0.12)' }}>
                <Mail size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--heading-dark)' }}>Email</div>
                <a href={`mailto:${email}`} className="text-sm hover:underline" style={{ color: 'var(--gold)' }}>{email}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(200,150,12,0.12)' }}>
                <Clock size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1" style={{ color: 'var(--heading-dark)' }}>Opening Hours</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Monday – Saturday: 7:00am – 6:00pm<br />
                  Sunday: 9:00am – 3:00pm
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`https://wa.me/233${phones[0]?.slice(1) || '244754803'}`} target="_blank" rel="noopener noreferrer" className="btn-gold text-sm px-6 py-2.5">
              WhatsApp Us
            </a>
            <a href={`tel:+233${phones[0]?.slice(1) || '244754803'}`} className="btn-outline-gold text-sm px-6 py-2.5">
              Call Now
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--heading-dark)' }}>Send a Quick Message</h2>
          <div className="card p-6 space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              For a formal price quote with full itemised pricing, use our <Link href="/quote" className="font-semibold underline" style={{ color: 'var(--gold)' }}>Quote Request form</Link>.
              For quick inquiries, call or WhatsApp any of the numbers above.
            </p>
            <div className="rounded-xl overflow-hidden h-56 bg-gray-100 flex items-center justify-center" style={{ border: '1px solid var(--border)' }}>
              <div className="text-center p-4">
                <div className="mb-2 flex justify-center"><MapPin size={28} style={{ color: 'var(--gold)' }} /></div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--heading-dark)' }}>K.K. Danny Enterprise</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Opp. Radiance Gas Filling Station<br />Adeiso, Eastern Region</div>
                <a href="https://www.google.com/maps/search/Radiance+Gas+Filling+Station+Adeiso+Ghana" target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded" style={{ background: 'var(--gold)', color: '#000' }}>
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
