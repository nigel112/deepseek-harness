// Spatial Studio: a real-time Three.js light-tunnel stage with a procedurally
// built concept SUV. Drag to orbit, change paint, toggle X-ray.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const GOLD = 0xe6bd79

function rounded(w, h, d, r = 0.1) {
  return new RoundedBoxGeometry(w, h, d, 4, r)
}

function radialTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function buildArch() {
  const group = new THREE.Group()
  const core = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 })
  const bloom = new THREE.MeshBasicMaterial({
    color: GOLD, transparent: true, opacity: 0.075,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const R = 2.65
  group.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.022, 6, 64, Math.PI), core))
  group.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.11, 6, 64, Math.PI), bloom))
  const leg = new THREE.CylinderGeometry(0.022, 0.022, 2.15, 6)
  const legGlow = new THREE.CylinderGeometry(0.1, 0.1, 2.15, 6)
  for (const x of [-R, R]) {
    const bar = new THREE.Mesh(leg, core)
    bar.position.set(x, -1.075, 0)
    group.add(bar)
    const glow = new THREE.Mesh(legGlow, bloom)
    glow.position.set(x, -1.075, 0)
    group.add(glow)
  }
  group.position.y = 1.12
  return group
}

function buildWheel(paintMaterial) {
  const wheel = new THREE.Group()
  const rubber = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, roughness: 0.85, metalness: 0.05 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x2c3238, roughness: 0.25, metalness: 0.95 })
  const accent = new THREE.MeshBasicMaterial({ color: GOLD })

  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.3, 32), rubber)
  tire.rotation.x = Math.PI / 2
  wheel.add(tire)

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.315, 32), rimMat)
  rim.rotation.x = Math.PI / 2
  wheel.add(rim)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.305, 0.022, 8, 40), accent)
  ring.position.z = 0.16
  wheel.add(ring)

  for (let i = 0; i < 6; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.5, 0.035), rimMat)
    spoke.rotation.z = (i / 6) * Math.PI
    spoke.position.z = 0.165
    wheel.add(spoke)
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.34, 16), accent)
  hub.rotation.x = Math.PI / 2
  wheel.add(hub)
  wheel.userData.isWheel = true
  return wheel
}

