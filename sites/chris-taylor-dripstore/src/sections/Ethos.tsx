import { useRef } from 'react'
import { useScrollReveal } from '../core/reveal'
import { LiquidWordmark } from '../components/LiquidFilters'

const STATS = [
  { value: '05', label: 'Categories', note: 'shirts / shorts / jeans / track / caps' },
  { value: '07', label: 'Pieces live', note: 'restocked only when the fit is right' },
  { value: '01', label: 'Rack', note: 'everything hangs in one room' },
  { value: '00', label: 'Filler', note: 'no accessories, no noise' },
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
          <p className="ethos__note">
            Every hanger is checked by hand before it hits the rail. If the shoulder sags or the seam
            twists, it never leaves the back room.
          </p>
        </div>

        <div className="ethos__body">
          <h2 ref={title} className="ethos__title">
            No seasons. No hype. Just pieces that hang right and wear until the seams tell the story.
          </h2>

          <div className="ethos__cols">
            <p ref={statement} className="ethos__copy">
              Chris Taylor started with one rail in a Baines Avenue studio and a rule that hasn't moved
              in six years: a piece has to earn its hanger. Cut loose, washed heavy, built for a Harare
              afternoon that runs long. Shirts, shorts, jeans, track bottoms, caps — that's the whole
              store, and that's the point.
            </p>
            <div className="ethos__sign">
              <span className="serif-italic">Chris Taylor</span>
              <span className="mono">Founder / cutter / the one who says no</span>
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
