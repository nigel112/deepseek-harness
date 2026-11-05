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
  brand: string
}

export const CATEGORIES: Category[] = ['Shirts', 'Shorts', 'Jeans', 'Track bottoms', 'Caps']

export const PRODUCTS: Product[] = [
  {
    id: 'ct-001',
    code: 'CT—001',
    name: 'Eagle Legend Tee',
    brand: 'Rhude',
    category: 'Shirts',
    price: 45,
    image: '/img/rack/tee-rhude.webp',
    colorway: 'Faded ink',
    fit: 'Boxy / XL',
    sizes: ['M', 'L', 'XL'],
    note: 'Eagle and wordmark print across the back. Heavyweight cotton, single-stitch hems.',
  },
  {
    id: 'ct-002',
    code: 'CT—002',
    name: 'Sunwash Cross Denim',
    brand: 'Chrome Hearts',
    category: 'Jeans',
    price: 150,
    image: '/img/rack/jeans-cross.webp',
    colorway: 'Bleached indigo',
    fit: 'Straight / 32',
    sizes: ['30', '32', '34'],
    note: 'Cross patches at the thigh, knee and hem. 13oz denim, raw hem, one pair only.',
  },
  {
    id: 'ct-003',
    code: 'CT—003',
    name: 'Gore-Tex Track',
    brand: 'Essentials',
    category: 'Track bottoms',
    price: 90,
    image: '/img/rack/track-ink.webp',
    colorway: 'Coal',
    fit: 'Relaxed / tapered',
    sizes: ['S', 'M', 'L'],
    note: 'Shell track pant with taped side seam, elastic cuff and a Gore-Tex tag at the hip.',
  },
  {
    id: 'ct-004',
    code: 'CT—004',
    name: 'Amiri 22 Beanie',
    brand: 'Amiri',
    category: 'Caps',
    price: 25,
    image: '/img/rack/beanie-amiri.webp',
    colorway: 'Deep navy',
    fit: 'Ribbed cuff',
    sizes: ['One size'],
    note: 'Chunky rib knit, 22 embroidered into the fold.',
  },
  {
    id: 'ct-005',
    code: 'CT—005',
    name: 'Chainlink Cap',
    brand: 'Stüssy',
    category: 'Caps',
    price: 30,
    image: '/img/rack/cap-stussy.webp',
    colorway: 'Washed black',
    fit: 'Six panel / adjustable',
    sizes: ['One size'],
    note: 'Chainlink embroidery to the front, unstructured crown, brass slider.',
  },
  {
    id: 'ct-006',
    code: 'CT—006',
    name: 'Box Logo Cap',
    brand: 'Supreme',
    category: 'Caps',
    price: 45,
    image: '/img/rack/cap-supreme.webp',
    colorway: 'Ice blue',
    fit: 'Camp cap / adjustable',
    sizes: ['One size'],
    note: 'Box logo to the crown, pale blue twill, soft brim.',
  },
  {
    id: 'ct-007',
    code: 'CT—007',
    name: 'Raw Cut Denim Short',
    brand: 'CT Studio',
    category: 'Shorts',
    price: 30,
    image: '/img/rack/shorts-denim.webp',
    colorway: 'Mid indigo',
    fit: 'Baggy / knee',
    sizes: ['28', '30', '32', '34'],
    note: '14oz rigid denim cut at the knee, selvedge outseam, raw hem.',
  },
]

export const LOOKS = [
  {
    id: 'look-01',
    index: '01',
    title: 'The Everyday',
    pieces: 'CT—001 Eagle Legend Tee · CT—002 Sunwash Cross Denim · CT—005 Chainlink Cap',
    image: '/img/opt/mann-01.webp',
    note: 'Worn loose, cap low.',
  },
  {
    id: 'look-02',
    index: '02',
    title: 'The Soft Run',
    pieces: 'CT—003 Gore-Tex Track · CT—001 Eagle Legend Tee · CT—004 Amiri 22 Beanie',
    image: '/img/opt/mann-02.webp',
    note: 'Nothing tight, nothing loud.',
  },
  {
    id: 'look-03',
    index: '03',
    title: 'The Heat Cut',
    pieces: 'CT—007 Raw Cut Denim Short · CT—001 Eagle Legend Tee · CT—005 Chainlink Cap',
    image: '/img/opt/mann-03.webp',
    note: 'Cut above the knee.',
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
  address: ['Homegate Mall, Shop 37', 'Upstairs — Harare CBD', 'Zimbabwe'],
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
