<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ items?: string[] }>()
const defaultItems = [
  '***',
  '---',
  '0101',
  '###',
  'XXX',
  '2026',
]
const arr = computed(() => props.items ?? defaultItems)
</script>

<template>
  <div class="marquee-wrap" aria-hidden="true">
    <div class="marquee-track">
      <span v-for="(item, i) in [...arr, ...arr, ...arr, ...arr, ...arr, ...arr]" :key="i" class="marquee-item">
        {{ item }}<span class="sep">၊၊||၊</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-wrap {
  overflow: hidden;
  padding: 1rem 0;
  background: var(--bg);
  border-top: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
  position: relative;
  z-index: 1;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: marquee 60s linear infinite;
  width: max-content;
}

.marquee-item {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--fg-dim);
  padding: 0 1.5rem;
  flex-shrink: 0;
}

.sep {
  color: var(--accent);
  margin-left: 1.5rem;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>

