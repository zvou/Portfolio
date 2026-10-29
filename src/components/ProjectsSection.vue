<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const el = ref<HTMLElement | null>(null)

interface Project {
  id: string; title: string; category: string; type: string; year: string
  note: string; thumb?: string
  href?: string
  gallery?: string[]
  description?: string
}

const projects: Project[] = [
  {
    id: '01', title: 'The Arsenal [WIP]', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'Built a digital library for Warframe fashion, inspired by Warframes 1999 update. Designed to look like a desktop.',
    thumb: `${import.meta.env.BASE_URL}Photos/ArsenalSC1.png`,
    description: `The Arsenal is a desktop-style fashion archive for Warframe. Built with React + TypeScript, it mimics a retro operating system interface where players can browse, catalog, and organize character fashion looks.\n\nFeatures include a draggable windowed interface with folders for browsing Operator, Drifter, and Warframe fashion loadouts, a searchable look browser, wallpaper selector, and a media player. The project emphasizes retro aesthetic through pixel-perfect UI, custom interactions, and OS-like window management, creating a unique way to explore character fashion outside the game.`,
    gallery: [
      `${import.meta.env.BASE_URL}Photos/ArsenalSC1.png`,
    ],
  },
  {
    id: '02', title: 'Baro Relay Tracker', category: 'Loot Tracker', type: 'Web Design', year: '2026',
    note: 'Designed a real-time Warframe Tennocon relay tracker with live data and trackable loot tables.',
    thumb: `${import.meta.env.BASE_URL}Photos/BaroSC1.png`,
    description: `A personal portfolio project built to track Baro Ki'Teer, the Void Trader in the videogame Warframe. Baro visits a random relay every two weeks carrying a rotating selection of exclusive items.\n\nThis tool helps players plan, track, and wishlist items across every visit, with special focus on the TennoCon 2026 event where Baro historically returns every item he has ever sold.\n\nFeatures:\n- Live Baro tab fetches the current Baro inventory in real time via the warframestat.us community API (with a DE worldstate fallback).\n- All Items catalog is a persistent, growing historical catalog of every item Baro has ever brought. Automatically updated each time Baro visits while the backend is running.\n- TennoCon 2026 tab displays the full catalog as a pre-event planning list. During the TennoCon event window (July 11-18 2026), switches to the live TennoCon inventory.\n- Wishlist: Star any item to mark it as wanted. Persists across sessions via localStorage.\n- Mark Acquired: Track which items you've already purchased. Bought items are visually dimmed with an overlay.\n- Search, filter & sort: Search by name, filter by status (wishlisted / not acquired), filter by category (Mods, Appearance, Weapons, Misc), and sort by name or price.\n- Stats panel shows at-a-glance counts for total items, wishlisted items, acquired items, and remaining.\n- Countdown timer provides live countdown to the next Baro arrival or departure, and a dedicated TennoCon countdown.`,
    gallery: [
      `${import.meta.env.BASE_URL}Videos/relay-tracker-preview.mp4`,
    ],
  },
  {
    id: '04', title: 'Diagnostics Tool [WIP]', category: 'Desktop Application', type: 'App', year: '2026',
    note: 'Created an interactive diagnostics tool with smooth page transitions and data visualization.',
    thumb: `${import.meta.env.BASE_URL}Photos/DiagSC1.png`,
    description: `GameDiag is a Windows-first game performance diagnostics tool. It finds the most likely cause of FPS drops, stutter, and lag and tells you exactly what to fix.\n\nEvery scan produces ranked findings with severity, confidence, and actionable fixes. It checks CPU core count, GPU drivers and VRAM, RAM availability, storage space, power plans, background apps, frame-time data, game settings, network latency, and OS health.\n\nYou can run it via desktop UI, web dashboard, CLI, or system tray background monitor. It supports live frame-time capture with PresentMon, analyzes existing CSV data from capture tools, or processes gameplay MP4 recordings. Before/after benchmarking measures the impact of changes like driver updates or settings tweaks.\n\nSupported game configs auto-detect from default install locations: The Finals, Overwatch 2, Valorant, and CS2. Hardware tier is inferred automatically and recommendations adapt to your system.`,
    gallery: [
      `${import.meta.env.BASE_URL}Photos/DiagSC1.png`,
      `${import.meta.env.BASE_URL}Photos/DiagSC2.png`,
    ],
  },
  {
    id: '03', title: 'Pokédex', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'A simple Pokedex that includes the first 151 Pokemon, built with JS and a public API. Features search and filter functionality.',
    thumb: `${import.meta.env.BASE_URL}Photos/pokedexSC1.png`,
    href: 'https://zvou.github.io/Pokedex/',
  },
  {
    id: '05', title: 'Magnifier', category: 'Desktop Application', type: 'App', year: '2026',
    note: 'A Windows desktop magnification tool with hotkey-driven region selection, live tracking, and customizable magnified display windows.',
    description: `A Windows app for magnifying specific screen areas in real-time. Built with C# and WPF, it provides hotkey-driven region selection and displays magnified content in separate windows.\n\nSelect regions either by drawing directly on screen or picking from existing windows. Drag and resize magnified windows freely, set up multiple regions simultaneously, and enable auto-tracking for moving targets to keep them centered. Perfect for accessibility needs, precision work like video editing or design, or monitoring multiple screen areas at once.\n\nThe app supports customizable magnification levels, window positioning, and optional border highlighting. Access settings to adjust behavior, configure hotkeys, and manage multiple magnified windows.`,
    gallery: [],
  },
]

