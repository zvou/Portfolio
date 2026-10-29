import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import { prefersReducedMotion } from './motion'

gsap.registerPlugin(ScrollTrigger)

if (prefersReducedMotion) {
  // Native scrolling, and GSAP tweens finish instantly so content just appears
  gsap.globalTimeline.timeScale(1000)
} else {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  ;(window as any).__lenis = lenis
}

createApp(App).mount('#app')

