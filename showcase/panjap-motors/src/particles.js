// Lightweight 2D dust field for the hero. No WebGL, no dependencies.

export function createDust(canvas) {
  if (!canvas) return { frame() {}, destroy() {} }
  const ctx = canvas.getContext('2d')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0
  let h = 0
  let dpr = 1
  let motes = []
  let visible = true
  let mx = -1000
  let my = -1000
  let t = 0

  function resize() {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = rect.width
    h = rect.height
    canvas.width = Math.max(1, Math.floor(w * dpr))
    canvas.height = Math.max(1, Math.floor(h * dpr))
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.min(180, Math.max(40, Math.floor((w * h) / 11000)))
    motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.35,
      vx: (Math.random() - 0.5) * 0.14,
      vy: -Math.random() * 0.2 - 0.03,
      a: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }))
  }

  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
  io.observe(canvas)

  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect()
    mx = e.clientX - rect.left
    my = e.clientY - rect.top
  }, { passive: true })

  function frame(time) {
    if (!visible || w === 0) return
    t = reduced ? 0 : time
    ctx.clearRect(0, 0, w, h)
    for (const m of motes) {
      if (!reduced) {
        m.x += m.vx + Math.sin(t * 0.35 + m.phase) * 0.09
        m.y += m.vy
        const dx = m.x - mx
        const dy = m.y - my
        const d2 = dx * dx + dy * dy
        if (d2 < 11000 && d2 > 1) {
          const push = (11000 - d2) / 11000 * 0.7
          const d = Math.sqrt(d2)
          m.x += (dx / d) * push
          m.y += (dy / d) * push
        }
        if (m.y < -8) { m.y = h + 8; m.x = Math.random() * w }
        if (m.x < -8) m.x = w + 8
        if (m.x > w + 8) m.x = -8
      }
      const flicker = reduced ? 1 : 0.72 + Math.sin(t * 1.6 + m.phase) * 0.28
      ctx.beginPath()
      ctx.fillStyle = `rgba(238, 200, 139, ${m.a * flicker})`
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  function destroy() {
    ro.disconnect()
    io.disconnect()
  }

  return { frame, destroy }
}
