<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animId = 0
let renderer: THREE.WebGLRenderer | null = null
let resizeFn: (() => void) | null = null
let scrollProgress = 0
let scrollFn: (() => void) | null = null

function buildEnvMap(r: THREE.WebGLRenderer): THREE.Texture {
  const W = 1024, H = 512
  const data = new Float32Array(W * H * 4)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i  = (y * W + x) * 4
      const ny = y / H
      const nx = x / W
      const sky      = Math.max(0, 1.0 - ny * 2.0) * 0.95
      const horiz    = Math.exp(-Math.pow((ny - 0.35) * 8, 2)) * 2.8
      const floor    = Math.max(0, (ny - 0.50) * 1.8)
      const topSpot  = Math.exp(-Math.pow((nx - 0.5) * 2.5, 2)) * Math.max(0, 1 - ny * 5) * 0.7
      const sideGlow = Math.exp(-Math.pow((nx - 0.15) * 5, 2)) * Math.exp(-Math.pow((ny - 0.42) * 6, 2)) * 1.4
      const base     = 0.35
      const val      = base + sky + horiz + topSpot + sideGlow - floor * 0.48
      data[i]     = Math.min(4, val * 0.93)
      data[i + 1] = Math.min(4, val * 0.97)
      data[i + 2] = Math.min(4, val * 1.06)
      data[i + 3] = 1.0
    }
  }
  const tex      = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType)
  tex.mapping    = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.LinearSRGBColorSpace
  tex.needsUpdate = true
  const pmrem    = new THREE.PMREMGenerator(r)
  const envMap   = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose(); tex.dispose()
  return envMap
}

function helixPoints(turns: number, height: number, radius: number, angleOffset = 0): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const N = 400
  for (let i = 0; i <= N; i++) {
    const t   = i / N
    const ang = t * turns * Math.PI * 2 + angleOffset
    const swayZ = Math.sin(t * Math.PI) * 0.18
    pts.push(new THREE.Vector3(
      Math.cos(ang) * radius,
      (t - 0.5) * height,
      Math.sin(ang) * radius + swayZ
    ))
  }
  return pts
}

onMounted(() => {
  const canvas = canvasRef.value!
  const W = canvas.clientWidth, H = canvas.clientHeight

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(W, H, false)
  renderer.toneMapping         = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.35
  renderer.outputColorSpace    = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.environment = buildEnvMap(renderer)

  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
  camera.position.set(0, 0, 7)

  const group = new THREE.Group()
  group.position.set(2.0, 0, 0)
  scene.add(group)

  const chromeMat = new THREE.MeshStandardMaterial({
    color:           new THREE.Color(0.93, 0.96, 1.0),
    metalness:       1.0,
    roughness:       0.006,
    envMapIntensity: 3.2,
  })

  const innerA = new THREE.CatmullRomCurve3(helixPoints(4.5, 7.5, 1.00, 0))
  const innerB = new THREE.CatmullRomCurve3(helixPoints(4.5, 7.5, 1.00, Math.PI))
  const geoA   = new THREE.TubeGeometry(innerA, 700, 0.110, 20, false)
  const geoB   = new THREE.TubeGeometry(innerB, 700, 0.110, 20, false)
  group.add(new THREE.Mesh(geoA, chromeMat))
  group.add(new THREE.Mesh(geoB, chromeMat))

  const outerCurve  = new THREE.CatmullRomCurve3(helixPoints(2.5, 8.0, 2.10, Math.PI * 0.6))
  const geoOuter    = new THREE.TubeGeometry(outerCurve, 450, 0.210, 24, false)
  group.add(new THREE.Mesh(geoOuter, chromeMat))

  const outerCurve2 = new THREE.CatmullRomCurve3(helixPoints(3.0, 7.8, 1.65, Math.PI * 1.4))
  const geoOuter2   = new THREE.TubeGeometry(outerCurve2, 380, 0.160, 20, false)
  group.add(new THREE.Mesh(geoOuter2, chromeMat))

  const sGeoA    = new THREE.SphereGeometry(0.26, 96, 64)
  const sphereA  = new THREE.Mesh(sGeoA, chromeMat)
  group.add(sphereA)
  const sPosA    = sGeoA.getAttribute('position') as THREE.BufferAttribute
  const sOrigA   = new Float32Array(sPosA.array)

  const sGeoB    = new THREE.SphereGeometry(0.15, 80, 54)
  const sphereB  = new THREE.Mesh(sGeoB, chromeMat)
  group.add(sphereB)
  const sPosB    = sGeoB.getAttribute('position') as THREE.BufferAttribute
  const sOrigB   = new Float32Array(sPosB.array)

  const key    = new THREE.PointLight(0xffffff, 7.0, 32)
  key.position.set(5, 9, 5); scene.add(key)
  const fill   = new THREE.PointLight(0xffffff, 3.0, 24)
  fill.position.set(-7, -2, 4); scene.add(fill)
  const rim    = new THREE.PointLight(0xccdaff, 5.5, 24)
  rim.position.set(0, 9, -7); scene.add(rim)
  const ground = new THREE.PointLight(0xffffff, 2.0, 18)
  ground.position.set(-1, -8, 2); scene.add(ground)
  scene.add(new THREE.AmbientLight(0xffffff, 0.06))

  function morphBlob(attr: THREE.BufferAttribute, orig: Float32Array, t: number, spd: number, amp: number) {
    for (let i = 0; i < attr.count; i++) {
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2]
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1
      const nx = ox / len, ny = oy / len, nz = oz / len
      const d =
        Math.sin(ox * 2.3 + t * spd)                * amp        +
        Math.sin(oy * 3.1 + t * spd * 0.87)         * amp * 0.85 +
        Math.sin(oz * 2.7 + t * spd * 1.13)         * amp * 0.8  +
        Math.sin((ox + oy) * 1.9 + t * spd * 0.65)  * amp * 0.9  +
        Math.sin((oy + oz) * 2.5 + t * spd * 0.75)  * amp * 0.7
      attr.setXYZ(i, ox + nx * d, oy + ny * d, oz + nz * d)
    }
    attr.needsUpdate = true
  }

  scrollFn = () => {
    scrollProgress = Math.min(1, window.scrollY / (window.innerHeight * 0.85))
  }
  window.addEventListener('scroll', scrollFn, { passive: true })

  function animate(ms: number) {
    animId = requestAnimationFrame(animate)
    const t  = ms * 0.001
    const sp = scrollProgress

    group.position.y = sp * -2.8
    group.rotation.x = sp * 0.28
    group.rotation.z = -0.32 + sp * -0.12
    group.rotation.y = t * 0.10 + Math.sin(t * 0.07) * 0.15

    const breath = 1.0 + Math.sin(t * 0.32) * 0.018
    group.scale.setScalar(breath)

    sphereA.position.set(
       Math.sin(t * 0.42) * 1.5,
       2.6 + Math.cos(t * 0.34) * 0.5,
      Math.cos(t * 0.28) * 0.6
    )
    morphBlob(sPosA, sOrigA, t, 0.9, 0.055)
    sGeoA.computeVertexNormals()

    sphereB.position.set(
       Math.cos(t * 0.58 + 2.0) * 1.8,
      -2.8 + Math.sin(t * 0.49 + 1.1) * 0.6,
      Math.sin(t * 0.36) * 0.7
    )
    morphBlob(sPosB, sOrigB, t, 1.2, 0.042)
    sGeoB.computeVertexNormals()

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
  if (scrollFn) window.removeEventListener('scroll', scrollFn)
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