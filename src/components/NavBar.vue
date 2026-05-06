<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled  = ref(false)
const menuOpen  = ref(false)
const darkMode  = ref(false)

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Contact',  href: '#contact' },
]

function onScroll() { scrolled.value = window.scrollY > 40 }
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  // Respect OS preference on first load
  darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function closeMenu() { menuOpen.value = false }

function toggleDark() {
  darkMode.value = !darkMode.value
  applyTheme()
}
function applyTheme() {
  document.documentElement.classList.toggle('dark',  darkMode.value)
  document.documentElement.classList.toggle('light', !darkMode.value)
}
</script>

<template>
  <header :class="['nav', { scrolled }]">
    <a href="#hero" class="logo">zvou<span class="dot">.</span></a>

    <nav class="links">
      <a v-for="l in links" :key="l.href" :href="l.href">{{ l.label }}</a>
    </nav>

    <button class="theme-toggle" @click="toggleDark" :aria-label="darkMode ? 'Switch to light mode' : 'Switch to dark mode'">
      <span v-if="darkMode">&#9788;</span>
      <span v-else>&#9790;</span>
    </button>

    <button class="burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
      <span /><span />
    </button>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a v-for="l in links" :key="l.href" :href="l.href" @click="closeMenu">{{ l.label }}</a>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 5vw;
  transition: background 0.3s, border-bottom 0.3s;
}
.nav.scrolled {
  background: rgba(240, 236, 229, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(13, 11, 8, 0.08);
}

.logo {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--fg);
  letter-spacing: -0.01em;
}
.logo .dot { color: var(--accent); }

.links {
  display: flex;
  gap: 2.5rem;
}
.links a {
  font-family: var(--font-body);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--fg-dim);
  transition: color 0.2s;
}
.links a:hover { color: var(--fg); }

.theme-toggle {
  background: none;
  border: 1px solid rgba(13, 11, 8, 0.15);
  color: var(--fg-dim);
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s;
  cursor: none;
}
.theme-toggle:hover { color: var(--fg); border-color: var(--accent); }

.burger {
  display: none;
  flex-direction: column;
  gap: 7px;
  background: none;
  border: none;
  cursor: none;
  padding: 4px;
}
.burger span {
  display: block;
  width: 22px;
  height: 1px;
  background: var(--fg);
  transition: transform 0.3s, opacity 0.3s;
}
.burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.burger.open span:nth-child(2) { transform: translateY(0px) rotate(-45deg); }

.mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 2rem;
  gap: 1.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
  z-index: 99;
}
.mobile-menu.open { opacity: 1; pointer-events: all; }
.mobile-menu a {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--fg);
  line-height: 1;
  transition: color 0.2s;
}
.mobile-menu a:hover { color: var(--accent); }

@media (max-width: 768px) {
  .nav { padding: 1.2rem 1.5rem; }
  .links { display: none; }
  .burger { display: flex; }
}
</style>

