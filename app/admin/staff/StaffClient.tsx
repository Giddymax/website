'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { UserCheck, UserX, Shield, User, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile, UserRole } from '@/types/database'

interface Props { staff: Profile[]; currentUserId: string }

export default function StaffClient({ staff: initial, currentUserId }: Props) {
  const [staff, setStaff] = useState(initial)

  async function toggleActive(id: string, current: boolean) {
    if (id === currentUserId) { toast.error('Cannot deactivate your own account'); return }
    const supabase = createClient()
    await supabase.from('profiles').update({ is_active: !current }).eq('id', id)
    setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
    toast.success(current ? 'Staff deactivated' : 'Staff activated')
  }

  async function changeRole(id: string, role: UserRole) {
    if (id === currentUserId) { toast.error('Cannot change your own role'); return }
    const supabase = createClient()
    await supabase.from('profiles').update({ role }).eq('id', id)
    setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s))
    toast.success(`Role changed to ${role}`)
  }

  async function resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    })
    if (error) { toast.error('Failed to send reset email'); return }
    toast.success(`Password reset email sent to ${email}`)
  }

  async function deleteStaff(id: string) {
    if (id === currentUserId) { toast.error('Cannot delete your own account'); return }
    if (!confirm('Permanently delete this staff account?')) return
    const supabase = createClient()
    await supabase.from('profiles').delete().eq('id', id)
    setStaff(prev => prev.filter(s => s.id !== id))
    toast.success('Staff account deleted')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 text-sm" style={{ background: '#0d1821', border: '1px solid #1e2e3c', color: '#8a9ba8' }}>
        <strong className="text-white">Creating new staff accounts:</strong> Go to your Supabase project → Authentication → Users → Invite User. The profile will be created automatically via the database trigger. Then update their role here.
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr style={{ background: '#0d1821' }}>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a6175' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #0d1821' }} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white font-medium">
                    {s.full_name || '—'}
                    {s.id === currentUserId && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-yellow-900/40 text-yellow-400">You</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.email}</td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs rounded px-2 py-1 border-none outline-none cursor-pointer font-semibold"
                      style={{ background: s.role === 'admin' ? 'rgba(200,150,12,0.15)' : 'rgba(96,165,250,0.1)', color: s.role === 'admin' ? 'var(--gold)' : '#60a5fa' }}
                      value={s.role}
                      onChange={e => changeRole(s.id, e.target.value as UserRole)}
                      disabled={s.id === currentUserId}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button title={s.is_active ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleActive(s.id, s.is_active)}
                        disabled={s.id === currentUserId}
                        className="p-1.5 rounded text-gray-500 hover:text-white transition-colors disabled:opacity-30">
                        {s.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button title="Send password reset" onClick={() => resetPassword(s.email)}
                        className="p-1.5 rounded text-gray-500 hover:text-blue-400 transition-colors">
                        <Shield size={14} />
                      </button>
                      <button title="Delete account" onClick={() => deleteStaff(s.id)}
                        disabled={s.id === currentUserId}
                        className="p-1.5 rounded text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No staff found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
