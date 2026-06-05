'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  onMenuClick: () => void
  email?: string
  role?: string
  title?: string
}

export default function Topbar({ onMenuClick, email, role, title }: Props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-14 shrink-0"
      style={{ background: 'var(--navy-light)', borderBottom: '1px solid #1e2e3c' }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white p-1">
          <Menu size={20} />
        </button>
        <span className="text-white font-bold text-sm">{title || 'Dashboard'}</span>
      </div>
      <div className="flex items-center gap-3 relative">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-white font-medium">{email || 'Staff'}</span>
          <span className="text-[10px] capitalize font-semibold" style={{ color: 'var(--gold)' }}>{role || 'staff'}</span>
        </div>
        <button onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ background: 'var(--gold)', color: '#000' }}>
          <User size={15} />
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 top-10 rounded-lg shadow-2xl overflow-hidden z-50 w-44"
            style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <div className="text-white text-xs font-medium truncate">{email}</div>
              <div className="text-xs capitalize" style={{ color: 'var(--gold)' }}>{role}</div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
