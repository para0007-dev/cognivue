<script setup lang="ts">
/**
 * Data Awareness page (EPIC 4)
 * - Pulls factoids & lifestyle tips from Django API
 * - Renders jumbotron (auto-rotates), a CTA, and flippable cards
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick} from 'vue'
import Header from '@/components/Header.vue'

const factoids = ref<any[]>([])
const tips = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// at top of <script setup>
const CARD_BASELINE = 220; // px: pre-flip height target

const vAutosizeVisible = {
  mounted(el: any) {
    const inner = el.querySelector('.inner') as HTMLElement | null
    if (!inner) return
    inner.style.minHeight = CARD_BASELINE + 'px'   // nice baseline pre-flip

    const measureNow = () => {
      const front = el.querySelector('.face.front') as HTMLElement | null
      const back  = el.querySelector('.face.back')  as HTMLElement | null
      const target = el.classList.contains('flipped') ? back : front
      if (!target || !inner) return
      const h = Math.max(target.scrollHeight, CARD_BASELINE) // never below baseline
      inner.style.height = h + 'px'                          // grow/shrink to visible face
    }

    const rafMeasure = () => requestAnimationFrame(measureNow)
    ;(el as any).__measure = rafMeasure

    rafMeasure()                                    // initial size (front)
    window.addEventListener('resize', rafMeasure)
    el.addEventListener('transitionend', (e: any) => {
      if (e.propertyName === 'transform') rafMeasure() // after flip finishes, recheck height
    })
  },
  updated(el: any) { el.__measure && el.__measure() },  // runs after flip class toggles
  unmounted(el: any) { window.removeEventListener('resize', el.__measure) }
}


// Carousel state
const curIndex = ref(0)
const current = computed(() => factoids.value[curIndex.value] || null)
let timer: any = null
const intervalMs = 6000

function next() { if (factoids.value.length) curIndex.value = (curIndex.value + 1) % factoids.value.length }
function prev() { if (factoids.value.length) curIndex.value = (curIndex.value - 1 + factoids.value.length) % factoids.value.length }
function go(i: number) { curIndex.value = i }
function startAuto(){ stopAuto(); timer = setInterval(next, intervalMs) }
function stopAuto(){ if (timer) { clearInterval(timer); timer = null } }

async function load() {
  loading.value = true;
  try {
    const [allFacts, allTips] = await Promise.all([
      fetch('/insights/api/factoids/').then(r => r.json()),
      fetch('/insights/api/tips/').then(r => r.json()),
    ]);

    // --- random 5 client-side ---
    const saved = sessionStorage.getItem('rand5_factoid_ids'); // optional persistence
    if (saved) {
      const ids = JSON.parse(saved) as number[];
      factoids.value = ids
        .map(id => allFacts.find((f:any) => f.id === id))
        .filter(Boolean);
      if (factoids.value.length < 5) {
        factoids.value = pickRandom(allFacts, 5);
        sessionStorage.setItem('rand5_factoid_ids', JSON.stringify(factoids.value.map((f:any)=>f.id)));
      }
    } else {
      factoids.value = pickRandom(allFacts, 5);
      sessionStorage.setItem('rand5_factoid_ids', JSON.stringify(factoids.value.map((f:any)=>f.id)));
    }
    // ----------------------------

    tips.value = allTips;
    startAuto();
  } catch (e:any) {
    error.value = e?.message || 'Failed to load insights.';
  } finally {
    loading.value = false;
  }
}


onMounted(load)
onBeforeUnmount(stopAuto)

// Flip handler for cards (keeps state on the object)
function toggleFlip(t:any){
  t._flipped = !t._flipped
  nextTick(() => {
    // nudge directives in case updated timing varies across browsers
    window.dispatchEvent(new Event('resize'))
  })
}
function chipClass(impact: string){
  return impact === 'beneficial' ? 'chip chip-green' : 'chip chip-amber'
}

// Helper function for picking N unique items from factoids
function pickRandom<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  // Fisher–Yates partial shuffle
  const a = [...arr];
  for (let i = a.length - 1; i > a.length - 1 - n; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(a.length - n);
}

</script>

<template>
    <Header />
    <div class="awa-page">
    <!-- Jumbotron -->
    <section class="jumbotron" @mouseenter="stopAuto" @mouseleave="startAuto">
      <div class="container">
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-else-if="loading" class="skeleton" />
        <div v-else-if="current" class="slide">
          <h1 class="title"><span aria-hidden="true">🧠</span> {{ current.title }}</h1>
          <p class="text">{{ current.text }}</p>
          <div class="source" v-if="current.source_url || current.source_name">
            <span>Source: {{ current.source_name || current.source_url }}</span>
          </div>

          <div class="controls">
            <button @click="prev" aria-label="Previous">‹</button>
            <div class="dots">
              <button
                v-for="(f,i) in factoids" :key="f.id"
                :class="['dot',{active:i===curIndex}]"
                @click="go(i)"
                aria-label="Go to slide"
              />
            </div>
            <button @click="next" aria-label="Next">›</button>
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
            v-for="t in tips" :key="t.id"
            class="card3d" :class="{flipped: t._flipped}" @click="toggleFlip(t)" v-autosize-visible
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
/* tiny “lift” on hover for interactivity */
.jumbotron:hover{
  transform: translateY(-2px);
  box-shadow:
    0 24px 56px rgba(16,24,40,.20),
    0 8px 18px rgba(16,24,40,.12);
}
.title{display:flex;align-items:center;gap:8px;margin:0 0 8px;font-size:28px;}
.text{font-size:16px;color:#2a2a2a;margin:0 0 10px;}
.source{font-size:13px;color:#dbdde1;}
.controls{display:flex;align-items: center; justify-content: center; gap: 10px; margin: 16px auto 0; width: 100%;}
.controls>button{border:none;background:#ffffffaa;padding:8px 10px;border-radius:8px;cursor:pointer;}
.dots{display:flex;gap:6px;}
.dot{width:8px;height:8px;border-radius:50%;background:#cbd5e1;border:none;}
.dot.active{background:#6366f1;}
.skeleton{height:140px;border-radius:12px;background:repeating-linear-gradient(90deg,#f3f4f6,#eef2f7 20px,#f3f4f6 40px);animation:pulse 1.6s infinite;}
@keyframes pulse{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}

/* Lifestyle impact header and subheader*/
.impact{margin-bottom: 30px; text-align: center;}
.impact-subheader{color: #808081;}

/* CTA */
.cta .cta-card{background:#e9fff1;border:1px solid #cbf3d2;border-radius:14px;padding:16px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.cta-btn{background:#16a34a;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none;}

/* Cards */
/* front side centers content */
.front .front-center{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
  text-align:center;
}
/* center the title text on front */
.card-title.center{
  text-align:center;
  margin:20px;
}
/* make faces center rather than space-between */
.face{ justify-content:center; }  /* was space-between */
.cards h4{margin:6px 0 10px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;}
.card3d{perspective:1000px;cursor:pointer;}
.inner{position:relative;width:100%;transition:transform .6s, height .2s ease;transform-style:preserve-3d;}
.card3d.flipped .inner{transform:rotateY(180deg);}
.face{position:absolute;inset:0;backface-visibility:hidden;border-radius:12px;padding:14px;border:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column;justify-content:space-between;}
.back{transform:rotateY(180deg);}
.row1{display:flex;gap:8px;align-items:center;}
.icon{font-size:18px;}
.chip{padding:2px 8px;font-size:12px;border-radius:999px;}
.chip-green{background:#e6f6ec;color:#0a7d3a;}
.chip-amber{background:#fff1cc;color:#7a5500;}
.muted{color:#6b7280;}
.hint{font-size:12px;color:#94a3b8;}
.detail{overflow-wrap:anywhere;color:#1f2937;}
</style>
