'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/pos': 'Point of Sale',
  '/admin/sales': 'Sales',
  '/admin/analytics': 'Business Analytics',
  '/admin/inventory': 'Inventory',
  '/admin/invoices': 'Invoices',
  '/admin/quotes': 'Quote Requests',
  '/admin/content': 'Content Management',
  '/admin/hero-slides': 'Hero Slides',
  '/admin/gallery': 'Gallery',
  '/admin/products': 'Products',
  '/admin/social-links': 'Social Links',
  '/admin/theme': 'Theme & Colours',
  '/admin/staff': 'Staff Accounts',
}

interface Props {
  children: React.ReactNode
  email: string
  role: string
  name: string
}

export default function AdminShell({ children, email, role, name }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const path = usePathname()
  const title = PAGE_TITLES[path] || 'Admin'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d1821' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} role={role} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          email={email}
          role={role}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
