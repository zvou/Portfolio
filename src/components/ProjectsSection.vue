<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const el = ref<HTMLElement | null>(null)

// Preview image: use a placeholder gradient per project (swap src for real screenshots)
const projects = [
  {
    id: '01', title: 'The Arsenal',         category: 'Digital Library', type: 'Web Design',    year: '2026',
    note: 'Built a digital library for Warframe fashion, inspired by Warframes 1999 update. Designed to look like a desktop.',
    thumb: 'https://placehold.co/320x200/0d0b08/f0ece5?text=The+Arsenal',
  },
  {
    id: '02', title: 'TC2026 Relay Tracker', category: 'Design System',  type: 'UI Kit',        year: '2026',
    note: 'Designed a real-time Warframe Tennocon relay tracker with live data and trackable loot tables.',
    thumb: 'https://placehold.co/320x200/2828ff/f0ece5?text=TC2026',
  },
  {
    id: '03', title: 'Recipe Library',       category: 'Web App',        type: 'Motion Design', year: '2026',
    note: 'Created an interactive recipe app with smooth page transitions and ingredient filters.',
    thumb: 'https://placehold.co/320x200/0d0b08/f0ece5?text=Recipe+Library',
  },
  {
    id: '04', title: 'Pokédex',              category: 'Editorial',      type: 'Concept',       year: '2026',
    note: 'Reimagined the Pokédex as an editorial web experience with typographic hierarchy.',
    thumb: 'https://placehold.co/320x200/2828ff/f0ece5?text=Pokedex',
  },
]

// Floating preview card
const previewVisible = ref(false)
const previewSrc     = ref('')
const previewX       = ref(0)
const previewY       = ref(0)
let previewRaf       = 0
let targetX = 0, targetY = 0

function onRowEnter(thumb: string) {
  previewSrc.value     = thumb
  previewVisible.value = true
}
function onRowLeave() {
  previewVisible.value = false
}
function onRowMove(e: MouseEvent) {
  targetX = e.clientX + 24
  targetY = e.clientY - 60
}

function lerpPreview() {
  previewX.value += (targetX - previewX.value) * 0.12
  previewY.value += (targetY - previewY.value) * 0.12
  previewRaf = requestAnimationFrame(lerpPreview)
}

onMounted(() => {
  lerpPreview()
  if (!el.value) return
  gsap.from(el.value.querySelectorAll('.p-row'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1
  })
})

onUnmounted(() => cancelAnimationFrame(previewRaf))
</script>

<template>
  <section id="projects" class="projects" ref="el">
    <div class="p-inner">

      <div class="p-label-row">
        <span class="section-num">[ 02 ]</span>
        <div class="section-rule"></div>
        <span class="p-label-text">WORK</span>
        <span class="p-tech-tag" aria-hidden="true">{+}</span>
      </div>

      <div class="p-header">
        <h2 class="p-title">Selected<br /><em>Projects_</em></h2>
        <div class="p-header-right">
          <p class="p-sub">A curated set of projects across branding, interfaces, and experimental web.</p>
          <div class="p-checker" aria-hidden="true"></div>
        </div>
      </div>

      <div class="p-list">
        <a
          v-for="proj in projects"
          :key="proj.id"
          href="#"
          class="p-row"
          @mouseenter="onRowEnter(proj.thumb)"
          @mouseleave="onRowLeave"
          @mousemove="onRowMove"
        >
          <span class="p-num">{{ proj.id }}</span>
          <span class="p-name">{{ proj.title }}</span>
          <span class="p-cat">{{ proj.category }}</span>
          <span class="p-type">{{ proj.type }}</span>
          <span class="p-year">{{ proj.year }}</span>
          <span class="p-arrow">&#8599;</span>
          <!-- Process note, revealed on hover -->
          <span class="p-note">{{ proj.note }}</span>
        </a>
      </div>

    </div>

    <!-- Floating thumbnail preview -->
    <Teleport to="body">
      <div
        class="p-preview"
        :class="{ visible: previewVisible }"
        :style="{ left: previewX + 'px', top: previewY + 'px' }"
        aria-hidden="true"
      >
        <img :src="previewSrc" alt="" />
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.projects {
  position: relative;
  padding: 8rem 5vw;
  background: transparent;
}
.p-inner { max-width: 1200px; margin: 0 auto; }

