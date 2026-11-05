import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../core/gsap'
import { useScrollReveal } from '../core/reveal'
import { LOOKS } from '../data/site'

export function Lookbook() {
  const root = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  useScrollReveal(title, { mode: 'lines', stagger: 0.05 })

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.look__fig').forEach((fig, index) => {
        const mask = fig.querySelector('.look__mask')
        const image = fig.querySelector('img')
        const cap = fig.querySelector('.look__info')

        gsap
          .timeline({ scrollTrigger: { trigger: fig, start: 'top 90%', once: true } })
          .fromTo(mask, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.35, ease: 'power4.inOut' })
          .fromTo(image, { scale: 1.28 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
          .from(cap, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.55)

        gsap.fromTo(
          fig.querySelector('.look__index'),
          { yPercent: -60 },
          {
            yPercent: 60,
            ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )

        /* Slight drift so the three plates read as one hanging run. */
        gsap.to(fig, {
          y: () => (index % 2 === 0 ? -30 : 30),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="lookbook" className="look">
      <div className="shell look__head">
        <div>
          <span className="mono section-index">03 / Lookbook</span>
          <h2 ref={title} className="look__title">
            Dressed, not <em>modelled</em>.
          </h2>
        </div>
        <p className="look__intro">
          Shot on form — no faces, no filters.
        </p>
      </div>

      <div className="look__grid">
        {LOOKS.map((look) => (
          <figure key={look.id} className="look__fig" data-cursor="LOOK">
            <div className="look__mask">
              <img src={look.image} alt={`Mannequin wearing ${look.pieces}`} loading="lazy" decoding="async" />
              <span className="look__index" aria-hidden="true">
                {look.index}
              </span>
            </div>
            <figcaption className="look__info">
              <div className="look__info-top">
                <span className="mono">Look {look.index}</span>
                <h3>{look.title}</h3>
              </div>
              <p className="look__pieces">{look.pieces}</p>
              <p className="look__note">{look.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="shell look__foot">
        <span className="mono">Shot on form / no faces / no filters</span>
        <span className="mono">Harare, 2026</span>
      </div>
    </section>
  )
}
