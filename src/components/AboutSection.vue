<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const baseUrl = import.meta.env.BASE_URL
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

    <!-- Ghost section number -->
    <span class="a-ghost-num" aria-hidden="true">01</span>

    <!-- Right vertical strip -->
    <div class="a-rightstrip" aria-hidden="true">
      <span>EXPAND</span>
      <span>◊</span>
      <span>REPLICATE</span>
      <span>◊</span>
      <span>2026∞</span>
      <span>◊</span>
      <span>CE∂MOR</span>
      <span>◊</span>
      <span>BMM∕PSTR</span>
    </div>

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
              About<br />
              <em>Me_</em><br />
            </h2>
          </div>

          <div class="a-body">
            <p>
              I'm Amalie Wallenius, also known as zvou online. I'm a frontend developer and UI designer, and I also build smaller projects on the side, which you'll find on this page.
            </p>
            <p>
              I got into web design through Neopets when I was 11, customising my pets' pages with HTML and CSS.
            </p>
            <p>
              I studied graphic design in Oslo, then moved to England to study Computer Science. I recently wrapped up a frontend internship at Cloudgeni.
            </p>
            <p>
              Outside work I play a lot of games, which is where most of my project ideas come from: a Warframe fashion archive, a loot tracker, a performance tool and a cosy game of my own.
            </p>
            <p>
              Now I'm looking for my next role, ideally somewhere I get to both design and build things. I can start right away.
            </p>

            <div class="a-stats">
              <div class="stat">
                <span class="stat-n">6<span class="acc">+</span></span>
                <span class="stat-l">Projects</span>
              </div>
              <div class="stat">
                <span class="stat-n">2008</span>
                <span class="stat-l">Coding since</span>
              </div>
              <div class="stat">
                <span class="stat-n">4<span class="acc">+</span></span>
                <span class="stat-l">Languages</span>
              </div>
            </div>
          </div>
        </div>

        <div class="a-right">
          <!-- Sparkle cluster: top-right -->
          <div class="a-spark-tr" aria-hidden="true">
            <svg class="spark spark--lg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><path d="M50,2 C50,2 47,47 2,50 C47,50 50,98 50,98 C50,98 53,53 98,50 C53,50 50,2 50,2Z"/></svg>
            <svg class="spark spark--sm" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M50,2 C50,2 47,47 2,50 C47,50 50,98 50,98 C50,98 53,53 98,50 C53,50 50,2 50,2Z"/></svg>
          </div>
          <!-- Sparkle cluster: bottom-left -->
          <div class="a-spark-bl" aria-hidden="true">
            <span class="spark-ascii">&#x2500;&#x2534;&#x2500; &#x00B7; &#x2500;&#x2500;&#x00B7;&#x2500;&#x2500;<br/>ID:AMW-026 // &#x0394;<br/>&#x2588;&#x2591;&#x2588;&#x2591; &#x25A0; &#x2592;&#x2593;&#x2591;<br/>&#x0394;ELT:0.03ms<br/>&#x2590;&#x28FF; &#x25C4; 192.168.*<br/>&#x00B7;&#x2500;&#x00B7;&#x2500;&#x00B7; &#x2261;&#x2261; &#x2297;</span>
            <svg class="spark spark--md" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M50,2 C50,2 47,47 2,50 C47,50 50,98 50,98 C50,98 53,53 98,50 C53,50 50,2 50,2Z"/></svg>
            <svg class="spark spark--xs" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"><path d="M50,2 C50,2 47,47 2,50 C47,50 50,98 50,98 C50,98 53,53 98,50 C53,50 50,2 50,2Z"/></svg>
            <span class="spark-ascii">&#x2846;&#x2009;&#x28FF; &#x22C4; &#x2592;&#x2591;&#x25A0;<br/>&#x00B7;&#x2500;&#x00B7;&#x2500;&#x00B7; &#x2590;&#x2593; &#x2295;&#x2297;</span>
          </div>
          <div class="a-photo">
            <div class="photo-inner">
              <!-- corner brackets -->
              <div class="photo-corner photo-corner--tl" aria-hidden="true"></div>
              <div class="photo-corner photo-corner--br" aria-hidden="true"></div>
              <!-- HUD overlays -->
              <div class="photo-hud photo-hud--tl" aria-hidden="true">&#x25C8; SPRITE&#x00B7;LOADED<br/>36&#x00D7;48&#x2009;PX<br/>&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x252C;</div>
              <div class="photo-hud photo-hud--br" aria-hidden="true">SCALE&#x202F;&#x00D7;10<br/>LITTLE&#x202F;BY&#x202F;LITTLE<br/>&#x2534;&#x2500;&#x2500;&#x2500;&#x2500;</div>
              <div class="photo-hud photo-hud--ml" aria-hidden="true">SIG&#x2009;&#x2588;&#x2588;&#x2588;&#x2588;&#x2591;&#x2009;67%</div>
              <img :src="`${baseUrl}Photos/avatar.png`" alt="Pixel-art avatar of Amalie Wallenius, in the style of Little by Little" class="photo-img" />
              <!-- ID label strip -->
              <div class="photo-id-strip" aria-hidden="true">
                <span>SUBJECT : AMW</span>
                <span class="id-sep">//</span>
                <span>OSLO, NO</span>
                <span class="id-sep">//</span>
                <span>CE-2026</span>
              </div>
            </div>
          </div>
          <!-- Overhang: crosses LEFT edge of photo -->
          <div class="a-spark-ov a-spark-ov--l" aria-hidden="true">
            <span>&#x2500;&#x2500; LAT:59.91 &#x2500;&#x2500;</span>
            <span>&#x25C4; SIG &#x00B7; &#x2593;&#x2592;&#x2591;</span>
            <span>&#x2500;&#x2500;&#x2500; 192.168.* &#x2500;</span>
            <span>&#x2261;&#x2261; &#x00B7; &#x2297; &#x00B7;</span>
            <span>&#x2500;&#x2500;&#x2500; &#x00B7; &#x252C;&#x2500;&#x2500;&#x2500;</span>
          </div>
          <!-- Crossing line: left edge -->
          <div class="a-spark-cross a-spark-cross--l" aria-hidden="true">&#x2500;&#x2500;&#x2500;&#x2500; &#x22C4; &#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;</div>
          <p class="a-caption">FRONTEND DEV · UI DESIGNER · OSLO</p>
        </div>

      </div>
    </div>
  </section>
