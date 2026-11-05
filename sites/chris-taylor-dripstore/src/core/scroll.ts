import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

export const getLenis = () => lenis

/** Lenis driven off the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const instance = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })
    lenis = instance

    const update = () => ScrollTrigger.update()
    instance.on('scroll', update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      instance.off('scroll', update)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [])
}

/** Jump to a section, through Lenis when it is running. */
export function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  const target = document.querySelector<HTMLElement>(id.startsWith('#') ? id : `#${id}`)
  if (!target) return

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.25, offset: 0 })
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
