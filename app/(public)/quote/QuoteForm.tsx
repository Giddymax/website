'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

export default function QuoteForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    project_type: '', materials_needed: '',
    quantity_volume: '', delivery_address: '',
    deadline: '', notes: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('quote_requests').insert([form])
    setLoading(false)
    if (error) { toast.error('Failed to submit. Please call us directly.'); return }
    setSubmitted(true)
    toast.success('Quote request submitted! We\'ll be in touch shortly.')
  }

  if (submitted) {
    return (
      <div className="text-center py-16 card p-10">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--heading-dark)' }}>Request Received!</h2>
        <p className="mb-2" style={{ color: 'var(--text-muted)' }}>Thank you, <strong>{form.name}</strong>. We&apos;ll prepare your quote and contact you on <strong>{form.phone}</strong> shortly.</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>For urgent requests, call us directly on <a href="tel:+233244754803" className="font-bold" style={{ color: 'var(--gold)' }}>02444754803</a>.</p>
      </div>
    )
  }

  const inputCls = "w-full border rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500"
  const inputStyle = { borderColor: 'var(--border)', color: 'var(--heading-dark)' }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Full Name *</label>
          <input className={inputCls} style={inputStyle} value={form.name} onChange={set('name')} placeholder="Your name" required />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Phone Number *</label>
          <input type="tel" className={inputCls} style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="e.g. 02444754803" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Email (optional)</label>
        <input type="email" className={inputCls} style={inputStyle} value={form.email} onChange={set('email')} placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Project Type</label>
        <select className={inputCls} style={inputStyle} value={form.project_type} onChange={set('project_type')}>
          <option value="">Select project type</option>
          <option>Residential House Build</option>
          <option>Commercial Building</option>
          <option>Extensions / Renovation</option>
          <option>Roofing</option>
          <option>Fencing</option>
          <option>Flooring / Tiling</option>
          <option>Painting</option>
          <option>General Repairs</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Materials Needed</label>
        <textarea className={inputCls} style={inputStyle} value={form.materials_needed} onChange={set('materials_needed')}
          rows={3} placeholder="e.g. 100 bags cement, 50 rebar 12mm, 200 zinc sheets..." />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Estimated Quantity / Volume</label>
          <input className={inputCls} style={inputStyle} value={form.quantity_volume} onChange={set('quantity_volume')} placeholder="e.g. 500 bags total" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Required By (Deadline)</label>
          <input type="date" className={inputCls} style={inputStyle} value={form.deadline} onChange={set('deadline')} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Delivery Address</label>
        <input className={inputCls} style={inputStyle} value={form.delivery_address} onChange={set('delivery_address')} placeholder="Site address for delivery (if needed)" />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--heading-dark)' }}>Additional Notes</label>
        <textarea className={inputCls} style={inputStyle} value={form.notes} onChange={set('notes')} rows={2} placeholder="Any other details or special requirements..." />
      </div>
      <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 flex items-center justify-center gap-2">
        {loading ? 'Submitting…' : <><Send size={16} /> Submit Quote Request</>}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        Or call us directly: <a href="tel:+233244754803" className="font-bold" style={{ color: 'var(--gold)' }}>02444754803</a>
      </p>
    </form>
  )
}
