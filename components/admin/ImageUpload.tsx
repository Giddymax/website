'use client'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  value: string | null | undefined
  onChange: (url: string | null) => void
  folder?: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Image' }: Props) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    setUploading(true)
    const supabase = createClient()
    const { error } = await supabase.storage.from('uploads').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) {
      toast.error('Upload failed: ' + error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('uploads').getPublicUrl(path)
    onChange(data.publicUrl)
    toast.success('Image uploaded')
    setUploading(false)
  }

  function pick() { inputRef.current?.click() }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>

      {value ? (
        <div className="relative rounded-lg overflow-hidden" style={{ border: '1px solid #1e2e3c' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 hover:opacity-100">
            <button
              type="button"
              onClick={pick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'rgba(0,0,0,0.7)' }}
            >
              <Upload size={12} /> Change
            </button>
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(null)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: 'rgba(220,38,38,0.8)' }}
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          className="w-full h-36 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors hover:border-gray-500"
          style={{ background: '#0a1628', border: '2px dashed #1e2e3c' }}
        >
          {uploading ? (
            <span className="text-sm text-gray-400">Uploading…</span>
          ) : (
            <>
              <ImageIcon size={24} className="text-gray-600" />
              <span className="text-sm text-gray-500">Click to upload</span>
              <span className="text-xs text-gray-600">JPG, PNG, WebP, GIF</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
      />
    </div>
  )
}
