import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../core/gsap'

/**
 * Shared liquid-glass filter bank.
 * `#lg-warp` feeds CSS backdrop-filter on the lens elements; `#liquid-chrome`
 * displaces the chrome wordmark so it reads as poured metal, not flat type.
 */
export function LiquidFilters() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="lg-warp" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="9" result="warp" />
          <feGaussianBlur in="warp" stdDeviation="1.4" result="softWarp" />
          <feDisplacementMap in="SourceGraphic" in2="softWarp" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="liquid-chrome" x="-15%" y="-30%" width="130%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.01" numOctaves="3" seed="12" result="turb">
            <animate
              attributeName="baseFrequency"
              dur="16s"
              values="0.007 0.01; 0.012 0.006; 0.005 0.013; 0.007 0.01"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            id="liquid-chrome-map"
            in="SourceGraphic"
            in2="turb"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.32" />
        </filter>

        <linearGradient id="chrome-stops" x1="8%" y1="0%" x2="92%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="16%" stopColor="#e2e8ec" />
          <stop offset="32%" stopColor="#8d969d" />
          <stop offset="45%" stopColor="#fafcfc" />
          <stop offset="55%" stopColor="#6c757c" />
          <stop offset="70%" stopColor="#cdd5da" />
          <stop offset="86%" stopColor="#3a4044" />
          <stop offset="100%" stopColor="#f2f4f5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

interface WordmarkProps {
  text?: string
  className?: string
  /** Base displacement when idle. */
  intensity?: number
}

/** Chrome wordmark that ripples — and pours harder under the cursor. */
export function LiquidWordmark({ text = 'CHRIS TAYLOR', className = '', intensity = 8 }: WordmarkProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const map = document.getElementById('liquid-chrome-map')
    if (!map) return

    const state = { scale: intensity }
    const apply = () => map.setAttribute('scale', state.scale.toFixed(2))

    const enter = () =>
      gsap.to(state, { scale: intensity + 16, duration: 0.6, ease: 'power3.out', onUpdate: apply })
    const leave = () =>
      gsap.to(state, { scale: intensity, duration: 1.1, ease: 'power3.out', onUpdate: apply })

    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
    }
  }, [intensity])

  return (
    <span ref={ref} className={`liquid-wordmark ${className}`} data-text={text}>
      {text}
    </span>
  )
}
