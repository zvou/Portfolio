<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const el = ref<HTMLElement | null>(null)

interface Project {
  id: string; title: string; category: string; type: string; year: string
  note: string; thumb: string
  gallery?: string[]
  description?: string
}

const projects: Project[] = [
  {
    id: '01', title: 'The Arsenal [WIP]', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'Built a digital library for Warframe fashion, inspired by Warframes 1999 update. Designed to look like a desktop.',
    thumb: 'https://placehold.co/320x200/0d0b08/f0ece5?text=The+Arsenal',
  },
  {
    id: '02', title: 'Baro Relay Tracker', category: 'Loot Tracker', type: 'Web Design', year: '2026',
    note: 'Designed a real-time Warframe Tennocon relay tracker with live data and trackable loot tables.',
    thumb: 'https://placehold.co/320x200/2828ff/f0ece5?text=TC2026',
    description: `TC2026 is a real-time relay tracker built for Warframe's Tennocon 2026 event. The interface displays live relay population data, trackable loot tables, and mission timers — all in a dashboard designed to feel native to the Warframe universe.\n\nThe design system uses a dark, data-dense layout with colour-coded status indicators and a modular card grid. Built with vanilla JS and a custom CSS design system.`,
    gallery: [
      'https://placehold.co/1200x750/2828ff/f0ece5?text=TC2026+Screenshot+1',
      'https://placehold.co/1200x750/1a1aaa/f0ece5?text=TC2026+Screenshot+2',
      'https://placehold.co/1200x750/0d0b08/2828ff?text=TC2026+Screenshot+3',
      'https://placehold.co/1200x750/2828ff/0d0b08?text=TC2026+Screenshot+4',
    ],
  },
  {
    id: '03', title: 'Diagnostics Tool [WIP]', category: 'Diagnostics Tool', type: 'App', year: '2026',
    note: 'Created an interactive diagnostics tool with smooth page transitions and data visualization.',
    thumb: 'https://placehold.co/320x200/0d0b08/f0ece5?text=Diagnostics+Tool',
  },
  {
    id: '04', title: 'Pokédex', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'A simple Pokedex that includes the first 151 Pokemon, built with JS and a public API. Features search and filter functionality.',
    thumb: 'https://placehold.co/320x200/2828ff/f0ece5?text=Pokedex',
  },
]

// Floating preview card
const previewVisible = ref(false)
const previewSrc     = ref('')
const previewX       = ref(0)
const previewY       = ref(0)
let previewRaf = 0
let targetX = 0, targetY = 0

function onRowEnter(thumb: string) { previewSrc.value = thumb; previewVisible.value = true }
function onRowLeave() { previewVisible.value = false }
function onRowMove(e: MouseEvent) { targetX = e.clientX + 24; targetY = e.clientY - 60 }

function lerpPreview() {
  previewX.value += (targetX - previewX.value) * 0.12
  previewY.value += (targetY - previewY.value) * 0.12
  previewRaf = requestAnimationFrame(lerpPreview)
}

// Gallery modal
const galleryOpen    = ref(false)
const galleryProject = ref<Project | null>(null)
const activeIndex    = ref(0)

function openGallery(proj: Project, e: MouseEvent) {
  e.preventDefault()
  galleryProject.value = proj
  activeIndex.value = 0
  galleryOpen.value = true
  previewVisible.value = false
  document.body.style.overflow = 'hidden'
}

function closeGallery() {
  galleryOpen.value = false
  galleryProject.value = null
  document.body.style.overflow = ''
}

function onOverlayKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeGallery()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

