import { SITE_URL, IMAGE_ENTRIES } from './config.mjs'

const escapeXml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

// One-page site: a single URL, with an image sitemap for the vehicle plates.
export function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const images = IMAGE_ENTRIES.map((img) =>
    `    <image:image>\n` +
    `      <image:loc>${escapeXml(`${SITE_URL}${img.path}`)}</image:loc>\n` +
    `      <image:title>${escapeXml(img.title)}</image:title>\n` +
    `    </image:image>`,
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(`${SITE_URL}/`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${images}
  </url>
</urlset>
`
}

export function buildRobots() {
  return `# PanJap Motors — generated from seo/config.mjs
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}
