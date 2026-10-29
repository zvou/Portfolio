<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motion'
import CustomCursor from './components/CustomCursor.vue'
import ProgressBar from './components/ProgressBar.vue'
import MarqueeTicker from './components/MarqueeTicker.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'

const showBackToTop = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
}

onMounted(() => {
  // Allow layout to settle before ScrollTrigger measures positions
  setTimeout(() => ScrollTrigger.refresh(), 200)

  // Show back-to-top button after scrolling past hero
  window.addEventListener('scroll', () => {
    showBackToTop.value = window.scrollY > 800
  })
})
</script>

<template>
  <CustomCursor />
  <ProgressBar />
  <NavBar />
  <main>
    <HeroSection />
    <MarqueeTicker />
    <AboutSection />
    <MarqueeTicker :items="['PROJECTS', 'SELECTED WORK', 'WIP', 'APPS', 'WEB DESIGN', '2026']" />
    <ProjectsSection />
    <SkillsSection />
    <ContactSection />
  </main>

  <!-- Back to top button -->
  <button
    v-if="showBackToTop"
    class="back-to-top"
    @click="scrollToTop"
    aria-label="Back to top"
  >
    ↑
  </button>
</template>

<style>
.app { min-height: 100vh; }
main { overflow: hidden; }

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: var(--accent);
  color: #0f0d0a;
  border: none;
  cursor: none;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
  transition: opacity 0.2s, transform 0.2s;
}

.back-to-top:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
</style>


