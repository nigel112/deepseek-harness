// JSON-LD graph: AutoDealer + WebSite + WebPage + ItemList of current stock.
// Vehicle data is imported from the same module the UI renders from, so the
// markup never drifts away from what visitors actually see.
import { vehicles, vehicleTitle } from '../src/data.js'
import {
  SITE_URL, SITE_NAME, SITE_TITLE, META_DESCRIPTION, SITE_LANG,
  PHONE, ADDRESS, GEO, MAPS_URL, SOCIAL_PROFILES, OPENING_HOURS,
  HERO_IMAGE,
} from './config.mjs'

const dealerId = `${SITE_URL}/#dealership`
const websiteId = `${SITE_URL}/#website`
const webpageId = `${SITE_URL}/#webpage`

const dealership = {
  '@type': 'AutoDealer',
  '@id': dealerId,
  name: SITE_NAME,
  alternateName: 'PanJap Motors Zimbabwe',
  url: `${SITE_URL}/`,
  description: META_DESCRIPTION,
  telephone: PHONE,
  image: `${SITE_URL}${HERO_IMAGE}`,
  logo: `${SITE_URL}/favicon.svg`,
  address: { '@type': 'PostalAddress', ...ADDRESS },
  geo: { '@type': 'GeoCoordinates', ...GEO },
  hasMap: MAPS_URL,
  priceRange: '$$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Bank Transfer',
  openingHoursSpecification: OPENING_HOURS.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  areaServed: [
    { '@type': 'City', name: 'Harare' },
    { '@type': 'Country', name: 'Zimbabwe' },
  ],
  sameAs: SOCIAL_PROFILES,
}

const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  description: META_DESCRIPTION,
  inLanguage: SITE_LANG,
  publisher: { '@id': dealerId },
}

const webpage = {
  '@type': 'WebPage',
  '@id': webpageId,
  url: `${SITE_URL}/`,
  name: SITE_TITLE,
  description: META_DESCRIPTION,
  isPartOf: { '@id': websiteId },
  about: { '@id': dealerId },
  inLanguage: SITE_LANG,
  primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_URL}${HERO_IMAGE}` },
}

const stock = {
  '@type': 'ItemList',
  '@id': `${SITE_URL}/#stock`,
  name: 'Current vehicle stock at PanJap Motors',
  numberOfItems: vehicles.length,
  itemListElement: vehicles.map((v, i) => {
    const mileageValue = Number(String(v.mileage).replace(/[^\d]/g, ''))
    const car = {
      '@type': 'Car',
      '@id': `${SITE_URL}/#vehicle-${v.id}`,
      name: vehicleTitle(v),
      brand: { '@type': 'Brand', name: v.make },
      model: v.model,
      ...(v.year ? { vehicleModelDate: String(v.year) } : {}),
      vehicleCondition: v.condition === 'Brand New' ? 'NewCondition' : 'UsedCondition',
      ...(Number.isFinite(mileageValue) && mileageValue > 0
        ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: mileageValue, unitCode: 'KMT' } }
        : {}),
      image: `${SITE_URL}${v.image}`,
      url: `${SITE_URL}/#stock`,
      offers: {
        '@type': 'Offer',
        ...(v.price != null ? { price: v.price } : { description: 'Price on application' }),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        itemCondition: v.condition === 'Brand New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
        seller: { '@id': dealerId },
        url: `${SITE_URL}/#stock`,
      },
    }
    // Provenance for listings taken from PanJap's own social posts/inventory.
    if (v.source) {
      car.subjectOf = {
        '@type': 'CreativeWork',
        name: `${v.source.channel} vehicle listing`,
        datePublished: v.source.date,
        url: v.source.url,
      }
    }
    return { '@type': 'ListItem', position: i + 1, item: car }
  }),
}

export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [dealership, website, webpage, stock],
  }
}
