import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Mail, Facebook, Instagram } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
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

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#c0c9d2' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded overflow-hidden ring-2 ring-yellow-500/30">
              <Image src="/logo.jpeg" alt="K.K. Danny Enterprise" width={48} height={48} className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-tight">K.K. DANNY ENTERPRISE</div>
              <div className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Building Materials & Services</div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#8a9ba8' }}>
            Adeiso&apos;s most reliable source for cement, steel, roofing, paint, tiles, timber, tools, and more.
          </p>
          <div className="flex gap-3">
            <a href="https://facebook.com/kkdannyenterprise" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" style={{ border: '1px solid #374d5e' }}>
              <Facebook size={14} />
            </a>
            <a href="https://instagram.com/kkdannyenterprise" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" style={{ border: '1px solid #374d5e' }}>
              <Instagram size={14} />
            </a>
            <a href="https://wa.me/233244754803" target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-bold" style={{ border: '1px solid #374d5e' }}>
              WA
            </a>
          </div>
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
              <span>Opp. Radiance Gas Filling Station, Near Point 3 Hotel, Adeiso, Eastern Region, Ghana</span>
            </li>
            <li>
              <a href="tel:+233244754803" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                <Phone size={14} className="text-yellow-500" /> 02444754803
              </a>
            </li>
            <li>
              <a href="tel:+233249986118" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                <Phone size={14} className="text-yellow-500" /> 0249986118
              </a>
            </li>
            <li>
              <a href="tel:+233240268125" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                <Phone size={14} className="text-yellow-500" /> 0240268125
              </a>
            </li>
            <li>
              <a href="mailto:info@kkdannyenterprise.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: '#8a9ba8' }}>
                <Mail size={14} className="text-yellow-500" /> info@kkdannyenterprise.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1e2e3c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: '#4a6175' }}>
          <span>© 2025 K.K. Danny Enterprise. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
