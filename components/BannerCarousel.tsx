'use client'
import { useEffect, useState, useCallback, useSyncExternalStore } from 'react'
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
  // 'split' shows the whole image (e.g. a poster) next to the text on a solid `background`, instead of behind it
  layout?: 'cover' | 'split'
  background?: string
  // Cover slides only. 'dark' (default) darkens photos so white text reads on any image; 'subtle' is for backgrounds
  // designed to keep the text area dark themselves, such as the generated point cloud
  overlay?: 'dark' | 'subtle'
  // Cover slides only: a very slow pan of the background, off for visitors who prefer reduced motion
  drift?: boolean
}

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const subscribeReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

// Full class names, so Tailwind can find them when it scans this file
const objectPosition = { center: 'object-center', top: 'object-top', bottom: 'object-bottom' }

function SlideButtons({ slide, className }: { slide: Slide; className: string }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {slide.primary && (
        <Link href={slide.primary.href} className="btn-primary focus-visible:outline-white">
          {slide.primary.label}
        </Link>
      )}
      {slide.secondary && (
        <Link
          href={slide.secondary.href}
          className="inline-flex items-center justify-center rounded-md border border-white px-5 py-2.5 font-medium text-white transition-colors hover:bg-white hover:text-gray-900 focus-visible:outline-white"
        >
          {slide.secondary.label}
        </Link>
      )}
    </div>
  )
}

type Props = {
  slides: Slide[]
  className?: string
  autoPlayMs?: number
}

export default function BannerCarousel({ slides, className = '', autoPlayMs = 6000 }: Props) {
  const [index, setIndex] = useState(0)
  // Visitors who prefer reduced motion start paused. The pause button overrides that either way;
  // hover and focus only hold the current slide while they last
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  )
  const [pausedByVisitor, setPausedByVisitor] = useState<boolean | null>(null)
  const paused = pausedByVisitor ?? reducedMotion
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const count = slides.length
  const playing = count > 1 && !paused && !hovered && !focused

  const goTo = useCallback((i: number) => setIndex((i + count) % count), [count])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => goTo(index + 1), autoPlayMs)
    return () => window.clearTimeout(timer)
  }, [playing, index, goTo, autoPlayMs])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      {/* Track. Announce slide changes only when the visitor drives them; while rotating on its own it stays quiet */}
      <div
        className="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
        aria-live={playing ? 'off' : 'polite'}
      >
        {slides.map((s, i) => {
          const slideProps = {
            role: 'group',
            'aria-roledescription': 'slide',
            'aria-label': `${i + 1} of ${count}`,
            // Off-screen slides can't be focused or read
            inert: i !== index,
          }
          return s.layout === 'split' ? (
            // Mobile: image on top, text below. Desktop: text left, image right. No overlay, so the image stays readable
            <div key={i} {...slideProps} className="relative flex min-w-full flex-col md:flex-row-reverse" style={{ backgroundColor: s.background }}>
              <div className="relative h-1/3 w-full shrink-0 sm:h-1/2 md:h-full md:w-1/2">
                <Image src={s.image} alt={s.title} fill priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-3 md:p-6" />
              </div>
              {/* px-12 keeps the text clear of the prev/next arrows, which sit over this block on mobile */}
              <div className="flex flex-1 flex-col justify-center px-12 pb-12 text-center text-white md:pr-6 md:pb-0 md:pl-16 md:text-left">
                <h2 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">{s.title}</h2>
                {s.subtitle && <p className="mt-2 text-sm sm:text-lg md:mt-4 md:text-xl">{s.subtitle}</p>}
                {s.description && <p className="mt-1 text-sm text-white/90 sm:text-base md:mt-2">{s.description}</p>}
                <SlideButtons slide={s} className="mt-4 justify-center md:mt-8 md:justify-start" />
              </div>
            </div>
          ) : (
            <div key={i} {...slideProps} className="relative min-w-full">
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 ${s.drift ? 'animate-drift motion-reduce:animate-none' : ''}`}>
                  <Image src={s.image} alt="" fill priority={i === 0} sizes="(min-width: 1024px) 1024px, 100vw" className={`object-cover ${objectPosition[s.imagePosition ?? 'bottom']}`} />
                </div>
                {/* Darkens the image so the white text stays readable */}
                <div className={`absolute inset-0 ${s.overlay === 'subtle' ? 'bg-black/15' : 'bg-black/50'}`} />
              </div>

              {/* Text layer. Centred in the slide; px-12 keeps it clear of the prev/next arrows, pb-8 clear of the dots */}
              <div className="relative flex h-full items-center justify-center px-12 pb-8 text-white">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">{s.title}</h2>
                  {s.subtitle && <p className="mx-auto mt-3 max-w-2xl text-base sm:mt-6 sm:text-xl">{s.subtitle}</p>}
                  {s.description && <p className="mx-auto mt-1 max-w-2xl text-sm sm:text-base">{s.description}</p>}

                  <SlideButtons slide={s} className="mt-6 justify-center sm:mt-10" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
            className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur hover:bg-black/70 focus-visible:outline-white"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white backdrop-blur hover:bg-black/70 focus-visible:outline-white"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="absolute right-0 bottom-2 left-0 flex items-center justify-center gap-1">
            <button
              type="button"
              aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              onClick={() => setPausedByVisitor(!paused)}
              className="mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-white"
            >
              {paused ? (
                <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 fill-current">
                  <path d="M3 1.5v9l7.5-4.5z" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 fill-current">
                  <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                </svg>
              )}
            </button>
            {/* 24px targets around small dots */}
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="group flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-white"
              >
                <span className={`h-2.5 w-2.5 rounded-full shadow-sm ring-1 ring-black/30 transition-colors ${i === index ? 'bg-white' : 'bg-white/50 group-hover:bg-white/80'}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
