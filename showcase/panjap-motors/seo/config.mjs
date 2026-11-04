import { vehicles, vehicleTitle } from '../src/data.js'

// ───────────────────────────────────────────────────────────────────────────
// Single source of truth for every absolute URL and business fact used by
// metadata, JSON-LD, robots.txt and sitemap.xml.
//
// Override the production origin without editing files:
//   SITE_URL=https://your-domain.example npm run build
// ───────────────────────────────────────────────────────────────────────────

export const SITE_URL = (process.env.SITE_URL || 'https://panjapmotorszim.com').replace(/\/+$/, '')

export const SITE_NAME = 'PanJap Motors'
export const SITE_TITLE = 'PanJap Motors | Premium Cars, Japanese Imports & Car Hire in Harare'
export const META_DESCRIPTION =
  "PanJap Motors, Harare: certified luxury vehicles, Japanese imports, car hire and earth-moving equipment. 19553 Robert Mugabe Rd, Eastlea. Call +263 78 978 8615."
export const SOCIAL_DESCRIPTION =
  "Discover Zimbabwe's premier automotive destination. Browse a curated collection of premium SUVs, sedans and Japanese imports, inspected and certified before they reach our Harare showroom."
export const OG_TITLE = 'PanJap Motors — The Ultimate Driving Experience'

export const SITE_LOCALE = 'en_ZW'
export const SITE_LANG = 'en-ZW'
export const SITE_REGION = 'ZW-HA'

export const PHONE = '+263789788615'
export const PHONE_DISPLAY = '+263 78 978 8615'
export const EMAIL = null // intentionally omitted — not published by the business

export const ADDRESS = {
  streetAddress: '19553 Robert Mugabe Road, Eastlea',
  addressLocality: 'Harare',
  addressRegion: 'Harare',
  addressCountry: 'ZW',
}

export const GEO = { latitude: -17.8252, longitude: 31.0335 }

export const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=19553+Robert+Mugabe+Road+Eastlea+Harare'

// Verify these profiles still belong to the business before production launch.
export const SOCIAL_PROFILES = [
  'https://www.facebook.com/panjapmotors/',
  'https://x.com/Panjapmotorszim',
]

export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:30', closes: '17:00' },
  { days: ['Saturday'], opens: '09:00', closes: '13:00' },
]

export const HERO_IMAGE = '/assets/hero.jpg'
export const IMAGE_WIDTH = 1376
export const IMAGE_HEIGHT = 768
export const IMAGE_ALT =
  'A luxury SUV inside a tunnel of glowing light arches at PanJap Motors, Harare'

// Used for the image sitemap (image:loc / image:title).
// Every newly sourced listing contributes its plate, de-duplicated because
// two Range Rover Sport posts share one render.
const SOCIAL_IMAGE_ENTRIES = [...new Map(
  vehicles
    .filter((v) => v.source)
    .map((v) => [v.image, {
      path: v.image,
      title: `${vehicleTitle(v)} — ${v.source.channel} listing`,
    }]),
).values()]

export const IMAGE_ENTRIES = [
  { path: '/assets/hero.jpg', title: 'PanJap Motors light tunnel and premium SUV' },
  { path: '/assets/showroom.jpg', title: 'PanJap Motors showroom at night, Harare' },
  { path: '/assets/g-wagon.jpg', title: 'Mercedes-Benz G63 AMG in the PanJap studio' },
  { path: '/assets/maybach.jpg', title: 'Mercedes-Maybach S680 luxury sedan' },
  { path: '/assets/range-rover.jpg', title: 'Range Rover Sport SVR Overfinch' },
  { path: '/assets/fortuner.jpg', title: 'Toyota Fortuner premium SUV' },
  { path: '/assets/bentayga.jpg', title: 'Bentley Bentayga luxury SUV' },
  { path: '/assets/cayenne.jpg', title: 'Porsche Cayenne performance SUV' },
  { path: '/assets/expedition.jpg', title: 'PanJap vehicle on an African expedition' },
  { path: '/assets/earthmoving.jpg', title: 'Earth-moving equipment supplied by PanJap Motors' },
  ...SOCIAL_IMAGE_ENTRIES,
]
