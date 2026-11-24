<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { prefersReducedMotion } from '../motion'
import type { ChromeScene } from '../hero/chromeScene'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const ready = ref(false)

let scene: ChromeScene | null = null
let visible = true
let observer: IntersectionObserver | null = null
let disposed = false

// Only animate while the hero is on screen and the tab is in front
function updateRunning() {
  if (!scene || prefersReducedMotion) return
  if (visible && !document.hidden) scene.start()
  else scene.stop()
}

function onScroll() {
  scene?.setScroll(Math.min(1, window.scrollY / (window.innerHeight * 0.85)))
}
function onPointer(e: PointerEvent) {
  scene?.setPointer(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * 2 - 1)
}
function onResize() { scene?.resize() }

onMounted(async () => {
  // three.js lives in its own chunk, loaded after the page has painted
  const { createChromeScene } = await import('../hero/chromeScene')
  if (disposed || !canvasRef.value) return
  scene = createChromeScene(canvasRef.value)
  onScroll()

  if (prefersReducedMotion) {
    // Reduced motion: one still frame, redrawn only on resize
    scene.renderOnce()
  } else {
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateRunning() })
    observer.observe(canvasRef.value)
    document.addEventListener('visibilitychange', updateRunning)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    updateRunning()
  }
  window.addEventListener('resize', onResize)
  requestAnimationFrame(() => { ready.value = true })
})

onUnmounted(() => {
  disposed = true
  observer?.disconnect()
  document.removeEventListener('visibilitychange', updateRunning)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onPointer)
  window.removeEventListener('resize', onResize)
  scene?.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="hero-canvas" :class="{ ready }" aria-hidden="true" />
</template>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.hero-canvas.ready { opacity: 1; }
</style>