</template>

<!-- Schematic decoration moved here from hero -->
<style scoped>
.about {
  position: relative;
  padding: 8rem 5vw;
  background: transparent;
  isolation: isolate;
}

/* ── Right vertical strip ── */
.a-rightstrip {
  position: absolute;
  right: 0.4rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  z-index: 1;
  pointer-events: none;
}
.a-rightstrip span {
  font-family: var(--font-body);
  font-size: 0.38rem;
  letter-spacing: 0.18em;
  color: var(--fg);
  opacity: 0.25;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
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
  font-size: 1em;
  position: relative;
  top: -0.15em;
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

.a-right { position: relative; }

/* ── Sparkle clusters ── */
.a-spark-tr {
  position: absolute;
  top: 1%;
  right: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  pointer-events: none;
  z-index: 10;
  color: var(--fg);
}
.a-spark-bl {
  position: absolute;
  bottom: 13%;
  left: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  pointer-events: none;
  z-index: 10;
  color: var(--fg);
}
.spark { display: block; }
.spark--lg { width: 56px; height: 56px; }
.spark--sm { width: 30px; height: 30px; }
.spark--md { width: 38px; height: 38px; }
.spark--xs { width: 20px; height: 20px; }
.spark-ascii {
  font-family: var(--font-body);
  font-size: 0.65rem;
  opacity: 0.5;
  line-height: 1.7;
  letter-spacing: 0.06em;
  text-align: right;
}

/* ── Overhangs: ASCII bleeding outside photo edges ── */
.a-spark-ov {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  pointer-events: none;
  z-index: 10;
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  opacity: 0.55;
  text-transform: uppercase;
  white-space: nowrap;
}
.a-spark-ov--l {
  top: 52%;
  left: -3rem;
  align-items: flex-end;
}
/* Single-line crossing marks that span the photo edge */
.a-spark-cross {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  opacity: 0.4;
  white-space: nowrap;
}
.a-spark-cross--l {
  top: 68%;
  left: -4.5rem;
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
.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  display: block;
  /* Pixel-art avatar: keep the pixels hard-edged when scaled up */
  image-rendering: pixelated;
}
/* Scan lines removed */
/* ID label strip */
.photo-id-strip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.35rem 0.7rem;
  background: rgba(73, 0, 255, 0.72);
  display: flex;
  gap: 0.45rem;
  align-items: center;
  z-index: 4;
}
.photo-id-strip span {
  font-family: var(--font-body);
  font-size: 0.42rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.88);
  text-transform: uppercase;
}
.id-sep {
  color: rgba(255, 255, 255, 0.35) !important;
}
.photo-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 5;
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

/* ── Photo HUD overlays ── */
.photo-hud {
  position: absolute;
  font-family: var(--font-body);
  font-size: 0.4rem;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  z-index: 6;
  line-height: 1.9;
  text-transform: uppercase;
  white-space: nowrap;
}
.photo-hud--tl {
  top: 2.4rem;
  left: 0.7rem;
}
.photo-hud--br {
  bottom: 2.6rem;
  right: 0.7rem;
  text-align: right;
}
.photo-hud--ml {
  top: 50%;
  left: 0;
  writing-mode: vertical-rl;
  transform: translateY(-50%) rotate(180deg);
  padding: 0.4rem 0.3rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.12em;
}

.a-caption {
  margin-top: 1rem;
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: var(--fg-dim);
  text-align: right;
}

.a-ghost-num {
  position: absolute;
  bottom: 0;
  right: -2vw;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(10rem, 22vw, 22rem);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 7%, transparent);
  pointer-events: none;
  z-index: -1;
  line-height: 0.85;
  letter-spacing: -0.04em;
  user-select: none;
}

@media (max-width: 900px) {
  .about { padding: 5rem 1.5rem; }
  .a-grid { grid-template-columns: 1fr; gap: 3rem; }
  .a-right { order: -1; }
  .a-caption { text-align: left; }
  .a-rightstrip { display: none; }
  .a-ghost-num { display: none; }
  .a-spark-ov { display: none; }
  .a-spark-cross { display: none; }
}
</style>

<!-- Unscoped: light mode sparkle colour override -->
<style>
html:not(.dark) .a-spark-tr,
html:not(.dark) .a-spark-bl,
html:not(.dark) .a-spark-ov,
html:not(.dark) .a-spark-cross {
  color: rgba(255, 255, 255, 0.85);
}
</style>