.p-label-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 4rem; }
.p-label-text { font-family: var(--font-body); font-size: 0.68rem; letter-spacing: 0.25em; color: var(--fg-dim); }
.p-tech-tag { font-family: var(--font-body); font-size: 0.58rem; letter-spacing: 0.15em; color: var(--accent); opacity: 0.6; }

.p-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 2rem; margin-bottom: 4rem; flex-wrap: wrap; }
.p-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 1.2rem; }
.p-sub { max-width: 320px; color: var(--fg-dim); font-size: 0.9rem; line-height: 1.7; text-align: right; }
.p-checker {
  width: 48px;
  height: 16px;
  background-image: conic-gradient(
    rgba(40, 40, 255, 0.5) 90deg, transparent 90deg 180deg,
    rgba(40, 40, 255, 0.5) 180deg 270deg, transparent 270deg
  );
  background-size: 8px 8px;
}
.p-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.95;
  letter-spacing: -0.01em;
}
.p-title em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  color: var(--accent);
  font-size: 1em;
  position: relative;
  top: -0.15em;
}
.p-sub { max-width: 320px; color: var(--fg-dim); font-size: 0.9rem; line-height: 1.7; }

.p-list { border-top: 1px solid rgba(13, 11, 8, 0.1); }

.p-row {
  display: grid;
  grid-template-columns: 3.5rem 1fr auto auto auto 2rem;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1.6rem 0;
  border-bottom: 1px solid rgba(13, 11, 8, 0.1);
  transition: background 0.2s, padding-left 0.2s;
  position: relative;
  color: var(--fg);
}
.p-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 0;
  background: var(--accent);
  transition: width 0.2s ease;
}
.p-row:hover { padding-left: 1.2rem; background: rgba(13, 11, 8, 0.03); }
.p-row:hover::before { width: 2px; }
.p-row:hover .p-name { color: var(--accent); }
.p-row:hover .p-arrow { transform: rotate(0deg); color: var(--accent); }
.p-row:hover .p-note { max-height: 2em; opacity: 1; margin-top: 0.3rem; }

/* Process note — hidden until hover */
.p-note {
  grid-column: 2 / -1;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--fg-dim);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.3s ease, margin-top 0.3s ease;
}

/* Floating thumbnail preview */
.p-preview {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transform: scale(0.92) translateY(6px);
  transition: opacity 0.22s ease, transform 0.22s ease;
  border: 1px solid rgba(13, 11, 8, 0.12);
  box-shadow: 0 16px 48px rgba(13, 11, 8, 0.18);
}
.p-preview.visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.p-preview img {
  display: block;
  width: 280px;
  height: auto;
}

.p-num { font-family: var(--font-body); font-size: 0.62rem; letter-spacing: 0.15em; color: var(--fg-dim); }
.p-name {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 3rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1;
  transition: color 0.2s;
}
.p-cat { font-family: var(--font-body); font-size: 0.78rem; color: var(--fg-dim); }
.p-type { font-family: var(--font-body); font-size: 0.72rem; color: var(--fg-dim); padding: 0.25rem 0.7rem; border: 1px solid rgba(13, 11, 8, 0.15); }
.p-year { font-family: var(--font-body); font-size: 0.72rem; color: var(--fg-dim); }
.p-arrow { font-size: 1.1rem; color: var(--fg-dim); transform: rotate(-45deg); transition: transform 0.2s, color 0.2s; }

@media (max-width: 768px) {
  .projects { padding: 5rem 1.5rem; }
  .p-row { grid-template-columns: 2.5rem 1fr 1.5rem; }
  .p-cat, .p-type, .p-year { display: none; }
  .p-name { font-size: clamp(1.4rem, 7vw, 2rem); }
  .p-header { flex-direction: column; align-items: flex-start; }
}
</style>

