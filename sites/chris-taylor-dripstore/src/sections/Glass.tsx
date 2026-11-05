import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollReveal } from '../lib/reveal'
import { LiquidWordmark } from '../components/LiquidFilters'

const SPECS = [
  {
    key: 'Refraction',
    value: '1.52',
    unit: 'IOR',
    copy: 'Casts the room behind it — the rail, the paper backdrop, you — a few degrees off true.',
  },
  {
    key: 'Chromatics',
    value: '0.18',
    unit: 'CA',
    copy: 'A whisper of colour split at the rim, the way real glass holds a Harare afternoon.',
  },
  {
    key: 'Surface',
    value: '0.02',
    unit: 'ROUGH',
    copy: 'Polished, not plastic. Sharp highlights that slide across the bevel as you move.',
  },
]

export function Glass() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const lens = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useScrollReveal(heading, { mode: 'lines', stagger: 0.05 })

  /* Liquid lens follows the cursor across the stage. */
  useEffect(() => {
    const stageEl = stage.current
    const lensEl = lens.current
    if (!stageEl || !lensEl) return
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const xTo = gsap.quickTo(lensEl, 'x', { duration: 0.65, ease: 'power3.out' })
    const yTo = gsap.quickTo(lensEl, 'y', { duration: 0.65, ease: 'power3.out' })

    let shown = false
    const onMove = (event: PointerEvent) => {
      const rect = stageEl.getBoundingClientRect()
      xTo(gsap.utils.clamp(0, rect.width, event.clientX - rect.left))
      yTo(gsap.utils.clamp(0, rect.height, event.clientY - rect.top))
      if (!shown) {
        shown = true
        gsap.to(lensEl, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' })
      }
    }

    const onEnter = () => gsap.to(lensEl, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' })
    const onLeave = () => gsap.to(lensEl, { scale: 0.6, opacity: 0, duration: 0.5, ease: 'power3.out' })

    stageEl.addEventListener('pointermove', onMove)
    stageEl.addEventListener('pointerenter', onEnter)
    stageEl.addEventListener('pointerleave', onLeave)
    return () => {
      stageEl.removeEventListener('pointermove', onMove)
      stageEl.removeEventListener('pointerenter', onEnter)
      stageEl.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.glass__card').forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          delay: i * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.glass__cards', start: 'top 88%', once: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="glass" className="glass">
      <div className="shell glass__head">
        <div>
          <span className="mono section-index">04 / Material study</span>
          <h2 ref={heading} className="glass__title">
            Liquid glass, poured in <em>Harare</em>.
          </h2>
        </div>
        <p className="glass__intro">
          The drop cards, the rail tags and the store signage are cast in liquid glass — a refractive
          chrome finish built in the browser with Three.js and React Three Fiber. It bends light the way
          the pieces bend a silhouette.
        </p>
      </div>

      <div className="shell glass__grid">
        <div ref={stage} className="glass__stage">
          <img src="/img/opt/mann-02.webp" alt="Mannequin in the Stripe Track look, seen through the liquid glass lens" loading="lazy" />
          <div className="glass__stage-tint" aria-hidden="true" />
          <div ref={lens} className="glass__lens" aria-hidden="true">
            <span className="glass__lens-ring" />
            <span className="glass__lens-tag mono">LIQUID / n 1.52</span>
          </div>
          <div className="glass__stage-foot mono">
            <span>Move the cursor</span>
            <span>Refraction in real time</span>
          </div>
        </div>

        <div className="glass__panel">
          <LiquidWordmark text="LIQUID GLASS" className="liquid-wordmark--panel" intensity={7} />
          <p className="glass__panel-copy">
            Rendered with a distorted chrome mesh and a transmissive glass shader. No flat PNGs — the
            material is alive, and it reacts to the pointer, the scroll and the light in the room.
          </p>

          <div className="glass__cards">
            {SPECS.map((spec) => (
              <div key={spec.key} className="glass__card liquid">
                <div className="liquid__tint" />
                <div className="liquid__sheen" />
                <div className="liquid__edge" />
                <div className="glass__card-inner">
                  <span className="mono glass__card-key">{spec.key}</span>
                  <span className="glass__card-value">
                    {spec.value}
                    <sup>{spec.unit}</sup>
                  </span>
                  <p>{spec.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shell glass__foot">
        <span className="mono">Three.js r187</span>
        <span className="mono">React Three Fiber 9</span>
        <span className="mono">GSAP 3.15 / ScrollTrigger</span>
        <span className="mono">Lenis smooth scroll</span>
      </div>
    </section>
  )
}
