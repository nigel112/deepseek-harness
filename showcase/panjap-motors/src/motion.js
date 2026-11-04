// Scroll choreography, reveals, counters, rails, cursor and clocks.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function createMotion({ reduced = false } = {}) {
  const nav = document.getElementById('nav')
  const navToggle = document.getElementById('navToggle')
  const navLinks = [...document.querySelectorAll('.nav__links a')]
  const chaptersEl = document.getElementById('chapters')
  const progress = document.querySelector('#pageProgress i')
  const heroMedia = document.getElementById('heroMedia')
  const heroContent = document.querySelector('.hero__content')
  const runway = document.querySelector('.runway')
  const track = document.getElementById('runwayTrack')
  const panels = [...track.children]
  const runwayBar = document.getElementById('runwayBar')
  const runwayIndex = document.getElementById('runwayIndex')
  const runwayTotal = document.getElementById('runwayTotal')
  const ring = document.querySelector('.ring')
  const ringScene = document.getElementById('ringScene')
  const ringDeck = document.getElementById('ringDeck')
  const ringCards = [...ringDeck.children]
  const ringDots = [...document.getElementById('ringDots').children]
  const showroom = document.querySelector('.showroom')
  const showroomMedia = document.getElementById('showroomMedia')
  const cursor = document.getElementById('cursor')
  const sections = [...document.querySelectorAll('[data-chapter]')]

  runwayTotal.textContent = String(panels.length).padStart(2, '0')

  // ── chapter rail ──────────────────────────────────────────────────────
  sections.forEach((s, i) => {
    const a = document.createElement('a')
    a.href = `#${s.id}`
    a.innerHTML = `<span>${String(i + 1).padStart(2, '0')} / ${s.dataset.chapter}</span><i></i>`
    a.setAttribute('aria-label', `Go to ${s.dataset.chapter}`)
    chaptersEl.append(a)
  })
  const chapterLinks = [...chaptersEl.children]

  // ── reveal on enter ───────────────────────────────────────────────────
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in')
        revealIO.unobserve(e.target)
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`
    revealIO.observe(el)
  })

  // ── animated counters ─────────────────────────────────────────────────
  function animateCount(el) {
    const end = Number(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    if (reduced) { el.textContent = `${end}${suffix}`; return }
    const duration = 1500
    const start = performance.now()
    function step(now) {
      const t = clamp((now - start) / duration, 0, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      el.textContent = `${Math.round(end * eased)}${suffix}`
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  const countIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target) }
    }
  }, { threshold: 0.4 })
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el))

  // ── navigation ────────────────────────────────────────────────────────
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open')
    navToggle.setAttribute('aria-expanded', String(open))
  })
  navLinks.forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('is-open')
    navToggle.setAttribute('aria-expanded', 'false')
  }))

  // ── clocks in Africa/Harare ───────────────────────────────────────────
  const navClock = document.getElementById('navClock')
  const mapClock = document.getElementById('mapClock')
  const openState = document.getElementById('openState')
  function updateClock() {
    const now = new Date()
    const hm = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Harare', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now)
    const hms = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Harare', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now)
    const day = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Harare', weekday: 'short' }).format(now)
    navClock.textContent = `HARARE ${hm} CAT`
    mapClock.textContent = `${hms} CAT`
    const [h, m] = hm.split(':').map(Number)
    const mins = h * 60 + m
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day)
    const saturday = day === 'Sat'
    const open = (weekday && mins >= 510 && mins < 1020) || (saturday && mins >= 540 && mins < 780)
    openState.textContent = open ? 'OPEN NOW' : 'CLOSED NOW'
  }
  updateClock()
  setInterval(updateClock, 1000)

  // ── cursor + magnetic buttons ─────────────────────────────────────────
  const finePointer = window.matchMedia('(pointer: fine)').matches && !reduced
  let cursorX = -100, cursorY = -100, cursorTX = -100, cursorTY = -100
  let mouseNX = 0, mouseNY = 0
  window.addEventListener('pointermove', (e) => {
    cursorTX = e.clientX
    cursorTY = e.clientY
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2
    if (finePointer) cursor.classList.add('is-on')
  }, { passive: true })
  document.addEventListener('pointerover', (e) => {
    if (!finePointer) return
    const interactive = e.target.closest('a, button, input, select, [data-magnetic], #studioCanvas')
    cursor.classList.toggle('is-active', Boolean(interactive))
  })
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector('span') || el
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      inner.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.16}px, ${(e.clientY - r.top - r.height / 2) * 0.22}px)`
    })
    el.addEventListener('pointerleave', () => { inner.style.transform = '' })
  })

  // ── horizontal runway geometry ────────────────────────────────────────
  let maxShift = 0
  function measure() {
    maxShift = Math.max(0, track.scrollWidth - window.innerWidth)
  }
  const ro = new ResizeObserver(measure)
  ro.observe(track)
  measure()
  window.addEventListener('resize', measure)

  // ── 3D ring drag ──────────────────────────────────────────────────────
  const flat = window.matchMedia('(max-width: 700px)')
  const syncFlat = () => ring.classList.toggle('is-flat', flat.matches)
  syncFlat()
  flat.addEventListener('change', syncFlat)
  let ringDrag = 0
  let ringDragging = false
  let ringLastX = 0
  ringScene.addEventListener('pointerdown', (e) => {
    if (flat.matches) return
    ringDragging = true
    ringLastX = e.clientX
    ringScene.setPointerCapture(e.pointerId)
  })
  ringScene.addEventListener('pointermove', (e) => {
    if (!ringDragging) return
    ringDrag += (e.clientX - ringLastX) * 0.32
    ringLastX = e.clientX
  })
  const endRingDrag = () => { ringDragging = false }
  ringScene.addEventListener('pointerup', endRingDrag)
  ringScene.addEventListener('pointercancel', endRingDrag)
  ringDots.forEach((dot, i) => dot.addEventListener('click', () => {
    const travel = Math.max(1, ring.offsetHeight - window.innerHeight)
    const top = ring.offsetTop + (i / (ringCards.length - 1)) * travel
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }))

  // ── per-frame scroll choreography ─────────────────────────────────────
  function update(scrollY, velocity, dt) {
    // global progress + nav
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    progress.style.transform = `scaleX(${clamp(scrollY / max, 0, 1)})`
    nav.classList.toggle('is-scrolled', scrollY > 40)

    // cursor easing
    if (finePointer) {
      cursorX += (cursorTX - cursorX) * Math.min(1, dt * 14)
      cursorY += (cursorTY - cursorY) * Math.min(1, dt * 14)
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
    }

    // active chapter / nav link
    let active = 0
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= window.innerHeight * 0.45) active = i
    }
    chapterLinks.forEach((a, i) => a.classList.toggle('is-active', i === active))
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${sections[active].id}`))

    if (reduced) return

    // hero parallax
    if (scrollY < window.innerHeight * 1.4) {
      const p = clamp(scrollY / window.innerHeight, 0, 1)
      heroMedia.style.transform = `translate3d(${mouseNX * 14}px, ${p * 90}px, 0) scale(${1.06 + p * 0.08})`
      heroContent.style.transform = `translate3d(0, ${p * -90}px, 0)`
      heroContent.style.opacity = String(clamp(1 - p * 1.35, 0, 1))
    }

    // scroll-scrubbed collection runway
    const rr = runway.getBoundingClientRect()
    const runwayTravel = Math.max(1, runway.offsetHeight - window.innerHeight)
    if (rr.bottom > 0 && rr.top < window.innerHeight) {
      const p = clamp(-rr.top / runwayTravel, 0, 1)
      track.style.transform = `translate3d(${-p * maxShift}px, 0, 0)`
      runwayBar.style.transform = `scaleX(${p})`
      for (const panel of panels) {
        const r = panel.getBoundingClientRect()
        const d = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth
        panel.style.setProperty('--ry', `${clamp(d * -17, -17, 17)}deg`)
        panel.style.setProperty('--sc', String(1 - Math.min(0.16, Math.abs(d) * 0.24)))
        panel.style.setProperty('--op', String(1 - Math.min(0.5, Math.abs(d) * 0.75)))
      }
      const idx = Math.min(panels.length, Math.round(p * (panels.length - 1)) + 1)
      runwayIndex.textContent = String(idx).padStart(2, '0')
    }

    // depth ring
    if (!flat.matches) {
      const rg = ring.getBoundingClientRect()
      const ringTravel = Math.max(1, ring.offsetHeight - window.innerHeight)
      if (rg.bottom > 0 && rg.top < window.innerHeight) {
        const p = clamp(-rg.top / ringTravel, 0, 1)
        const rotation = -p * (ringCards.length - 1) * 72 + ringDrag
        const radius = clamp(window.innerWidth * 0.24, 240, 380)
        ringCards.forEach((card, i) => {
          const angle = rotation + i * 72
          card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`
          const front = Math.cos(angle * Math.PI / 180)
          card.style.setProperty('--op', String(clamp((front + 0.1) / 1.05, 0.04, 1)))
          card.style.pointerEvents = front > 0.62 ? 'auto' : 'none'
          card.style.zIndex = String(100 + Math.round(front * 100))
        })
        const dotIdx = clamp(Math.round(-rotation / 72), 0, ringDots.length - 1)
        ringDots.forEach((d, i) => d.classList.toggle('is-active', i === dotIdx))
      }
    }

    // showroom depth parallax
    const sr = showroom.getBoundingClientRect()
    if (sr.bottom > 0 && sr.top < window.innerHeight) {
      const p = clamp((window.innerHeight - sr.top) / (window.innerHeight + sr.height), 0, 1)
      showroomMedia.style.transform = `translate3d(0, ${(p - 0.5) * -110}px, 0) scale(1.14)`
    }
  }

  return { update }
}
