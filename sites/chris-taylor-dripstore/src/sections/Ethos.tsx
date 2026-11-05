import { useRef } from 'react'
import { useScrollReveal } from '../core/reveal'
import { LiquidWordmark } from '../components/LiquidFilters'

const STATS = [
  { value: '05', label: 'Categories', note: 'shirts / shorts / jeans / track / caps' },
  { value: '07', label: 'Pieces live', note: 'restocked when the fit is right' },
  { value: '01', label: 'Rack', note: 'one room' },
  { value: '00', label: 'Filler', note: 'nothing else' },
]

export function Ethos() {
  const statement = useRef<HTMLParagraphElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  useScrollReveal(title, { mode: 'lines', stagger: 0.04 })
  useScrollReveal(statement, { mode: 'lines', stagger: 0.02, start: 'top 88%' })

  return (
    <section id="ethos" className="ethos">
      <div className="shell ethos__inner">
        <div className="ethos__aside">
          <span className="mono section-index">01 / The ethos</span>
          <div className="ethos__chrome">
            <LiquidWordmark text="HANG IT RIGHT" className="liquid-wordmark--stack" />
          </div>
        </div>

        <div className="ethos__body">
          <h2 ref={title} className="ethos__title">
            No seasons. No hype. Only pieces that hang right.
          </h2>

          <div className="ethos__cols">
            <p ref={statement} className="ethos__copy">
              One rail, one rule: a piece has to earn its hanger.
            </p>
            <div className="ethos__sign">
              <span className="serif-italic">Chris Taylor</span>
              <span className="mono">Founder</span>
            </div>
          </div>

          <dl className="ethos__stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="ethos__stat">
                <dt className="mono">{stat.label}</dt>
                <dd>
                  <span className="ethos__stat-value">{stat.value}</span>
                  <span className="ethos__stat-note">{stat.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
