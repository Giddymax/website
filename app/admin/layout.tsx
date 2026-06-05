import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // Login page renders without the shell — handled by its own page.tsx
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles').select('full_name, role, email').eq('id', user.id).single()

  return (
    <AdminShell
      email={profile?.email || user.email || ''}
      role={profile?.role || 'staff'}
      name={profile?.full_name || ''}
    >
      {children}
    </AdminShell>
  )
}
