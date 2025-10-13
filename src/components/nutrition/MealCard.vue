<template>
  <article class="meal-card">
    <header class="mc-head">
      <div class="mc-info">
        <span class="badge">{{ badgeText }}</span>
        <h3 class="mc-title">{{ meal.name }}</h3>
        <div class="meta">
          <span>Vit D: {{ vitdMcg }} µg ({{ vitdIUDisplay }})</span>
          <span>Prep: {{ prepMinutes }} min</span>
          <span>Cost: ${{ costAud }}</span>
        </div>
      </div>
      <img v-if="imageUrl" :src="imageUrl" alt="" class="mc-img" loading="lazy" />
    </header>
    <div class="mc-body">
      <div class="col">
        <h4>Ingredients</h4>
        <ul class="ingredients list-split">
          <li v-for="(ing, idx) in parsedIngredients" :key="'ing-'+idx" class="ing-item">
            <span class="ing-qty" v-if="ing.qty">{{ ing.qty }}</span>
            <span class="ing-name">{{ ing.name }}</span>
          </li>
        </ul>
      </div>
      <div class="col">
        <h4>Recipe</h4>
        <ol>
          <li v-for="(step, idx) in recipeSteps" :key="idx">{{ step }}</li>
        </ol>
      </div>
    </div>
    <footer class="mc-foot">
      <div class="tags">
        <span v-for="t in tags" :key="t" class="tag">{{ t }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  meal: { type: Object, required: true }
})

// Compat: support existing fields and teammate naming
const badgeText = computed(() => props.meal.type || (props.meal.kind === 'snack' ? 'Snack' : 'Meal'))
const vitdMcg = computed(() => {
  if (props.meal.vitd_mcg != null) return props.meal.vitd_mcg
  if (props.meal.vitaminD != null) return props.meal.vitaminD
  return ''
})
const vitdIUDisplay = computed(() => {
  if (props.meal.vitd_iu != null) return `${props.meal.vitd_iu} IU`
  if (props.meal.vitaminDUnit) return props.meal.vitaminDUnit
  if (props.meal.vitaminD != null) return `${Math.round(Number(props.meal.vitaminD) * 40)} IU`
  return ''
})
const prepMinutes = computed(() => props.meal.prep_minutes ?? props.meal.prepTime ?? '')
const costAud = computed(() => {
  const c = props.meal.cost_aud ?? props.meal.cost
  const n = Number(c)
  return Number.isFinite(n) ? n.toFixed(2) : c
})
const ingredients = computed(() => props.meal.ingredients ?? [])
// Add parsing for quantity + unit vs name
const parseIngredient = (raw) => {
  const s = String(raw || '').trim()
  if (!s) return { qty: '', name: '' }
  const parts = s.split(/\s+/)
  const isNumber = (tok) => /^\d+(?:\.\d+)?$/.test(tok)
  if (!isNumber(parts[0] || '')) return { qty: '', name: s }
  let qty = parts[0]
  let i = 1
  const unitSet = new Set(['g','kg','mg','µg','ug','ml','l','tsp','tbsp','cup','cups','oz','lb','slice','slices','piece','pieces'])
  if (i < parts.length && unitSet.has((parts[i] || '').toLowerCase())) {
    qty += ' ' + parts[i]
    i++
  }
  return { qty, name: parts.slice(i).join(' ') }
}
const parsedIngredients = computed(() => ingredients.value.map(parseIngredient))
const recipeSteps = computed(() => props.meal.recipe_steps ?? props.meal.recipe ?? [])
const tags = computed(() => props.meal.tags ?? [])
const imageUrl = computed(() => props.meal.image_url ?? props.meal.image ?? '')
</script>

