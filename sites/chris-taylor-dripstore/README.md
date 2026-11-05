# Chris Taylor — Dripstore

A concept storefront for **Chris Taylor Dripstore**, Harare. Five categories only — shirts,
shorts, jeans, track bottoms, caps — hung on one rack. Built as a standalone Vite + React app
so it lives beside the harness monorepo without touching its pnpm workspace.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # type-check + production bundle
```

## What's in it

| Section | Idea |
| --- | --- |
| Preloader | 0 → 100 counter, wordmark mask, five-panel curtain lift |
| Hero | WebGL liquid-chrome pour behind outline display type, rotating chrome badge |
| The rack | Horizontally pinned rail (GSAP ScrollTrigger) with garment hangers, filters, add-to-bag |
| Lookbook | Mannequin plates revealed with clip-path wipes and scroll drift — no faces, no filters |
| Material study | Cursor-driven liquid-glass lens with `backdrop-filter` refraction + chrome spec cards |
| The drop | Live countdown to the next rail re-up, liquid-glass signup |
| Store | Address, hours, socials, chrome `DRIPSTORE` wordmark |

## Stack

- **React 19 + Vite 7 + TypeScript**
- **Three.js / @react-three/fiber / drei** — `MeshDistortMaterial` chrome pour, procedural
  `Environment` lightformers (no HDR fetch), additive sparkles
- **GSAP 3.15 + ScrollTrigger + SplitText + Flip** — pinning, velocity skew, masked type reveals
- **Lenis** — smooth scroll, driven off the GSAP ticker
- **Hand-rolled liquid glass** — layered `backdrop-filter`, conic specular sheen, SVG
  `feTurbulence` + `feDisplacementMap` for the lens and the liquid chrome wordmarks

## Notes

- **Imagery.** The product and mannequin photography was generated for this build; nothing is
  scraped. Human models were deliberately replaced with faceless mannequins, per the brief, and
  every garment hangs on a wooden hanger. The footer carries a short disclaimer.
- **Categories.** The rack contains only shirts, shorts, jeans, track bottoms and caps.
- **Placeholders.** Store address, phone number, drop dates and socials are illustrative —
  swap them in `src/data/site.ts`.
- **Performance.** The WebGL scene is a lazily loaded chunk and its render loop pauses when the
  hero scrolls out of view. `prefers-reduced-motion` disables Lenis, pinning, splits and the lens.
- **Accessibility.** Focus rings, aria labels on icon buttons, `aria-pressed` on filters and a
  decorative-only cursor layer that never replaces keyboard focus.
