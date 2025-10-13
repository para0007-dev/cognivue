<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/Header.vue'
import { mealAI, mealImages } from '@/services/apiCore.js'

const dietaryOptions = ['Vegetarian','Vegan','Lactose-free','Gluten-free','Nut-free','Low-sodium']
const selectedDietary = ref([])
const budget = ref(20) // daily budget scope
const maxPrep = ref(40)

const loading = ref(false)
const error = ref(null)
const result = ref(null)

// Caching mealplan accross a session
const CACHE_KEY = 'mealplan:v1';
const CACHE_TTL_HOURS = 24;

function saveCache(prefs, res){
  const payload = {prefs, res, ts: Date.now()};
  localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

function loadCache(){
  const raw = localStorage.getItem(CACHE_KEY);
  if(!raw) return null;
  try{
    const {ts, res} = JSON.parse(raw);
    const ageHrs = (Date.now() - ts) / 36e5;
    if (ageHrs > CACHE_TTL_HOURS) return null;
    return res;
  } catch {return null;}
}

function clearCache(){localStorage.removeItem(CACHE_KEY);}

function toggleChip(v){
  const i = selectedDietary.value.indexOf(v)
  i>=0 ? selectedDietary.value.splice(i,1) : selectedDietary.value.push(v)
}

async function generate(){
  loading.value = true; error.value=null; result.value=null
  try{
    const payload = {
      days: 1,                          
      budget_scope: 'daily',            
      budgetAud: Number(budget.value),
      max_prep_minutes: Number(maxPrep.value),
      dietary: selectedDietary.value.map(s=>s.toLowerCase())
    }
    const res = await mealAI.generate(payload)
    if(!res.success) throw new Error(res.error || 'Failed')
    const diet = selectedDietary.value.map(s => s.toLowerCase())

    // fetching photos for each item
    const withPhotos = await Promise.all(
      res.items.map(async (it) => {
        const p = await mealImages.get(it.name, diet)
        return { ...it, image_url: (p && p.url) ? p.url : null}
      })
    )
    result.value = {...res, items: withPhotos}
    saveCache(payload, result.value)
  }catch(e){ error.value = e.message || 'Failed' }
  finally{ loading.value=false }
}

onMounted(()=>{
  const cached = loadCache()
  if (cached) result.value = cached
})
</script>

<template>
  <Header />
  <div class="mp">
    <!-- Hero header -->
    <section class="hero">
      <div class="title">AI Vitamin D Meal Planner</div>
      <div class="subtitle">Personalised Australian meal plans for optimal brain health</div>
      <div class="goal-pill">Recommended daily goal: 10–20 µg Vitamin D</div>
    </section>

    <section class="controls two-col">
      <!-- LEFT: Dietary -->
      <div class="card">
        <div class="card-title">Dietary Requirements</div>
        <div class="chips">
          <button v-for="opt in dietaryOptions" :key="opt"
                  :class="['chip', selectedDietary.includes(opt) && 'chip--on']"
                  @click="toggleChip(opt)">
            {{ opt }}
          </button>
          <button class="chip ghost" @click="selectedDietary=[]">No Restrictions</button>
        </div>
      </div>

      <!-- RIGHT: Budget and Prep time -->
      <div class="card">
        <div class="card-title">Daily Budget & Prep Time</div>
        <div class="budget-row">
          <label>Daily budget (AUD):</label>
          <input type="number" min="0" step="1" v-model.number="budget" />
        </div>
        <div class="slider">
          <label>Max prep time</label>
          <input type="range" min="5" max="90" step="5" v-model.number="maxPrep" />
          <span>{{ maxPrep }} mins</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <div class="cta">
      <button class="generate" :disabled="loading" @click="generate">
        {{ loading ? 'Generating…' : 'Generate My AI Meal Plan' }}
      </button>
    </div>

    <div v-if="error" class="alert">{{ error }}</div>

    <!-- Results -->
    <section v-if="result" class="results">
      <div class="results-head">
        <div class="h">Here's your personalised meal plan:</div>
        <div class="summary">
          <span>Total: ${{ Number(result.summary.total_cost_aud).toFixed(2) }}</span>
          <span>Budget: ${{ Number(result.summary.budget_limit_aud).toFixed(2) }}</span>
          <span :class="result.summary.within_budget ? 'ok':'bad'">
            {{ result.summary.within_budget ? 'Within budget' : 'Over budget' }}
          </span>
        </div>
      </div>

      <div class="cards">
        <article v-for="(it,i) in result.items" :key="i" class="meal-card">
          <header class="mc-head">
            <div class="mc-info">
              <span class="badge">{{ it.kind === 'snack' ? 'Snack' : 'Meal' }}</span>
              <h3 class="mc-title">{{ it.name }}</h3>
              <div class="meta">
                <span>Vit D: {{ it.vitd_mcg }} µg ({{ it.vitd_iu }} IU)</span>
                <span>Prep: {{ it.prep_minutes }} min</span>
                <span>Cost: ${{ Number(it.cost_aud).toFixed(2) }}</span>
              </div>
            </div>

            <img v-if="it.image_url" :src="it.image_url" alt="" class="mc-img" loading="lazy" />
          </header>

          <div class="mc-body">
            <div class="col">
              <h4>Ingredients</h4>
              <ul>
                <li v-for="(ing,idx) in it.ingredients" :key="idx">{{ ing }}</li>
              </ul>
            </div>
            <div class="col">
              <h4>Recipe</h4>
              <ol>
                <li v-for="(step,idx) in it.recipe_steps" :key="idx">{{ step }}</li>
              </ol>
            </div>
          </div>

          <footer class="mc-foot">
            <div class="tags">
              <span v-for="t in it.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </footer>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Palette (adjust to your theme) */
:root{
  --bg:#f7fbf8;
  --card:#ffffff;
  --ink:#0f172a;
  --muted:#64748b;
  --brand:#163321;
  --brand-600:#15803d;
  --accent:#60a5fa;
  --ring:rgba(22,163,74,.25);
}

.mp{max-width:1200px;margin:0 auto;padding:20px}
.hero{background:linear-gradient(180deg,#33825d, #6febab); border:1px solid #bbf7d0; padding:20px; border-radius:16px; text-align:center; margin-bottom:16px}
.title{font-size:28px;font-weight:800;color:#cdeeda}
.subtitle{color:#effaf3;margin-top:4px}
.goal-pill{display:inline-block;margin-top:10px;background:#14532d;color:#ecfdf5;padding:6px 10px;border-radius:999px;font-size:12px}

.controls.two-col{
  display:grid;
  grid-template-columns: 1fr 1fr;  
  gap:16px;
}
.card{background:var(--card);border:1px solid #e5e7eb;border-radius:14px;padding: 30px;display: flex; flex-direction: column; align-items: center;}
.card-title{font-weight:700;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid #e5e7eb;background:#fff;border-radius:999px;padding:6px 10px;font-weight:600;cursor:pointer}
.chip--on{background:#dcfce7;border-color:#86efac;color:#14532d}
.chip.ghost{background:#f8fafc}
.budget-row{
  display:flex; align-items:center; gap:10px; margin-bottom:12px;
}
.budget-row input{
  width:140px; padding:6px 8px; border:1px solid #d1d5db; border-radius:10px;
}
.scope{display:flex;gap:8px;margin-bottom:10px}
.scope-btn{padding:6px 10px;border:1px solid #e5e7eb;border-radius:999px;background:#fff;cursor:pointer}
.scope-btn.on{background:#eefcf2;border-color:#86efac;color:#166534}
.slider{display:flex;align-items:center;gap:10px}
.types{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.type-btn{padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;font-weight:700;cursor:pointer}
.type-btn.on{background:#f0fdf4;border-color:#86efac;color:#166534}

.cta{display:flex;justify-content:center;margin:16px 0}
.generate{background:black;color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px var(--ring)}
.generate:disabled{opacity:.6;cursor:not-allowed}

.alert{color:#b91c1c;margin:10px 0}

.results-head{display:flex;justify-content:space-between;align-items:center;margin:10px 0}
.summary{display:flex;gap:12px;color:#475569}
.ok{color:#16a34a}.bad{color:#b91c1c}

.cards{display:flex;flex-direction:column;gap:12px}
.meal-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden}
.mc-head{
  display:grid;
  grid-template-columns: 1fr 140px;   /* left text | right image */
  gap:16px;
  align-items:start;
  padding: 15px 15px 0px 15px;
}
.mc-info{ min-width:0; }              /* let text wrap nicely */
.mc-img{
  grid-column: 2;                     /* force to right column */
  width:140px; height:110px;
  object-fit:cover; border-radius:10px;
}

/* Stack on small screens */
@media (max-width: 600px){
  .mc-head{ grid-template-columns: 1fr; }
  .mc-img{ grid-column: 1; width:100%; height:180px; }
}

.badge{background:#e0f2fe;color:#075985;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:700}
.mc-title{margin:6px 0 4px;font-size:18px}
.meta{display:flex;gap:14px;color:#64748b;font-size:14px;flex-wrap:wrap}

.mc-body{display:grid;grid-template-columns:1fr 1fr; gap:16px; padding:14px}
.mc-body h4{margin:0 0 6px}
.mc-body ul, .mc-body ol{margin:0 0 0 16px}

.mc-foot{padding:10px 14px;border-top:1px solid #eef2f7}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{background:#f1f5f9;border-radius:999px;padding:2px 8px;font-size:12px}

@media (max-width: 900px){
  .controls.two-col{grid-template-columns:1fr;}
}
</style>
