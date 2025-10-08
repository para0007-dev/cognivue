<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { mealAI } from '@/services/api.js'

const dietaryOptions = ['Vegetarian','Vegan','Lactose-free','Gluten-free','Nut-free','Low-sodium']
const selectedDietary = ref([])
const budget = ref(150)
const budgetScope = ref('weekly') // weekly | daily
const maxPrep = ref(40)
const mealTypes = ['Breakfast','Lunch','Dinner','Snack']
const selectedMealTypes = ref(['Breakfast','Lunch','Dinner','Snack'])

const loading = ref(false)
const error = ref(null)
const result = ref(null)

function toggleChip(arr, v){ const i=arr.value.indexOf(v); i>=0?arr.value.splice(i,1):arr.value.push(v) }

async function generate(){
  loading.value = true; error.value = null; result.value = null
  try{
    const payload = {
      days: 1,
      budget_scope: budgetScope.value,
      budget_aud: Number(budget.value),
      max_prep_minutes: Number(maxPrep.value),
      dietary: selectedDietary.value.map(s=>s.toLowerCase()),
    }
    const res = await mealAI.generate(payload)
    if(!res.success) throw new Error(res.error || 'Failed')
    result.value = res
  }catch(e){ error.value = e.message || 'Failed to generate' }
  finally{ loading.value = false }
}
</script>

<template>
  <Header />
  <div class="mp">
    <!-- Hero header -->
    <section class="hero">
      <div class="title">AI Vitamin D Meal Planner</div>
      <div class="subtitle">Personalised Australian meal plans for optimal brain health</div>
      <div class="goal-pill">Daily goal: 10–20 µg Vitamin D</div>
    </section>

    <!-- Controls row -->
    <section class="controls">
      <!-- Dietary chips -->
      <div class="card">
        <div class="card-title">Dietary Requirements</div>
        <div class="chips">
          <button v-for="opt in dietaryOptions" :key="opt"
                  :class="['chip', selectedDietary.includes(opt) && 'chip--on']"
                  @click="toggleChip(selectedDietary,opt)">
            {{ opt }}
          </button>
          <button class="chip ghost" @click="selectedDietary=[]">No Restrictions</button>
        </div>
      </div>

      <!-- Budget card -->
      <div class="card">
        <div class="card-title">Weekly Budget</div>
        <div class="budget">
          <input type="number" min="0" step="5" v-model.number="budget" /> <span>AUD/{{ budgetScope }}</span>
        </div>
        <div class="scope">
          <button :class="['scope-btn', budgetScope==='daily' && 'on']" @click="budgetScope='daily'">Daily</button>
          <button :class="['scope-btn', budgetScope==='weekly' && 'on']" @click="budgetScope='weekly'">Weekly</button>
        </div>
        <div class="slider">
          <label>Max prep time</label>
          <input type="range" min="5" max="90" step="5" v-model.number="maxPrep" />
          <span>{{ maxPrep }} mins</span>
        </div>
      </div>

      <!-- Meal type buttons -->
      <div class="card">
        <div class="card-title">Meal Types Needed</div>
        <div class="types">
          <button v-for="t in mealTypes" :key="t"
                  :class="['type-btn', selectedMealTypes.includes(t) && 'on']"
                  @click="toggleChip(selectedMealTypes,t)">
            {{ t }}
          </button>
        </div>
      </div>
    </section>

    <!-- Generate CTA -->
    <div class="cta">
      <button class="generate" :disabled="loading" @click="generate">
        {{ loading ? 'Generating…' : 'Generate My AI Meal Plan' }}
      </button>
    </div>

    <div v-if="error" class="alert">{{ error }}</div>

    <!-- Results -->
    <section v-if="result" class="results">
      <div class="results-head">
        <div class="h">Your Personalised Meal Plan</div>
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
            <span class="badge">{{ it.kind === 'snack' ? 'Snack' : it.kind }}</span>
            <h3 class="mc-title">{{ it.name }}</h3>
            <div class="meta">
              <span>Vit D: {{ it.vitd_mcg }} µg ({{ it.vitd_iu }} IU)</span>
              <span>Prep: {{ it.prep_minutes }} min</span>
              <span>Cost: ${{ Number(it.cost_aud).toFixed(2) }}</span>
            </div>
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
  --brand:#16a34a;
  --brand-600:#15803d;
  --accent:#60a5fa;
  --ring:rgba(22,163,74,.25);
}

.mp{max-width:1200px;margin:0 auto;padding:20px}
.hero{background:linear-gradient(180deg,#ecfdf5, #d1fae5); border:1px solid #bbf7d0; padding:20px; border-radius:16px; text-align:center; margin-bottom:16px}
.title{font-size:28px;font-weight:800;color:#14532d}
.subtitle{color:#166534;margin-top:4px}
.goal-pill{display:inline-block;margin-top:10px;background:#14532d;color:#ecfdf5;padding:6px 10px;border-radius:999px;font-size:12px}

.controls{display:grid;grid-template-columns:1fr 1fr; gap:16px}
.card{background:var(--card);border:1px solid #e5e7eb;border-radius:14px;padding:14px}
.card-title{font-weight:700;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid #e5e7eb;background:#fff;border-radius:999px;padding:6px 10px;font-weight:600;cursor:pointer}
.chip--on{background:#dcfce7;border-color:#86efac;color:#14532d}
.chip.ghost{background:#f8fafc}
.budget{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.budget input{width:110px;padding:6px 8px;border:1px solid #d1d5db;border-radius:10px}
.scope{display:flex;gap:8px;margin-bottom:10px}
.scope-btn{padding:6px 10px;border:1px solid #e5e7eb;border-radius:999px;background:#fff;cursor:pointer}
.scope-btn.on{background:#eefcf2;border-color:#86efac;color:#166534}
.slider{display:flex;align-items:center;gap:10px}
.types{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.type-btn{padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;font-weight:700;cursor:pointer}
.type-btn.on{background:#f0fdf4;border-color:#86efac;color:#166534}

.cta{display:flex;justify-content:center;margin:16px 0}
.generate{background:linear-gradient(180deg,var(--brand),var(--brand-600));color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer;box-shadow:0 8px 20px var(--ring)}
.generate:disabled{opacity:.6;cursor:not-allowed}

.alert{color:#b91c1c;margin:10px 0}

.results-head{display:flex;justify-content:space-between;align-items:center;margin:10px 0}
.summary{display:flex;gap:12px;color:#475569}
.ok{color:#16a34a}.bad{color:#b91c1c}

.cards{display:flex;flex-direction:column;gap:12px}
.meal-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden}
.mc-head{padding:14px;border-bottom:1px solid #eef2f7}
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
  .controls{grid-template-columns:1fr}
}
</style>
