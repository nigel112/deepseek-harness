import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource-variable/manrope/index.css'

import { vehicles, brands, divisions, showroomSlides, paints, money, vehicleTitle } from './data.js'
import { resolveStudioModels, resolveStockRenders } from './studioModels.js'
import { createDust } from './particles.js'
import { createMotion } from './motion.js'
import { createConcierge } from './concierge.js'

const $ = (sel) => document.querySelector(sel)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const WHATSAPP = 'https://wa.me/263789788615'
const waLink = (text) => `${WHATSAPP}?text=${encodeURIComponent(text)}`

/* ──────────────────────────────────────────────────────────────────────────
   1. Collection runway
   ────────────────────────────────────────────────────────────────────────── */
const track = $('#runwayTrack')
// The pinned runway stays curated; the full live catalogue lives in #stock.
track.innerHTML = vehicles.slice(0, 8).map((v, i) => `
  <article class="vpanel">
    <div class="vpanel__media" data-open="${v.id}" role="button" tabindex="0" aria-label="View ${vehicleTitle(v)}">
      <img src="${v.image}" alt="${vehicleTitle(v)}" width="1376" height="768" loading="lazy" decoding="async" />
      <span class="vpanel__badge">${v.badge}</span>
    </div>
    <div class="vpanel__info">
      <span class="vpanel__num">${String(i + 1).padStart(2, '0')}</span>
      <div>
        <h3>${v.model}</h3>
        <small>${[v.year, v.make, v.condition].filter(Boolean).join(' · ')}</small>
        <p class="vpanel__price">${money(v.price)}</p>
      </div>
      <button class="vpanel__open" data-open="${v.id}" aria-label="Open ${vehicleTitle(v)}">↗</button>
    </div>
    <dl class="vpanel__specs">
      ${v.specs.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('')}
    </dl>
  </article>
`).join('')

/* ──────────────────────────────────────────────────────────────────────────
   2. Spatial studio controls
   ────────────────────────────────────────────────────────────────────────── */
const paintsEl = $('#paints')
const paintName = $('#paintName')
const telemetry = $('#telemetry')
const studioCanvas = $('#studioCanvas')
const studioStage = $('#studioStage')
const modelsEl = $('#studioModels')
const modelNameEl = $('#studioModelName')
const modelMetaEl = $('#modelMeta')
const modelCreditEl = $('#modelCredit')

paintsEl.innerHTML = paints.map((p, i) => `
  <button class="studio__paint${i === 0 ? ' is-active' : ''}" data-paint="${i}" style="--swatch:${p.hex}" aria-label="${p.name} finish" title="${p.name}"></button>
`).join('')

// Three.js is a separate async chunk so the hero paints immediately.
let studio = null
function showStudioFallback() {
  studioStage.classList.add('is-fallback')
  modelsEl.classList.add('is-disabled')
  modelsEl.querySelectorAll('button').forEach((button) => { button.disabled = true })
  studioStage.querySelectorAll('button').forEach((button) => { button.disabled = true })
  studioStage.querySelector('.studio__hud--tl').textContent = 'STATIC PREVIEW · WEBGL UNAVAILABLE'
  modelNameEl.textContent = 'STUDIO PREVIEW'
  modelMetaEl.textContent = 'STATIC PREVIEW'
  modelCreditEl.textContent = 'Interactive 3D requires WebGL 2.'
  studioStage.insertAdjacentHTML('afterbegin', `
    <div class="studio__fallback">
      <p>WebGL is unavailable on this device — here is the PanJap light tunnel.</p>
    </div>`)
}
const studioPromise = Promise.all([
  import('./showroom3d.js'),
  resolveStudioModels(),
  resolveStockRenders(vehicles),
])
  .then(([{ createStudio3D }, models, renders]) => {
    modelsEl.innerHTML = '<span class="studio__models-label">3D MODEL</span>' + models.map((m, i) => `
      <button class="studio__model${i === 0 ? ' is-active' : ''}" data-model="${m.id}" type="button" aria-pressed="${i === 0}">
        <span>${m.label}</span><i>${m.kind === 'glb' ? 'GLB' : m.kind === 'renders' ? 'RENDERS' : 'MESH'}</i>
      </button>`).join('')
    studio = createStudio3D(studioCanvas, paints, {
      onPaint: (name) => { paintName.textContent = name.toUpperCase() },
      onTelemetry: (text) => { telemetry.textContent = text },
      onModel: (m) => {
        modelNameEl.innerHTML = `${m.label.toUpperCase()}<br /><small>${m.meta || 'SPATIAL STUDIO / WEBGL'}</small>`
        if (modelMetaEl) modelMetaEl.textContent = m.meta || ''
        modelCreditEl.textContent = m.error
          ? 'That 3D mesh could not be loaded — showing the in-browser concept SUV instead.'
          : (m.credit || '')
        modelsEl.querySelectorAll('.studio__model').forEach((el) => {
          el.classList.toggle('is-active', el.dataset.model === m.id)
          el.classList.toggle('is-loading', !!m.loading && el.dataset.model === m.id)
        })
      },
    }, { models, renders })
    if (!studio) showStudioFallback()
    return studio
  })
  .catch((err) => {
    console.warn('[panjap] 3D studio failed to initialise', err)
    showStudioFallback()
    return null
  })

