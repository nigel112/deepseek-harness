import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { CATEGORIES, DROP, PRODUCTS, type Category, type Product } from '../data/site'
import { useCart } from '../lib/cart'
import { scrollToId } from '../lib/scroll'

function RackItem({ product, muted }: { product: Product; muted: boolean }) {
  const card = useRef<HTMLElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const quick = useRef<HTMLSpanElement>(null)
  const { add } = useCart()

  useEffect(() => {
    const el = card.current
    const image = img.current
    if (!el || !image || prefersReducedMotion()) return

    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    const rotTo = gsap.quickTo(el, 'rotation', { duration: 0.65, ease: 'power3.out' })
    const imgTo = gsap.quickTo(image, 'scale', { duration: 0.8, ease: 'power3.out' })

    const enter = () => {
      yTo(-16)
      rotTo(-1.4)
      imgTo(1.05)
      if (quick.current) gsap.to(quick.current, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
    }
    const leave = () => {
      yTo(0)
      rotTo(0)
      imgTo(1)
      if (quick.current) gsap.to(quick.current, { yPercent: 110, opacity: 0, duration: 0.35, ease: 'power3.in' })
    }

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <article
      ref={card}
      className={`rack-item ${muted ? 'is-muted' : ''}`}
      data-code={product.code}
      data-cursor="ADD"
    >
      <div className="rack-item__hanger" aria-hidden="true">
        <svg viewBox="0 0 60 132" fill="none">
          <path d="M30 132V30" stroke="currentColor" strokeWidth="1.2" />
          <path d="M30 30c0-14 12-14 12-2 0 7-6 9-12 9" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="30" cy="31" r="2.6" fill="currentColor" />
        </svg>
      </div>

      <button
        type="button"
        className="rack-item__frame"
        onClick={() => add(product.id)}
        aria-label={`Add ${product.name} to bag, $${product.price}`}
      >
        <img ref={img} src={product.image} alt={`${product.name} — ${product.colorway} ${product.category.toLowerCase()} hanging on a wooden hanger`} loading="lazy" decoding="async" />
        <span className="rack-item__quick">
          <span ref={quick}>Add to bag</span>
        </span>
      </button>

      <div className="rack-item__info">
        <div className="rack-item__row">
          <span className="mono rack-item__code">{product.code}</span>
          <span className="rack-item__price">${product.price}</span>
        </div>
        <h3 className="rack-item__name">{product.name}</h3>
        <div className="rack-item__row rack-item__row--dim">
          <span>{product.category}</span>
          <span>{product.sizes[0]} — {product.sizes[product.sizes.length - 1]}</span>
        </div>
      </div>
    </article>
  )
}

export function Rack() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<'All' | Category>('All')

  const visible = active === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)

  /* Horizontal rail, pinned on desktop only. */
  useEffect(() => {
    const sectionEl = section.current
    const trackEl = track.current
    if (!sectionEl || !trackEl) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 48)
      const setSkew = gsap.quickTo(trackEl, 'skewX', { duration: 0.5, ease: 'power3.out' })

      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.25}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setSkew(gsap.utils.clamp(-3.2, 3.2, self.getVelocity() / -1400)),
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(trackEl, { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => window.clearTimeout(id)
  }, [active])

  return (
    <section ref={section} id="rack" className="rack">
      <div className="rack__inner">
        <header className="rack__head shell">
          <div className="rack__head-left">
            <span className="mono section-index section-index--dark">02 / The rack</span>
            <h2 className="rack__title">
              Seven pieces,
              <br />
              one <em>rack</em>
            </h2>
          </div>

          <div className="rack__head-right">
            <p className="rack__intro">
              Shirts, shorts, jeans, track bottoms and caps. Hover to look closer — click to hang it in
              your bag.
            </p>
            <div className="rack__filters" role="group" aria-label="Filter the rack">
              <button
                className={`rack__chip ${active === 'All' ? 'is-active' : ''}`}
                onClick={() => setActive('All')}
                aria-pressed={active === 'All'}
              >
                All <sup>{String(PRODUCTS.length).padStart(2, '0')}</sup>
              </button>
              {CATEGORIES.map((category) => {
                const count = PRODUCTS.filter((p) => p.category === category).length
                return (
                  <button
                    key={category}
                    className={`rack__chip ${active === category ? 'is-active' : ''}`}
                    onClick={() => setActive(category)}
                    aria-pressed={active === category}
                  >
                    {category} <sup>{String(count).padStart(2, '0')}</sup>
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <div className="rack__viewport">
          <div className="rack__rail" aria-hidden="true">
            <span className="rack__rail-end" />
            <span className="rack__rail-label mono">Rack 01 — Baines Avenue</span>
          </div>

          <div className="rack__scroller">
            <div ref={track} className="rack__track">
              {PRODUCTS.map((product) => (
                <RackItem key={product.id} product={product} muted={active !== 'All' && product.category !== active} />
              ))}

              <div className="rack__end">
                <span className="mono">End of rack</span>
                <h3>
                  The rest of Drop {DROP.number} hangs {DROP.label.split(' — ')[0]}
                </h3>
                <p>Forty-eight pieces. Seven styles. One per customer.</p>
                <button className="btn btn--line btn--dark" onClick={() => scrollToId('#drop')} data-cursor="DROP">
                  Get on the drop list
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="rack__foot shell">
          <span className="mono">The rail runs sideways — keep scrolling</span>
          <span className="mono rack__foot-note">
            Showing {String(visible.length).padStart(2, '0')} of {String(PRODUCTS.length).padStart(2, '0')}
          </span>
        </footer>
      </div>
    </section>
  )
}
