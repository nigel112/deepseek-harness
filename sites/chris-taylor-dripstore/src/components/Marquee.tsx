interface Props {
  items: string[]
  variant?: 'acid' | 'outline' | 'quiet'
  reverse?: boolean
  speed?: number
  className?: string
  separator?: string
}

/** CSS-driven loop — duplicated content keeps it seamless at any width. */
export function Marquee({ items, variant = 'outline', reverse = false, speed = 34, className = '', separator = '✳' }: Props) {
  const row = [...items, ...items]

  return (
    <div
      className={`marquee marquee--${variant} ${reverse ? 'marquee--reverse' : ''} ${className}`}
      style={{ ['--marquee-speed' as string]: `${speed}s` }}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee__item">
            {item}
            <i className="marquee__sep">{separator}</i>
          </span>
        ))}
      </div>
    </div>
  )
}
