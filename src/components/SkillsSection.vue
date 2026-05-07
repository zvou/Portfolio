<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const el = ref<HTMLElement | null>(null)

const cols = [
  {
    cat: 'Design',
    skills: ['Affinity', 'Photoshop', 'Figma', 'Illustrator', 'InDesign', 'CSP'],
  },
  {
    cat: 'Dev',
    skills: ['HTML / CSS', 'JavaScript', 'Vue.js', 'React', 'Python', 'SQL', 'C#'],
  },
  {
    cat: 'Others',
    skills: ['Vite', 'Microsoft Dynamics 365', 'VS Code', 'Git', 'Obsidian', 'Magento', 'DevOps'],
  },
]

onMounted(() => {
  if (!el.value) return
  gsap.from(el.value.querySelectorAll('.sk-col'), {
    scrollTrigger: { trigger: el.value, start: 'top 75%' },
    y: 40, opacity: 0, duration: 0.75, ease: 'power2.out', stagger: 0.15
  })
})
</script>

<template>
  <section id="skills" class="skills" ref="el">
    <div class="sk-inner">

      <div class="sk-label-row">
        <span class="section-num">[ 03 ]</span>
        <div class="section-rule"></div>
        <span class="sk-label-text">SKILLS</span>
        <span class="sk-tech-tag" aria-hidden="true">{+}</span>
      </div>

      <div class="sk-header">
        <h2 class="sk-title">The <em>toolkit.</em></h2>
        <div class="sk-ruler" aria-hidden="true">
          <span v-for="i in 16" :key="i" class="sk-ruler-tick"></span>
        </div>
      </div>

      <div class="sk-grid">
        <div v-for="col in cols" :key="col.cat" class="sk-col">
          <h3 class="sk-cat">{{ col.cat }}</h3>
          <ul class="sk-list">
            <li v-for="s in col.skills" :key="s" class="sk-item">
              <span class="sk-dot">&#9632;</span>{{ s }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.skills {
  position: relative;
  padding: 8rem 5vw;
  background: transparent;
}
.sk-inner { max-width: 1200px; margin: 0 auto; }

.sk-label-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 4rem; }
.sk-label-text { font-family: var(--font-body); font-size: 0.68rem; letter-spacing: 0.25em; color: var(--fg-dim); }
.sk-tech-tag { font-family: var(--font-body); font-size: 0.58rem; letter-spacing: 0.15em; color: var(--accent); opacity: 0.6; }

.sk-header { margin-bottom: 4rem; }
.sk-ruler {
  display: flex;
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
}
.sk-ruler-tick {
  flex: 1;
  height: 6px;
  border-left: 1px solid rgba(13, 11, 8, 0.1);
}
.sk-ruler-tick:nth-child(4n) {
  height: 12px;
  border-left-color: rgba(40, 40, 255, 0.3);
}
.sk-ruler-tick:first-child { border-left: none; }
.sk-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.95;
  letter-spacing: -0.01em;
}
.sk-title em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  color: var(--accent);
  font-size: 1em;
}

.sk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  border-top: 1px solid rgba(13, 11, 8, 0.1);
  padding-top: 3rem;
}

.sk-cat {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg);
  margin-bottom: 1.5rem;
}

.sk-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.sk-item {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--fg-dim);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: color 0.2s;
}
.sk-item:hover { color: var(--fg); }
.sk-dot {
  font-size: 0.35rem;
  color: var(--accent);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .skills { padding: 5rem 1.5rem; }
  .sk-grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>

