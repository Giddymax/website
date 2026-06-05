'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { UserCheck, UserX, Shield, Trash2, UserPlus, Pencil, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile, UserRole } from '@/types/database'
import { createStaffMember, deleteStaffMember } from './actions'

interface Props { staff: Profile[]; currentUserId: string; currentRole: string }

const BLANK_ADD = { full_name: '', email: '', password: '', role: 'staff' as UserRole }
const BLANK_EDIT = { full_name: '', role: 'staff' as UserRole }

export default function StaffClient({ staff: initial, currentUserId, currentRole }: Props) {
  const [staff, setStaff] = useState(initial)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(BLANK_ADD)
  const [addSaving, setAddSaving] = useState(false)
  const [editTarget, setEditTarget] = useState<Profile | null>(null)
  const [editForm, setEditForm] = useState(BLANK_EDIT)
  const [editSaving, setEditSaving] = useState(false)
  const router = useRouter()
  const isAdmin = currentRole === 'admin'

  /* ---------- Add ---------- */
  function openAdd() { setAddForm(BLANK_ADD); setAddOpen(true) }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.full_name.trim()) { toast.error('Name is required'); return }
    if (!addForm.email.trim()) { toast.error('Email is required'); return }
    if (addForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setAddSaving(true)
    const { error } = await createStaffMember({
      full_name: addForm.full_name.trim(),
      email: addForm.email.trim(),
      password: addForm.password,
      role: addForm.role,
    })
    setAddSaving(false)
    if (error) { toast.error(error); return }
    toast.success('Staff account created')
    setAddOpen(false)
    router.refresh()
  }

  /* ---------- Edit ---------- */
  function openEdit(s: Profile) {
    setEditTarget(s)
    setEditForm({ full_name: s.full_name || '', role: s.role })
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editTarget) return
    if (!editForm.full_name.trim()) { toast.error('Name is required'); return }
    setEditSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: editForm.full_name.trim(), role: editForm.role })
      .eq('id', editTarget.id)
    setEditSaving(false)
    if (error) { toast.error('Failed to update staff'); return }
    setStaff(prev => prev.map(s => s.id === editTarget.id ? { ...s, ...editForm, full_name: editForm.full_name.trim() } : s))
    toast.success('Staff updated')
    setEditTarget(null)
  }

  /* ---------- Toggle active ---------- */
  async function toggleActive(id: string, current: boolean) {
    if (id === currentUserId) { toast.error('Cannot deactivate your own account'); return }
    const supabase = createClient()
    await supabase.from('profiles').update({ is_active: !current }).eq('id', id)
    setStaff(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s))
    toast.success(current ? 'Staff deactivated' : 'Staff activated')
  }

  /* ---------- Delete ---------- */
  async function handleDelete(s: Profile) {
    if (s.id === currentUserId) { toast.error('Cannot delete your own account'); return }
    if (!confirm(`Permanently delete ${s.full_name || s.email}?`)) return
    const { error } = await deleteStaffMember(s.id)
    if (error) { toast.error(error); return }
    setStaff(prev => prev.filter(x => x.id !== s.id))
    toast.success('Staff account deleted')
  }

  /* ---------- Reset password ---------- */
  async function resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    })
    if (error) { toast.error('Failed to send reset email'); return }
    toast.success(`Password reset email sent to ${email}`)
  }

  /* ---------- UI ---------- */
  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#8a9ba8' }}>
          Manage staff accounts and permissions.
        </p>
        {isAdmin && (
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-black transition-opacity hover:opacity-90"
            style={{ background: 'var(--gold)' }}
          >
            <UserPlus size={15} /> Add Staff
          </button>
        )}
      </div>

      {/* Table */}
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
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: s.role === 'admin' ? 'rgba(200,150,12,0.15)' : 'rgba(96,165,250,0.1)', color: s.role === 'admin' ? 'var(--gold)' : '#60a5fa' }}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {isAdmin && (
                        <button type="button" aria-label="Edit staff" title="Edit"
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded text-gray-500 hover:text-blue-400 transition-colors">
                          <Pencil size={14} />
                        </button>
                      )}
                      <button type="button" aria-label={s.is_active ? 'Deactivate' : 'Activate'} title={s.is_active ? 'Deactivate' : 'Activate'}
                        onClick={() => toggleActive(s.id, s.is_active)}
                        disabled={s.id === currentUserId}
                        className="p-1.5 rounded text-gray-500 hover:text-white transition-colors disabled:opacity-30">
                        {s.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button type="button" aria-label="Send password reset" title="Send password reset"
                        onClick={() => resetPassword(s.email)}
                        className="p-1.5 rounded text-gray-500 hover:text-blue-400 transition-colors">
                        <Shield size={14} />
                      </button>
                      {isAdmin && (
                        <button type="button" aria-label="Delete staff" title="Delete"
                          onClick={() => handleDelete(s)}
                          disabled={s.id === currentUserId}
                          className="p-1.5 rounded text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No staff found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Modal ── */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-2xl w-full max-w-md" style={{ background: '#0d1f33', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold">Add Staff Member</h2>
              <button type="button" aria-label="Close" onClick={() => setAddOpen(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label htmlFor="add-name" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Full Name *</label>
                <input id="add-name" type="text" required placeholder="e.g. Kofi Mensah"
                  value={addForm.full_name}
                  onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }} />
              </div>
              <div>
                <label htmlFor="add-email" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Email Address *</label>
                <input id="add-email" type="email" required placeholder="staff@example.com"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }} />
              </div>
              <div>
                <label htmlFor="add-password" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Password *</label>
                <input id="add-password" type="password" required placeholder="Min. 6 characters"
                  value={addForm.password}
                  onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-1"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }} />
              </div>
              <div>
                <label htmlFor="add-role" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Role *</label>
                <select id="add-role"
                  value={addForm.role}
                  onChange={e => setAddForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddOpen(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                  style={{ background: '#1e2e3c' }}>
                  Cancel
                </button>
                <button type="submit" disabled={addSaving}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--gold)' }}>
                  {addSaving ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-2xl w-full max-w-md" style={{ background: '#0d1f33', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e2e3c' }}>
              <h2 className="text-white font-bold">Edit Staff</h2>
              <button type="button" aria-label="Close" onClick={() => setEditTarget(null)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Full Name *</label>
                <input id="edit-name" type="text" required
                  value={editForm.full_name}
                  onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }} />
              </div>
              <div>
                <label htmlFor="edit-email-display" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Email</label>
                <div id="edit-email-display" className="px-3 py-2 rounded-lg text-sm text-gray-400" style={{ background: '#0a1628', border: '1px solid #1e2e3c' }}>
                  {editTarget.email}
                </div>
              </div>
              <div>
                <label htmlFor="edit-role" className="block text-xs font-semibold mb-1.5" style={{ color: '#8a9ba8' }}>Role</label>
                <select id="edit-role"
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={{ background: '#0a1628', border: '1px solid #1e2e3c' }}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-300 transition-colors hover:text-white"
                  style={{ background: '#1e2e3c' }}>
                  Cancel
                </button>
                <button type="submit" disabled={editSaving}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--gold)' }}>
                  {editSaving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
