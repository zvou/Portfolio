<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import gsap from 'gsap'

const el = ref<HTMLElement | null>(null)

interface Project {
  id: string; title: string; category: string; type: string; year: string
  note: string; thumb?: string
  href?: string
  gallery?: string[]
  description?: string
  /** Shown as the large card above the list instead of as a row */
  featured?: { pitch: string; image: string; tags: string[] }
}

const projects: Project[] = [
  {
    id: '02', title: 'The Arsenal [WIP]', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'A digital library of Warframe fashion, built as a Y2K-style desktop with draggable windows, a fake web browser and a media player.',
    thumb: `${import.meta.env.BASE_URL}Photos/ArsenalSC1.png`,
    description: `The Arsenal is a digital library of fashion from Warframe, built to look and feel like an old desktop computer. Instead of scrolling a gallery, you log in, open folders and windows, and browse looks the way you'd browse files. The style is Y2K and "cybersigil": electric blue, halftone collages, chrome shapes and retro window chrome, inspired by Warframe's 1999 update.\n\nWhat you can do:\n- Log in on an ACCESS.EXE screen with a typewriter effect and a fade into the desktop.\n- Search 25 Warframe looks in HexFind, a fake web browser, and open any look as its own page.\n- Open a look's dossier window for every shot, the frame it's on, and notes on the colours.\n- Browse Operator and Drifter looks in folder windows with tabs and a filter.\n- Drag windows by their title bars, bring them to the front, and switch between them from the taskbar.\n- Use the start menu to search the whole archive or launch any view, including the VoidAmp media player.\n\nBuilt with React and TypeScript on Vite, with no UI library: the window manager, taskbar, layout that keeps windows on screen, and all styling are hand-written. It respects reduced-motion settings, and keyboard users can open looks with Enter.`,
    gallery: [
      `${import.meta.env.BASE_URL}Videos/arsenal-walkthrough.webm`,
      `${import.meta.env.BASE_URL}Photos/ArsenalSC1.png`,
      `${import.meta.env.BASE_URL}Photos/ArsenalSC2.png`,
      `${import.meta.env.BASE_URL}Photos/ArsenalSC3.png`,
      `${import.meta.env.BASE_URL}Photos/ArsenalSC4.png`,
      `${import.meta.env.BASE_URL}Photos/ArsenalSC5.png`,
    ],
  },
  {
    id: '03', title: 'Baro Relay Tracker', category: 'Loot Tracker', type: 'Web Design', year: '2026',
    note: 'Designed a real-time Warframe Tennocon relay tracker with live data and trackable loot tables.',
    thumb: `${import.meta.env.BASE_URL}Photos/BaroSC1.png`,
    description: `A personal portfolio project built to track Baro Ki'Teer, the Void Trader in the videogame Warframe. Baro visits a random relay every two weeks carrying a rotating selection of exclusive items.\n\nThis tool helps players plan, track, and wishlist items across every visit, with special focus on the TennoCon 2026 event where Baro historically returns every item he has ever sold.\n\nFeatures:\n- Live Baro tab fetches the current Baro inventory in real time via the warframestat.us community API (with a DE worldstate fallback).\n- All Items catalog is a persistent, growing historical catalog of every item Baro has ever brought. Automatically updated each time Baro visits while the backend is running.\n- TennoCon 2026 tab displays the full catalog as a pre-event planning list. During the TennoCon event window (July 11-18 2026), switches to the live TennoCon inventory.\n- Wishlist: Star any item to mark it as wanted. Persists across sessions via localStorage.\n- Mark Acquired: Track which items you've already purchased. Bought items are visually dimmed with an overlay.\n- Search, filter & sort: Search by name, filter by status (wishlisted / not acquired), filter by category (Mods, Appearance, Weapons, Misc), and sort by name or price.\n- Stats panel shows at-a-glance counts for total items, wishlisted items, acquired items, and remaining.\n- Countdown timer provides live countdown to the next Baro arrival or departure, and a dedicated TennoCon countdown.`,
    gallery: [
      `${import.meta.env.BASE_URL}Videos/relay-tracker-preview.mp4`,
    ],
  },
  {
    id: '01', title: 'Little by Little [WIP]', category: 'Planner Game', type: 'App', year: '2026',
    note: 'A cosy pixel-art game that doubles as a planner for people who leave things to the last minute. Tasks are quests, and your homestead grows as you get things done.',
    thumb: `${import.meta.env.BASE_URL}Photos/PlannerSC1.jpg`,
    featured: {
      pitch: 'A cosy pixel-art game that helps you start things earlier. Your real tasks become quests, and your homestead grows as you get them done.',
      image: `${import.meta.env.BASE_URL}Photos/PlannerSC2.jpg`,
      tags: ['React', 'TypeScript', 'Phaser', 'Pixel art', 'PWA + Electron'],
    },
    description: `Little by Little is a cosy pixel-art game that also works as a motivation planner, built for people who put things off until the deadline (common with ADHD) and who enjoy cosy games. Your homestead and character run on your real day: tasks are quests, finishing them waters the garden and earns XP and coins, and the world never punishes you for a bad day.\n\nThe core is about starting earlier, not just finishing:\n- Start-by dates work backwards from the deadline, effort and a buffer, so the app nudges you to begin in time.\n- A "Just 10 minutes" focus timer on every quest, because starting is the hard part.\n- Big quests get split into small steps, each with its own earlier date.\n- Gentle streaks that rest and sick days never break, and nothing turns red for "late".\n\nIt covers work, hobbies, chores (with repeating schedules), a weekly meal planner with recipe import and a shopping list, and a calendar where quests and events can be dragged to another day. A household can share chores, meals and the calendar through Supabase sync.\n\nBuilt with React, TypeScript and Vite, with the game world in Phaser and hand-made pixel art checked against a fixed palette. It works offline as an installable PWA, stores everything locally in IndexedDB with automatic backups, and also runs as a Windows desktop app with Electron, including a global quick-add shortcut and a system tray. Every sound is generated in code with the Web Audio API.`,
    gallery: [
      `${import.meta.env.BASE_URL}Photos/PlannerSC1.jpg`,
      `${import.meta.env.BASE_URL}Photos/PlannerSC2.jpg`,
      `${import.meta.env.BASE_URL}Photos/PlannerSC3.jpg`,
    ],
  },
  {
    id: '05', title: 'Diagnostics Tool [WIP]', category: 'Desktop Application', type: 'App', year: '2026',
    note: 'A Windows tool that scans your PC and frame-time data to find the most likely cause of FPS drops and stutter, then tells you what to fix.',
    thumb: `${import.meta.env.BASE_URL}Photos/GameDiagSC1.png`,
    description: `GameDiag is a Windows-first game performance diagnostics tool. It finds the most likely cause of FPS drops, stutter, and lag and tells you exactly what to fix.\n\nEvery scan produces ranked findings with severity, confidence, and actionable fixes. It checks CPU core count, GPU drivers and VRAM, RAM availability, storage space, power plans, background apps, frame-time data, game settings, network latency, and OS health.\n\nYou can run it via desktop UI, web dashboard, CLI, or system tray background monitor. It supports live frame-time capture with PresentMon, analyzes existing CSV data from capture tools, or processes gameplay MP4 recordings. Before/after benchmarking measures the impact of changes like driver updates or settings tweaks.\n\nSupported game configs auto-detect from default install locations: The Finals, Overwatch 2, Valorant, and CS2. Hardware tier is inferred automatically and recommendations adapt to your system.\n\nThe desktop app shows a health score with the primary cause up front, stat tiles for average FPS, 1% lows, P99 frame time and stutter events, and tabs for findings, an interactive frame-time chart, system details, before/after comparison, history and tools. It has light and dark themes, and a full scan takes about 20 seconds. Built in Python with Tkinter, with no required third-party dependencies.`,
    gallery: [
      `${import.meta.env.BASE_URL}Videos/gamediag-showcase.webm`,
      `${import.meta.env.BASE_URL}Photos/GameDiagSC1.png`,
      `${import.meta.env.BASE_URL}Photos/GameDiagSC2.png`,
      `${import.meta.env.BASE_URL}Photos/GameDiagSC3.png`,
      `${import.meta.env.BASE_URL}Photos/GameDiagSC4.png`,
    ],
  },
  {
    id: '04', title: 'Pokédex', category: 'Digital Library', type: 'Web Design', year: '2026',
    note: 'A simple Pokedex that includes the first 151 Pokemon, built with JS and a public API. Features search and filter functionality.',
    thumb: `${import.meta.env.BASE_URL}Photos/pokedexSC1.png`,
    href: 'https://zvou.github.io/Pokedex/',
  },
  {
    id: '06', title: 'Magnifier', category: 'Desktop Application', type: 'App', year: '2026',
    note: 'A Windows app that magnifies any parts of your screen in live, movable windows, and can follow a HUD element as it moves.',
    thumb: `${import.meta.env.BASE_URL}Photos/MagnifierSC1.png`,
    description: `Magnifier is a Windows app for keeping small parts of the screen readable, like a game's minimap, a timer or a health bar. You drag over any part of the screen, and it shows up enlarged in its own live window that you can move anywhere and zoom with the scroll wheel.\n\nWhat it does:\n- Magnify several areas at once, each in its own window with its own zoom (0.5× to 8×).\n- Anchor an area to a window, so it moves along with a windowed game instead of staying fixed on screen.\n- Auto-track: pick the icon or element that moves, and the area follows it every frame using OpenCV template matching.\n- Pin the overlays to make them click-through with no controls, for playing.\n- Global shortcuts for adding areas, pinning and hiding, which work even while a game has focus and can be changed in settings.\n- Sharp or smooth scaling, so text and pixel art stay crisp.\n- Areas are saved and come back the next time you open it, and it handles multiple monitors with different scaling.\n\nBuilt with C# and WPF on .NET 8, with screen capture through the Windows API and tracking with OpenCvSharp. The magnified windows hide themselves from the app's own capture, so they never magnify themselves even when they overlap what they show.`,
    gallery: [
      `${import.meta.env.BASE_URL}Videos/magnifier-showcase.webm`,
      `${import.meta.env.BASE_URL}Photos/MagnifierSC1.png`,
      `${import.meta.env.BASE_URL}Photos/MagnifierSC2.png`,
      `${import.meta.env.BASE_URL}Photos/MagnifierSC3.png`,
    ],
  },
]

