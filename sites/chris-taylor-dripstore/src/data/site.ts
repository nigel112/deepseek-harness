export type Category = 'Shirts' | 'Shorts' | 'Jeans' | 'Track bottoms' | 'Caps'

export interface Product {
  id: string
  code: string
  name: string
  category: Category
  price: number
  image: string
  colorway: string
  fit: string
  sizes: string[]
  note: string
}

export const CATEGORIES: Category[] = ['Shirts', 'Shorts', 'Jeans', 'Track bottoms', 'Caps']

export const PRODUCTS: Product[] = [
  {
    id: 'ct-001',
    code: 'CT—001',
    name: 'Slab Tee',
    category: 'Shirts',
    price: 38,
    image: '/img/opt/rack-shirt-01.webp',
    colorway: 'Coal wash',
    fit: 'Oversized / boxy',
    sizes: ['S', 'M', 'L', 'XL'],
    note: '260gsm heavyweight cotton, garment dyed, drop shoulder.',
  },
  {
    id: 'ct-002',
    code: 'CT—002',
    name: 'Bone Tee',
    category: 'Shirts',
    price: 34,
    image: '/img/opt/rack-shirt-02.webp',
    colorway: 'Raw bone',
    fit: 'Boxy / cropped',
    sizes: ['XS', 'S', 'M', 'L'],
    note: 'Undyed loopback cotton, ribbed collar, blind hem.',
  },
  {
    id: 'ct-003',
    code: 'CT—003',
    name: 'Raw Cut',
    category: 'Shorts',
    price: 52,
    image: '/img/opt/rack-shorts.webp',
    colorway: 'Mid indigo',
    fit: 'Baggy / knee',
    sizes: ['28', '30', '32', '34'],
    note: '14oz rigid denim, selvedge outseam, raw hem.',
  },
  {
    id: 'ct-004',
    code: 'CT—004',
    name: 'Baggy 32',
    category: 'Jeans',
    price: 78,
    image: '/img/opt/rack-jeans.webp',
    colorway: 'Vintage light',
    fit: 'Wide leg / stacked',
    sizes: ['28', '30', '32', '34', '36'],
    note: 'Washed twice for drape, copper rivets, 34" inseam.',
  },
  {
    id: 'ct-005',
    code: 'CT—005',
    name: 'Stripe Track',
    category: 'Track bottoms',
    price: 64,
    image: '/img/opt/rack-track.webp',
    colorway: 'Coal / bone stripe',
    fit: 'Relaxed / tapered',
    sizes: ['S', 'M', 'L', 'XL'],
    note: 'Brushed-back jersey, taped side seam, ribbed cuff.',
  },
  {
    id: 'ct-006',
    code: 'CT—006',
    name: 'Blackout Cap',
    category: 'Caps',
    price: 28,
    image: '/img/opt/rack-cap-01.webp',
    colorway: 'Blackout',
    fit: 'Six panel / adjustable',
    sizes: ['One size'],
    note: 'Washed cotton twill, brass slider, unstructured crown.',
  },
  {
    id: 'ct-007',
    code: 'CT—007',
    name: 'Acid Cap',
    category: 'Caps',
    price: 28,
    image: '/img/opt/rack-cap-02.webp',
    colorway: 'Acid lime',
    fit: 'Five panel / adjustable',
    sizes: ['One size'],
    note: 'Sun-faded canvas, tonal topstitch, soft brim.',
  },
]

export const LOOKS = [
  {
    id: 'look-01',
    index: '01',
    title: 'The Everyday',
    pieces: 'CT—001 Slab Tee · CT—004 Baggy 32 · CT—006 Blackout Cap',
    image: '/img/opt/mann-01.webp',
    note: 'Worn loose, dropped low, cap pulled to the brow.',
  },
  {
    id: 'look-02',
    index: '02',
    title: 'The Soft Run',
    pieces: 'CT—002 Bone Tee · CT—005 Stripe Track · CT—007 Acid Cap',
    image: '/img/opt/mann-02.webp',
    note: 'Sunday uniform. Nothing tight, nothing loud.',
  },
  {
    id: 'look-03',
    index: '03',
    title: 'The Heat Cut',
    pieces: 'CT—001 Slab Tee · CT—003 Raw Cut · CT—006 Blackout Cap',
    image: '/img/opt/mann-03.webp',
    note: 'Built for a Harare October. Cut above the knee.',
  },
]

export const DROP = {
  number: '004',
  title: 'The Rack Re-Up',
  date: '2026-11-13T18:00:00+02:00',
  label: 'Friday 13 November / 18:00 CAT',
  units: 48,
  styles: 7,
  rule: 'One piece per style, per customer. No restocks.',
}

export const STORE = {
  city: 'Harare',
  address: ['24 Baines Avenue', 'Harare CBD', 'Zimbabwe'],
  hours: [
    ['Tue — Fri', '10:00 — 18:00'],
    ['Saturday', '09:00 — 16:00'],
    ['Sunday', '11:00 — 15:00'],
  ],
  socials: [
    { label: 'Instagram', handle: '@christaylor.dripstore', href: 'https://www.instagram.com/christaylor.dripstore/' },
    { label: 'TikTok', handle: '@christaylor.dripstore', href: 'https://www.tiktok.com/@christaylor.dripstore' },
    { label: 'WhatsApp orders', handle: '+263 77 000 0000', href: 'https://wa.me/263770000000' },
  ],
}
