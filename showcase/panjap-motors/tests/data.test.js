import { test } from 'node:test'
import assert from 'node:assert/strict'
import { money, vehicles, vehicleTitle } from '../src/data.js'
import { buildStructuredData } from '../seo/structured-data.mjs'
import { buildSitemap } from '../seo/sitemap.mjs'

test('prices retain their USD symbol and missing prices remain POA', () => {
  assert.equal(money(78000), '$78,000')
  assert.equal(money(0), '$0')
  assert.equal(money(null), 'POA')
})

test('vehicle titles do not contain a missing year', () => {
  assert.equal(vehicleTitle({ year: null, make: 'BMW', model: 'X6M' }), 'BMW X6M')
})

test('structured data reflects stock, POA and listing provenance', () => {
  const stock = buildStructuredData()['@graph'].find((item) => item['@type'] === 'ItemList')
  assert.equal(stock.numberOfItems, vehicles.length)
  for (const [index, vehicle] of vehicles.entries()) {
    const item = stock.itemListElement[index].item
    assert.equal(item.name, vehicleTitle(vehicle))
    if (vehicle.price == null) {
      assert.equal(item.offers.description, 'Price on application')
      assert.equal(item.offers.price, undefined)
    } else {
      assert.equal(item.offers.price, vehicle.price)
    }
    if (vehicle.source) assert.equal(item.subjectOf.url, vehicle.source.url)
  }
})

test('sitemap includes each distinct listing image', () => {
  const sitemap = buildSitemap()
  for (const path of new Set(vehicles.map((vehicle) => vehicle.image))) {
    assert.ok(sitemap.includes(path), `missing ${path}`)
  }
})
