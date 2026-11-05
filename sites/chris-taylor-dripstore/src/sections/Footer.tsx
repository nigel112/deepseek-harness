import { useRef } from 'react'
import { STORE } from '../data/site'
import { LiquidWordmark } from '../components/LiquidFilters'
import { useScrollReveal } from '../core/reveal'
import { scrollToId } from '../core/scroll'

export function Footer() {
  const title = useRef<HTMLHeadingElement>(null)
  useScrollReveal(title, { mode: 'lines', stagger: 0.045 })

  return (
    <footer id="store" className="store">
      <div className="shell store__top">
        <div className="store__head">
          <span className="mono section-index section-index--dark">06 / Store</span>
          <h2 ref={title} className="store__title">
            Come hang.
          </h2>
        </div>

        <div className="store__cols">
          <div className="store__col">
            <span className="mono store__label">Visit</span>
            <address className="store__address">
              {STORE.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <a
              className="store__link"
              href="https://maps.google.com/?q=Homegate+Mall+Harare"
              target="_blank"
              rel="noreferrer"
              data-cursor="MAP"
            >
              Open in maps <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="store__col">
            <span className="mono store__label">Hours</span>
            <dl className="store__hours">
              {STORE.hours.map(([day, time]) => (
                <div key={day}>
                  <dt>{day}</dt>
                  <dd>{time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="store__col">
            <span className="mono store__label">Elsewhere</span>
            <ul className="store__socials">
              {STORE.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" data-cursor="OPEN">
                    <span>{social.label}</span>
                    <span className="mono">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="store__col">
            <span className="mono store__label">The rack</span>
            <ul className="store__nav">
              {['#rack', '#lookbook', '#glass', '#drop'].map((id, i) => (
                <li key={id}>
                  <button onClick={() => scrollToId(id)}>
                    {['The rack', 'Lookbook', 'Material study', 'The drop'][i]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="store__wordmark">
        <LiquidWordmark text="DRIPSTORE" className="liquid-wordmark--mega" intensity={10} />
      </div>

      <div className="shell store__bottom">
        <span className="mono">© 2026 Chris Taylor Dripstore — Harare, Zimbabwe</span>
        <span className="mono store__credits">
          Three.js · React Three Fiber · GSAP · Lenis
        </span>
        <button className="store__top-btn mono" onClick={() => scrollToId('#top')} data-cursor="TOP">
          Back to top ↑
        </button>
      </div>

      <p className="shell store__disclaimer mono">
        Concept storefront. All prices and figures illustrative.
      </p>
    </footer>
  )
}
