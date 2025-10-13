<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Header from '@/components/Header.vue'
import { insightsAPI } from '@/services/api'

const factoids = ref([])
const tips = ref([])
const loading = ref(true)
const error = ref(null)

const CARD_BASELINE = 220

const vAutosizeVisible = {
  mounted(el) {
    const inner = el.querySelector('.inner')
    if (!inner) return
    inner.style.minHeight = CARD_BASELINE + 'px'
    const measureNow = () => {
      const front = el.querySelector('.face.front')
      const back  = el.querySelector('.face.back')
      const target = el.classList.contains('flipped') ? back : front
      if (!target || !inner) return
      const h = Math.max(target.scrollHeight, CARD_BASELINE)
      inner.style.height = h + 'px'
    }
    const rafMeasure = () => requestAnimationFrame(measureNow)
    el.__measure = rafMeasure
    rafMeasure()
    window.addEventListener('resize', rafMeasure)
    el.addEventListener('transitionend', (e) => { if (e.propertyName === 'transform') rafMeasure() })
  },
  updated(el) { el.__measure && el.__measure() },
  unmounted(el) { window.removeEventListener('resize', el.__measure) }
}

const curIndex = ref(0)
const current = computed(() => factoids.value[curIndex.value] || null)
let timer = null
const intervalMs = 6000

function next() { if (factoids.value.length) curIndex.value = (curIndex.value + 1) % factoids.value.length }
function prev() { if (factoids.value.length) curIndex.value = (curIndex.value - 1 + factoids.value.length) % factoids.value.length }
function go(i) { curIndex.value = i }
function startAuto(){ stopAuto(); timer = setInterval(next, intervalMs) }
function stopAuto(){ if (timer) { clearInterval(timer); timer = null } }

function toggleFlip(t){
  t._flipped = !t._flipped
  nextTick(() => window.dispatchEvent(new Event('resize')))
}
function chipClass(impact){ return impact === 'beneficial' ? 'chip chip-green' : 'chip chip-amber' }

function pickRandom(arr, n) {
  if (arr.length <= n) return [...arr]
  const a = [...arr]
  for (let i = a.length - 1; i > a.length - 1 - n; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(a.length - n)
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const hub = await insightsAPI.getHub()         // <- now calls /insights/api/factoids|tips/
    const allFacts = hub.factoids || []
    tips.value = hub.tips || []

    // keep only 5 random factoids for the carousel
    const saved = sessionStorage.getItem('rand5_factoid_ids')
    if (saved) {
      const ids = JSON.parse(saved)
      const picked = ids.map(id => allFacts.find((f) => f.id === id)).filter(Boolean)
      factoids.value = picked.length >= 5 ? picked : pickRandom(allFacts, 5)
      sessionStorage.setItem('rand5_factoid_ids', JSON.stringify(factoids.value.map((f)=>f.id)))
    } else {
      factoids.value = pickRandom(allFacts, 5)
      sessionStorage.setItem('rand5_factoid_ids', JSON.stringify(factoids.value.map((f)=>f.id)))
    }

    startAuto()
  } catch (e) {
    error.value = e?.message || 'Failed to load insights'
  } finally {
    loading.value = false
    await nextTick()
  }
})
onBeforeUnmount(stopAuto)
</script>


