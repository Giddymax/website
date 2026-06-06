'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'

interface NavbarProps {
  phone?: string
  tagline?: string
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
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
  { label: 'Wire & Mesh', href: '/products/wire-mesh' },
  { label: 'Pipes & Plumbing', href: '/products/pipes-plumbing' },
  { label: 'Delivery Service', href: '/delivery' },
]

export default function Navbar({ phone = '02444754803', tagline = 'Building Materials & Services' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        style={{ background: 'var(--navy)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.35)]' : 'shadow-[0_2px_12px_rgba(0,0,0,0.2)]'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded overflow-hidden ring-2 ring-yellow-500/30">
                <Image src="/logo.jpeg" alt="K.K. Danny Enterprise" width={144} height={144} quality={100} sizes="36px" className="object-cover w-full h-full" priority />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-extrabold text-sm leading-tight tracking-wide">K.K. DANNY ENTERPRISE</div>
                <div style={{ color: 'var(--text-muted)' }} className="text-[10px] font-medium tracking-widest uppercase">{tagline}</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded">
                  {l.label}
                </Link>
              ))}

              {/* Products Dropdown */}
              <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
                <button className="flex items-center gap-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors rounded">
                  Products <ChevronDown size={14} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                </button>
                {productsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-lg shadow-2xl overflow-hidden z-50" style={{ background: 'var(--navy-light)' }}>
                    <div className="py-2">
                      <Link href="/products" className="block px-4 py-2 text-xs font-bold tracking-widest uppercase text-yellow-500 border-b border-white/10">
                        All Products
                      </Link>
                      {PRODUCT_LINKS.map(l => (
                        <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <a href={`tel:+233${phone.replace(/^0/, '')}`} style={{ color: 'var(--gold)' }} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold">
                <Phone size={14} /> {phone}
              </a>
              <Link href="/quote" className="btn-gold hidden sm:inline-flex text-xs px-4 py-2">
                Get Quote
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white p-2 rounded hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'var(--navy)' }}>
          <div className="flex flex-col h-full pt-20 px-6 pb-8 overflow-y-auto">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="text-white text-2xl font-bold py-4 border-b border-white/10">
                {l.label}
              </Link>
            ))}
            <div className="py-4 border-b border-white/10">
              <div style={{ color: 'var(--gold)' }} className="text-xs font-bold tracking-widest uppercase mb-3">Products</div>
              {PRODUCT_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block text-gray-300 text-lg font-semibold py-2">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <Link href="/quote" className="btn-gold w-full text-center" onClick={() => setMobileOpen(false)}>
                Get a Quote
              </Link>
              <a href={`tel:+233${phone.replace(/^0/, '')}`} className="btn-outline-gold w-full text-center">
                <Phone size={16} /> Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
