import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../core/gsap'

const WORDS = ['Chris', 'Taylor', 'Dripstore']

interface Props {
  onReveal: () => void
  onDone: () => void
}

/** 0 → 100 counter, curtain lift, then the hero is free to animate. */
export function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReveal()
      onDone()
      return
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

      tl.set('.preloader__panel', { yPercent: 0 })
        .fromTo(
          '.preloader__word span',
          { yPercent: 120 },
          { yPercent: 0, duration: 1, stagger: 0.06, ease: 'power4.out' },
          0.1,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => setPct(Math.round(counter.v)),
          },
          0.2,
        )
        .fromTo('.preloader__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.2)
        .from('.preloader__meta', { opacity: 0, duration: 0.6 }, 0.2)
        .to('.preloader__word span', { yPercent: -120, duration: 0.6, stagger: 0.035, ease: 'power3.in' }, '+=0.08')
        .to('.preloader__meta', { opacity: 0, duration: 0.3 }, '<')
        .add(() => onReveal())
        .to('.preloader__panel', {
          yPercent: -101,
          duration: 1,
          ease: 'power4.inOut',
          stagger: 0.07,
        })
        .add(() => onDone())
        .set(root.current, { display: 'none' })
    }, root)

    return () => ctx.revert()
  }, [onReveal, onDone])

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__panels">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="preloader__panel" />
        ))}
      </div>
      <div className="preloader__word">
        {WORDS.map((word, i) => (
          <span key={word} className={i % 2 === 1 ? 'is-serif' : ''}>
            {word}
          </span>
        ))}
      </div>
      <div className="preloader__meta">
        <span>Harare, ZW</span>
        <span className="preloader__count">{String(pct).padStart(3, '0')}%</span>
        <span>Est. 2019</span>
      </div>
      <div className="preloader__bar">
        <span className="preloader__bar-fill" />
      </div>
    </div>
  )
}