<template>
  <div class="page-content">
    <Header />
    <div class="awa-page">
      <!-- Jumbotron -->
    <section class="jumbotron" @mouseenter="stopAuto" @mouseleave="startAuto">
      <div class="container">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading" class="skeleton" />
        <div v-else-if="current" class="slide">
          <h1 class="title">
            <img src="@/assets/images/logo-icon.svg" alt="Education Hub" class="title-icon" />
            {{ current.title }}
          </h1>
          <p class="text">{{ current.text }}</p>
          <div class="source" v-if="current.source_url || current.source_name">
            <span>Source: {{ current.source_name || current.source_url }}</span>
          </div>

          <div class="controls">
            <button @click="prev" aria-label="Previous">&lt;</button>
            <div class="dots">
              <button
                v-for="(f,i) in factoids" :key="f.id"
                :class="['dot',{active:i===curIndex}]"
                @click="go(i)"
                aria-label="Go to slide"
              />
            </div>
            <button @click="next" aria-label="Next">&gt;</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Questionnaire CTA -->
    <section class="cta">
      <div class="container">
        <div class="cta-card">
          <div class="cta-text">
            <h3>Test Your Vitamin D Level</h3>
            <p>Take our 2-minute questionnaire to estimate your vitamin D level and brain-health risk.</p>
          </div>
          <!-- If your SPA already has a questionnaire route, point to it -->
          <router-link class="cta-btn" to="/vitamin-d-questionnaire">Test Your Level</router-link>
          <!-- otherwise temporarily use: <a class="cta-btn" href="/insights/questionnaire/">Test Your Level</a> -->
        </div>
      </div>
    </section>

    <!-- Lifestyle Cards -->
    <section class="cards">
      <div class="container">
        <div class="impact">
          <h2 class="impact-header">Lifestyle Impact Explorer</h2>
          <h4>Here's some handy tips and factoids that can help you maximise your Brain Health.</h4>
          <p class="impact-subheader">Click each card to flip and reveal more</p>
        </div>
        <div class="grid">
          <div
            v-for="(t, index) in tips" :key="t.id"
            class="card3d" :class="{flipped: t._flipped}" @click="toggleFlip(t)" :style="{ '--animation-order': index }"
          >
            <div class="inner">
              <!-- front -->
              <div class="face front">
                <div class="front-center">
                  <h3 class="card-title center">{{ t.title }}</h3>
                  <span :class="chipClass(t.impact)">
                    {{ t.impact === 'beneficial' ? 'Beneficial' : 'Concerning' }}
                  </span>
                </div>
              </div>
              <!-- back -->
              <div class="face back">
                <h5 class="card-title">{{ t.title }}</h5>
                <p class="detail">{{ t.back_detail }}</p>
                <div class="hint">Click to flip back</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  </div>
</template>

<style scoped>
/* Keep styles local to this page. */
.awa-page { display:flex; flex-direction:column; gap:24px; }
.container { max-width:1080px; margin:0 auto; padding:10px 30px; }

