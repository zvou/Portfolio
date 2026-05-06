<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animId = 0
let renderer: THREE.WebGLRenderer | null = null
let resizeFn: (() => void) | null = null

// Neutral studio HDRI: bright sky + blazing-white horizon + near-black floor
// No warm/cool colour accents — keeps chrome silver/white not yellow/blue
function buildEnvMap(r: THREE.WebGLRenderer): THREE.Texture {
  const W = 1024, H = 512
  const data = new Float32Array(W * H * 4)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      const ny = y / H
      const nx = x / W

      const sky     = Math.max(0, 1.0 - ny * 2.0) * 0.9
      const horiz   = Math.exp(-Math.pow((ny - 0.35) * 9, 2)) * 2.2    // bright but not blinding
      const floor   = Math.max(0, (ny - 0.50) * 1.6)                   // softer floor falloff
      const topSpot = Math.exp(-Math.pow((nx - 0.5) * 2.5, 2)) *
                      Math.max(0, 1 - ny * 5) * 0.6
      const base    = 0.38                                              // grey baseline — no pure black

      const val = base + sky + horiz + topSpot - floor * 0.42          // floor only dims, not blacks out

      // Nearly achromatic — just 2 % more blue, 2 % less red = cool silver white
      data[i]     = Math.min(4, val * 0.96)
      data[i + 1] = Math.min(4, val * 0.99)
      data[i + 2] = Math.min(4, val * 1.03)
      data[i + 3] = 1.0
    }
  }

  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType)
  tex.mapping   = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.LinearSRGBColorSpace
  tex.needsUpdate = true

  const pmrem   = new THREE.PMREMGenerator(r)
  const envMap  = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose()
  tex.dispose()
  return envMap
}

