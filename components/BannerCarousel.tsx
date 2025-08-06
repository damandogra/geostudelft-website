'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from '@/components/Link'

type Slide = {
  image: string
  title: string
  subtitle?: string
  description?: string
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
  imagePosition?: 'center' | 'top' | 'bottom'
}

type Props = {
  slides: Slide[]
  className?: string
  autoPlayMs?: number
}

export default function BannerCarousel({ slides, className = '', autoPlayMs = 6000 }: Props) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const timerRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isHoveredRef = useRef(false)

  const goTo = useCallback(
    (i: number) => {
      setIndex(() => {
        const next = (i + count) % count
        if (containerRef.current) {
          containerRef.current.setAttribute('aria-live', 'polite')
        }
        return next
      })
    },
    [count]
  )

  const next = useCallback(() => goTo(index + 1), [index, goTo])
  const prev = useCallback(() => goTo(index - 1), [index, goTo])

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (count <= 1) return
    stopTimer()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    timerRef.current = window.setInterval(() => {
      next()
    }, autoPlayMs)
  }, [count, next, autoPlayMs, stopTimer])

  useEffect(() => {
    if (!isHoveredRef.current) startTimer()
    return () => stopTimer()
  }, [index, startTimer, stopTimer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => {
        isHoveredRef.current = true
        stopTimer()
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
        startTimer()
      }}
      ref={containerRef}
      aria-roledescription="carousel"
    >
      {/* Track */}
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className="relative min-w-full">
            <div className="absolute inset-0">
              <Image src={s.image} alt={s.title} fill priority={i === 0} className={`object-cover ${s.imagePosition ? `object-${s.imagePosition}` : 'object-bottom'}`} />
              {/* Optional overlay layer */}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Text layer */}
            <div className="relative container mx-auto px-4 py-24 text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{s.title}</h1>
                {s.subtitle && <p className="mx-auto mt-6 max-w-2xl text-xl">{s.subtitle}</p>}
                {s.description && <p className="mx-auto mt-1 max-w-2xl text-base">{s.description}</p>}

                <div className="mt-10 flex justify-center gap-4">
                  {s.primary && (
                    <Link href={s.primary.href} className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-white transition-colors">
                      {s.primary.label}
                    </Link>
                  )}
                  {s.secondary && (
                    <Link href={s.secondary.href} className="rounded-md border border-white px-6 py-3 text-white transition-colors hover:bg-white hover:text-gray-900">
                      {s.secondary.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttom */}
      {count > 1 && (
        <>
          <button aria-label="Previous slide" onClick={prev} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60">
            ‹
          </button>
          <button aria-label="Next slide" onClick={next} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white backdrop-blur hover:bg-black/60">
            ›
          </button>
        </>
      )}

      {/* Indicator point */}
      {count > 1 && (
        <div className="pointer-events-none absolute right-0 bottom-3 left-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)} className={`pointer-events-auto h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  )
}
