import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | K.K. Danny Enterprise',
  description: 'Building tips, material guides, and construction advice from K.K. Danny Enterprise.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts').select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">Tips & Guides</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">Our Blog</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8a9ba8' }}>
            Building tips, material guides, and construction advice from the K.K. Danny Enterprise team.
          </p>
        </div>
      </div>
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                {post.cover_url && (
                  <div className="relative h-44 overflow-hidden">
                    <Image src={post.cover_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                )}
                <div className="p-5">
                  {post.category && <span className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(200,150,12,0.12)', color: 'var(--gold)' }}>{post.category}</span>}
                  <h2 className="font-extrabold text-base mt-3 mb-2" style={{ color: 'var(--heading-dark)' }}>{post.title}</h2>
                  {post.excerpt && <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{post.author}</span>
                    {post.published_at && <span>{formatDate(post.published_at)}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>No blog posts published yet.</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Check back soon for building tips and guides.</p>
          </div>
        )}
      </section>
    </>
  )
}
