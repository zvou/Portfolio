// The hero's chrome sculpture: a stretched four-point star wrapped in thorny tendrils,
// with a few liquid drops. All geometry is built once; each frame only moves the meshes,
// so it stays cheap on laptops and phones.
import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Curve,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export interface ChromeScene {
  start(): void
  stop(): void
  renderOnce(): void
  resize(): void
  setScroll(progress: number): void
  setPointer(x: number, y: number): void
  dispose(): void
}

// ── Environment: bright strips on black give chrome its sharp, high-contrast reflections ──
function buildEnvironment(renderer: WebGLRenderer) {
  const env = new Scene()
  env.background = new Color(0x000000)
  const strip = (w: number, h: number, d: number, color: Color, pos: [number, number, number]) => {
    const mesh = new Mesh(new BoxGeometry(w, h, d), new MeshBasicMaterial({ color, toneMapped: false }))
    mesh.position.set(...pos)
    env.add(mesh)
  }
  const white = (v: number) => new Color(v, v, v)

  // Soft grey dome, lighter at the top, so chrome reads silver rather than black
  const dome = new SphereGeometry(30, 32, 16)
  const domeColors: number[] = []
  const dp = dome.attributes.position
  for (let i = 0; i < dp.count; i++) {
    const h = (dp.getY(i) / 30 + 1) / 2
    const v = 0.03 + Math.pow(h, 2.2) * 0.55
    domeColors.push(v, v, v * 1.06)
  }
  dome.setAttribute('color', new Float32BufferAttribute(domeColors, 3))
  env.add(new Mesh(dome, new MeshBasicMaterial({ vertexColors: true, side: BackSide, toneMapped: false })))

  strip(12, 0.4, 5, white(5), [0, 7, 0])            // overhead softbox
  strip(1.1, 9, 1.1, white(3.5), [-7, 0, 2])        // left vertical strip
  strip(0.7, 8, 0.7, new Color(1.4, 1.6, 6), [7, 0, -1]) // right strip, tinted with the site's blue
  strip(9, 0.25, 0.25, white(2.5), [0, -2, -7])     // thin rim behind
  strip(2.2, 2.2, 0.1, white(7), [4, 3.5, 7])       // key light, front right
  strip(10, 6, 0.1, white(0.9), [-1, 1, 12])        // big soft panel behind the camera lights the front faces
  strip(14, 0.1, 14, white(0.12), [0, -7, 0])       // faint floor so the undersides aren't pure black
  const pmrem = new PMREMGenerator(renderer)
  const texture = pmrem.fromScene(env, 0.035).texture
  pmrem.dispose()
  env.traverse(o => { if (o instanceof Mesh) { o.geometry.dispose(); (o.material as MeshBasicMaterial).dispose() } })
  return texture
}