/* Jumbotron */
.jumbotron{
  margin: 8px 10px 16px;
  position: relative;
  border-radius: 18px;
  padding: 28px 24px 32px;
  background: linear-gradient(180deg,#91dc95 0%, #1e5a2c 100%); 
  border: 1px solid rgba(16,24,40,.08);                         /* subtle edge */
  box-shadow:
    0 18px 40px rgba(16,24,40,.16),    /* main shadow */
    0 3px 10px rgba(16,24,40,.10);     /* contact shadow */
  isolation: isolate;                  /* keeps halo behind */
  transform: translateZ(0);            /* its own layer (crisper shadow) */
  transition: transform .18s ease, box-shadow .18s ease;
}
/* soft glow/halo behind the card to lift it off the page */
.jumbotron::before{
  content:"";
  position:absolute;
  inset:-24px -24px auto -24px;        /* overflow around top/sides */
  height:55%;
  border-radius: 28px;
  background:
    radial-gradient(70% 120% at 20% -20%, rgba(123,162,107,.22), transparent 60%),
    radial-gradient(60% 110% at 110% 120%, rgba(239,230,216,.25), transparent 60%);
  filter: blur(18px);
  z-index:-1;
}
/* tiny lift on hover for interactivity */
.jumbotron:hover{
  transform: translateY(-2px);
  box-shadow:
    0 24px 56px rgba(16,24,40,.20),
    0 8px 18px rgba(16,24,40,.12);
}
.title{
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
}

.title-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
.text{
  font-size: 18px;
  color: #f8fafc;
  margin: 0 0 16px;
  line-height: 1.6;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  font-weight: 400;
}

.source{
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  background: none;
  padding: 0;
  border: none;
  backdrop-filter: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 400;
  font-style: italic;
  opacity: 0.9;
  margin-top: 8px;
  position: relative;
}

.source::before {
  content: "- ";
  color: rgba(255, 255, 255, 0.6);
  font-style: normal;
  font-weight: 300;
}

.source:hover {
  opacity: 1;
  color: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}
.controls{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px auto 0;
  width: 100%;
}

.controls>button{
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.controls>button:hover{
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dots{
  display: flex;
  gap: 8px;
}

.dot{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active{
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
  transform: scale(1.2);
}

.dot:hover{
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.1);
}
.skeleton{height:140px;border-radius:12px;background:repeating-linear-gradient(90deg,#f3f4f6,#eef2f7 20px,#f3f4f6 40px);animation:pulse 1.6s infinite;}
@keyframes pulse{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}

/* Lifestyle impact header and subheader*/
.impact {
  margin-bottom: 40px; 
  text-align: center;
  padding: 2rem 1rem;
  position: relative;
}

.impact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #16a34a, #22c55e, #34d399);
  border-radius: 2px;
  animation: shimmerLine 2s ease-in-out infinite;
}

@keyframes shimmerLine {
  0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 1; transform: translateX(-50%) scaleX(1.2); }
}

.impact-header {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1rem 0 0.5rem 0;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(22, 163, 74, 0.1);
  position: relative;
  display: inline-block;
}

.impact-header::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  transition: width 0.6s ease;
}

.impact:hover .impact-header::after {
  width: 100%;
}

.impact h4 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #374151;
  margin: 0.75rem auto;
  line-height: 1.5;
  max-width: 100%;
  width: 100%;
  text-align: center;
  position: relative;
  opacity: 0.9;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2rem;
  display: block;
}

@media (max-width: 1024px) {
  .impact h4 {
    white-space: normal;
    font-size: 1.1rem;
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .impact h4 {
    font-size: 1rem;
    max-width: 100%;
    width: 100%;
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .impact h4 {
    font-size: 0.95rem;
    max-width: 100%;
    width: 100%;
    padding: 0 1rem;
    line-height: 1.4;
  }
}

.impact:hover h4 {
  opacity: 1;
  transform: translateY(-1px);
}

.impact-subheader {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 400;
  margin: 0.5rem 0 0 0;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(22, 163, 74, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(22, 163, 74, 0.1);
  transition: all 0.3s ease;
}

.impact-subheader::before {
  content: '*';
  font-size: 1.1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.impact-subheader:hover {
  background: rgba(22, 163, 74, 0.1);
  border-color: rgba(22, 163, 74, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
}

.cta {
  margin: 2rem 0;
}

.cta .cta-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #dcfce7 100%);
  border: 2px solid #22c55e;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 
    0 10px 25px rgba(34, 197, 94, 0.15),
    0 4px 10px rgba(34, 197, 94, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cta .cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #16a34a, #15803d);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.cta .cta-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 15px 35px rgba(34, 197, 94, 0.2),
    0 8px 15px rgba(34, 197, 94, 0.15);
  border-color: #16a34a;
}

.cta-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-text p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.cta-btn{
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  border: none;
  position: relative;
  overflow: hidden;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.cta-btn:hover::before {
  left: 100%;
}

.cta-btn:hover{
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
  text-decoration: none;
  color: #fff;
}

/* Cards */
/* front side centers content */
.front .front-center{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
  text-align:center;
  height: 100%;
  justify-content: center;
}
/* center the title text on front */
.card-title.center{
  text-align:center;
  margin:20px;
}
/* make faces center rather than space-between */
.face{ 
  justify-content: flex-start;
}
.cards h4{margin:6px 0 10px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;}
.card3d{
  perspective:1000px;
  cursor:pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card3d:hover {
  transform: scale(1.05);
  z-index: 10;
}
.card3d:hover .face {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1);
}
.inner{
  position:relative;
  width:100%;
  height: 220px; /* fixed height for consistency */
  transition:transform .6s;
  transform-style:preserve-3d;
}
.card3d.flipped .inner{transform:rotateY(180deg);}
.face{
  position:absolute;
  inset:0;
  backface-visibility:hidden;
  border-radius:12px;
  padding:14px;
  border:1px solid #e5e7eb;
  background:#fff;
  display:flex;
  flex-direction:column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.back{
  transform:rotateY(180deg);
  padding: 16px;
  overflow: hidden;
}
.back .card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  flex-shrink: 0;
}
.back .detail {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #374151;
  word-wrap: break-word;
  hyphens: auto;
}
.back .detail::-webkit-scrollbar {
  width: 4px;
}
.back .detail::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}
.back .detail::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
.back .detail::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.back .hint {
  flex-shrink: 0;
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  margin-top: auto;
}
.row1{display:flex;gap:8px;align-items:center;}
.icon{font-size:18px;}
.chip{padding:2px 8px;font-size:12px;border-radius:999px;}
.chip-green{background:#e6f6ec;color:#0a7d3a;}
.chip-amber{background:#fff1cc;color:#7a5500;}
.muted{color:#6b7280;}
.hint{font-size:12px;color:#94a3b8;}
.detail{overflow-wrap:anywhere;color:#1f2937;}

/* Responsive design for impact section */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }
  
  .inner {
    height: 200px;
  }
  
  .card-title.center {
    margin: 15px;
    font-size: 0.95rem;
  }
  
  .back .card-title {
    font-size: 0.9rem;
  }
  
  .back .detail {
    font-size: 0.8rem;
  }
  .jumbotron {
    margin: 8px 5px 16px;
    padding: 20px 16px 24px;
  }
  
  .title {
    font-size: 26px;
    gap: 6px;
    margin: 0 0 10px;
  }
  
  .title-icon {
    width: 32px;
    height: 32px;
  }
  
  .text {
    font-size: 16px;
    margin: 0 0 14px;
    line-height: 1.5;
  }
  
  .source {
    font-size: 12px;
    margin-top: 6px;
  }
  
  .controls>button {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
  }
  
  .cta .cta-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .cta-text h3 {
    font-size: 1.25rem;
  }
  
  .cta-text p {
    font-size: 0.9rem;
  }
  
  .cta-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .inner {
    height: 180px;
  }
  
  .card-title.center {
    margin: 10px;
    font-size: 0.9rem;
  }
  
  .back {
    padding: 12px;
  }
  
  .back .card-title {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
  
  .back .detail {
    font-size: 0.75rem;
    line-height: 1.4;
  }
  
  .back .hint {
    font-size: 10px;
  }
  
  .jumbotron {
    margin: 8px 2px 16px;
    padding: 16px 12px 20px;
  }
  
  .title {
    font-size: 22px;
    flex-direction: column;
    text-align: center;
    gap: 4px;
  }
  
  .title-icon {
    width: 28px;
    height: 28px;
  }
  
  .text {
    font-size: 15px;
    text-align: center;
  }
  
  .source {
    font-size: 11px;
    text-align: center;
    margin-top: 8px;
  }
  
  .controls {
    gap: 8px;
    margin: 16px auto 0;
  }
  
  .controls>button {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .cta .cta-card {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 16px;
  }
  
  .cta-text h3 {
    font-size: 1.1rem;
  }
  
  .cta-text p {
    font-size: 0.85rem;
  }
  
  .cta-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}

/* Component Entrance Animations - MealPlanner Style */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Apply animations to main components */
.jumbotron {
  animation: fadeInUp 0.8s ease-out;
}

.cta {
  animation: fadeInLeft 0.8s ease-out 0.4s both;
}

.cards {
  animation: fadeInRight 0.8s ease-out 0.6s both;
}

.impact {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

/* Staggered animations for cards */
.card3d {
  animation: scaleIn 0.6s ease-out calc(0.1s * var(--animation-order, 0) + 1.0s) both;
}
</style>
