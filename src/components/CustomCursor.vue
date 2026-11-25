<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { prefersReducedMotion } from '../motion'

const ring = ref<HTMLElement | null>(null)
const isHover = ref(false)

onMounted(() => {
  if (!ring.value) return

  const lag = prefersReducedMotion ? 0 : 0.5
  const xToRing = gsap.quickTo(ring.value, 'x', { duration: lag, ease: 'power3.out' })
  const yToRing = gsap.quickTo(ring.value, 'y', { duration: lag, ease: 'power3.out' })

  function onMove(e: MouseEvent) {
    const { clientX: x, clientY: y } = e
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
  <div ref="ring" class="c-ring" :class="{ hover: isHover }"></div>
</template>

<style scoped>
.c-ring {
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  border: 1.5px solid color-mix(in srgb, var(--fg) 45%, transparent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  will-change: transform;
  transition: width 0.25s, height 0.25s, border-color 0.25s;
}
.c-ring.hover {
  width: 56px; height: 56px;
  border-color: var(--accent);
}

@media (pointer: coarse) {
  .c-ring { display: none; }
}
</style>