const featured = projects.find(p => p.featured)
const listed   = projects.filter(p => !p.featured)

// Groups without projects are hidden until there is something to show
const groupedProjects = computed(() => [
  { label: 'Web Design', key: 'web', items: listed.filter(p => p.type === 'Web Design') },
  { label: 'Graphic Design', key: 'graphic', items: listed.filter(p => p.type === 'Graphic Design') },
  { label: 'Other', key: 'other', items: listed.filter(p => p.type !== 'Web Design' && p.type !== 'Graphic Design') },
].filter(g => g.items.length > 0))

// Gallery modal
const galleryOpen    = ref(false)
const galleryProject = ref<Project | null>(null)
const activeIndex    = ref(0)

function openGallery(proj: Project, e: MouseEvent) {
  e.preventDefault()
  galleryProject.value = proj
  activeIndex.value = 0
  galleryOpen.value = true
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
  if (!el.value) return
  gsap.from(el.value.querySelectorAll('.p-feature, .p-cat-header, .p-row'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1
  })
})

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

      <!-- Featured project -->
      <a
        v-if="featured?.featured"
        href="#"
        class="p-feature"
        @click="openGallery(featured, $event)"
      >
        <div class="p-feature-media">
          <img :src="featured.featured.image" :alt="`${featured.title} screenshot`" />
        </div>
        <div class="p-feature-body">
          <div class="p-feature-meta">
            <span class="p-feature-badge">Featured</span>
            <span>{{ featured.id }}</span>
            <span>·</span>
            <span>{{ featured.category }}</span>
            <span>·</span>
            <span>{{ featured.year }}</span>
          </div>
          <h3 class="p-feature-title">{{ featured.title }}</h3>
          <p class="p-feature-pitch">{{ featured.featured.pitch }}</p>
          <ul class="p-feature-tags">
            <li v-for="tag in featured.featured.tags" :key="tag">{{ tag }}</li>
          </ul>
          <span class="p-feature-cta">View project <span aria-hidden="true">⊞</span></span>
        </div>
      </a>

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
            @click="proj.gallery ? openGallery(proj, $event) : (!proj.href && $event.preventDefault())"
          >
            <span class="p-num">{{ proj.id }}</span>
            <span class="p-thumb">
              <img v-if="proj.thumb" :src="proj.thumb" alt="" loading="lazy" />
              <span v-else class="p-thumb-empty">Preview soon</span>
            </span>
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
  grid-template-columns: 3.5rem 9rem 1fr auto auto auto 2rem;
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

