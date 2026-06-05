import { createClient } from '@/lib/supabase/server'
import BlogAdminClient from './BlogAdminClient'

export default async function BlogAdminPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  return <BlogAdminClient posts={posts || []} />
}