// Groups without projects are hidden until there is something to show
const groupedProjects = computed(() => [
  { label: 'Web Design', key: 'web', items: projects.filter(p => p.type === 'Web Design') },
  { label: 'Graphic Design', key: 'graphic', items: projects.filter(p => p.type === 'Graphic Design') },
  { label: 'Other', key: 'other', items: projects.filter(p => p.type !== 'Web Design' && p.type !== 'Graphic Design') },
].filter(g => g.items.length > 0))

// Floating preview card
const previewVisible = ref(false)
const previewSrc     = ref('')
const previewX       = ref(0)
const previewY       = ref(0)
let previewRaf = 0
let targetX = 0, targetY = 0

function onRowEnter(thumb?: string) {
  if (!thumb) return
  previewSrc.value = thumb
  previewVisible.value = true
}
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
  document.documentElement.style.overflow = 'hidden'
}

function closeGallery() {
  galleryOpen.value = false
  galleryProject.value = null
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
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

function isVideo(src: string): boolean {
  return /\.(mp4|webm|ogg|mov)$/i.test(src)
}

onMounted(() => {
  lerpPreview()
  if (!el.value) return
  gsap.from(el.value.querySelectorAll('.p-cat-header, .p-row'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1
  })
})

onUnmounted(() => cancelAnimationFrame(previewRaf))
</script>

<template>
  <section id="projects" class="projects" ref="el">

    <!-- Ghost stroke word -->
    <span class="p-ghost-word" aria-hidden="true">WORK</span>
    <!-- Ghost section number -->
    <span class="p-ghost-num" aria-hidden="true">02</span>
    <!-- Registration marks -->
    <div class="p-reg p-reg--tr" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="5.5" stroke="currentColor" stroke-width="0.6"/><line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="0.6"/></svg>
    </div>
    <div class="p-reg p-reg--bl" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="5.5" stroke="currentColor" stroke-width="0.6"/><line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" stroke-width="0.6"/><line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="0.6"/></svg>
    </div>

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
          <p class="p-sub">A curated set of projects across web interfaces, desktop tools, and experimental web.</p>
          <div class="p-checker" aria-hidden="true"></div>
        </div>
      </div>

      <div class="p-list">
        <template v-for="group in groupedProjects" :key="group.key">
          <div class="p-cat-header">
            <span class="p-cat-header-label">{{ group.label }}</span>
            <div class="p-cat-header-rule"></div>
            <span class="p-cat-header-count">[ {{ group.items.length }} ]</span>
          </div>
          <a
            v-for="proj in group.items"
            :key="proj.id"
            :href="proj.href ?? '#'"
            :target="proj.href ? '_blank' : undefined"
            :rel="proj.href ? 'noopener noreferrer' : undefined"
            class="p-row"
            :class="{ 'has-gallery': proj.gallery }"
            @mouseenter="onRowEnter(proj.thumb)"
            @mouseleave="onRowLeave"
            @mousemove="onRowMove"
            @click="proj.gallery ? openGallery(proj, $event) : (!proj.href && $event.preventDefault())"
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
        </template>
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
        @wheel.prevent
        tabindex="0"
      >
        <div class="gal-modal" @wheel.stop>

          <div class="gal-header">
            <div class="gal-header-left">
              <span class="gal-num">{{ galleryProject.id }}</span>
              <span class="gal-title">{{ galleryProject.title }}</span>
              <span class="gal-type">{{ galleryProject.type }}</span>
            </div>
            <button class="gal-close" @click="closeGallery" aria-label="Close">✕</button>
          </div>

          <div class="gal-body" :class="{ 'gal-body--text': galleryProject.gallery!.length === 0 }">
            <div v-if="galleryProject.gallery!.length > 0" class="gal-stage">
              <div class="gal-img-wrap">
                <video
                  v-if="isVideo(galleryProject.gallery![activeIndex])"
                  :key="galleryProject.gallery![activeIndex]"
                  :src="galleryProject.gallery![activeIndex]"
                  class="gal-img gal-video"
                  controls
                  muted
                  loop
                  playsinline
                ></video>
                <img
                  v-else
                  :src="galleryProject.gallery![activeIndex]"
                  :alt="`${galleryProject.title} screenshot ${activeIndex + 1}`"
                  class="gal-img"
                />
                <button v-if="galleryProject.gallery!.length > 1" class="gal-nav gal-nav--prev" @click="prevImage" aria-label="Previous">&#8592;</button>
                <button v-if="galleryProject.gallery!.length > 1" class="gal-nav gal-nav--next" @click="nextImage" aria-label="Next">&#8594;</button>
              </div>
              <div v-if="galleryProject.gallery!.length > 1" class="gal-thumbs">
                <button
                  v-for="(src, i) in galleryProject.gallery"
                  :key="i"
                  class="gal-thumb"
                  :class="{ active: i === activeIndex }"
                  @click="activeIndex = i"
                >
                  <span v-if="isVideo(src)" class="gal-thumb-video">&#9654;</span>
                  <img v-else :src="src" :alt="`Thumbnail ${i + 1}`" />
                </button>
              </div>
              <span v-if="galleryProject.gallery!.length > 1" class="gal-counter">{{ activeIndex + 1 }} / {{ galleryProject.gallery!.length }}</span>
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
  isolation: isolate;
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
  font-family: var(--font-body);
  font-style: normal;
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
  border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
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

/* ── Category headers ── */
.p-cat-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.6rem 0 0.5rem;
}
.p-cat-header-label {
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.28em;
  color: var(--fg-dim);
  text-transform: uppercase;
  white-space: nowrap;
}
.p-cat-header-rule {
  flex: 1;
  height: 1px;
  background: rgba(13, 11, 8, 0.1);
}
.p-cat-header-count {
  font-family: var(--font-body);
  font-size: 0.58rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  opacity: 0.55;
}

