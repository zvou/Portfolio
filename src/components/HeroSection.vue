<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import HeroCanvas from './HeroCanvas.vue'

const heroRef   = ref<HTMLElement | null>(null)
const typedRole = ref('')

const roles = ['Web Designer', 'UI Designer', 'Frontend Dev', 'Creative Coder']
let roleIndex = 0
let charIndex = 0
let deleting  = false
let typingTimer = 0

function typeStep() {
  const current = roles[roleIndex]
  if (!deleting) {
    charIndex++
    typedRole.value = current.slice(0, charIndex)
    if (charIndex === current.length) {
      deleting = true
      typingTimer = window.setTimeout(typeStep, 2200)
      return
    }
  } else {
    charIndex--
    typedRole.value = current.slice(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      roleIndex = (roleIndex + 1) % roles.length
    }
  }
  typingTimer = window.setTimeout(typeStep, deleting ? 45 : 90)
}

onMounted(() => {
  // Start typing after entrance animation settles
  typingTimer = window.setTimeout(typeStep, 1800)

  const el = heroRef.value
  if (!el) return

  const tl = gsap.timeline({ delay: 0.1 })

  tl.from([el.querySelector('.h-frame--tl'), el.querySelector('.h-frame--br')], {
      opacity: 0, scale: 0.6, duration: 0.5, ease: 'power2.out', stagger: 0.08
    }, 0)
    .from(el.querySelector('.h-ci'), {
      opacity: 0, x: -10, duration: 0.6, ease: 'power2.out'
    }, 0.1)
    .from(el.querySelector('.h-checker'), {
      opacity: 0, duration: 0.4, ease: 'power2.out'
    }, 0.2)
    .from(el.querySelector('.h-topmeta'), {
      opacity: 0, x: 12, duration: 0.6, ease: 'power2.out'
    }, 0.2)
    .from(el.querySelector('.h-name'), {
      yPercent: 105, duration: 1, ease: 'power3.out'
    }, 0.3)
    .from(el.querySelector('.h-serif'), {
      yPercent: 105, duration: 0.85, ease: 'power3.out'
    }, '-=0.65')
    .from(el.querySelector('.h-rule'), {
      scaleX: 0, duration: 0.65, ease: 'power2.inOut', transformOrigin: 'left'
    }, '-=0.4')
    .from(el.querySelectorAll('.h-tick-row, .h-desc, .h-barcode, .h-cta'), {
      opacity: 0, y: 18, duration: 0.55, ease: 'power2.out', stagger: 0.08
    }, '-=0.3')
    .from(el.querySelectorAll('.h-float, .h-scroll'), {
      opacity: 0, duration: 0.5
    }, '-=0.2')
})

onUnmounted(() => clearTimeout(typingTimer))
</script>

<template>
  <section id="hero" class="hero" ref="heroRef">

    <!-- Chrome 3D blob canvas -->
    <HeroCanvas />
    <!-- Left vignette so text stays readable -->
    <div class="h-vignette" aria-hidden="true"></div>

    <!-- Corner bracket frames -->
    <div class="h-frame h-frame--tl" aria-hidden="true"></div>
    <div class="h-frame h-frame--br" aria-hidden="true"></div>

    <!-- Top-left technical cluster -->
    <div class="h-ci" aria-hidden="true">
      <span class="h-ci-tag">{+} PORTFOLIO</span>
      <span class="h-ci-coord">59.9139° N · 10.7522° E</span>
      <span class="h-ci-ver">REF / WD-2026-001</span>
    </div>

    <!-- Checkerboard accent top-right -->
    <div class="h-checker" aria-hidden="true"></div>

    <!-- Top-right meta panel -->
    <div class="h-topmeta">
      <div class="h-meta-row">
        <span class="meta-k">[ ROLE ]</span>
        <span class="meta-v">Web Designer</span>
      </div>
      <div class="h-meta-row">
        <span class="meta-k">[ STATUS ]</span>
        <span class="meta-v accent">◉ Open to work</span>
      </div>
    </div>

    <!-- Main title block -->
    <div class="h-title-block">
      <div class="clip"><h1 class="h-name">ZVOU</h1></div>
      <div class="clip"><p class="h-serif"><span class="h-typed">{{ typedRole }}</span><span class="h-caret" aria-hidden="true">|</span></p></div>
    </div>

    <!-- Rule + measurement ticks -->
    <div class="h-rule"></div>
    <div class="h-tick-row" aria-hidden="true">
      <span v-for="i in 24" :key="i" class="h-tick"></span>
    </div>

    <!-- Bottom row -->
    <div class="h-bottom">
      <div class="h-bottom-left">
        <p class="h-desc">
          Crafting digital experiences<br />that feel alive on screen.
        </p>
        <!-- Barcode decoration -->
        <div class="h-barcode" aria-hidden="true">
          <div class="h-barcode-bars"></div>
          <span class="h-barcode-label">ZVOU · WD · 2026 · 001</span>
        </div>
      </div>
      <div class="h-cta">
        <a href="#projects" class="btn-fill">View Work</a>
        <a href="#contact"  class="btn-line">Get In Touch</a>
      </div>
    </div>

    <!-- Floating ambient markers -->
    <span class="h-float h-float--1" aria-hidden="true">✦</span>
    <span class="h-float h-float--2" aria-hidden="true">{+}</span>
    <span class="h-float h-float--3" aria-hidden="true">◈</span>

    <!-- Scroll indicator -->
    <div class="h-scroll">
      <div class="scroll-bar"></div>
      <span>SCROLL</span>
    </div>

  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 7rem 5vw 5rem 5vw;
  overflow: hidden;
  background: var(--bg);
}