function buildCar(paintMaterial) {
  const car = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: 0x11151a, metalness: 0.65, roughness: 0.42 })
  const trim = new THREE.MeshStandardMaterial({ color: 0x07090b, metalness: 0.4, roughness: 0.65 })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0a141c, metalness: 0.35, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 })
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff1cf })
  const tail = new THREE.MeshBasicMaterial({ color: 0xd3513b })

  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    car.add(m)
    return m
  }

  // lower body + hood
  add(rounded(4.35, 0.82, 1.86, 0.16), paintMaterial, 0, 0.86, 0)
  add(rounded(1.25, 0.22, 1.82, 0.1), paintMaterial, 1.53, 1.29, 0)
  // trapezoidal glasshouse with a raked windscreen (extruded side profile)
  const cabinShape = new THREE.Shape()
  cabinShape.moveTo(-1.48, 0)
  cabinShape.lineTo(1.02, 0)
  cabinShape.lineTo(0.62, 0.7)
  cabinShape.lineTo(-1.12, 0.7)
  cabinShape.closePath()
  const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, {
    depth: 1.62, bevelEnabled: true, bevelSize: 0.05,
    bevelThickness: 0.05, bevelSegments: 2, curveSegments: 2,
  })
  cabinGeo.translate(0, 0, -0.81)
  add(cabinGeo, glass, -0.25, 1.2, 0)
  add(rounded(1.86, 0.1, 1.62, 0.05), paintMaterial, -0.3, 1.95, 0)
  for (const z of [-0.84, 0.84]) {
    const aPillar = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.72, 0.055), trim)
    aPillar.rotation.z = -0.52
    aPillar.position.set(0.56, 1.56, z)
    car.add(aPillar)
    add(rounded(0.08, 0.7, 0.055, 0.02), trim, -0.36, 1.55, z)
    add(rounded(0.22, 0.045, 0.04, 0.015), dark, 0.12, 1.06, z * 1.12)
  }
  // shoulder line / side skirts
  for (const z of [-0.94, 0.94]) {
    add(new THREE.BoxGeometry(4.1, 0.055, 0.025), trim, 0, 1.18, z)
    add(rounded(3.2, 0.16, 0.09, 0.04), dark, 0, 0.54, z)
  }
  // roof rails
  for (const z of [-0.68, 0.68]) add(rounded(2.1, 0.05, 0.07, 0.02), dark, -0.3, 2.08, z)
  // mirrors
  for (const z of [-1.02, 1.02]) add(rounded(0.28, 0.12, 0.2, 0.05), paintMaterial, 0.68, 1.55, z)
  // bumpers & grille
  add(rounded(0.3, 0.44, 1.9, 0.08), dark, 2.16, 0.72, 0)
  add(rounded(0.28, 0.4, 1.88, 0.08), dark, -2.16, 0.72, 0)
  add(new THREE.BoxGeometry(0.05, 0.34, 0.95), trim, 2.31, 0.92, 0)
  for (let i = -3; i <= 3; i++) add(new THREE.BoxGeometry(0.06, 0.3, 0.035), dark, 2.34, 0.92, i * 0.13)
  // lamps
  for (const z of [-0.66, 0.66]) {
    add(new THREE.BoxGeometry(0.07, 0.11, 0.52), lamp, 2.2, 1.12, z)
    add(new THREE.BoxGeometry(0.07, 0.1, 0.5), tail, -2.2, 1.08, z)
  }
  add(new THREE.BoxGeometry(0.06, 0.035, 1.5), tail, -2.2, 1.3, 0)
  // wheels
  const wheels = []
  for (const x of [-1.38, 1.38]) {
    for (const z of [-0.98, 0.98]) {
      const wheel = buildWheel(paintMaterial)
      wheel.position.set(x, 0.45, z)
      if (z < 0) wheel.rotation.y = Math.PI
      car.add(wheel)
      wheels.push(wheel)
    }
  }
  // subtle underglow
  const under = new THREE.PointLight(0xe6bd79, 8, 5, 2)
  under.position.set(0, 0.25, 0)
  car.add(under)

  // X-ray edges as children so they inherit every transform
  const wireMat = new THREE.LineBasicMaterial({ color: 0xe6bd79, transparent: true, opacity: 0.42 })
  const edges = []
  car.traverse((o) => {
    if (o.isMesh && o.geometry) {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 28), wireMat)
      e.visible = false
      o.add(e)
      edges.push(e)
    }
  })
  return { car, wheels, edges }
}

