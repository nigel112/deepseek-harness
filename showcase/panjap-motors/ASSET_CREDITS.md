# Third-party assets & credits

The site's cinematic plates, car cutouts, logo mark and procedural 3D SUV are
created for this project. Two **real 3D car meshes** are third-party open
assets, shipped locally (no CDN) and loaded only when a visitor selects them.

## Ferrari 458 Italia — `public/assets/models/ferrari-458.glb`

- Source: `examples/models/gltf/ferrari.glb` from
  [mrdoob/three.js r170](https://github.com/mrdoob/three.js/tree/r170/examples/models/gltf)
  (three.js is MIT licensed).
- Model: **Ferrari 458 Italia by vicent091036**, originally published on
  [Sketchfab](https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6),
  as credited in the three.js `webgl_materials_car` example.
- Draco-compressed; decoded with the three.js Draco JS/WASM decoder in
  `public/assets/draco/` (Google Draco, Apache-2.0).
- **Action before commercial launch:** confirm the current Sketchfab licence
  for the source model and add the required attribution. It is included here as
  an open reference mesh for the concept demo.

## Car Concept — `public/assets/models/car-concept.glb`

- Source: [`Models/CarConcept/glTF-Binary/CarConcept.glb`](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept)
  from **Khronos glTF-Sample-Assets**.
- Licensed **CC BY 4.0** (see `Models/CarConcept/LICENSE.md` in that repo). The
  underlying source model was released CC0 / public domain by Unity Fan.
- Attribution: *"Car Concept" — Khronos Group, glTF-Sample-Assets, CC BY 4.0.*
  Khronos logos/trademarks inside the asset are excluded from the licence.

## Fonts

Fontsource packages (`@fontsource-variable/space-grotesk`,
`@fontsource-variable/manrope`) bundle the SIL Open Font License fonts
locally; no external font CDN is used.

## Vehicle imagery

`public/assets/*.jpg` and `public/assets/cars/*.webp` are AI-generated concept
renders produced for this project. They depict the named models but are **not**
photographs of the actual vehicles in PanJap Motors' inventory. Manufacturer
names, badges and trademarks belong to their respective owners and appear only
for identification.

Business facts (address, phone, hours, prices, specifications) are transcribed
from PanJap Motors' public channels; see
[`dsh/social-sources.md`](dsh/social-sources.md) for the full provenance table.
