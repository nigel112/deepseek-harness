import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../core/gsap'
import { scrollToId } from '../core/scroll'
import { useCart } from '../core/cart'
import { DROP } from '../data/site'

const LINKS = [
  { id: '#rack', label: 'The Rack' },
  { id: '#lookbook', label: 'Lookbook' },
  { id: '#glass', label: 'Material' },
  { id: '#drop', label: 'The Drop' },
  { id: '#store', label: 'Store' },
]

export function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { count, setOpen } = useCart()

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setSolid(self.scroll() > 24)
        setHidden(self.direction === 1 && self.scroll() > 320 && !menu)
      },
    })
    return () => st.kill()
  }, [menu])

  const go = (id: string) => {
    setMenu(false)
    scrollToId(id)
  }

  return (
    <>
      <div className={`ticker ${ready ? 'is-ready' : ''}`}>
        <div className="ticker__track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              Drop {DROP.number} — {DROP.title} <b>/</b> {DROP.label} <b>/</b> 48 pieces only <b>/</b>{' '}
              Worldwide shipping from Harare <b>/</b>
            </span>
          ))}
        </div>
      </div>

      <header
        ref={navRef}
        className={`nav ${solid ? 'is-solid' : ''} ${hidden ? 'is-hidden' : ''} ${ready ? 'is-ready' : ''}`}
      >
        <div className="nav__glass">
          <button className="nav__brand" onClick={() => go('#top')} data-cursor="TOP" aria-label="Chris Taylor Dripstore, back to top">
            <span className="nav__mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 21V11l10 10V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
            </span>
            <span className="nav__name">
              Chris Taylor <em>Dripstore</em>
            </span>
          </button>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((link) => (
              <button key={link.id} className="nav__link" onClick={() => go(link.id)} data-cursor="GO">
                <span>{link.label}</span>
                <span className="nav__link-line" aria-hidden="true" />
              </button>
            ))}
          </nav>

          <div className="nav__right">
            <button className="nav__bag" onClick={() => setOpen(true)} data-cursor="OPEN">
              <span>Bag</span>
              <span className="nav__bag-count">{String(count).padStart(2, '0')}</span>
            </button>
            <button
              className="nav__burger"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <div className="mobile-menu__inner">
          {LINKS.map((link, i) => (
            <button key={link.id} onClick={() => go(link.id)} style={{ transitionDelay: `${0.06 * i}s` }}>
              <span className="mobile-menu__index">0{i + 1}</span>
              {link.label}
            </button>
          ))}
          <a href="https://www.instagram.com/christaylor.dripstore/" target="_blank" rel="noreferrer" className="mobile-menu__social">
            Instagram / TikTok — @christaylor.dripstore
          </a>
        </div>
      </div>
    </>
  )
}