export function createStudio3D(canvas, paints, callbacks = {}, config = {}) {
  if (!canvas) return null
  const models = config.models || []
  const renders = config.renders || []
  // Probe on a throwaway canvas first: constructing WebGLRenderer without a
  // context makes three.js emit a console.error before our try/catch runs.
  const probe = document.createElement('canvas')
  let context
  try { context = probe.getContext('webgl2') } catch { /* unsupported */ }
  if (!context) {
    console.warn('[panjap] WebGL 2 unavailable — using the static studio fallback')
    return null
  }
  context.getExtension('WEBGL_lose_context')?.loseContext()
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch (err) {
    console.warn('[panjap] WebGL unavailable', err)
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.02
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.5
  scene.fog = new THREE.FogExp2(0x07090b, 0.021)
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120)
  const target = new THREE.Vector3(0, 1.05, 0)
  let theta = 0.66
  let phi = 1.22
  let radius = 9.2
  let targetTheta = theta
  let targetPhi = phi
  let targetRadius = radius

  // ── floor & atmosphere ────────────────────────────────────────────────
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.55, roughness: 0.48, envMapIntensity: 0.3 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)

  const grid = new THREE.GridHelper(90, 90, 0x3a3327, 0x1a1d21)
  grid.position.y = 0.004
  grid.material.transparent = true
  grid.material.opacity = 0.3
  scene.add(grid)

  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 8),
    new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(230,189,121,0.20)', 'rgba(230,189,121,0)'),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  )
  pool.rotation.x = -Math.PI / 2
  pool.position.y = 0.01
  scene.add(pool)

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 3.4),
    new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(0,0,0,0.78)', 'rgba(0,0,0,0)'),
      transparent: true, depthWrite: false,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.02
  scene.add(shadow)

  // ── light tunnel ──────────────────────────────────────────────────────
  const arches = []
  const ARCH_COUNT = 10
  const ARCH_SPACING = 3
  for (let i = 0; i < ARCH_COUNT; i++) {
    const a = buildArch()
    a.position.z = 5 - i * ARCH_SPACING
    a.scale.setScalar(0.98 + Math.sin(i * 0.9) * 0.02)
    scene.add(a)
    arches.push(a)
  }
  const tunnelSpan = ARCH_COUNT * ARCH_SPACING

  // dust motes inside the tunnel
  const dustGeo = new THREE.BufferGeometry()
  const dustPos = new Float32Array(360 * 3)
  for (let i = 0; i < 360; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 12
    dustPos[i * 3 + 1] = Math.random() * 5
    dustPos[i * 3 + 2] = 6 - Math.random() * 34
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: GOLD, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false }))
  scene.add(dust)

  // ── car ───────────────────────────────────────────────────────────────
  const paintMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(paints[0].hex),
    metalness: paints[0].metalness,
    roughness: paints[0].roughness,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.1,
  })
  const { car, wheels, edges } = buildCar(paintMaterial)
  scene.add(car)

  // ── real 3D meshes + photoreal stock renders ───────────────────────────
  // Three switchable groups. Only one is visible at a time, so the WebGL cost
  // of a heavy GLB is paid only when a visitor actually selects it.
  const glbGroup = new THREE.Group()
  const renderGroup = new THREE.Group()
  glbGroup.visible = false
  renderGroup.visible = false
  scene.add(glbGroup, renderGroup)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/assets/draco/')
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)
  const textureLoader = new THREE.TextureLoader()
  const glbCache = new Map()
  const billboards = []

  // A ring of transparent, camera-facing cutouts of the *real* current cars.
  // Orbiting the studio walks you through the live stock rather than one
  // generic placeholder.
  // Preload every cutout, then cycle six at a time through the ring so all of
  // the current listings appear in the live session without loading 10 heavy
  // planes into the scene at once.
  const aspects = new Array(renders.length).fill(2)
  const stockTextures = renders.map((r, idx) => {
    const tex = textureLoader.load(r.url, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace
      loaded.anisotropy = renderer.capabilities.getMaxAnisotropy()
      aspects[idx] = (loaded.image.width || 900) / (loaded.image.height || 500)
      refreshAssignment()
    })
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  })
  let ringOffset = 0
  const ringCount = Math.min(6, Math.max(1, renders.length))

  for (let i = 0; i < ringCount; i++) {
    const material = new THREE.MeshBasicMaterial({
      map: stockTextures[i] || null, transparent: true, alphaTest: 0.02,
      depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: radialTexture('rgba(230,189,121,0.10)', 'rgba(230,189,121,0)'),
        transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, toneMapped: false,
      }),
    )
    glow.position.z = -0.02
    glow.scale.set(1.12, 1.25, 1)
    plane.add(glow)
    const angle = (i / ringCount) * Math.PI * 2
    plane.position.set(Math.sin(angle) * 3.9, 1.65 + Math.sin(i * 1.9) * 0.18, Math.cos(angle) * 3.9)
    plane.userData.material = material
    plane.userData.baseY = plane.position.y
    renderGroup.add(plane)
    billboards.push(plane)
  }

  function refreshAssignment() {
    if (!stockTextures.length) return
    billboards.forEach((plane, i) => {
      const idx = (i + ringOffset) % stockTextures.length
      plane.userData.material.map = stockTextures[idx]
      plane.userData.material.needsUpdate = true
      plane.scale.set(2.1, 2.1 / (aspects[idx] || 2), 1)
    })
  }
  refreshAssignment()

  let activeGlb = null
  let currentModelId = 'concept'
  let modelToken = 0

  function loadGlb(model) {
    if (glbCache.has(model.id)) return Promise.resolve(glbCache.get(model.id))
    return new Promise((resolve, reject) => {
      gltfLoader.load(model.url, (gltf) => {
        const root = gltf.scene
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const centre = box.getCenter(new THREE.Vector3())
        const scale = 4.6 / Math.max(size.x, size.y, size.z || 1)
        root.scale.setScalar(scale)
        root.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale)
        const materials = []
        root.traverse((o) => {
          if (!o.isMesh) return
          o.castShadow = true
          o.receiveShadow = true
          const list = Array.isArray(o.material) ? o.material : [o.material]
          for (const mat of list) {
            if (!mat || !mat.isMeshStandardMaterial || mat.transparent) continue
            if (!mat.userData.baseColor) mat.userData.baseColor = mat.color.clone()
            materials.push(mat)
          }
        })
        const entry = { root, materials }
        glbCache.set(model.id, entry)
        resolve(entry)
      }, undefined, reject)
    })
  }

  function applyGlbPaint() {
    if (!activeGlb) return
    for (const mat of activeGlb.materials) {
      mat.color.copy(mat.userData.baseColor).lerp(paintTarget, 0.3)
    }
  }

  // ── lighting ──────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x8d99a6, 0.35))
  const key = new THREE.DirectionalLight(0xffe3b4, 2.9)
  key.position.set(4.5, 8, 6)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -8
  key.shadow.camera.right = 8
  key.shadow.camera.top = 8
  key.shadow.camera.bottom = -8
  key.shadow.camera.updateProjectionMatrix()
  key.shadow.bias = -0.0006
  scene.add(key)
  const fill = new THREE.DirectionalLight(0x8fb6c8, 1.9)
  fill.position.set(-6, 4, -5)
  scene.add(fill)
  const rim = new THREE.PointLight(0xe6bd79, 32, 18, 2)
  rim.position.set(0, 3.4, -4)
  scene.add(rim)

  // ── state ─────────────────────────────────────────────────────────────
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let visible = true
  let autoRotate = !reduced
  let xray = false
  let paintIndex = 0
  const paintTarget = new THREE.Color(paints[0].hex)
  let targetMetalness = paints[0].metalness
  let targetRoughness = paints[0].roughness
  let fps = 60
  let frames = 0
  let fpsTime = 0
  let dragging = false
  let lastX = 0
  let lastY = 0
  let telemetryTime = 0
  let ringTimer = 0

  function resize() {
    const rect = canvas.getBoundingClientRect()
    if (rect.width < 2 || rect.height < 2) return
    renderer.setSize(rect.width, rect.height, false)
    camera.aspect = rect.width / rect.height
    camera.fov = rect.width < 700 ? 46 : 36
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
  io.observe(canvas)

  // ── pointer orbit ─────────────────────────────────────────────────────
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
  })
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return
    targetTheta -= (e.clientX - lastX) * 0.007
    targetPhi = THREE.MathUtils.clamp(targetPhi - (e.clientY - lastY) * 0.004, 0.72, 1.5)
    lastX = e.clientX
    lastY = e.clientY
  })
  const endDrag = () => { dragging = false }
  canvas.addEventListener('pointerup', endDrag)
  canvas.addEventListener('pointercancel', endDrag)
  canvas.addEventListener('dblclick', resetView)

  // ── public controls ───────────────────────────────────────────────────
  function setPaint(i) {
    paintIndex = i
    const p = paints[i]
    paintTarget.set(p.hex)
    targetMetalness = p.metalness
    targetRoughness = p.roughness
    applyGlbPaint()
    callbacks.onPaint?.(p.name)
  }

  async function setModel(id) {
    const model = models.find((m) => m.id === id) || models[0]
    if (!model) return null
    const token = ++modelToken
    callbacks.onModel?.({ ...model, loading: model.kind === 'glb' })
    car.visible = false
    glbGroup.visible = false
    renderGroup.visible = false
    activeGlb = null

    if (model.kind === 'glb') {
      try {
        const entry = await loadGlb(model)
        if (token !== modelToken) return null
        glbGroup.clear()
        glbGroup.add(entry.root)
        glbGroup.visible = true
        activeGlb = entry
        applyGlbPaint()
        applyXrayToGlb()
      } catch (err) {
        if (token !== modelToken) return null
        console.warn('[panjap] GLB model failed to load', err)
        car.visible = true
        callbacks.onModel?.({ ...model, loading: false, error: true })
        return null
      }
    } else if (model.kind === 'renders') {
      renderGroup.visible = true
    } else {
      car.visible = true
    }
    currentModelId = model.id
    if (token === modelToken) callbacks.onModel?.({ ...model, loading: false, ok: true })
    return model.id
  }
  function setAutoRotate(value) {
    autoRotate = value
    callbacks.onAutoRotate?.(value)
    return value
  }
  function getAutoRotate() { return autoRotate }
  function applyXrayToGlb() {
    if (!activeGlb) return
    for (const mat of activeGlb.materials) {
      mat.opacity = xray ? 0.45 : 1
      mat.transparent = xray
      mat.needsUpdate = true
    }
  }
  function setXray(value) {
    xray = value
    for (const e of edges) e.visible = value
    paintMaterial.opacity = value ? 0.42 : 1
    paintMaterial.transparent = value
    paintMaterial.needsUpdate = true
    for (const plane of billboards) plane.userData.material.opacity = value ? 0.55 : 1
    applyXrayToGlb()
    callbacks.onXray?.(value)
    return value
  }
  function getXray() { return xray }
  function resetView() {
    targetTheta = 0.66
    targetPhi = 1.22
    targetRadius = 9.2
    callbacks.onReset?.()
  }

  // ── render loop (driven by main.js) ───────────────────────────────────
  function frame(dt, time, scrollVelocity = 0) {
    if (!visible || document.hidden) return
    const speed = reduced ? 0 : 1.7 + Math.min(6, Math.abs(scrollVelocity) * 0.075)

    if (autoRotate && !dragging && !reduced) targetTheta += dt * 0.22
    theta += (targetTheta - theta) * Math.min(1, dt * 6)
    phi += (targetPhi - phi) * Math.min(1, dt * 6)
    radius += (targetRadius - radius) * Math.min(1, dt * 6)

    const sway = reduced ? 0 : Math.sin(time * 0.35) * 0.035
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta + sway),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta + sway),
    )
    camera.lookAt(target)

    // Camera-facing cutouts of the real current listings.
    if (renderGroup.visible) {
      if (!reduced) {
        ringTimer += dt
        if (ringTimer > 8) {
          ringTimer = 0
          ringOffset = (ringOffset + ringCount) % (stockTextures.length || 1)
          refreshAssignment()
        }
      }
      for (const plane of billboards) {
        plane.quaternion.copy(camera.quaternion)
        plane.position.y = plane.userData.baseY + (reduced ? 0 : Math.sin(time * 0.7 + plane.id) * 0.055)
      }
    }

    // travel the light tunnel
    if (!reduced) {
      for (const a of arches) {
        a.position.z += speed * dt
        if (a.position.z > 6) a.position.z -= tunnelSpan
      }
      dust.position.z = (dust.position.z + speed * dt * 0.5) % 3
      if (car.visible) for (const w of wheels) w.rotation.z -= speed * dt * 0.5
    }

    paintMaterial.color.lerp(paintTarget, Math.min(1, dt * 5))
    paintMaterial.metalness += (targetMetalness - paintMaterial.metalness) * Math.min(1, dt * 5)
    paintMaterial.roughness += (targetRoughness - paintMaterial.roughness) * Math.min(1, dt * 5)

    renderer.render(scene, camera)

    frames++
    fpsTime += dt
    if (fpsTime >= 0.5) {
      fps = Math.round(frames / fpsTime)
      frames = 0
      fpsTime = 0
    }
    telemetryTime += dt
    if (telemetryTime > 0.12) {
      telemetryTime = 0
      const az = ((theta * 180 / Math.PI) % 360 + 360) % 360
      callbacks.onTelemetry?.(`AZ ${String(Math.round(az)).padStart(3, '0')}° · ${paints[Math.max(0, paintIndex)].name.toUpperCase()} · ${fps} FPS`)
    }
  }

  function destroy() {
    ro.disconnect()
    io.disconnect()
    dracoLoader.dispose()
    renderer.dispose()
  }

  return {
    frame, setPaint, setModel, getCurrentModel: () => currentModelId,
    setAutoRotate, getAutoRotate, setXray, getXray, resetView, destroy,
  }
}
