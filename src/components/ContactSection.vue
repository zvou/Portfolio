<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const el = ref<HTMLElement | null>(null)
const emailCopied = ref(false)
const EMAIL = 'amaliewallenius@outlook.com'

async function copyEmail(e: MouseEvent) {
  e.preventDefault()
  try {
    await navigator.clipboard.writeText(EMAIL)
    emailCopied.value = true
    setTimeout(() => { emailCopied.value = false }, 2000)
  } catch {
    window.location.href = `mailto:${EMAIL}`
  }
}

onMounted(() => {
  if (!el.value) return
  gsap.from(el.value.querySelectorAll('.c-left > *, .c-form-wrap'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    y: 40, opacity: 0, duration: 0.75, ease: 'power2.out', stagger: 0.12
  })
})
</script>

<template>
  <section id="contact" class="contact" ref="el">

    <!-- Ghost stroke word -->
    <span class="c-ghost-word" aria-hidden="true">CONTACT</span>
    <!-- Ghost section number -->
    <span class="c-ghost-num" aria-hidden="true">04</span>

    <div class="c-inner">

      <div class="c-label-row">
        <span class="section-num">[ 04 ]</span>
        <div class="section-rule"></div>
        <span class="c-label-text">CONTACT</span>
        <span class="c-tech-tag" aria-hidden="true">{+}</span>
      </div>

      <div class="c-grid">

        <div class="c-left">
          <div class="c-frame c-frame--tl" aria-hidden="true"></div>
          <h2 class="c-title">Contact<br /><em>Me_</em></h2>
          <p class="c-desc">
            Open to work. Reach out if you have any questions.
          </p>
          <div class="c-links">
            <a href="mailto:amaliewallenius@outlook.com" class="c-link c-link--email" @click="copyEmail">
              <span class="c-link-label">Email</span>
              <span class="c-link-val">{{ emailCopied ? 'Copied!' : 'amaliewallenius@outlook.com' }}</span>
            </a>
            <a href="https://linkedin.com/in/zvou/" target="_blank" class="c-link">
              <span class="c-link-label">LinkedIn</span>
              <span class="c-link-val">Amalie Wallenius / zvou</span>
            </a>
            <a href="https://github.com/zvou" target="_blank" class="c-link">
              <span class="c-link-label">GitHub</span>
              <span class="c-link-val">zvou</span>
            </a>
          </div>
        </div>

        <!-- ASCII art panel -->
        <div class="c-ascii" aria-hidden="true">
          <pre class="c-ascii-art">
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⢠⢠⢀⣄⠤⠄⢴⢂⠢⣀⠠⡀⡀⡀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠂⠉⡀⠄⠂⠈⠀⠈⠀⠈⠈⠈⠈⠈⠈⠀⠙⠀⠒⠲⢀⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡀⡀⠀⠀⣘⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠠⠊⠀⠠⠤⠠⠺⢺⠸⠷⠢⠤⣐⠀⠠⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠊⠀⠀⠀⣀⡀⣽⣢⢃⣽⣩⣤⣄⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣶⣺⠿⠫⠚⢻⠛⠉⠝⠛⠹⡗⣿⢛⣳⣞⠛⡶⡴⣄⠀⣀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⣿⣧⠻⠃⠀⠀⠀⠀⢁⢇⠀⠀⠀⠀⠘⢽⡀⢰⡃⠀⠀⠐⠓⠪⢬⢥⡞⠞⠗⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠋⢠⢟⠋⠨⠀⠀⠀⠀⠀⠀⢱⣃⠀⠀⠀⠀⠸⠳⣧⠂⠀⠀⠀⢀⡃⠀⠀⠑⣿⣖⣤⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣐⢼⢉⡈⠀⠀⠀⠀⠀⠀⠀⠀⠖⢲⠀⠀⠀⠀⠀⠨⠁⠀⠀⠀⣾⡅⠀⠀⠀⠀⢽⣿⡷⠐⠚⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⡌⡿⠉⠸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡰⠅⠕⠕⠫⠫⠟⢊⡕⠃⢼⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠒⠶⢢⡤⠄⠀⠀⠀⠀⠈⠁⠉⠉⠁⠈⠈⠈⠈⠀⣰⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠋⢑⠓⠂⠠⠀⢀⠀⠀⠀⢀⡤⡾⠹⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⢁⢎⡉⠉⠙⠓⠋⢡⡅⠀⣀⡹⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠋⠉⠐⠤⢄⡀⠝⢤⣿⠚⠛⠁⠀⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
          </pre>
        </div>

      </div>
    </div>

    <footer class="site-footer">
      <span class="footer-copy">&copy; 2026 zvou / Amalie Wallenius</span>
      <span class="footer-avail">
        <span class="avail-dot"></span>Available for work
      </span>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  padding: 8rem 5vw 0;
  background: transparent;
  isolation: isolate;
}
.c-inner { max-width: 1200px; margin: 0 auto; }

