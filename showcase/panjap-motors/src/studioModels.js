// 3D asset manifest for the live Spatial Studio.
//
// DeepSeek Harness seam: a running DSH client assembly can inject additional
// (or replacement) 3D assets without rebuilding the site. It does so by
// setting a Remote-shaped global before the studio boots:
//
//   window.__DSH_SHOWROOM_REMOTE__ = {
//     models: () => Promise<[{ id, label, kind, url, meta, credit }]>,
//     renders: () => Promise<[{ id, label, url }]>,
//   }
//
// `kind` is one of 'procedural' | 'glb' | 'renders'. GLB entries may set
// `draco: true` for Draco-compressed meshes. Every Remote failure falls back
// to the local, self-hosted assets below — the studio never breaks.
import { vehicleTitle } from './data.js'

export const LOCAL_STUDIO_MODELS = [
  {
    id: 'concept',
    label: 'Concept SUV',
    kind: 'procedural',
    meta: 'PROCEDURAL / THREE.JS',
    credit: 'Parametric concept SUV built in-browser from Three.js geometry.',
  },
  {
    id: 'ferrari-458',
    label: 'Ferrari 458 Italia',
    kind: 'glb',
    url: '/assets/models/ferrari-458.glb',
    draco: true,
    meta: 'REAL GLB MESH / DRACO',
    credit: 'Ferrari 458 Italia by vicent091036 (Sketchfab), shipped with the three.js examples (MIT repo). Open reference mesh.',
  },
  {
    id: 'car-concept',
    label: 'Car Concept',
    kind: 'glb',
    url: '/assets/models/car-concept.glb',
    meta: 'REAL GLB MESH / KHRONOS',
    credit: '“Car Concept” from Khronos glTF-Sample-Assets, licensed CC BY 4.0. Open reference mesh.',
  },
  {
    id: 'live-stock',
    label: 'Live stock',
    kind: 'renders',
    meta: 'PHOTOREAL RENDERS / CURRENT LISTINGS',
    credit: 'Photoreal cutout renders of the vehicles PanJap Motors is currently posting — orbit the gallery of real cars.',
  },
]

async function fromRemote(method) {
  const remote = window.__DSH_SHOWROOM_REMOTE__
  if (!remote || typeof remote[method] !== 'function') return null
  try {
    const result = await remote[method]()
    return Array.isArray(result) && result.length ? result : null
  } catch (err) {
    console.warn(`[panjap] DSH showroom remote ${method}() failed; using local assets`, err)
    return null
  }
}

export async function resolveStudioModels() {
  const injected = await fromRemote('models')
  return injected ? [...LOCAL_STUDIO_MODELS, ...injected] : LOCAL_STUDIO_MODELS
}

export async function resolveStockRenders(vehicles) {
  const local = vehicles
    .filter((v) => v.cutout)
    .map((v) => ({ id: v.id, label: vehicleTitle(v), url: v.cutout, source: v.source }))
  const injected = await fromRemote('renders')
  return injected ? [...local, ...injected] : local
}
