# Build brief (DeepSeek Harness session)

The prompt that produced this site, kept verbatim so the experience can be
regenerated or iterated by another DSH agent session:

> use deepseek harness to create a motion scroll and interactive website for
> panjap motors, get inspiration from spatialsites.com or horizon.so

## How the brief was resolved

- **PanJap Motors** is a real premium vehicle dealership at 19553 Robert Mugabe
  Road, Eastlea, Harare, Zimbabwe (`panjapmotorszim.com`). Real stock names,
  prices, address, phone and hours were adapted from its public catalogue.
- **`spatialsites.com`** currently resolves to a parked domain-for-sale page,
  so it was read as the *spatial web* category rather than a specific layout.
- **`horizon.so`** returned a Cloudflare 522 during the session. Its closest
  live reference, `horizonx.so`, documents the genre precisely: scroll-scrubbed
  gallery zoom/orbit, 3D grid runways, draggable gallery rings, and a
  "Car Showroom" concept with a tunnel of light arches, wet reflections,
  drag-to-orbit and live paint changes. Those became the design vocabulary.

## Decisions

| Decision | Reason |
| --- | --- |
| Vanilla Vite + JS, no React | One persistent rAF loop drives every scroll effect; fewer moving parts, smaller initial bundle (11 kB gzip). |
| Three.js as an async chunk | The hero must paint instantly; the 520 kB 3D engine loads while the user reads the intro. |
| Generated cinematic plates | Avoids hotlinking/licensed manufacturer photography and keeps one consistent obsidian + champagne grade. |
| CSS 3D ring + DOM runway | Depth effects stay crisp, accessible and cheap; WebGL is reserved for the one genuinely interactive object. |
| Local assets only | The Arena preview host cannot rely on third-party CDNs; fonts are self-hosted via Fontsource. |
| Reduced-motion / no-WebGL fallbacks | Pinned sections become ordinary readable sections; the studio falls back to a still light-tunnel plate. |

## Verification performed

Headless Chromium (SwiftShader WebGL) at 1440×900, 1024×768 and 390×844:

- zero console/page errors, WebGL context active, telemetry reporting ~60 FPS
- scroll-scrubbed runway, depth ring, parallax showroom and marquees render
- paint swatches, X-ray, auto-rotate, filters, quick-view modal, showroom
  slides, concierge and WhatsApp enquiry all respond
- `prefers-reduced-motion` and mobile produce no horizontal overflow
- `npm run build` succeeds with a 28.5 kB entry chunk
- SEO pass: canonical/OG/Twitter tags, JSON-LD `@graph` (AutoDealer, WebSite,
  WebPage, ItemList), `/robots.txt`, `/sitemap.xml` with 10 image entries,
  no unresolved URL placeholders, no missing `alt` text, and a readable
  no-JavaScript fallback verified in headless Chromium
- live stock pass: 11 real vehicles sourced from PanJap Motors' X, TikTok and
  inventory posts (29 Oct – 3 Nov 2026) added with per-listing provenance,
  POA / unknown-year handling, JSON-LD `subjectOf`, 17-item no-JS stock list
  and 20 sitemap images
- 3D pass: real Draco GLB (Ferrari 458 Italia) and Khronos CC BY 4.0 GLB
  (Car Concept) load on demand via `GLTFLoader`; 10 transparent cutout renders
  of the exact posted cars cycle through a camera-facing ring in the live
  WebGL session; model picker, HUD, credits and DSH Remote seam wired;
  GLB/Draco/WebP assets all 200, zero console errors, mobile 0 overflow
