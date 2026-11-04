// Vite plugin:
//  • replaces __SITE_URL__ in index.html with the configured production origin
//  • injects the JSON-LD graph into <head> (so crawlers see it in the HTML)
//  • serves /robots.txt and /sitemap.xml in dev and emits them in the build
import { SITE_URL } from './config.mjs'
import { buildStructuredData } from './structured-data.mjs'
import { buildRobots, buildSitemap } from './sitemap.mjs'

export function seoPlugin() {
  const jsonLd = JSON.stringify(buildStructuredData(), null, 2)
  const robots = buildRobots()
  const sitemap = buildSitemap()
  const jsonLdTag = `<script type="application/ld+json">\n${jsonLd}\n    </script>`

  return {
    name: 'panjap-seo',
    transformIndexHtml(html) {
      const out = html.replaceAll('__SITE_URL__', SITE_URL)
      // Use the LAST </head> so comments mentioning the tag can't swallow the script.
      const idx = out.lastIndexOf('</head>')
      if (idx === -1) return out
      return `${out.slice(0, idx)}    ${jsonLdTag}\n  ${out.slice(idx)}`
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        if (path === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(robots)
          return
        }
        if (path === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(sitemap)
          return
        }
        next()
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}