modelsEl.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-model]')
  if (!b) return
  const s = await studioPromise
  if (!s) return
  modelsEl.querySelectorAll('.studio__model').forEach((el) => {
    el.classList.toggle('is-active', el === b)
    el.setAttribute('aria-pressed', String(el === b))
  })
  await s.setModel(b.dataset.model)
})

paintsEl.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-paint]')
  if (!b) return
  const i = Number(b.dataset.paint)
  paintsEl.querySelectorAll('.studio__paint').forEach((el) => el.classList.toggle('is-active', el === b))
  const s = await studioPromise
  s?.setPaint(i)
})
const autoBtn = $('#autoRotate')
autoBtn.addEventListener('click', async () => {
  const s = await studioPromise
  if (!s) return
  const value = s.setAutoRotate(!s.getAutoRotate())
  autoBtn.innerHTML = `AUTO-ROTATE <b>${value ? 'ON' : 'OFF'}</b>`
  autoBtn.setAttribute('aria-pressed', String(value))
})
const xrayBtn = $('#xray')
xrayBtn.addEventListener('click', async () => {
  const s = await studioPromise
  if (!s) return
  const value = s.setXray(!s.getXray())
  xrayBtn.innerHTML = `X-RAY <b>${value ? 'ON' : 'OFF'}</b>`
  xrayBtn.setAttribute('aria-pressed', String(value))
})
$('#resetView').addEventListener('click', async () => {
  const s = await studioPromise
  s?.resetView()
})

/* ──────────────────────────────────────────────────────────────────────────
   3. Divisions ring
   ────────────────────────────────────────────────────────────────────────── */
$('#ringDeck').innerHTML = divisions.map((d) => `
  <article class="ring-card">
    <img src="${d.image}" alt="${d.title}" width="1376" height="768" loading="lazy" decoding="async" />
    <span class="ring-card__num">${d.n} / 05</span>
    <div class="ring-card__body">
      <span class="ring-card__tag">${d.tag}</span>
      <h3>${d.title}</h3>
      <p>${d.desc}</p>
      <a href="#stock" data-filter-jump="${d.filter}">Explore division ↗</a>
    </div>
  </article>
`).join('')
$('#ringDots').innerHTML = divisions.map((_, i) => `<button type="button" class="${i === 0 ? 'is-active' : ''}" aria-label="Show division ${i + 1}"></button>`).join('')

/* ──────────────────────────────────────────────────────────────────────────
   4. Showroom slides
   ────────────────────────────────────────────────────────────────────────── */
const showroomImg = $('#showroomImg')
$('#showroomSlides').innerHTML = showroomSlides.map((s, i) => `
  <button type="button" class="${i === 0 ? 'is-active' : ''}" data-slide="${i}">${String(i + 1).padStart(2, '0')} ${s.label}</button>
`).join('')
let slideTimer = null
$('#showroomSlides').addEventListener('click', (e) => {
  const b = e.target.closest('[data-slide]')
  if (!b) return
  const i = Number(b.dataset.slide)
  const s = showroomSlides[i]
  $('#showroomSlides').querySelectorAll('button').forEach((el) => el.classList.toggle('is-active', el === b))
  showroomImg.style.opacity = '0'
  clearTimeout(slideTimer)
  slideTimer = setTimeout(() => {
    showroomImg.src = s.image
    showroomImg.alt = s.caption
    showroomImg.style.opacity = '1'
    $('#showroomCaption').textContent = s.caption
    $('#showroomMeta').textContent = s.meta
  }, reduced ? 0 : 260)
})

