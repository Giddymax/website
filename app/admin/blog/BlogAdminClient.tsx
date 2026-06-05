'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { slugify, formatDate } from '@/lib/utils'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { BlogPost, BlogStatus } from '@/types/database'
import ImageUpload from '@/components/admin/ImageUpload'

const EMPTY: Partial<BlogPost> = {
  title: '', slug: '', category: 'Guides', excerpt: '', content: '',
  cover_url: '', status: 'draft', author: 'K.K. Danny Enterprise', published_at: null,
}

interface Props { posts: BlogPost[] }

export default function BlogAdminClient({ posts: initial }: Props) {
  const [posts, setPosts] = useState(initial)
  const [modal, setModal] = useState<{ open: boolean; p: Partial<BlogPost> }>({ open: false, p: EMPTY })
  const [loading, setLoading] = useState(false)

  const open = (p?: BlogPost) => setModal({ open: true, p: p ? { ...p } : { ...EMPTY } })
  const close = () => setModal({ open: false, p: EMPTY })
  const set = (k: keyof BlogPost, v: unknown) => setModal(m => ({ ...m, p: { ...m.p, [k]: v } }))

  async function save() {
    const { p } = modal
    if (!p.title || !p.content) { toast.error('Title and content required'); return }
    const slug = p.slug || slugify(p.title)
    setLoading(true)
    const supabase = createClient()
    const published_at = p.status === 'published' ? (p.published_at || new Date().toISOString()) : null
    const payload = {
      title: p.title, slug, category: p.category, excerpt: p.excerpt || null,
      content: p.content, cover_url: p.cover_url || null,
      status: p.status, author: p.author || null, published_at,
    }
    if (p.id) {
      await supabase.from('blog_posts').update(payload).eq('id', p.id)
      setPosts(prev => prev.map(x => x.id === p.id ? { ...x, ...payload } as BlogPost : x))
    } else {
      const { data } = await supabase.from('blog_posts').insert([payload]).select().single()
      if (data) setPosts(prev => [data, ...prev])
    }
    toast.success('Saved')
    setLoading(false)
    close()
  }

  async function del(id: string) {
    if (!confirm('Delete post?')) return
    const supabase = createClient()
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => open()} className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5"><Plus size={15} /> New Post</button>
      </div>
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="rounded-xl px-5 py-4 flex items-center gap-4" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm truncate">{post.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${post.status === 'published' ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {post.status}
                </span>
              </div>
              <div className="text-xs text-gray-500">{post.category} · {post.author} {post.published_at ? `· ${formatDate(post.published_at)}` : ''}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => open(post)} className="text-gray-400 hover:text-white p-1.5"><Pencil size={14} /></button>
              <button onClick={() => del(post.id)} className="text-gray-600 hover:text-red-400 p-1.5"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="rounded-xl py-12 text-center text-gray-500" style={{ border: '1px solid #1e2e3c' }}>No posts yet</div>}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl rounded-xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2e3c]">
              <h2 className="text-white font-bold">{modal.p.id ? 'Edit Post' : 'New Post'}</h2>
              <button onClick={close} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Title *</label>
                <input className="admin-input" value={modal.p.title || ''} onChange={e => { set('title', e.target.value); if (!modal.p.id) set('slug', slugify(e.target.value)) }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Slug</label>
                  <input className="admin-input font-mono text-xs" value={modal.p.slug || ''} onChange={e => set('slug', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
                  <input className="admin-input" value={modal.p.category || ''} onChange={e => set('category', e.target.value)} placeholder="e.g. Guides, News" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Excerpt</label>
                <textarea className="admin-input resize-none" rows={2} value={modal.p.excerpt || ''} onChange={e => set('excerpt', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Content * (HTML supported)</label>
                <textarea className="admin-input resize-none font-mono text-xs" rows={10} value={modal.p.content || ''} onChange={e => set('content', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Author</label>
                  <input className="admin-input" value={modal.p.author || ''} onChange={e => set('author', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                  <select className="admin-select" value={modal.p.status || 'draft'} onChange={e => set('status', e.target.value as BlogStatus)}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <ImageUpload
                label="Cover Image"
                folder="blog"
                value={modal.p.cover_url}
                onChange={url => set('cover_url', url)}
              />
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-[#1e2e3c]">
              <button onClick={save} disabled={loading} className="btn-gold flex-1 py-2.5 text-sm">{loading ? 'Saving…' : 'Save Post'}</button>
              <button onClick={close} className="flex-1 py-2.5 text-sm rounded font-semibold text-gray-300" style={{ background: '#1e2a35', border: '1px solid #374d5e' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
