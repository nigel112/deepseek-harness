import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from '../core/gsap'
import { scrollToId } from '../core/scroll'
import { SceneBoundary } from '../components/SceneBoundary'
import { DROP } from '../data/site'

const LiquidScene = lazy(() => import('../components/LiquidScene'))

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [sceneActive, setSceneActive] = useState(true)

  /* Pause the render loop when the hero leaves the viewport. */
  useEffect(() => {
    const el = sceneRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Entrance, fired by the preloader curtain. */
  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion()) {
      gsap.set('[data-hero-fade], .hero__word, .hero__title', { opacity: 1, clearProps: 'transform' })
      return
    }

    let split: SplitText | null = null
    const ctx = gsap.context(() => {
      split = new SplitText('.hero__word', { type: 'chars,words', wordsClass: 'hero-word' })

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(split.chars, {
        yPercent: 118,
        rotate: 3,
        duration: 1.5,
        stagger: 0.032,
        ease: 'expo.out',
      })
        .from('[data-hero-fade]', { y: 26, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.35)
        .from('.hero__rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.2 }, 0.4)
        .from('.hero__badge', { scale: 0.7, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' }, 0.55)
        .from('.hero__scroll', { opacity: 0, duration: 0.8 }, 0.8)

      gsap.to('.hero__title', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__scene', {
        yPercent: 16,
        scale: 1.06,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__content', {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: '35% top', end: 'bottom top', scrub: true },
      })
    }, root)

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
      split?.revert()
    }
  }, [ready])

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__glow hero__glow--acid" />
        <span className="hero__glow hero__glow--cool" />
        <span className="hero__grid" />
      </div>

      <div ref={sceneRef} className="hero__scene" aria-hidden="true">
        <SceneBoundary>
          <Suspense fallback={null}>
            <LiquidScene active={sceneActive} />
          </Suspense>
        </SceneBoundary>
      </div>

      <div className="hero__content shell">
        <div className="hero__top">
          <span className="eyebrow" data-hero-fade>
            <i className="dot" /> Harare, Zimbabwe — 17.82° S / 31.05° E
          </span>
          <span className="eyebrow eyebrow--right" data-hero-fade>
            Est. 2019 <span className="eyebrow__sep">/</span> Five categories
          </span>
        </div>

        <h1 className="hero__title" aria-label="Drip Store">
          <span className="hero__line">
            <span className="hero__word hero__word--solid" aria-hidden="true">
              DRIP
            </span>
          </span>
          <span className="hero__line hero__line--two">
            <span className="hero__word hero__word--outline" aria-hidden="true">
              STORE
            </span>
            <sup className="hero__reg" aria-hidden="true">
              ®
            </sup>
          </span>
        </h1>

        <div className="hero__bottom">
          <div className="hero__lede-wrap" data-hero-fade>
            <span className="hero__rule" />
            <p className="hero__lede">Seven pieces on one rack. Homegate Mall, Harare.</p>
            <p className="hero__sub">Nothing else earns the hanger.</p>
          </div>

          <div className="hero__ctas" data-hero-fade>
            <button className="btn btn--acid" data-cursor="RACK" onClick={() => scrollToId('#rack')}>
              <span>Shop the rack</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button className="btn btn--line" data-cursor="LOOK" onClick={() => scrollToId('#lookbook')}>
              <span>See the lookbook</span>
            </button>
          </div>

          <div className="hero__meta" data-hero-fade>
            <div>
              <span className="mono">Next drop</span>
              <strong>
                Drop {DROP.number} — {DROP.label.split(' / ')[0]}
              </strong>
            </div>
            <div>
              <span className="mono">Pieces</span>
              <strong>{DROP.units} only</strong>
            </div>
            <div>
              <span className="mono">Delivery</span>
              <strong>Harare same-day</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__badge" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="badge-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
          </defs>
          <text>
            <textPath href="#badge-circle" startOffset="0%">
              Chris Taylor · Dripstore · Harare · Worn loose · No filler ·
            </textPath>
          </text>
        </svg>
        <span className="hero__badge-core">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M10 22V10l12 12V10" />
          </svg>
        </span>
      </div>

      <button className="hero__scroll" onClick={() => scrollToId('#ethos')} aria-label="Scroll to the ethos" data-cursor="SCROLL">
        <span className="mono">Scroll</span>
        <span className="hero__scroll-line" />
      </button>
    </section>
  )
}