/* ──────────────────────────────────────────────────────────────────────────
   5. Marquees
   ────────────────────────────────────────────────────────────────────────── */
function fillMarquee(el, list) {
  const items = list.map((b) => `<button class="marque" data-brand="${b}" type="button">${b}<i>◆</i></button>`).join('')
  el.innerHTML = `<div class="marquee__track">${items}${items}</div>`
}
fillMarquee($('#marqueeA'), brands.slice(0, Math.ceil(brands.length / 2)))
fillMarquee($('#marqueeB'), brands.slice(Math.ceil(brands.length / 2)))

/* ──────────────────────────────────────────────────────────────────────────
   6. Filterable stock
   ────────────────────────────────────────────────────────────────────────── */
const FILTERS = ['All', 'Brand New', 'Pre-Owned', 'SUV', 'Sedan', 'Off-road', 'Pickup', 'Under $100k']
const chipsEl = $('#filterChips')
const stockGrid = $('#stockGrid')
const stockSearch = $('#stockSearch')
const state = { filter: 'All', query: '' }

chipsEl.innerHTML = FILTERS.map((f, i) => `<button class="chip${i === 0 ? ' is-active' : ''}" data-filter="${f}" type="button">${f}</button>`).join('')

function matches(v) {
  const f = state.filter
  if (f === 'Under $100k' && !(v.price != null && v.price < 100000)) return false
  if ((f === 'Brand New' || f === 'Pre-Owned') && v.condition !== f) return false
  if (['SUV', 'Sedan', 'Off-road', 'Pickup'].includes(f) && v.type !== f) return false
  if (state.query) {
    const hay = [v.year, v.make, v.model, v.type, v.condition, v.location].filter(Boolean).join(' ').toLowerCase()
    if (!hay.includes(state.query.toLowerCase())) return false
  }
  return true
}

function renderStock() {
  const list = vehicles.filter(matches)
  if (!list.length) {
    stockGrid.innerHTML = '<p class="stock__empty">NO VEHICLES MATCH THAT SEARCH — TRY ANOTHER MARQUE OR CLEAR THE FILTERS.</p>'
    return
  }
  stockGrid.innerHTML = list.map((v, i) => `
    <article class="stock-card" id="vehicle-${v.id}" style="animation-delay:${i * 55}ms">
      <div class="stock-card__media" data-open="${v.id}">
        <img src="${v.image}" alt="${vehicleTitle(v)}" loading="lazy" />
        <span class="stock-card__badge">${v.badge}</span>
        <button class="stock-card__quick" data-open="${v.id}" type="button">Quick view ↗</button>
      </div>
      <div class="stock-card__body">
        <h3>${vehicleTitle(v)}</h3>
        <small>${v.condition} · ${v.type} · ${v.location}</small>
        <p class="stock-card__price">${money(v.price)}</p>
        <p class="stock-card__source">${v.source ? `${v.source.channel} · ${v.source.date}` : 'PANJAP CATALOGUE'}</p>
        <div class="stock-card__meta"><span>${v.mileage}</span><span>${v.year || '—'}</span><span>VERIFIED</span></div>
      </div>
    </article>
  `).join('')
}

function setFilter(filter) {
  state.filter = filter
  chipsEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter))
  renderStock()
}

chipsEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-filter]')
  if (b) setFilter(b.dataset.filter)
})
stockSearch.addEventListener('input', () => {
  state.query = stockSearch.value.trim()
  renderStock()
})
document.addEventListener('click', (e) => {
  const brandBtn = e.target.closest('[data-brand]')
  if (brandBtn) {
    state.filter = 'All'
    state.query = brandBtn.dataset.brand
    stockSearch.value = brandBtn.dataset.brand
    chipsEl.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === 'All'))
    renderStock()
    document.getElementById('stock').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }
  const jump = e.target.closest('[data-filter-jump]')
  if (jump) {
    state.query = ''
    stockSearch.value = ''
    setFilter(jump.dataset.filterJump)
  }
})
renderStock()

/* ──────────────────────────────────────────────────────────────────────────
   7. Vehicle quick view
   ────────────────────────────────────────────────────────────────────────── */