function nextImage() {
  const len = galleryProject.value?.gallery?.length ?? 0
  activeIndex.value = (activeIndex.value + 1) % len
}
function prevImage() {
  const len = galleryProject.value?.gallery?.length ?? 0
  activeIndex.value = (activeIndex.value - 1 + len) % len
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
          :class="{ 'has-gallery': proj.gallery }"
          @mouseenter="onRowEnter(proj.thumb)"
          @mouseleave="onRowLeave"
          @mousemove="onRowMove"
          @click="proj.gallery ? openGallery(proj, $event) : $event.preventDefault()"
        >
          <span class="p-num">{{ proj.id }}</span>
          <span class="p-name">{{ proj.title }}</span>
          <span class="p-cat">{{ proj.category }}</span>
          <span class="p-type">{{ proj.type }}</span>
          <span class="p-year">{{ proj.year }}</span>
          <span class="p-arrow">{{ proj.gallery ? '⊞' : '↗' }}</span>
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

    <!-- Gallery modal -->
    <Teleport to="body">
      <div
        v-if="galleryOpen && galleryProject"
        class="gal-overlay"
        @click.self="closeGallery"
        @keydown="onOverlayKey"
        tabindex="0"
      >
        <div class="gal-modal">

          <div class="gal-header">
            <div class="gal-header-left">
              <span class="gal-num">{{ galleryProject.id }}</span>
              <span class="gal-title">{{ galleryProject.title }}</span>
              <span class="gal-type">{{ galleryProject.type }}</span>
            </div>
            <button class="gal-close" @click="closeGallery" aria-label="Close">✕</button>
          </div>

          <div class="gal-body">
            <div class="gal-stage">
              <div class="gal-img-wrap">
                <img :src="galleryProject.gallery![activeIndex]" :alt="`${galleryProject.title} screenshot ${activeIndex + 1}`" class="gal-img" />
                <button class="gal-nav gal-nav--prev" @click="prevImage" aria-label="Previous">&#8592;</button>
                <button class="gal-nav gal-nav--next" @click="nextImage" aria-label="Next">&#8594;</button>
              </div>
              <div class="gal-thumbs">
                <button
                  v-for="(src, i) in galleryProject.gallery"
                  :key="i"
                  class="gal-thumb"
                  :class="{ active: i === activeIndex }"
                  @click="activeIndex = i"
                >
                  <img :src="src" :alt="`Thumbnail ${i + 1}`" />
                </button>
              </div>
              <span class="gal-counter">{{ activeIndex + 1 }} / {{ galleryProject.gallery!.length }}</span>
            </div>

            <div class="gal-info">
              <div class="gal-meta-row">
                <span class="gal-meta-k">CATEGORY</span>
                <span class="gal-meta-v">{{ galleryProject.category }}</span>
              </div>
              <div class="gal-meta-row">
                <span class="gal-meta-k">YEAR</span>
                <span class="gal-meta-v">{{ galleryProject.year }}</span>
              </div>
              <hr class="gal-rule" />
              <p class="gal-desc" v-if="galleryProject.description">{{ galleryProject.description }}</p>
            </div>
          </div>

        </div>
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
.has-gallery .p-arrow { transform: rotate(0deg); }

/* ── Gallery modal ─────────────────────────────── */
.gal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(13, 11, 8, 0.88);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.gal-modal {
  background: var(--bg);
  border: 1px solid rgba(13, 11, 8, 0.15);
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.gal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.8rem;
  border-bottom: 1px solid rgba(13, 11, 8, 0.1);
  flex-shrink: 0;
}
.gal-header-left { display: flex; align-items: baseline; gap: 1.2rem; }
.gal-num { font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--fg-dim); }
.gal-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: var(--fg);
}
.gal-type { font-family: var(--font-body); font-size: 0.68rem; letter-spacing: 0.12em; color: var(--accent); }
.gal-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--fg-dim);
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  transition: color 0.2s;
}
.gal-close:hover { color: var(--fg); }

.gal-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  flex: 1;
}

.gal-stage {
  padding: 1.8rem;
  border-right: 1px solid rgba(13, 11, 8, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gal-img-wrap {
  position: relative;
  background: var(--bg2);
  line-height: 0;
}
.gal-img {
  width: 100%;
  height: auto;
  display: block;
  max-height: 52vh;
  object-fit: contain;
}

.gal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg);
  border: 1px solid rgba(13, 11, 8, 0.12);
  color: var(--fg);
  font-size: 1rem;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.gal-nav:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
.gal-nav--prev { left: 0.8rem; }
.gal-nav--next { right: 0.8rem; }

.gal-thumbs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.gal-thumb {
  width: 72px; height: 46px;
  padding: 0;
  border: 1px solid rgba(13, 11, 8, 0.12);
  background: var(--bg2);
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
  overflow: hidden;
  line-height: 0;
}
.gal-thumb:hover { opacity: 0.8; }
.gal-thumb.active { opacity: 1; border-color: var(--accent); }
.gal-thumb img { width: 100%; height: 100%; object-fit: cover; }

.gal-counter { font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.15em; color: var(--fg-dim); }

.gal-info { padding: 1.8rem; display: flex; flex-direction: column; gap: 0; }
.gal-meta-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(13, 11, 8, 0.08);
}
.gal-meta-k { font-family: var(--font-body); font-size: 0.58rem; letter-spacing: 0.2em; color: var(--fg-dim); }
.gal-meta-v { font-family: var(--font-body); font-size: 0.88rem; color: var(--fg); }
.gal-rule { margin: 1.2rem 0; border: none; border-top: 1px solid rgba(13, 11, 8, 0.1); }
.gal-desc {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--fg-dim);
  white-space: pre-line;
}

@media (max-width: 768px) {
  .projects { padding: 5rem 1.5rem; }
  .p-row { grid-template-columns: 2.5rem 1fr 1.5rem; }
  .p-cat, .p-type, .p-year { display: none; }
  .p-name { font-size: clamp(1.4rem, 7vw, 2rem); }
  .p-header { flex-direction: column; align-items: flex-start; }
  .gal-body { grid-template-columns: 1fr; }
  .gal-stage { border-right: none; border-bottom: 1px solid rgba(13,11,8,0.1); }
  .gal-overlay { padding: 0; align-items: flex-end; }
  .gal-modal { max-height: 95vh; }
}
</style>

