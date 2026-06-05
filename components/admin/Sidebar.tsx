'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, BarChart3, Package, MessageSquare,
  FileText, Image as ImageIcon, Layers, Link2, Palette,
  Users, X, ChevronRight, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Point of Sale', href: '/admin/pos', icon: ShoppingCart },
  { label: 'Sales', href: '/admin/sales', icon: BarChart3 },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Quote Requests', href: '/admin/quotes', icon: MessageSquare },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Hero Slides', href: '/admin/hero-slides', icon: Layers },
  { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Social Links', href: '/admin/social-links', icon: Link2 },
  { label: 'Theme', href: '/admin/theme', icon: Palette },
  { label: 'Staff', href: '/admin/staff', icon: Users },
]

const STAFF_HREFS = new Set(['/admin/pos', '/admin/sales', '/admin/inventory', '/admin/quotes'])

interface Props {
  open?: boolean
  onClose?: () => void
  role?: string
}

export default function Sidebar({ open, onClose, role }: Props) {
  const path = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
  }

  const isActive = (href: string) =>
    href === '/admin' ? path === '/admin' : path.startsWith(href)

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--navy)', borderRight: '1px solid #1e2e3c' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded overflow-hidden ring-1 ring-yellow-500/30 shrink-0">
              <Image src="/logo.jpeg" alt="KK Danny" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <div>
              <div className="text-white font-bold text-xs leading-tight">K.K. DANNY</div>
              <div className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Enterprise</div>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.filter(item => role === 'admin' || STAFF_HREFS.has(item.href)).map(item => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors group ${active ? 'text-black font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                style={active ? { background: 'var(--gold)' } : {}}>
                <item.icon size={16} className="shrink-0" />
                <span className="text-sm">{item.label}</span>
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid #1e2e3c' }}>
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            <span>↗</span> View Public Site
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