const modal = $('#vehicleModal')
function openModal(id) {
  const v = vehicles.find((x) => x.id === id)
  if (!v) return
  $('#modalImg').src = v.image
  $('#modalImg').alt = vehicleTitle(v)
  $('#modalBadge').textContent = v.badge
  $('#modalKicker').textContent = `PANJAP MOTORS / ${v.condition.toUpperCase()} / ${v.location.toUpperCase()}`
  $('#modalTitle').textContent = vehicleTitle(v)
  $('#modalBlurb').textContent = v.blurb
  $('#modalPrice').textContent = money(v.price)
  const specs = [
    ['Year', v.year || 'On application'],
    ['Mileage', v.mileage],
    ['Location', v.location],
    ['Stock status', v.condition],
    ...v.specs,
    ['Listed', v.source ? `${v.source.channel} · ${v.source.date}` : 'PanJap catalogue'],
  ]
  // Some listings repeat a spec (e.g. Mileage) in their own specs array; keep
  // the first occurrence so no label appears twice in the quick view.
  const seen = new Set()
  const uniqueSpecs = specs.filter(([k]) => {
    const key = k.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  $('#modalSpecs').innerHTML = uniqueSpecs.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join('')
  $('#modalWhatsapp').href = waLink(`Hi PanJap Motors, I'd like to know more about the ${vehicleTitle(v)} listed at ${money(v.price)}. Is it still available?`)
  modal.hidden = false
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  modal.hidden = true
  document.body.style.overflow = ''
}
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open]')
  if (opener) openModal(opener.dataset.open)
  if (e.target.closest('[data-close]')) closeModal()
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
  const focus = document.activeElement
  if ((e.key === 'Enter' || e.key === ' ') && focus?.matches('.vpanel__media[data-open]')) {
    e.preventDefault()
    openModal(focus.dataset.open)
  }
})

/* ──────────────────────────────────────────────────────────────────────────
   8. Visit form → pre-filled WhatsApp enquiry
   ────────────────────────────────────────────────────────────────────────── */
$('#vehicleSelect').innerHTML = '<option value="General enquiry">General enquiry / not sure yet</option>' +
  vehicles.map((v) => `<option value="${vehicleTitle(v)}">${vehicleTitle(v)} — ${money(v.price)}</option>`).join('')

$('#viewingForm').addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(e.currentTarget)
  const name = String(data.get('name') || '').trim()
  const phone = String(data.get('phone') || '').trim()
  const vehicle = String(data.get('vehicle') || 'General enquiry')
  const message = `Hello PanJap Motors, I'd like to request a private viewing.\n\nName: ${name}\nPhone: ${phone}\nVehicle of interest: ${vehicle}\n\nPlease let me know a convenient time. Thank you!`
  const url = waLink(message)
  const note = $('#formNote')
  note.classList.add('is-success')
  note.textContent = `Thank you, ${name.split(' ')[0] || 'there'} — your enquiry is ready. `
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener'
  link.style.color = 'var(--gold)'
  link.textContent = 'Open WhatsApp ↗'
  note.append(link, " if it didn't open automatically.")
  window.open(url, '_blank', 'noopener')
})

/* ──────────────────────────────────────────────────────────────────────────
   9. Boot: preloader, motion loop, concierge
   ────────────────────────────────────────────────────────────────────────── */
$('#year').textContent = String(new Date().getFullYear())
createConcierge()
const motion = createMotion({ reduced })
const dust = createDust($('#dustCanvas'))

function runPreloader() {
  const preloader = $('#preloader')
  const bar = $('#preloadBar')
  const count = $('#preloadCount')
  const start = performance.now()
  let finished = false
  function finish() {
    if (finished) return
    finished = true
    document.body.classList.add('is-ready')
    preloader.classList.add('is-done')
    setTimeout(() => preloader.remove(), 1300)
  }
  function tick(now) {
    const p = Math.min(1, (now - start) / 1250)
    const eased = 1 - Math.pow(1 - p, 3)
    bar.style.width = `${eased * 100}%`
    count.textContent = String(Math.round(eased * 100)).padStart(2, '0')
    if (p < 1) requestAnimationFrame(tick)
    else finish()
  }
  requestAnimationFrame(tick)
  setTimeout(finish, 2800)
}
runPreloader()

let last = performance.now()
let prevScroll = window.scrollY
let velocity = 0
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  const scrollY = window.scrollY
  velocity += ((scrollY - prevScroll) - velocity) * 0.18
  prevScroll = scrollY
  motion.update(scrollY, velocity, dt)
  dust.frame(now / 1000)
  studio?.frame(dt, now / 1000, velocity)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)
