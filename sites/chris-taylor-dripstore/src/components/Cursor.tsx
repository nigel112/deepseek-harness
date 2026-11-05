import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/** Blend-mode cursor with a magnetic ring and per-target labels. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dotEl = dot.current
    const ringEl = ring.current
    const labelEl = label.current
    if (!dotEl || !ringEl || !labelEl) return

    document.documentElement.classList.add('has-custom-cursor')

    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power2.out' })
    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')
      if (target) {
        ringEl.dataset.state = 'active'
        labelEl.textContent = target.dataset.cursor || ''
      } else {
        ringEl.dataset.state = ''
        labelEl.textContent = ''
      }
    }

    const onDown = () => (ringEl.dataset.pressed = 'true')
    const onUp = () => delete ringEl.dataset.pressed
    const onLeave = () => gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.3 })
    const onEnter = () => gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={dot} className="cursor__dot" />
      <div ref={ring} className="cursor__ring">
        <span ref={label} className="cursor__label" />
      </div>
    </div>
  )
}