.c-label-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 4rem; }
.c-label-text { font-family: var(--font-body); font-size: 0.68rem; letter-spacing: 0.25em; color: var(--fg-dim); }
.c-tech-tag { font-family: var(--font-body); font-size: 0.58rem; letter-spacing: 0.15em; color: var(--accent); opacity: 0.6; }

.c-left { position: relative; }
.c-frame {
  position: absolute;
  width: 24px;
  height: 24px;
  pointer-events: none;
}
.c-frame--tl {
  top: -1rem;
  left: -1.2rem;
  border-top: 1px solid rgba(40, 40, 255, 0.5);
  border-left: 1px solid rgba(40, 40, 255, 0.5);
}

.c-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
}

.c-title {
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.9;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
}
.c-title em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  color: var(--accent);
  font-size: 0.9em;
}

.c-desc {
  color: var(--fg-dim);
  font-size: 0.97rem;
  line-height: 1.75;
  max-width: 360px;
  margin-bottom: 2.5rem;
}

.c-links { display: flex; flex-direction: column; gap: 0; border-top: 1px solid rgba(242,237,228,0.1); }
.c-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(242,237,228,0.1);
  transition: padding-left 0.2s;
}
.c-link:hover { padding-left: 0.5rem; }
.c-link:hover .c-link-val { color: var(--accent); }
.c-link-label { font-family: var(--font-body); font-size: 0.68rem; letter-spacing: 0.15em; color: var(--fg-dim); }
.c-link-val { font-family: var(--font-body); font-size: 0.88rem; color: var(--fg); transition: color 0.2s; }
.c-link--email .c-link-val { transition: color 0.2s, opacity 0.15s; }

.c-ascii {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 2rem;
}
.c-ascii-art {
  font-family: var(--font-serif);
  font-size: clamp(0.5rem, 0.85vw, 0.78rem);
  line-height: 1.55;
  color: var(--accent);
  white-space: pre;
  user-select: none;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.c-form { display: flex; flex-direction: column; gap: 1.5rem; }

.c-field { display: flex; flex-direction: column; gap: 0.5rem; }
.c-field label {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-dim);
}
.c-field input,
.c-field textarea {
  background: var(--bg2);
  border: 1px solid rgba(13, 11, 8, 0.12);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  outline: none;
  resize: none;
  transition: border-color 0.2s;
}
.c-field input:focus,
.c-field textarea:focus {
  border-color: var(--accent);
}

.btn-fill {
  background: var(--accent);
  color: #0f0d0a;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 1rem 2rem;
  border: none;
  cursor: none;
  transition: opacity 0.2s;
  align-self: flex-start;
}
.btn-fill:hover { opacity: 0.85; }

/* Footer */
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  margin-top: 6rem;
  border-top: 1px solid rgba(13, 11, 8, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.footer-copy {
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--fg-dim);
}
.footer-avail {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--fg-dim);
}
.avail-dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

@media (max-width: 768px) {
  .contact { padding: 5rem 1.5rem 0; }
  .c-grid { grid-template-columns: 1fr; gap: 3rem; }
  .site-footer { margin-top: 4rem; }
  .c-ghost-word, .c-ghost-num, .c-pgrid { display: none; }
}

/* ── Ghost deco ── */
.c-ghost-word {
  position: absolute;
  bottom: 4rem;
  right: -1vw;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(7rem, 16vw, 16rem);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 7%, transparent);
  pointer-events: none;
  z-index: -1;
  line-height: 0.9;
  letter-spacing: -0.03em;
  user-select: none;
  text-transform: uppercase;
}
.c-ghost-num {
  position: absolute;
  top: 1rem;
  left: -1vw;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(8rem, 18vw, 18rem);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--fg) 5%, transparent);
  pointer-events: none;
  z-index: -1;
  line-height: 0.85;
  letter-spacing: -0.04em;
  user-select: none;
}
.c-pgrid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 55%;
  color: var(--fg);
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
}

</style>

