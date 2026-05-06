<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const width = ref(0)
let done = false

function onLoad() {
  width.value = 100
  setTimeout(() => { done = true }, 600)
}

// Fake incremental progress while page loads
let raf = 0
function tick() {
  if (!done && width.value < 85) {
    width.value += (85 - width.value) * 0.04
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  tick()
  window.addEventListener('load', onLoad)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('load', onLoad)
})
</script>

<template>
  <div class="progress-bar" :class="{ done }" :style="{ width: width + '%' }" />
</template>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  z-index: 9999;
  transition: width 0.4s ease, opacity 0.5s ease 0.1s;
  pointer-events: none;
  transform-origin: left;
}
.progress-bar.done {
  opacity: 0;
}
</style>
