'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Enter email and password'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message || 'Invalid credentials')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--navy-deep)' }}>
      <div className="w-full max-w-md">
        {/* Logo Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-2 ring-yellow-500/30">
            <Image src="/logo.jpeg" alt="K.K. Danny Enterprise" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <div className="text-white font-extrabold text-lg tracking-wide">K.K. DANNY ENTERPRISE</div>
          <div className="text-xs tracking-widest uppercase mt-1" style={{ color: 'var(--text-muted)' }}>Staff & Admin Portal</div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
          <h1 className="text-xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Enter your staff credentials to access the dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-400">Email</label>
              <input
                type="email"
                className="admin-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="staff@kkdannyenterprise.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="admin-input pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-xs" style={{ color: '#3a4d5e' }}>
          © 2025 K.K. Danny Enterprise · Staff only
        </p>
      </div>
    </div>
  )
}
