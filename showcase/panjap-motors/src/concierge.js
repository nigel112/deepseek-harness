// PanJap Concierge.
// Local, deterministic answers over the site's own content model, with a
// single seam: a running DeepSeek Harness host may inject
// `window.__DSH_CONCIERGE_REMOTE__ = { ask: (text) => Promise<string> }`
// (a thin wrapper around a DSH Remote method). When present, answers come
// from the agent; otherwise the offline responder keeps the UI useful.

import { vehicles, brands, money, vehicleTitle } from './data.js'

const QUICK = ['What’s in stock?', 'Opening hours', 'Where are you?', 'Book a viewing']

function localRespond(raw) {
  const q = raw.toLowerCase().trim()
  const hit = vehicles.find((v) => q.includes(v.model.toLowerCase()) || q.includes(v.make.toLowerCase()) || q.includes(v.id))

  if (hit) {
    return `${vehicleTitle(hit)} — ${money(hit.price)}, ${hit.mileage}, ${hit.condition}, in ${hit.location}. ${hit.blurb} Say “book a viewing” and I’ll pre-fill an enquiry for you.`
  }
  if (/stock|available|list|inventory|vehicles|cars|show me/.test(q)) {
    const list = vehicles.slice(0, 4).map((v) => `• ${vehicleTitle(v)} — ${money(v.price)}`).join('\n')
    return `Currently in the plaza:\n${list}\n…and more in the Current Stock section. Every vehicle is inspected and certified before it reaches the floor.`
  }
  if (/price|cost|how much|expensive|cheap|budget|under/.test(q)) {
    return `Our current stock runs from ${money(Math.min(...vehicles.map((v) => v.price)))} to ${money(Math.max(...vehicles.map((v) => v.price)))}. Prices are indicative — the showroom confirms them on +263 78 978 8615.`
  }
  if (/hour|open|close|time|saturday|sunday/.test(q)) {
    return `We’re open Monday–Friday 08:30–17:00 and Saturday 09:00–13:00, closed Sunday. All times are Harare local (CAT).`
  }
  if (/where|location|address|direction|find|map|eastlea/.test(q)) {
    return `PanJap Plaza, 19553 Robert Mugabe Road, Eastlea, Harare, Zimbabwe. There’s an interactive map in the Visit section — or ask me to book a private viewing.`
  }
  if (/contact|phone|call|whatsapp|email|number/.test(q)) {
    return `Call or WhatsApp the showroom on +263 78 978 8615. You can also use the enquiry form in the Visit section and we’ll open a pre-filled WhatsApp message.`
  }
  if (/book|viewing|test drive|appointment|visit|come see/.test(q)) {
    return `Wonderful. Use “Request a private viewing” in the Visit section: choose your vehicle, add your name and number, and we’ll open a WhatsApp enquiry straight to the team. Prefer to call? +263 78 978 8615.`
  }
  if (/brand|marque|make|manufacturer|toyota|mercedes|bmw|land rover|bentley|porsche/.test(q)) {
    return `We source 22+ marques including ${brands.slice(0, 8).join(', ')} and more. Tap any marque in the scrolling marquee to filter current stock instantly.`
  }
  if (/hire|rent|rental|lease/.test(q)) {
    return `Car Hire is one of our five divisions — reliable vehicles for personal, wedding and corporate use, daily or longer. Tell the team your dates on +263 78 978 8615.`
  }
  if (/earth|excavator|plant|machinery|construction/.test(q)) {
    return `Our Earth Moving division supplies excavators and heavy equipment for projects that move ground. Reach the team on +263 78 978 8615 with the machine and timeframe you need.`
  }
  if (/certif|inspect|verified|quality|trust|warranty/.test(q)) {
    return `Every vehicle undergoes a rigorous multi-point inspection before it reaches the showroom. 100% verified stock is the promise behind PanJap Motors.`
  }
  if (/pre.?order|import|japan|source|find me/.test(q)) {
    return `Through Pre-Order and our Japanese import network we can source a specific specification for you. Name the make, model and year and the team will take it from there.`
  }
  if (/financ|payment|deposit|loan|instal/.test(q)) {
    return `Payment structures and trade-in / buy-back options are handled personally by the showroom. Give them a call on +263 78 978 8615 and they’ll talk you through what’s available.`
  }
  if (/hello|hi|hey|help/.test(q)) {
    return `Hello! I’m the PanJap concierge. I can help with current stock, prices, opening hours, directions and private viewings. What would you like to know?`
  }
  return `I can help with stock, prices, hours, directions, car hire, earth-moving equipment and private viewings. Try one of the quick prompts, or call the showroom directly on +263 78 978 8615.`
}

export function createConcierge() {
  const root = document.getElementById('concierge')
  const launch = document.getElementById('conciergeLaunch')
  const close = document.getElementById('conciergeClose')
  const panel = document.getElementById('conciergePanel')
  const log = document.getElementById('conciergeLog')
  const quick = document.getElementById('conciergeQuick')
  const form = document.getElementById('conciergeForm')
  const input = document.getElementById('conciergeText')
  let greeted = false

  function addMsg(text, who = 'bot') {
    const el = document.createElement('div')
    el.className = `msg msg--${who}`
    el.textContent = text
    el.style.whiteSpace = 'pre-line'
    log.append(el)
    while (log.children.length > 40) log.firstElementChild.remove()
    log.scrollTop = log.scrollHeight
    return el
  }

  function setOpen(value) {
    root.classList.toggle('is-open', value)
    launch.setAttribute('aria-expanded', String(value))
    panel.setAttribute('aria-hidden', String(!value))
    if (value && !greeted) {
      greeted = true
      addMsg('Welcome to PanJap Motors, Harare. I can help with stock, prices, hours and private viewings. What are you looking for?')
    }
    if (value) setTimeout(() => input.focus(), 350)
  }

  launch.addEventListener('click', () => setOpen(!root.classList.contains('is-open')))
  close.addEventListener('click', () => setOpen(false))
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false) })

  QUICK.forEach((label) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.textContent = label
    b.addEventListener('click', () => submit(label))
    quick.append(b)
  })

  async function submit(text) {
    const value = text.trim()
    if (!value) return
    addMsg(value, 'user')
    input.value = ''
    const typing = addMsg('···', 'bot')
    typing.classList.add('msg--typing')
    let answer
    try {
      const remote = window.__DSH_CONCIERGE_REMOTE__
      answer = remote && typeof remote.ask === 'function'
        ? await remote.ask(value)
        : await Promise.resolve(localRespond(value))
    } catch (err) {
      console.warn('[panjap] concierge remote unavailable', err)
      answer = localRespond(value)
    }
    setTimeout(() => {
      typing.remove()
      addMsg(String(answer || localRespond(value)))
    }, 420)
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    submit(input.value)
  })

  return { setOpen }
}