/* ── Corner bracket frames ── */
.h-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    var(--bg) 0%,
    var(--bg) 28%,
    rgba(240, 236, 229, 0.75) 52%,
    transparent 72%
  );
  z-index: 1;
  pointer-events: none;
}
.h-frame {
  position: absolute;
  width: 26px;
  height: 26px;
  pointer-events: none;
  z-index: 3;
}
.h-frame--tl {
  top: 1.4rem;
  left: 1.4rem;
  border-top: 1px solid rgba(40, 40, 255, 0.6);
  border-left: 1px solid rgba(40, 40, 255, 0.6);
}
.h-frame--br {
  bottom: 1.4rem;
  right: 1.4rem;
  border-bottom: 1px solid rgba(40, 40, 255, 0.6);
  border-right: 1px solid rgba(40, 40, 255, 0.6);
}

/* ── Top-left annotation cluster ── */
.h-ci {
  position: absolute;
  top: 4rem;
  left: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 3;
}
.h-ci-tag {
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--accent);
}
.h-ci-coord,
.h-ci-ver {
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.16em;
  color: var(--fg-dim);
  opacity: 0.6;
}

/* ── Checkerboard accent block ── */
.h-checker {
  position: absolute;
  top: 3.8rem;
  right: calc(5vw + 0.5rem);
  width: 36px;
  height: 36px;
  background-image: conic-gradient(
    rgba(40, 40, 255, 0.55) 90deg, transparent 90deg 180deg,
    rgba(40, 40, 255, 0.55) 180deg 270deg, transparent 270deg
  );
  background-size: 9px 9px;
  z-index: 3;
}

/* ── Top-right meta panel ── */
.h-topmeta {
  position: absolute;
  top: 7.5rem;
  right: 5vw;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: right;
  z-index: 3;
}
.h-meta-row {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-bottom: 0.3rem;
}
.meta-k {
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.18em;
  color: var(--fg-dim);
  text-transform: uppercase;
  display: block;
}
.meta-v {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--fg);
  display: block;
}
.meta-v.accent { color: var(--accent); }

/* ── Title block ── */
.h-title-block {
  position: relative;
  z-index: 2;
  margin-bottom: 0.2rem;
}
.clip { overflow: hidden; }

.h-name {
  font-family: var(--font-display);
  font-size: clamp(7rem, 18vw, 18rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.01em;
  color: var(--fg);
  text-transform: uppercase;
}
.h-serif {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(3rem, 7vw, 7rem);
  color: var(--fg);
  line-height: 1;
  margin-left: 0.5rem;
  margin-top: -0.2rem;
  min-height: 1.1em;
}
.h-caret {
  display: inline-block;
  color: var(--accent);
  font-style: normal;
  animation: blink 0.9s step-end infinite;
  margin-left: 2px;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Rule + ticks ── */
.h-rule {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 1px;
  background: rgba(13, 11, 8, 0.15);
  margin-top: 2rem;
}
.h-tick-row {
  display: flex;
  width: 100%;
  margin-bottom: 1.5rem;
  z-index: 2;
}
.h-tick {
  flex: 1;
  height: 5px;
  border-left: 1px solid rgba(13, 11, 8, 0.1);
}
.h-tick:nth-child(6n) {
  height: 10px;
  border-left-color: rgba(40, 40, 255, 0.3);
}
.h-tick:first-child { border-left: none; }

/* ── Bottom row ── */
.h-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}
.h-bottom-left {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}
.h-desc {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--fg-dim);
  max-width: 380px;
  line-height: 1.7;
}

