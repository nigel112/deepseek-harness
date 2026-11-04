# 3D showroom asset contract (DeepSeek Harness seam)

The live Spatial Studio is a **DSH-shaped client surface**: it ships with local,
self-hosted assets but exposes a Remote-shaped global that a running DeepSeek
Harness client assembly can implement to supply real 3D content at runtime.
This is the same pattern as `window.__DSH_CONCIERGE_REMOTE__` in
`src/concierge.js`.

## The seam

```js
// Inside a DSH client assembly, after ctx.remote is mounted:
window.__DSH_SHOWROOM_REMOTE__ = {
  models: () => ctx.remote.panjapShowroom.models(),
  renders: () => ctx.remote.panjapShowroom.renders(),
}
```

`src/studioModels.js` reads the global at studio boot time. Both methods are
optional, may return a Promise, and must resolve to arrays:

```ts
type StudioModel = {
  id: string,          // unique, used as the picker key
  label: string,       // shown in the picker and the HUD
  kind: 'procedural' | 'glb' | 'renders',
  url?: string,        // required for kind === 'glb'
  draco?: boolean,     // set for Draco-compressed GLB
  meta?: string,       // small HUD caption
  credit?: string,     // attribution shown under the picker
}

type StockRender = {
  id: string,
  label: string,
  url: string,         // transparent PNG/WebP cutout
  source?: object,
}
```

- `models()` entries are **appended** to the local manifest, so a Harness host
  can add hosted GLBs without removing the built-in ones.
- `renders()` entries are appended to the cutouts derived from `src/data.js`.
- Any thrown error, bad return value or missing global falls back to the local
  assets and logs a `console.warn`; the studio never fails to boot.
- GLB failures (404, unsupported extension, WebGL context loss) fall back to
  the in-browser concept SUV and update the credit line with an explanation.

## Local assets

| Path | Kind | Notes |
| --- | --- | --- |
| `src/showroom3d.js` `buildCar()` | procedural | Parametric concept SUV, 5 live paint finishes, X-ray edges. |
| `public/assets/models/ferrari-458.glb` | GLB / Draco | Real Ferrari 458 Italia mesh, 1.6 MB. |
| `public/assets/models/car-concept.glb` | GLB | Khronos "Car Concept", 11.8 MB, CC BY 4.0. |
| `public/assets/draco/*` | decoder | three.js Draco JS/WASM decoder, needed only for the Ferrari. |
| `public/assets/cars/*.webp` | renders | 10 transparent cutouts of the currently posted vehicles. |

GLBs are loaded **on demand** with `GLTFLoader` and cached per id; the 11.8 MB
mesh is never fetched unless a visitor selects it. The Draco decoder is fetched
only when the Ferrari is selected.

## Studio controls

`createStudio3D(canvas, paints, callbacks, config)` accepts `config.models` and
`config.renders` and returns `setModel(id)` in addition to the existing
`setPaint`, `setXray`, `setAutoRotate`, `resetView`, `frame` and `destroy`.
`callbacks.onModel({ id, label, meta, credit, loading, ok, error })` drives the
HUD, picker active state and the attribution line in `src/main.js`.

In `renders` mode the cutouts become camera-facing billboards arranged in a
ring of six; the set cycles every eight seconds so every current listing
appears in the live session. Drag-to-orbit, auto-rotate, paint swatches and
X-ray still work (X-ray dims the billboards / GLB materials).

See [`ASSET_CREDITS.md`](../ASSET_CREDITS.md) for third-party attribution.