// ── Four-point star with blade edges and a swollen, liquid centre ──
function starGeometry(): BufferGeometry {
  const tips = [new Vector2(1.55, 0), new Vector2(0, 2.9), new Vector2(-1.55, 0), new Vector2(0, -2.35)]
  const pinch = 0.17      // how close the curves between tips pass to the centre
  const perSegment = 64, rings = 40, thickness = 0.62

  // Outline: concave quadratic curves from tip to tip
  const outline: Vector2[] = []
  for (let k = 0; k < 4; k++) {
    const a = tips[k], b = tips[(k + 1) % 4]
    const mid = (k * Math.PI) / 2 + Math.PI / 4
    const c = new Vector2(Math.cos(mid), Math.sin(mid)).multiplyScalar(pinch)
    for (let i = 0; i < perSegment; i++) {
      const t = i / perSegment, u = 1 - t
      outline.push(new Vector2(u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y))
    }
  }

  const n = outline.length
  const pos: number[] = [], idx: number[] = []
  for (const side of [1, -1]) {
    const base = pos.length / 3
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= rings; j++) {
        const r = j / rings
        // Ease the radius so the surface is denser near the sharp rim
        const rr = Math.sin((r * Math.PI) / 2)
        const p = outline[i]
        const z = side * thickness * Math.pow(1 - rr, 1.7)
        pos.push(p.x * rr, p.y * rr, z)
      }
    }
    for (let i = 0; i < n; i++) {
      const i2 = (i + 1) % n
      for (let j = 0; j < rings; j++) {
        const a = base + i * (rings + 1) + j, b = base + i2 * (rings + 1) + j
        const c = a + 1, d = b + 1
        if (side > 0) idx.push(a, c, b, b, c, d)
        else idx.push(a, b, c, b, d, c)
      }
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

// ── A tube whose radius follows radiusAt(u), so it can taper to a needle point ──
function taperedTube(curve: Curve<Vector3>, segments: number, radial: number, radiusAt: (u: number) => number): BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false)
  const pos: number[] = [], idx: number[] = []
  const p = new Vector3(), dir = new Vector3()
  for (let i = 0; i <= segments; i++) {
    const u = i / segments
    curve.getPointAt(u, p)
    const r = radiusAt(u)
    const N = frames.normals[i], B = frames.binormals[i]
    for (let j = 0; j <= radial; j++) {
      const v = (j / radial) * Math.PI * 2
      dir.set(0, 0, 0).addScaledVector(N, -Math.cos(v)).addScaledVector(B, Math.sin(v))
      pos.push(p.x + dir.x * r, p.y + dir.y * r, p.z + dir.z * r)
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = (i + 1) * (radial + 1) + j
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

// Small deterministic random, so the sculpture looks the same on every visit
function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
}

// ── Thorny "cybersigil" tendrils that wrap around the star ──
function tendrilsGeometry(): BufferGeometry {
  const rand = rng(7)
  const parts: BufferGeometry[] = []
  const specs = [
    { from: 0.15, to: 1.25, rx: 2.5, ry: 3.1, tilt: 0.35, z: 0.6, thick: 0.13 },
    { from: 1.6, to: 2.75, rx: 2.2, ry: 2.6, tilt: -0.5, z: -0.5, thick: 0.11 },
    { from: 3.4, to: 4.6, rx: 2.7, ry: 2.9, tilt: 0.15, z: 0.2, thick: 0.12 },
  ]
  for (const s of specs) {
    // Wobbly arc around the centre
    const pts: Vector3[] = []
    const steps = 9
    for (let i = 0; i <= steps; i++) {
      const a = s.from + ((s.to - s.from) * i) / steps
      const wob = 1 + (rand() - 0.5) * 0.18
      const x = Math.cos(a) * s.rx * wob, y = Math.sin(a) * s.ry * wob
      pts.push(new Vector3(x, y * Math.cos(s.tilt), s.z + y * Math.sin(s.tilt) + (rand() - 0.5) * 0.4))
    }
    const curve = new CatmullRomCurve3(pts)
    parts.push(taperedTube(curve, 140, 14, u => s.thick * Math.pow(Math.sin(Math.PI * u), 0.55)))

    // Thorns swept back along the tendril, alternating sides
    const frames = curve.computeFrenetFrames(60, false)
    let side = 1
    for (let u = 0.08; u < 0.94; u += 0.055 + rand() * 0.05) {
      const i = Math.round(u * 60)
      const p = curve.getPointAt(u)
      const t = curve.getTangentAt(u)
      // Point the thorn mostly away from the centre
      const out = frames.normals[i].clone().multiplyScalar(side).add(frames.binormals[i].clone().multiplyScalar((rand() - 0.5) * 0.8))
      if (out.dot(p) < 0) out.negate()
      out.normalize()
      const len = 0.35 + rand() * 0.75
      const back = side > 0 ? 0.55 : -0.25
      const thorn = new CatmullRomCurve3([
        p.clone().addScaledVector(out, -0.04),
        p.clone().addScaledVector(out, len * 0.45).addScaledVector(t, len * back * 0.4),
        p.clone().addScaledVector(out, len).addScaledVector(t, len * back),
      ])
      const baseR = s.thick * Math.pow(Math.sin(Math.PI * u), 0.55) * 0.85
      parts.push(taperedTube(thorn, 18, 8, v => baseR * Math.pow(1 - v, 1.35)))
      side = -side
    }

    // A ring loop on each tendril, like the holes in the references
    const ringAt = 0.35 + rand() * 0.3
    const rp = curve.getPointAt(ringAt)
    const ring = new TorusGeometry(0.26 + rand() * 0.12, s.thick * 0.42, 14, 48)
    ring.lookAt(curve.getTangentAt(ringAt))
    ring.translate(rp.x, rp.y, rp.z)
    parts.push(ring)
  }
  // Torus geometry has uv attributes the tubes don't; drop them so everything merges
  for (const g of parts) { g.deleteAttribute('uv') }
  const merged = mergeGeometries(parts, false)
  parts.forEach(g => g.dispose())
  return merged!
}

// ── Liquid chrome drops: spheres pushed out of shape once, at build time ──
function dropGeometry(seed: number, radius: number): BufferGeometry {
  const g = new SphereGeometry(radius, 56, 40)
  const rand = rng(seed)
  const f = [rand() * 3 + 1.5, rand() * 3 + 1.5, rand() * 3 + 1.5], ph = [rand() * 6, rand() * 6, rand() * 6]
  const p = g.attributes.position as Float32BufferAttribute
  const v = new Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = v.clone().normalize()
    const d = 0.16 * (Math.sin(n.x * f[0] + ph[0]) + Math.sin(n.y * f[1] + ph[1]) + Math.sin(n.z * f[2] + ph[2])) / 3
    v.addScaledVector(n, d * radius * 2.2)
    v.y *= 1.25 // a little stretched, like a falling drop
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return g
}

export function createChromeScene(canvas: HTMLCanvasElement): ChromeScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  scene.environment = buildEnvironment(renderer)

  const camera = new PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 0, 11.5)

  const chrome = new MeshStandardMaterial({ color: new Color(0.92, 0.94, 1), metalness: 1, roughness: 0.07, envMapIntensity: 1.25, side: DoubleSide })

  const root = new Group()      // follows the layout, scroll and pointer
  const sculpture = new Group() // slow idle motion
  root.add(sculpture)
  scene.add(root)

  const star = new Mesh(starGeometry(), chrome)
  star.rotation.set(0.12, -0.35, -0.18)
  sculpture.add(star)

  const tendrils = new Mesh(tendrilsGeometry(), chrome)
  sculpture.add(tendrils)

  const drops = [
    { mesh: new Mesh(dropGeometry(3, 0.32), chrome), base: new Vector3(-2.4, 2.4, 0.8), speed: 0.6 },
    { mesh: new Mesh(dropGeometry(11, 0.2), chrome), base: new Vector3(2.2, -2.6, 1.2), speed: 0.8 },
    { mesh: new Mesh(dropGeometry(5, 0.13), chrome), base: new Vector3(-1.2, -3.1, -0.4), speed: 1.1 },
  ]
  drops.forEach(d => { d.mesh.position.copy(d.base); sculpture.add(d.mesh) })

  let scroll = 0
  const pointer = new Vector2(), eased = new Vector2()
  let raf = 0, running = false
  const t0 = performance.now()

  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    const aspect = w / Math.max(1, h)
    // Sit to the right on wide screens, centred and smaller on phones
    const wide = aspect > 1.1
    root.position.x = wide ? Math.min(2.9, 1.15 + aspect * 0.8) : 0.35
    root.userData.baseScale = wide ? 1 : 0.8
  }

  function frame(now: number) {
    const t = (now - t0) / 1000
    eased.lerp(pointer, 0.05)
    sculpture.rotation.y = Math.sin(t * 0.18) * 0.45 + t * 0.06
    sculpture.rotation.x = Math.sin(t * 0.13) * 0.12
    tendrils.rotation.z = t * 0.05
    star.rotation.z = -0.18 + Math.sin(t * 0.21) * 0.08
    drops.forEach((d, i) => {
      d.mesh.position.y = d.base.y + Math.sin(t * d.speed + i * 2) * 0.18
      d.mesh.rotation.y = t * d.speed * 0.5
    })
    root.rotation.y = eased.x * 0.25
    root.rotation.x = -eased.y * 0.15 + scroll * 0.3
    root.position.y = scroll * -2.6
    root.scale.setScalar((root.userData.baseScale ?? 1) * (1 - scroll * 0.12))
    renderer.render(scene, camera)
  }

  function loop(now: number) {
    frame(now)
    raf = requestAnimationFrame(loop)
  }

  const api: ChromeScene = {
    start() { if (!running) { running = true; raf = requestAnimationFrame(loop) } },
    stop() { running = false; cancelAnimationFrame(raf) },
    renderOnce() { frame(performance.now()) },
    resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(1, h)
      camera.updateProjectionMatrix()
      layout()
      if (!running) frame(performance.now())
    },
    setScroll(p) { scroll = p },
    setPointer(x, y) { pointer.set(x, y) },
    dispose() {
      api.stop()
      scene.traverse(o => { if (o instanceof Mesh) o.geometry.dispose() })
      chrome.dispose()
      scene.environment?.dispose()
      renderer.dispose()
    },
  }
  api.resize()
  return api
}
