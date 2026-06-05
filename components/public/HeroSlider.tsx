'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/types/database'

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title: 'Cement · Steel · Roofing',
    subtitle: 'Premium Building Materials',
    heading: 'Building Foundations\nThat Last',
    body: 'Premium cement, reinforcement steel, and roofing materials delivered to your site from Adeiso\'s most reliable supplier.',
    button1_text: 'Get a Quote',
    button1_href: '/quote',
    button2_text: 'Browse Products',
    button2_href: '/products',
    image_url: '/images/slide1.jpg',
    sort_order: 1,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Your First Stop For Building Materials',
    subtitle: 'Quality & Affordable',
    heading: 'Quality & Affordable Materials\nFor Every Project',
    body: 'From a single bag of cement to full project supply — K.K. Danny Enterprise has the stock, the price, and the delivery.',
    button1_text: 'View Products',
    button1_href: '/products',
    button2_text: 'Call Us Now',
    button2_href: 'tel:+233244754803',
    image_url: '/images/slide2.jpg',
    sort_order: 2,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Reliable · Stocked · Delivered',
    subtitle: 'Everything You Need',
    heading: 'Everything You Need,\nRight Here In Adeiso',
    body: 'Roofing sheets, tiles, paint, timber, wire mesh, tools, and more — walk in or call ahead for fast service and same-day delivery.',
    button1_text: 'Our Products',
    button1_href: '/products',
    button2_text: 'Contact Us',
    button2_href: '/contact',
    image_url: '/images/slide3.jpg',
    sort_order: 3,
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

const REAL_IMAGES = [
  '/images/WhatsApp Image 2026-06-03 at 17.26.55.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.06.jpeg',
  '/images/WhatsApp Image 2026-06-03 at 17.27.24.jpeg',
]

interface Props {
  slides?: HeroSlide[]
}

export default function HeroSlider({ slides }: Props) {
  const displaySlides = (slides && slides.length > 0 ? slides : FALLBACK_SLIDES).map((s, i) => ({
    ...s,
    image_url: REAL_IMAGES[i] || s.image_url,
  }))

  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 180)
  }, [transitioning])

  const prev = () => goTo((current - 1 + displaySlides.length) % displaySlides.length)
  const next = useCallback(() => goTo((current + 1) % displaySlides.length), [current, displaySlides.length, goTo])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = displaySlides[current]

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 64px)', minHeight: '520px', maxHeight: '820px' }}>
      {/* Background Images */}
      {displaySlides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={s.image_url || '/images/slide1.jpg'}
            alt={s.heading}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,15,24,0.92) 0%, rgba(13,15,24,0.7) 50%, rgba(13,15,24,0.25) 100%)' }} />
        </div>
      ))}

      {/* Content */}
      <div className={`relative z-10 h-full flex items-center transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <span className="label-chip mb-4 inline-block">{slide.title}</span>
            <h1 className="text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] mb-5" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
              {slide.heading.split('\n').map((line, i) => (
                <span key={i}>{line}{i < slide.heading.split('\n').length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl" style={{ color: 'rgba(255,255,255,0.82)' }}>
              {slide.body}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={slide.button1_href} className="btn-gold text-sm px-7 py-3">
                {slide.button1_text}
              </Link>
              <Link href={slide.button2_href} className="btn-gold text-sm px-7 py-3">
                {slide.button2_text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Controls */}
      <button onClick={prev} aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <ChevronLeft size={22} />
      </button>
      <button onClick={next} aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/15 transition-colors"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {displaySlides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}
            className={`slide-dot ${i === current ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  )
}
