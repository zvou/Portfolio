<script setup lang="ts">
import { onMounted } from 'vue'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CustomCursor from './components/CustomCursor.vue'
import MarqueeTicker from './components/MarqueeTicker.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ContactSection from './components/ContactSection.vue'

onMounted(() => {
  // Allow layout to settle before ScrollTrigger measures positions
  setTimeout(() => ScrollTrigger.refresh(), 200)
})
</script>

<template>
  <CustomCursor />
  <NavBar />
  <main>
    <HeroSection />
    <MarqueeTicker />
    <AboutSection />
    <MarqueeTicker :items="['PROJECTS', 'SELECTED WORK', 'CASE STUDIES', 'ZVOU', 'WEB DESIGN', '2026']" />
    <ProjectsSection />
    <SkillsSection />
    <ContactSection />
  </main>
</template>

<style>
.app { min-height: 100vh; }
main { overflow: hidden; }
</style>