onMounted(() => {
  const canvas = canvasRef.value!
  const W = canvas.clientWidth
  const H = canvas.clientHeight

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(W, H, false)
  renderer.toneMapping        = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  renderer.outputColorSpace   = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.environment = buildEnvMap(renderer)

  const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
  camera.position.set(0, 0, 7)

  // ── Chrome material — pure neutral silver ──────────────────────
  const chromeMat = new THREE.MeshStandardMaterial({
    color:           new THREE.Color(1, 1, 1),
    metalness:       1.0,
    roughness:       0.012,
    envMapIntensity: 2.6,
  })

  // ── Main shape: TorusKnot twisted ribbon ───────────────────────
  const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.34, 500, 128, 2, 3)
  const knot    = new THREE.Mesh(knotGeo, chromeMat)
  knot.position.set(2.1, 0.1, 0)
  scene.add(knot)

  // ── Satellite blobs: SphereGeometry for smooth silhouette ──────
  // SphereGeometry has uniform quad-based subdivision — no faceted poles visible
  const blobGeoA  = new THREE.SphereGeometry(0.38, 96, 64)
  const blobA     = new THREE.Mesh(blobGeoA, chromeMat)
  scene.add(blobA)
  const blobAPosA  = blobGeoA.getAttribute('position') as THREE.BufferAttribute
  const blobAOrig  = new Float32Array(blobAPosA.array)

  const blobGeoB  = new THREE.SphereGeometry(0.23, 80, 54)
  const blobB     = new THREE.Mesh(blobGeoB, chromeMat)
  scene.add(blobB)
  const blobAPosB  = blobGeoB.getAttribute('position') as THREE.BufferAttribute
  const blobBOrig  = new Float32Array(blobAPosB.array)

  const blobGeoC  = new THREE.SphereGeometry(0.14, 64, 40)
  const blobC     = new THREE.Mesh(blobGeoC, chromeMat)
  scene.add(blobC)
  const blobAPosC  = blobGeoC.getAttribute('position') as THREE.BufferAttribute
  const blobCOrig  = new Float32Array(blobAPosC.array)

  // ── Lights — all neutral white, no coloured tints ─────────────
  const keyLight   = new THREE.PointLight(0xffffff, 5.5, 25)
  keyLight.position.set(5, 7, 5)
  scene.add(keyLight)

  const fillLight  = new THREE.PointLight(0xffffff, 3.2, 20)
  fillLight.position.set(-6, -3, 4)
  scene.add(fillLight)

  const rimLight   = new THREE.PointLight(0xf4f6ff, 4.0, 20)  // barely-cool rim
  rimLight.position.set(1, 7, -5)
  scene.add(rimLight)

  const groundLight = new THREE.PointLight(0xffffff, 2.2, 16)
  groundLight.position.set(-2, -7, 2)
  scene.add(groundLight)

  const sideLight  = new THREE.PointLight(0xffffff, 2.0, 16)
  sideLight.position.set(7, -2, -2)
  scene.add(sideLight)

  scene.add(new THREE.AmbientLight(0xffffff, 0.08))

  // ── Organic morph: 6 sine octaves, normal-direction displacement
  function morphBlob(
    attr:  THREE.BufferAttribute,
    orig:  Float32Array,
    t:     number,
    speed: number,
    amp:   number
  ) {
    for (let i = 0; i < attr.count; i++) {
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2]
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
      const nx = ox / len, ny = oy / len, nz = oz / len
      const d =
        Math.sin(ox * 2.3 + t * speed)                   * amp        +
        Math.sin(oy * 3.1 + t * speed * 0.87)            * amp * 0.85 +
        Math.sin(oz * 2.7 + t * speed * 1.13)            * amp * 0.8  +
        Math.sin((ox + oy) * 1.9 + t * speed * 0.65)    * amp * 0.9  +
        Math.sin((oy + oz) * 2.5 + t * speed * 0.75)    * amp * 0.7  +
        Math.sin(ox * 4.1 + oy * 1.8 + t * speed * 0.5) * amp * 0.55
      attr.setXYZ(i, ox + nx * d, oy + ny * d, oz + nz * d)
    }
    attr.needsUpdate = true
  }

  // ── Animate ────────────────────────────────────────────────────
  function animate(ms: number) {
    animId = requestAnimationFrame(animate)
    const t = ms * 0.001

    // Knot: multi-axis rotation + organic non-uniform breathing
    knot.rotation.x = t * 0.10 + Math.sin(t * 0.22) * 0.14
    knot.rotation.y = t * 0.14
    knot.rotation.z = Math.sin(t * 0.11) * 0.09
    knot.scale.set(
      1.0 + Math.sin(t * 0.40)        * 0.030,
      1.0 + Math.sin(t * 0.40 + 1.05) * 0.042,
      1.0 + Math.sin(t * 0.40 + 2.09) * 0.026
    )

    // Blob A
    blobA.position.set(
      2.1 + Math.sin(t * 0.45) * 2.2,
      0.1 + Math.cos(t * 0.38) * 1.4,
      Math.sin(t * 0.30) * 0.9
    )
    morphBlob(blobAPosA, blobAOrig, t, 1.0, 0.068)
    blobGeoA.computeVertexNormals()

    // Blob B
    blobB.position.set(
      2.1 + Math.cos(t * 0.60 + 2.1) * 1.8,
      0.1 + Math.sin(t * 0.52 + 1.3) * 1.6,
      Math.cos(t * 0.40 + 0.8) * 0.7
    )
    morphBlob(blobAPosB, blobBOrig, t, 1.3, 0.055)
    blobGeoB.computeVertexNormals()

    // Blob C — tiny drip
    blobC.position.set(
      2.1 + Math.sin(t * 0.33 + 1.2) * 2.8,
      0.1 + Math.sin(t * 0.71 + 0.4) * 1.0,
      Math.cos(t * 0.55 + 1.7) * 1.1
    )
    morphBlob(blobAPosC, blobCOrig, t, 1.6, 0.042)
    blobGeoC.computeVertexNormals()

    renderer!.render(scene, camera)
  }
  requestAnimationFrame(animate)

  resizeFn = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer!.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', resizeFn)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  if (resizeFn) window.removeEventListener('resize', resizeFn)
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="hero-canvas" />
</template>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
