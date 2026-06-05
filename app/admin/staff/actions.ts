'use server'
import { createServerClient } from '@supabase/ssr'

function serviceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function createStaffMember(data: {
  full_name: string
  email: string
  password: string
  role: 'admin' | 'staff'
}): Promise<{ error?: string }> {
  const client = serviceClient()

  const { data: authData, error } = await client.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { full_name: data.full_name, role: data.role },
  })

  if (error) return { error: error.message }

  // Trigger creates the profile; update name & role immediately
  await client
    .from('profiles')
    .update({ full_name: data.full_name, role: data.role })
    .eq('id', authData.user.id)

  return {}
}

export async function deleteStaffMember(id: string): Promise<{ error?: string }> {
  const client = serviceClient()
  const { error } = await client.auth.admin.deleteUser(id)
  if (error) return { error: error.message }
  return {}
}