/* ── Featured card ── */
.p-feature {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  margin-bottom: 3rem;
  border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
  background: color-mix(in srgb, var(--fg) 3%, transparent);
  color: var(--fg);
  transition: border-color 0.2s;
}
.p-feature:hover { border-color: var(--accent); }
.p-feature-media { overflow: hidden; line-height: 0; border-right: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); }
.p-feature-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.p-feature:hover .p-feature-media img { transform: scale(1.03); }
.p-feature-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.2rem;
}
.p-feature-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
.p-feature-badge {
  padding: 0.2rem 0.55rem;
  background: var(--accent);
  color: var(--bg);
  letter-spacing: 0.2em;
}
.p-feature-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.95;
  letter-spacing: -0.01em;
  transition: color 0.2s;
}
.p-feature:hover .p-feature-title { color: var(--accent); }
.p-feature-pitch { font-size: 0.95rem; line-height: 1.7; color: var(--fg-dim); max-width: 42ch; }
.p-feature-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; list-style: none; }
.p-feature-tags li {
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: var(--fg-dim);
  padding: 0.25rem 0.7rem;
  border: 1px solid color-mix(in srgb, var(--fg) 15%, transparent);
}
.p-feature-cta {
  margin-top: auto;
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

/* Process note — hidden until hover */
.p-note {
  grid-column: 3 / -1;
  font-family: var(--font-body);
  font-style: normal;
  font-size: 0.85rem;
  color: var(--fg-dim);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, opacity 0.3s ease, margin-top 0.3s ease;
}

/* Inline thumbnail beside each project name */
.p-thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
  background: var(--bg2);
  line-height: 0;
  transition: border-color 0.2s;
}
.p-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.4s ease;
}
.p-row:hover .p-thumb { border-color: var(--accent); }
.p-row:hover .p-thumb img { transform: scale(1.06); }
.p-thumb-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  line-height: 1.2;
  color: var(--fg-dim);
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
  .p-row { grid-template-columns: 2rem 5.5rem 1fr 1.5rem; gap: 0.8rem; }
  .p-cat, .p-type, .p-year { display: none; }
  .p-name { font-size: clamp(1.4rem, 7vw, 2rem); }
  .p-header { flex-direction: column; align-items: flex-start; }
  .gal-overlay { padding: 0; align-items: flex-end; }
  .gal-modal { max-height: 95vh; }
  .gal-info { max-height: none; }
  .p-ghost-word, .p-ghost-num, .p-reg { display: none; }
  .p-feature { grid-template-columns: 1fr; }
  .p-feature-media { border-right: none; border-bottom: 1px solid color-mix(in srgb, var(--fg) 12%, transparent); }
  .p-feature-body { padding: 1.5rem; }
}
</style>

