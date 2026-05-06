<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!el.value) return

  gsap.from(el.value.querySelector('.a-heading'), {
    scrollTrigger: { trigger: el.value, start: 'top 80%' },
    yPercent: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
  })
  gsap.from(el.value.querySelectorAll('.a-body > *'), {
    scrollTrigger: { trigger: el.value, start: 'top 70%' },
    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12
  })
  gsap.from(el.value.querySelector('.a-photo'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    opacity: 0, x: 30, duration: 0.9, ease: 'power2.out'
  })
})
</script>

<template>
  <section id="about" class="about" ref="el">
    <div class="about-inner">

      <div class="a-label-row">
        <span class="section-num">[ 01 ]</span>
        <div class="section-rule"></div>
        <span class="a-label-text">ABOUT</span>
        <span class="a-tech-tag" aria-hidden="true">{+}</span>
      </div>

      <div class="a-grid">

        <div class="a-left">
          <div class="clip">
            <h2 class="a-heading">
              Designing at the<br />
              <em>intersection</em><br />
              of art &amp; code.
            </h2>
          </div>

          <div class="a-body">
            <p>
              Hey — I'm Zvou. A web designer who cares deeply about how things feel,
              not just how they look. I work at the edge of typography, motion, and code
              to build experiences that have real personality.
            </p>
            <p>
              Whether it's a brand, a product, or an experiment — I bring an editorial
              eye and systems thinking to every screen.
            </p>

            <div class="a-stats">
              <div class="stat">
                <span class="stat-n">12<span class="acc">+</span></span>
                <span class="stat-l">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-n">3<span class="acc">+</span></span>
                <span class="stat-l">Years</span>
              </div>
              <div class="stat">
                <span class="stat-n">∞</span>
                <span class="stat-l">Ideas</span>
              </div>
            </div>
          </div>
        </div>

        <div class="a-right">
          <div class="a-photo">
            <div class="photo-inner">
              <!-- corner brackets -->
              <div class="photo-corner photo-corner--tl" aria-hidden="true"></div>
              <div class="photo-corner photo-corner--br" aria-hidden="true"></div>
              <span class="photo-label">[ photo ]</span>
            </div>
          </div>
          <p class="a-caption">UI DESIGNER · WEB DEV · OSLO</p>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  padding: 8rem 5vw;
  background: transparent;
}

.about-inner { max-width: 1200px; margin: 0 auto; }

.a-label-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;
}
.a-label-text {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.25em;
  color: var(--fg-dim);
}
.a-tech-tag {
  font-family: var(--font-body);
  font-size: 0.58rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  opacity: 0.6;
}

.a-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 6rem;
  align-items: start;
}

.clip { overflow: hidden; }

.a-heading {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 5vw, 5rem);
  font-weight: 900;
  line-height: 1.0;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  letter-spacing: -0.01em;
}
.a-heading em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  color: var(--accent);
  font-size: 0.85em;
}

.a-body { display: flex; flex-direction: column; gap: 1rem; }

.a-body p {
  color: var(--fg-dim);
  font-size: 0.97rem;
  line-height: 1.75;
  max-width: 480px;
}

.a-stats {
  display: flex;
  gap: 3rem;
  margin-top: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(13, 11, 8, 0.1);
}
.stat { display: flex; flex-direction: column; gap: 0.2rem; }
.stat-n {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--fg);
  line-height: 1;
}
.acc { color: var(--accent); }
.stat-l {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  color: var(--fg-dim);
  text-transform: uppercase;
}

.a-photo {
  width: 100%;
  aspect-ratio: 3/4;
  border: 1px solid rgba(13, 11, 8, 0.1);
  overflow: hidden;
}
.photo-inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(13, 11, 8, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.photo-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 2;
}
.photo-corner--tl {
  top: 10px; left: 10px;
  border-top: 1px solid rgba(40, 40, 255, 0.5);
  border-left: 1px solid rgba(40, 40, 255, 0.5);
}
.photo-corner--br {
  bottom: 10px; right: 10px;
  border-bottom: 1px solid rgba(40, 40, 255, 0.5);
  border-right: 1px solid rgba(40, 40, 255, 0.5);
}
.photo-label {
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--fg-dim);
}

.a-caption {
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: var(--fg-dim);
  text-align: right;
}

@media (max-width: 900px) {
  .about { padding: 5rem 1.5rem; }
  .a-grid { grid-template-columns: 1fr; gap: 3rem; }
  .a-right { order: -1; }
  .a-caption { text-align: left; }
}
</style>

