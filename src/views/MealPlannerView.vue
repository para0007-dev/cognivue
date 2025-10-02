<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { mealAI } from '@/services/api.js'

const days = ref(1)
const budgetScope = ref('weekly')
const budgetAud = ref(60)
const maxPrep = ref(40)
const dietary = ref<string[]>([]) // ['vegetarian','lactose-free','nut-free']

const loading = ref(false)
const error = ref<string|null>(null)
const result = ref<any|null>(null)

async function generatePlan(){
  loading.value = true; error.value = null; result.value = null
  try {
    const res = await mealAI.generate({
      days: days.value,
      budget_scope: budgetScope.value,
      budget_aud: budgetAud.value,
      max_prep_minutes: maxPrep.value,
      dietary: dietary.value
    })
    if (!res.success) throw new Error(res.error || 'Failed')
    result.value = res
  } catch (e:any) {
    error.value = e?.message || 'Failed to generate'
  } finally { loading.value = false }
}
</script>

<template>
  <Header />
  <div class="mp container">
    <h1>AI Vitamin-D Meal Planner</h1>

    <form class="controls" @submit.prevent="generatePlan">
      <label>Days <input type="number" min="1" max="7" v-model.number="days" /></label>
      <label>Budget Scope
        <select v-model="budgetScope">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </label>
      <label>Budget (AUD) <input type="number" min="0" step="1" v-model.number="budgetAud" /></label>
      <label>Max Prep (mins) <input type="number" min="5" step="5" v-model.number="maxPrep" /></label>
      <fieldset>
        <legend>Dietary</legend>
        <label><input type="checkbox" value="vegetarian" v-model="dietary" /> Vegetarian</label>
        <label><input type="checkbox" value="lactose-free" v-model="dietary" /> Lactose-free</label>
        <label><input type="checkbox" value="nut-free" v-model="dietary" /> Nut-free</label>
      </fieldset>
      <button :disabled="loading">{{ loading ? 'Generating…' : 'Generate' }}</button>
    </form>

    <div v-if="error" class="alert">{{ error }}</div>

    <div v-if="result" class="cards">
      <div class="summary">
        <div>Total cost: ${{ Number(result.summary.total_cost_aud).toFixed(2) }}</div>
        <div>Budget: ${{ Number(result.summary.budget_limit_aud).toFixed(2) }}</div>
        <div :class="result.summary.within_budget ? 'ok' : 'bad'">
          {{ result.summary.within_budget ? 'Within budget' : 'Over budget' }}
        </div>
      </div>

      <div class="grid">
        <div v-for="it in result.items" :key="it.name" class="card">
          <div class="kind">{{ it.kind === 'snack' ? 'Snack' : 'Meal' }}</div>
          <div class="name">{{ it.name }}</div>
          <div class="meta">
            <span>Vit D: {{ it.vitd_mcg }} µg ({{ it.vitd_iu }} IU)</span>
            <span>Prep: {{ it.prep_minutes }} min</span>
            <span>Cost: ${{ Number(it.cost_aud).toFixed(2) }}</span>
          </div>
          <div class="tags"><span v-for="t in it.tags" :key="t" class="tag">{{ t }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container{max-width:1100px;margin:0 auto;padding:16px}
.controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:12px 0 16px}
.controls fieldset{border:1px solid #e5e7eb;border-radius:8px;padding:8px}
.cards .summary{display:flex;gap:16px;margin:10px 0 16px}
.ok{color:#16a34a}.bad{color:#b91c1c}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.card{border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fff}
.kind{font-weight:700;color:#16a34a}
.name{font-weight:700;margin:2px 0 6px}
.meta{display:flex;flex-direction:column;gap:4px;color:#475569}
.tag{background:#f1f5f9;border-radius:999px;padding:2px 8px;font-size:12px;margin-right:6px}
</style>
