import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('title, excerpt').eq('slug', slug).single()
  return {
    title: post ? `${post.title} | K.K. Danny Enterprise Blog` : 'Blog Post',
    description: post?.excerpt || undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single()
  if (!post) notFound()

  return (
    <>
      <div style={{ background: 'var(--navy)' }} className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: '#8a9ba8' }}>
            <ArrowLeft size={14} /> Blog
          </Link>
          {post.category && <span className="section-label mb-3 inline-block">{post.category}</span>}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: '#8a9ba8' }}>
            {post.author && <span>By {post.author}</span>}
            {post.published_at && <><span>·</span><span>{formatDate(post.published_at)}</span></>}
          </div>
        </div>
      </div>
      {post.cover_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-xl">
            <Image src={post.cover_url} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
          </div>
        </div>
      )}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--heading-dark)' }}>Need building materials?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/quote" className="btn-gold text-sm px-6 py-2.5">Get a Quote</Link>
            <Link href="/products" className="btn-outline-gold text-sm px-6 py-2.5">Browse Products</Link>
          </div>
        </div>
      </article>
    </>
  )
}