/* Barcode decoration */
.h-barcode {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.h-barcode-bars {
  height: 22px;
  width: 130px;
  background-image: repeating-linear-gradient(
    90deg,
    var(--fg-dim) 0px,   var(--fg-dim) 2px,
    transparent  2px,   transparent  5px,
    var(--fg-dim) 5px,   var(--fg-dim) 6px,
    transparent  6px,   transparent  9px,
    var(--fg-dim) 9px,   var(--fg-dim) 12px,
    transparent  12px,  transparent  14px,
    var(--fg-dim) 14px,  var(--fg-dim) 15px,
    transparent  15px,  transparent  19px,
    var(--fg-dim) 19px,  var(--fg-dim) 22px,
    transparent  22px,  transparent  24px,
    var(--fg-dim) 24px,  var(--fg-dim) 26px,
    transparent  26px,  transparent  30px,
    var(--fg-dim) 30px,  var(--fg-dim) 31px,
    transparent  31px,  transparent  35px,
    var(--fg-dim) 35px,  var(--fg-dim) 38px,
    transparent  38px,  transparent  40px,
    var(--fg-dim) 40px,  var(--fg-dim) 42px,
    transparent  42px,  transparent  46px,
    var(--fg-dim) 46px,  var(--fg-dim) 49px,
    transparent  49px,  transparent  51px,
    var(--fg-dim) 51px,  var(--fg-dim) 52px,
    transparent  52px,  transparent  56px,
    var(--fg-dim) 56px,  var(--fg-dim) 59px,
    transparent  59px,  transparent  62px,
    var(--fg-dim) 62px,  var(--fg-dim) 64px,
    transparent  64px,  transparent  68px,
    var(--fg-dim) 68px,  var(--fg-dim) 70px,
    transparent  70px,  transparent  74px,
    var(--fg-dim) 74px,  var(--fg-dim) 77px,
    transparent  77px,  transparent  79px,
    var(--fg-dim) 79px,  var(--fg-dim) 80px,
    transparent  80px,  transparent  84px,
    var(--fg-dim) 84px,  var(--fg-dim) 87px,
    transparent  87px,  transparent  90px,
    var(--fg-dim) 90px,  var(--fg-dim) 91px,
    transparent  91px,  transparent  95px,
    var(--fg-dim) 95px,  var(--fg-dim) 97px,
    transparent  97px,  transparent  100px,
    var(--fg-dim) 100px, var(--fg-dim) 103px,
    transparent  103px, transparent  106px,
    var(--fg-dim) 106px, var(--fg-dim) 108px,
    transparent  108px, transparent  112px,
    var(--fg-dim) 112px, var(--fg-dim) 115px,
    transparent  115px, transparent  118px,
    var(--fg-dim) 118px, var(--fg-dim) 120px,
    transparent  120px, transparent  124px,
    var(--fg-dim) 124px, var(--fg-dim) 126px,
    transparent  126px, transparent  130px
  );
  opacity: 0.3;
}
.h-barcode-label {
  font-family: var(--font-body);
  font-size: 0.48rem;
  letter-spacing: 0.14em;
  color: var(--fg-dim);
  opacity: 0.45;
}

/* ── CTA buttons ── */
.h-cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-self: flex-end;
}
.btn-fill {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 0.85rem 2rem;
  background: var(--accent);
  color: var(--bg);
  border: 1px solid var(--accent);
  transition: background 0.2s, color 0.2s;
}
.btn-fill:hover { background: transparent; color: var(--accent); }
.btn-line {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 0.85rem 2rem;
  background: transparent;
  color: var(--fg);
  border: 1px solid rgba(13, 11, 8, 0.2);
  transition: border-color 0.2s, color 0.2s;
}
.btn-line:hover { border-color: var(--fg); }

/* ── Floating ambient markers ── */
.h-float {
  position: absolute;
  font-family: var(--font-body);
  color: var(--accent);
  opacity: 0.2;
  pointer-events: none;
  z-index: 3;
  line-height: 1;
}
.h-float--1 { font-size: 1rem;  top: 44%;  right: 22%; }
.h-float--2 { font-size: 0.6rem; bottom: 32%; left: 42%; letter-spacing: 0.05em; }
.h-float--3 { font-size: 0.75rem; top: 60%; right: 38%; }

/* ── Scroll indicator ── */
.h-scroll {
  position: absolute;
  bottom: 2.5rem;
  right: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.3em;
  color: var(--fg-dim);
  z-index: 3;
}
.scroll-bar {
  width: 1px;
  height: 55px;
  background: rgba(13, 11, 8, 0.12);
  position: relative;
  overflow: hidden;
}
.scroll-bar::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 40%;
  background: var(--accent);
  animation: scrollDrop 1.8s ease-in-out infinite;
}
@keyframes scrollDrop {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(300%); }
}

@media (max-width: 768px) {
  .hero { padding: 7rem 1.5rem 4rem 1.5rem; }
  .h-ci { display: none; }
  .h-topmeta { display: none; }
  .h-checker { display: none; }
  .h-float { display: none; }
  .h-scroll { display: none; }
  .h-bottom { flex-direction: column; gap: 1.5rem; }
}
</style>

