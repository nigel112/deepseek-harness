# PanJap Motors — Spatial Experience

A motion-scroll, interactive concept website for **PanJap Motors** (Harare, Zimbabwe), built inside the **DeepSeek Harness** workspace.

The brief asked for a *spatial* web experience in the spirit of `spatialsites.com` / `horizon.so`. `spatialsites.com` is currently a parked domain, so the visual language was taken from the immersive-web genre itself — the scroll-scrubbed 3D galleries, draggable depth rings, light tunnels and wet reflections seen on sites like HorizonX (`horizonx.so`). The result is a single continuous scene rather than a set of stacked pages.

## Run it

```bash
cd showcase/panjap-motors
npm install
npm run dev        # http://0.0.0.0:5173  (Arena preview-ready)
npm run build      # static output in dist/
npm test           # stock formatting and SEO data checks
npm run preview
```

No API keys, no backend and no external runtime requests: fonts, images and Three.js are bundled locally. The Three.js studio is an async chunk, so the entry bundle is ~11 kB gzip. Node 18+ works (Vite 5), Node 22 was used for development.

The original brief and the design decisions behind it are recorded in [`dsh/build-brief.md`](dsh/build-brief.md).

## The experience

| Chapter | Motion / interaction |
| --- | --- |
| **Intro** | Cinematic hero, kinetic type reveal, mouse + scroll parallax, live dust field repelled by the pointer, animated counters, Harare clock. |
| **Collection** | 430vh scroll-scrubbed horizontal runway. Panels skew in 3D and dim by distance from the viewport centre; live `01 → 06` meter. |
| **Spatial Studio** | Real-time Three.js light tunnel with a procedurally built concept SUV. Drag to orbit, five live paint finishes, X-ray edge mode, auto-rotate, reset, FPS/azimuth telemetry. Tunnel travel speed reacts to scroll velocity. |
| **Divisions** | Scroll- and drag-driven CSS 3D ring of five cards with depth fading and clickable chapter dots. |
| **Showroom** | Layered parallax showroom with three cross-fading scenes and a glass HUD card. |
| **Marques** | Two counter-scrolling infinite marquees; clicking any manufacturer filters the live stock grid. |
| **Current Stock** | Filter chips + search over the vehicle data, quick-view modal with specs and pre-filled WhatsApp enquiry. |
| **Visit** | Animated radar map, live Harare open/closed state, and a viewing-request form that composes a WhatsApp message. |
| **Always on** | Chapter rail, scroll progress, custom cursor with magnetic buttons, and the **PanJap Concierge** chat. |

Everything degrades gracefully: reduced-motion mode removes the scroll hijacking and turns the pinned chapters into ordinary readable sections, touch devices get flat scrollable galleries, and a missing WebGL context falls back to a static light-tunnel image.

## Content provenance

