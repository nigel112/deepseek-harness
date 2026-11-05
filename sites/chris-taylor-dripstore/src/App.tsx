import { useCallback, useEffect, useState } from 'react'
import { CartProvider } from './lib/cart'
import { getLenis, useSmoothScroll } from './lib/scroll'
import { ScrollTrigger } from './lib/gsap'
import { LiquidFilters } from './components/LiquidFilters'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { Nav } from './components/Nav'
import { Marquee } from './components/Marquee'
import { CartDrawer } from './components/CartDrawer'
import { Hero } from './sections/Hero'
import { Ethos } from './sections/Ethos'
import { Rack } from './sections/Rack'
import { Lookbook } from './sections/Lookbook'
import { Glass } from './sections/Glass'
import { Drop } from './sections/Drop'
import { Footer } from './sections/Footer'

const CATEGORY_ROW = ['Shirts', 'Shorts', 'Jeans', 'Track bottoms', 'Caps']

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)

  useSmoothScroll()

  const onReveal = useCallback(() => {
    setRevealed(true)
  }, [])

  const onDone = useCallback(() => {
    setReady(true)
    document.documentElement.classList.remove('is-loading')
    ScrollTrigger.refresh()
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    const lenis = getLenis()
    lenis?.stop()

    return () => {
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  useEffect(() => {
    if (!ready) {
      getLenis()?.stop()
      return
    }
    getLenis()?.start()
    const refresh = () => ScrollTrigger.refresh()
    const timers = [600, 1600, 3200].map((delay) => window.setTimeout(refresh, delay))
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => undefined)
    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('load', refresh)
    }
  }, [ready])

  return (
    <CartProvider>
      <LiquidFilters />
      <Cursor />
      <div className="grain" aria-hidden="true" />

      <Preloader onReveal={onReveal} onDone={onDone} />
      <Nav ready={revealed} />

      <main>
        <Hero ready={revealed} />

        <Marquee
          variant="acid"
          speed={38}
          items={['Chris Taylor', 'Dripstore', 'Harare', 'Est. 2019', 'Shirts · Shorts · Jeans · Track · Caps']}
          separator="✳"
        />

        <Ethos />

        <Marquee
          variant="outline"
          reverse
          speed={46}
          items={['Shirts', 'Shorts', 'Jeans', 'Track bottoms', 'Caps', 'No filler']}
          separator="/"
        />

        <Rack />
        <Lookbook />
        <Glass />
        <Drop />
      </main>

      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
