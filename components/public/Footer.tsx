import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Mail, Facebook, Instagram, Youtube, Linkedin, Twitter, Settings } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Contact', href: '/contact' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'Bulk Orders', href: '/bulk-orders' },
]

const PRODUCT_LINKS = [
  { label: 'Cement & Concrete', href: '/products/cement-concrete' },
  { label: 'Steel & Reinforcement', href: '/products/steel-reinforcement' },
  { label: 'Roofing Materials', href: '/products/roofing-materials' },
  { label: 'Paint & Finishes', href: '/products/paint-finishes' },
  { label: 'Tiles & Flooring', href: '/products/tiles-flooring' },
  { label: 'Timber & Lumber', href: '/products/timber-lumber' },
  { label: 'Hardware & Fasteners', href: '/products/hardware-fasteners' },
  { label: 'Tools & Equipment', href: '/products/tools-equipment' },
  { label: 'Pipes & Plumbing', href: '/products/pipes-plumbing' },
]

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase()
  if (p === 'facebook') return <Facebook size={14} />
  if (p === 'instagram') return <Instagram size={14} />
  if (p === 'youtube') return <Youtube size={14} />
  if (p === 'linkedin') return <Linkedin size={14} />
  if (p === 'twitter' || p === 'x') return <Twitter size={14} />
  if (p === 'whatsapp') return (
    <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/>
    </svg>
  )
  if (p === 'tiktok') return <span style={{ fontSize: 11, fontWeight: 'bold' }}>TT</span>
  return null
}

export default async function Footer() {
  const supabase = await createClient()
  const [{ data: siteContent }, { data: socialLinks }] = await Promise.all([
    supabase.from('site_content').select('*').in('section', ['contact', 'footer', 'general']),
    supabase.from('social_links').select('*').eq('is_active', true).order('sort_order'),
  ])

  const c = (key: string, fallback = '') =>
    siteContent?.find(x => x.key === key)?.value || fallback

  const phones = [c('phone1', '0244754803'), c('phone2', '0249986118'), c('phone3', '0240268125')].filter(Boolean)
  const address = c('address', 'Opp. Radiance Gas Filling Station, Near Point 3 Hotel, Adeiso, Eastern Region, Ghana')
  const email = c('email', 'info@kkdannyenterprise.com')
  const tagline = c('footer_tagline', "Adeiso's most reliable source for cement, steel, roofing, paint, tiles, timber, tools, and more.")
  const copyright = c('footer_copyright', '© 2025 K.K. Danny Enterprise. All rights reserved.')

  return (
    <footer style={{ background: 'var(--navy)', color: '#c0c9d2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded overflow-hidden ring-2 ring-yellow-500/30">
              <Image src="/logo.jpeg" alt="K.K. Danny Enterprise" width={192} height={192} quality={100} sizes="48px" className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-tight">K.K. DANNY ENTERPRISE</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Building Materials &amp; Services</div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#8a9ba8' }}>{tagline}</p>

          {/* Social links from DB */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  style={{ border: '1px solid #374d5e' }}>
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {QUICK_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4">Products</h4>
          <ul className="space-y-2">
            {PRODUCT_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm" style={{ color: '#8a9ba8' }}>
              <MapPin size={14} className="shrink-0 mt-0.5 text-yellow-500" />
              <span>{address}</span>
            </li>
            {phones.map(n => (
              <li key={n}>
                <a href={`tel:+233${n.slice(1)}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                  <Phone size={14} className="text-yellow-500" /> {n}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                <Mail size={14} className="text-yellow-500" /> {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1e2e3c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#4a6175' }}>
          <span>{copyright}</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors" aria-label="Staff login"><Settings size={13} /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
