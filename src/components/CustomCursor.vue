<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const dot  = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const isHover = ref(false)

onMounted(() => {
  if (!dot.value || !ring.value) return

  const xToRing = gsap.quickTo(ring.value, 'x', { duration: 0.5, ease: 'power3.out' })
  const yToRing = gsap.quickTo(ring.value, 'y', { duration: 0.5, ease: 'power3.out' })

  function onMove(e: MouseEvent) {
    const { clientX: x, clientY: y } = e
    gsap.set(dot.value, { x: x - 4, y: y - 4 })
    xToRing(x - 20)
    yToRing(y - 20)
  }

  function onEnter() { isHover.value = true }
  function onLeave() { isHover.value = false }

  window.addEventListener('mousemove', onMove)
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => window.removeEventListener('mousemove', onMove))
})
</script>

<template>
  <div ref="dot"  class="c-dot"></div>
  <div ref="ring" class="c-ring" :class="{ hover: isHover }"></div>
</template>

<style scoped>
.c-dot {
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  background: var(--fg);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}
.c-ring {
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1.5px solid rgba(13, 11, 8, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  will-change: transform;
  transition: width 0.25s, height 0.25s, border-color 0.25s;
}
.c-ring.hover {
  width: 56px; height: 56px;
  border-color: var(--accent);
}

@media (pointer: coarse) {
  .c-dot, .c-ring { display: none; }
}
</style>

