<script setup lang="ts">
defineProps<{ items?: string[] }>()
const defaultItems = [
  'AVAILABLE FOR WORK',
  'WEB DESIGN',
  'UI / UX',
  'TYPOGRAPHY',
  'ZVOU',
  '2026',
]
</script>

<template>
  <div class="marquee-wrap" aria-hidden="true">
    <div class="marquee-track">
      <span v-for="(item, i) in [...(items ?? defaultItems), ...(items ?? defaultItems)]" :key="i" class="marquee-item">
        {{ item }}<span class="sep">âœ¦</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-wrap {
  overflow: hidden;
  border-top: none;
  border-bottom: none;
  padding: 1rem 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--bg2) 35%,
    var(--bg2) 65%,
    transparent 100%
  );
  margin: -2rem 0;
  position: relative;
  z-index: 1;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: marquee 22s linear infinite;
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

