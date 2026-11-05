import { useEffect, type RefObject } from 'react'
import { gsap, SplitText, prefersReducedMotion } from './gsap'

type RevealMode = 'lines' | 'chars' | 'fade'

interface RevealOptions {
  mode?: RevealMode
  stagger?: number
  start?: string
  /** how far the type travels in, as a percentage of its own height */
  distance?: number
}

/**
 * Masked scroll-in for headings and copy. Splits into lines once fonts settle,
 * then hands every line to a one-shot ScrollTrigger.
 */
export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { mode = 'lines', stagger = 0.05, start = 'top 84%', distance = 110 }: RevealOptions = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, clearProps: 'transform' })
      return
    }

    let split: SplitText | null = null
    let tween: gsap.core.Tween | null = null
    let cancelled = false

    const build = () => {
      if (cancelled || !el.isConnected) return
      gsap.set(el, { opacity: 1 })

      let targets: Element[] = [el]
      if (mode !== 'fade') {
        split = new SplitText(el, {
          type: mode === 'chars' ? 'chars,words,lines' : 'lines',
          linesClass: 'reveal-line',
        })
        targets = mode === 'chars' ? split.chars : split.lines
      }

      tween = gsap.from(targets, {
        yPercent: distance,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
      })
    }

    /* SplitText needs the real font metrics, otherwise lines break mid-word. */
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined
    if (fonts && fonts.status !== 'loaded') {
      let done = false
      const run = () => {
        if (done) return
        done = true
        build()
      }
      fonts.ready.then(run).catch(run)
      const fallback = window.setTimeout(run, 900)
      return () => {
        cancelled = true
        window.clearTimeout(fallback)
        tween?.scrollTrigger?.kill()
        tween?.kill()
        split?.revert()
      }
    }

    build()

    return () => {
      cancelled = true
      tween?.scrollTrigger?.kill()
      tween?.kill()
      split?.revert()
    }
  }, [ref, mode, stagger, start, distance])
}
