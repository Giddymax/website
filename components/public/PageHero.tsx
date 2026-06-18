import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

interface Props {
  slug: string
  defaultLabel: string
  defaultHeading: string
  defaultDescription: string
}

export default async function PageHero({ slug, defaultLabel, defaultHeading, defaultDescription }: Props) {
  const supabase = await createClient()
  const { data: hero } = await supabase
    .from('page_heroes')
    .select('*')
    .eq('page_slug', slug)
    .eq('is_active', true)
    .single()

  const label = hero?.subtitle || defaultLabel
  const heading = hero?.heading || defaultHeading
  const description = hero?.description || defaultDescription
  const imageUrl = hero?.image_url

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--navy)' }}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          style={{ opacity: 0.2 }}
        />
      )}
      <div className="relative py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">{label}</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 mb-4">{heading}</h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: '#8a9ba8' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
