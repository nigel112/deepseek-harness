import { useRef, useState } from 'react'
import { Countdown } from '../components/Countdown'
import { DROP } from '../data/site'
import { useScrollReveal } from '../core/reveal'

const RULES = [
  '48 pieces, 7 styles.',
  'One per customer.',
  'Harare same-day before 15:00.',
  'Returns within 7 days, unworn.',
]

export function Drop() {
  const title = useRef<HTMLHeadingElement>(null)
  useScrollReveal(title, { mode: 'lines', stagger: 0.05 })

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <section id="drop" className="drop">
      <div className="drop__bg" aria-hidden="true">
        <span className="drop__ring" />
        <span className="drop__ring drop__ring--two" />
      </div>

      <div className="shell drop__inner">
        <div className="drop__head">
          <span className="mono section-index">05 / The drop</span>
          <h2 ref={title} className="drop__title">
            Drop {DROP.number} — {DROP.title}
          </h2>
          <p className="drop__lede">
            Restocked every second Friday, 18:00 CAT. When it's gone, it's gone.
          </p>
        </div>

        <div className="drop__grid">
          <div className="drop__count">
            <span className="mono">Hangs in</span>
            <Countdown />
            <div className="drop__date">
              <span className="mono">{DROP.label}</span>
              <span className="mono">{DROP.units} pieces / {DROP.styles} styles</span>
            </div>
          </div>

          <div className="drop__signup liquid">
            <div className="liquid__tint" />
            <div className="liquid__sheen" />
            <div className="liquid__edge" />
            <div className="drop__signup-inner">
              <span className="mono">The list</span>
              <h3>First look at the rail.</h3>
              <p>
                One email per drop, twenty minutes before the store opens.
              </p>

              {sent ? (
                <div className="drop__thanks">
                  <span className="drop__tick" aria-hidden="true">
                    ✓
                  </span>
                  <div>
                    <strong>You're on the list.</strong>
                    <span className="mono">Watch your inbox on drop morning.</span>
                  </div>
                </div>
              ) : (
                <form
                  className="drop__form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (!email.includes('@')) return
                    setSent(true)
                  }}
                >
                  <label className="sr-only" htmlFor="drop-email">
                    Email address
                  </label>
                  <input
                    id="drop-email"
                    type="email"
                    required
                    placeholder="you@harare.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                  <button type="submit" className="btn btn--acid" data-cursor="JOIN">
                    Join the list
                  </button>
                </form>
              )}

              <ul className="drop__rules">
                {RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