/* ── Gallery modal ─────────────────────────────── */
.gal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(13, 11, 8, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.gal-modal {
  background: var(--bg);
  border: 1px solid rgba(40, 40, 255, 0.3);
  width: 100%;
  max-width: 1100px;
  height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.8rem;
  border-bottom: 1px solid rgba(40, 40, 255, 0.15);
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
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.gal-stage {
  padding: 1.8rem;
  border-bottom: 1px solid rgba(40, 40, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.gal-img-wrap {
  position: relative;
  background: var(--bg2);
  line-height: 0;
  border: 1px solid rgba(40, 40, 255, 0.2);
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
.gal-thumb-video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--fg-dim);
  background: var(--bg2);
}
.gal-video {
  width: 100%;
  max-height: 52vh;
  display: block;
  background: #000;
  object-fit: contain;
}

.gal-counter { font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.15em; color: var(--fg-dim); }

.gal-info { padding: 2rem; display: flex; flex-direction: column; gap: 0.2rem; overflow-y: auto; overscroll-behavior: contain; max-height: 280px; border-top: 1px solid rgba(40, 40, 255, 0.15); }
/* Projects without screenshots yet: let the description fill the modal */
.gal-body--text .gal-info { max-height: none; border-top: none; }

.gal-meta-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(40, 40, 255, 0.12);
}
.gal-meta-k { font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.gal-meta-v { font-family: var(--font-body); font-size: 0.95rem; color: var(--fg); font-weight: 500; }
.gal-rule { margin: 0.4rem 0; border: none; border-top: 1px solid rgba(40, 40, 255, 0.15); }
.gal-desc {
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.9;
  color: var(--fg-dim);
  white-space: pre-line;
  margin-top: 0.4rem;
}

/* ── Ghost deco ── */
.p-ghost-word {
  position: absolute;
  bottom: 0;
  right: -1vw;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(8rem, 18vw, 18rem);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 8%, transparent);
  pointer-events: none;
  z-index: -1;
  line-height: 0.9;
  letter-spacing: -0.03em;
  user-select: none;
  text-transform: uppercase;
}
.p-ghost-num {
  position: absolute;
  top: 2rem;
  left: -1vw;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(8rem, 16vw, 16rem);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 6%, transparent);
  pointer-events: none;
  z-index: -1;
  line-height: 1;
  letter-spacing: -0.04em;
  user-select: none;
}
.p-reg {
  position: absolute;
  width: 18px;
  height: 18px;
  color: var(--fg);
  opacity: 0.15;
  z-index: 2;
  pointer-events: none;
}
.p-reg svg { width: 100%; height: 100%; }
.p-reg--tr { top: 1.5rem; right: 1.5rem; }
.p-reg--bl { bottom: 1.5rem; left: 1.5rem; }

@media (max-width: 768px) {
  .projects { padding: 5rem 1.5rem; }
  .p-row { grid-template-columns: 2.5rem 1fr 1.5rem; }
  .p-cat, .p-type, .p-year { display: none; }
  .p-name { font-size: clamp(1.4rem, 7vw, 2rem); }
  .p-header { flex-direction: column; align-items: flex-start; }
  .gal-overlay { padding: 0; align-items: flex-end; }
  .gal-modal { max-height: 95vh; }
  .gal-info { max-height: none; }
  .p-ghost-word, .p-ghost-num, .p-reg { display: none; }
}
</style>