Vehicle names, prices, mileage, address (`19553 Robert Mugabe Rd, Eastlea, Harare`), phone (`+263 78 978 8615`) and opening hours were adapted from the public [panjapmotorszim.com](https://panjapmotorszim.com/) catalogue. Prices are indicative and the site says so. All photography is AI-generated concept imagery in `public/assets/` — no manufacturer logos or licensed photos are used.

## Live stock from social media

The stock grid now includes **17 vehicles**: the original six catalogue cars plus eleven listings taken from PanJap Motors' own recent posts and live inventory (researched 4 November 2026):

- **X / Twitter** ([@Panjapmotorszim](https://x.com/Panjapmotorszim), 29 Oct – 3 Nov 2026): 2025 Lexus GX550 ($198,000), 2025 Mercedes-Benz G450d (POA), 2024 Toyota Land Cruiser Prado ($125,000 / 800 km) and two 2022 Range Rover Sport HSE listings ($163,000 / 37,000 km and $168,000 / 12,000 km).
- **TikTok** ([@panjap.motors1](https://www.tiktok.com/@panjap.motors1)): Java Green 2019 Porsche Cayenne, BMW X6M, and the all-electric Riddara RD6.
- **Live inventory**: 2024 Lexus LX600 ($225,000 / 715 km), 2024 Range Rover Autobiography ($285,000 / 1,300 km), 2022 Land Rover Defender D300 ($125,000 / 22,991 km).

Every record carries a `source` (`channel`, `date`, `url`) shown on the stock card and quick view, in the crawlable no-JS fallback, and as `subjectOf` in JSON-LD. Post prices marked POA render as `POA` rather than an invented number; unstated model years render as "On application". The full provenance table is in [`dsh/social-sources.md`](dsh/social-sources.md). **This is a point-in-time snapshot, not a live feed** — refresh `socialVehicles` in `src/data.js` when the posts change.

## The live 3D session

The Spatial Studio has a **3D model picker** with four modes:

| Mode | What it renders |
| --- | --- |
| Concept SUV | The in-browser parametric Three.js SUV with five live paint finishes and X-ray edges. |
| Ferrari 458 Italia | A real Draco-compressed GLB car mesh, loaded on demand with `GLTFLoader` + `DRACOLoader`. |
| Car Concept | A real Khronos glTF sample GLB car mesh (CC BY 4.0), loaded on demand. |
| Live stock | Photoreal, transparent cutout renders of the real posted cars as camera-facing billboards in a ring of six; the set cycles every eight seconds so all listings appear. |

Big GLBs are never fetched until selected, Draco decoder files are local, and any load failure falls back to the concept SUV with an on-screen explanation. Drag-to-orbit, auto-rotate, paint swatches and X-ray work across every mode. Attribution for the two third-party meshes is in [`ASSET_CREDITS.md`](ASSET_CREDITS.md).

The studio is a **DeepSeek Harness-shaped client surface**: `window.__DSH_SHOWROOM_REMOTE__` lets a running DSH client assembly inject additional GLB models and stock renders without a rebuild, with a safe local fallback. See [`dsh/showroom.assets.md`](dsh/showroom.assets.md) for the contract.

## SEO

All absolute URLs and business facts live in **`seo/config.mjs`** — nothing is duplicated by hand.

| File | What it provides |
| --- | --- |
| `index.html` | Title, meta description, keywords, `robots`, canonical + `hreflang`, `color-scheme`, local geo meta, Open Graph, Twitter Card, `lang="en-ZW"`, `aria-labelledby` on every section, descriptive `alt` text. |
| `seo/structured-data.mjs` | JSON-LD `@graph`: `AutoDealer` (NAP, geo coordinates, opening hours, social profiles), `WebSite`, `WebPage` and an `ItemList` of every `Car` with `Offer` price / condition / mileage — generated from the same `src/data.js` the UI renders. |
| `seo/plugin.mjs` | Injects the JSON-LD into `<head>`, replaces `__SITE_URL__`, serves `/robots.txt` + `/sitemap.xml` in dev, and emits both into `dist/` on build. |
| `seo/sitemap.mjs` | One-page sitemap with `<image:image>` entries for the ten scene plates plus every sourced listing render (20 images), de-duplicated. |

Set the production origin before deploying (default is the business's current domain):

```bash
SITE_URL=https://your-domain.example npm run build
```

Also included: a `<noscript>` fallback with real business + stock text (and CSS that reveals the hero when JS is off), `decoding="async"` and intrinsic `width`/`height` on every image, lazy loading below the fold, and `fetchpriority="high"` on the hero plate.

Post-launch checklist: confirm canonical / OG URLs match the live origin; verify `SOCIAL_PROFILES`, phone, address and hours in `seo/config.mjs` and `src/data.js`; refresh the social listings in `src/data.js`; confirm the Ferrari mesh's original Sketchfab licence (see `ASSET_CREDITS.md`); run the Rich Results Test; submit `/sitemap.xml` in Google Search Console.

## DeepSeek Harness integration

This site is a deliverable produced by a **DeepSeek Harness (DSH) agent session** in this repository; it lives outside the pnpm workspace globs (`showcase/`) so it does not affect the Harness build, typecheck or test suites.

The concierge keeps one deliberate seam for a running Harness host. It answers locally over the site's own content model, but if a DSH client assembly injects a Remote wrapper, answers come from the agent instead:

```js
// Inside a DSH client assembly (after ctx.remote is mounted):
window.__DSH_CONCIERGE_REMOTE__ = {
  ask: (text) => ctx.remote.panjapConcierge.ask({ text }),
}
```

`src/concierge.js` reads that global at call time, falls back to the deterministic responder on any failure, and never blocks the UI. A suitable agent system prompt is in [`dsh/concierge.system.md`](dsh/concierge.system.md).

The same Remote pattern backs the 3D asset pipeline: `window.__DSH_SHOWROOM_REMOTE__ = { models, renders }` lets a Harness host supply real GLB meshes and cutout renders at runtime. `src/studioModels.js` resolves it at boot with a complete local fallback; the contract is documented in [`dsh/showroom.assets.md`](dsh/showroom.assets.md).

No credentials or model configuration are required to run the website. This sandbox cannot launch the `dsh` CLI itself (Node 22 vs the repo's Node 24.9+ requirement, no pnpm, no API credentials), so the work is done inside the DeepSeek Harness source checkout and the site exposes Harness-shaped integration seams rather than calling a live agent.

## Structure

```
index.html                 semantic shell, all chapters
src/data.js                vehicles, marques, divisions, paints, slides
src/main.js                content rendering, filters, modal, form, boot loop
src/motion.js              scroll choreography, reveals, counters, rails, cursor
src/showroom3d.js          Three.js tunnel, procedural car, GLB loader, render billboards
src/studioModels.js        3D asset manifest + DSH Showroom Remote seam
src/particles.js           lightweight 2D hero dust field
src/concierge.js           chat UI + DSH Remote seam
src/styles.css             full design system + responsive/reduced-motion rules
public/assets/*.jpg        generated plates + sourced listing renders
public/assets/cars/*.webp  transparent cutouts for the live 3D stock ring
public/assets/models/*.glb two real 3D car meshes (loaded on demand)
public/assets/draco/*      local Draco decoder for the Ferrari mesh
dsh/social-sources.md      provenance for every recently posted vehicle
dsh/showroom.assets.md     DSH 3D asset contract
ASSET_CREDITS.md           third-party mesh attribution
```