<style scoped>
.meal-card{background:linear-gradient(180deg,#ffffff 0%,#fbfdff 100%);border:1px solid #e6edf5;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 1px 3px rgba(16,24,40,.06);transition:box-shadow .25s ease,transform .25s ease,border-color .25s ease}
.meal-card::before{content:"";position:absolute;inset:-1px;border-radius:14px;background:radial-gradient(120% 100% at 0% 0%,rgba(16,185,129,.08) 0%,rgba(16,185,129,0) 60%),radial-gradient(120% 100% at 100% 0%,rgba(59,130,246,.06) 0%,rgba(59,130,246,0) 60%);pointer-events:none;opacity:.85}
.meal-card:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(16,24,40,.10)}
.mc-head{display:grid;grid-template-columns:1fr 140px;gap:16px;align-items:start;padding:15px 15px 0}
.mc-info{min-width:0}
.mc-img{grid-column:2;width:140px;height:110px;object-fit:cover;border-radius:10px;border:1px solid #e6edf5;box-shadow:0 4px 12px rgba(16,24,40,.08)}
@media(max-width:600px){.mc-head{grid-template-columns:1fr}.mc-img{grid-column:1;width:100%;height:180px}}
.badge{display:inline-block;background:linear-gradient(180deg,#e8faf0 0%,#dff7ea 100%);color:#0f766e;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:700;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 1px 2px rgba(16,24,40,.06)}
.mc-title{margin:6px 0 4px;font-size:18px;font-weight:700;color:#0f172a;letter-spacing:.2px;text-shadow:0 1px 0 rgba(255,255,255,.8);position:relative}
.mc-title::before{content:"";position:absolute;inset:auto auto 0 0;width:42px;height:3px;border-radius:3px;background:linear-gradient(90deg,rgba(16,185,129,.3),rgba(59,130,246,.25));opacity:.7;transform-origin:left bottom;transition:transform .25s ease,opacity .25s ease}
.meal-card:hover .mc-title::before{transform:scaleX(1.2);opacity:.9}
.meta{display:flex;gap:14px;color:#556987;font-size:14px;flex-wrap:wrap}
.mc-body{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:14px;position:relative}
.mc-body::after{content:"";position:absolute;top:14px;bottom:14px;left:50%;width:1px;background:linear-gradient(180deg,#e9eef5 0%,#f4f7fb 100%);transform:translateX(-0.5px)}
.mc-body .col{border-radius:10px;transition:transform .2s ease,box-shadow .2s ease}
.mc-body .col:hover{transform:translateY(-1px) scale(1.01);box-shadow:0 4px 12px rgba(16,24,40,.08)}
.mc-body h4{margin:0 0 6px;font-weight:700;color:#0f766e}
.mc-body ul{list-style:none;margin:0 0 0 16px}
.mc-body ol{counter-reset:step;list-style:none}
.mc-body ol li{position:relative;padding-left:28px}
.mc-body ol li::before{content:counter(step);counter-increment:step;position:absolute;left:0;top:.1em;width:20px;height:20px;border-radius:999px;background:linear-gradient(180deg,#dff7ea,#c9f0dd);color:#045d56;font-weight:700;font-size:12px;line-height:20px;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 1px 2px rgba(16,24,40,.06);transition:transform .2s ease,background .2s ease,color .2s ease}
.mc-body ol li:hover::before{transform:scale(1.08);background:linear-gradient(180deg,#c6efd7,#b6e9cd);color:#064e3b}
.mc-body ul li{position:relative;padding-left:18px}
.mc-body ul li::before{content:"";position:absolute;left:0;top:.35em;width:8px;height:8px;border-radius:999px;background:linear-gradient(180deg,#e8faf0,#dff7ea);box-shadow:0 1px 2px rgba(16,24,40,.06);transition:transform .2s ease}
.mc-body ul li:hover::before{transform:scale(1.25)}
.mc-foot{padding:10px 14px;border-top:1px solid #eef2f7;background:linear-gradient(180deg,#ffffff,#f8fbff)}
.tags{display:flex;gap:6px;flex-wrap:wrap}
.tag{background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);border:1px solid #e6edf5;border-radius:999px;padding:2px 8px;font-size:12px;color:#0f172a;box-shadow:0 1px 2px rgba(16,24,40,.06);transition:background .2s ease,transform .2s ease,box-shadow .2s ease}
.tag:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(16,24,40,.10)}
@media(prefers-reduced-motion:reduce){.meal-card,.tag{transition:none}.meal-card:hover,.tag:hover{transform:none}}
.list-split{list-style:none;margin:0 0 0 0;padding:0}
.list-split li::before{display:none}
.ing-item{display:flex;align-items:center;gap:12px;margin:6px 0}
.ing-qty{display:inline-block;min-width:96px;padding:4px 10px;border-radius:10px;background:linear-gradient(180deg,#e8faf0,#dff7ea);color:#045d56;font-weight:700;font-size:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.6),0 1px 2px rgba(16,24,40,.06)}
.ing-name{flex:1;color:#0f172a;font-size:14px}
@media(max-width:600px){
  .ing-item{flex-wrap:wrap}
  .ing-qty{min-width:auto;margin-bottom:4px}
  .ing-name{width:100%}
}
</style>