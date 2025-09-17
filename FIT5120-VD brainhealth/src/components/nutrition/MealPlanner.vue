<template>
  <section class="page">

    <!-- Header -->
    <header class="page__header">
      <div>
        <h2 class="title">7-Day Vitamin D Meal Plan</h2>
        <p class="subtitle">Breakfast • Lunch • Dinner — swap any meal to suit your taste</p>
      </div>
      <button class="refresh" @click="fetchMealPlan" :disabled="loading">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </header>

    <!-- Grid of days -->
    <div class="days">
      <article
        v-for="day in dayOrder"
        :key="day"
        class="daycard"
      >
        <header class="daycard__head">
          <div class="dayname">{{ day }}</div>
          <div class="badge">Total: {{ dailyTotal(day) }} IU</div>
        </header>

        <ul class="meals">
          <li v-for="mt in mealTypes" :key="mt" class="meal">
            <div class="meal__meta">
              <span class="chip">{{ pretty(mt) }}</span>
              <span v-if="mealFor(day, mt)?.food" class="meal__food">
                {{ mealFor(day, mt).food.name }}
                <span class="muted">• {{ mealFor(day, mt).food.vitamin_d_iu }} IU</span>
              </span>
              <span v-else class="muted">No meal set</span>
            </div>

            <button class="swapbtn" @click="openSwap(day, mt)">Swap</button>
          </li>
        </ul>
      </article>
    </div>

    <!-- Swap dialog -->
    <dialog ref="dlg" class="dlg">
      <form method="dialog" class="dlg__panel" @submit.prevent>
        <header class="dlg__head">
          <div class="dlg__title">Swap {{ current.day }} • {{ pretty(current.meal_type) }}</div>
          <button class="iconbtn" @click="close" title="Close">✕</button>
        </header>

        <div class="dlg__body">
          <div class="searchrow">
            <input
              class="input"
              v-model="q"
              @input="searchFoods"
              placeholder="Search foods (e.g. salmon, milk, mushroom)…"
            />
            <div class="filters">
              <label><input type="checkbox" v-model="filters.vegetarian" @change="searchFoods" /> Vegetarian</label>
              <label><input type="checkbox" v-model="filters.lactose_free" @change="searchFoods" /> Lactose-Free</label>
              <label><input type="checkbox" v-model="filters.nut_free" @change="searchFoods" /> Nut-Free</label>
            </div>
          </div>

          <div class="options">
            <button
              v-for="f in options"
              :key="f.id"
              class="option"
              @click.prevent="swapTo(f)"
            >
              <div class="option__name">{{ f.name }}</div>
              <div class="option__meta">{{ f.category }} • {{ f.vitamin_d_iu }} IU</div>
            </button>

            <div v-if="!optsLoading && options.length === 0" class="empty">No matches. Try different filters or terms.</div>
            <div v-if="optsLoading" class="loadingrow">Loading options…</div>
          </div>
        </div>

        <footer class="dlg__foot">
          <button class="btn ghost" @click.prevent="close">Cancel</button>
        </footer>
      </form>
    </dialog>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

// canonical order + meal types
const dayOrder = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const mealTypes = ["breakfast","lunch","dinner"];

// state
const loading = ref(false);
const rawPlan = ref([]); // flat array from API
const grouped = computed(() => {
  // group by day -> meal_type -> meal object
  const map = {};
  for (const d of dayOrder) map[d] = {};
  rawPlan.value.forEach(m => {
    (map[m.day] ||= {})[m.meal_type] = m;
  });
  return map;
});

// ui helpers
const pretty = (s) => s ? s[0].toUpperCase() + s.slice(1) : "";
const mealFor = (day, mt) => grouped.value?.[day]?.[mt] || null;
const dailyTotal = (day) =>
  mealTypes.reduce((sum, mt) => {
    const m = mealFor(day, mt);
    return sum + (m?.food?.vitamin_d_iu || 0);
  }, 0);

// fetch plan
async function fetchMealPlan() {
  loading.value = true;
  try {
    const { data } = await api.get("/nutrition/meal-plan/");
    rawPlan.value = data;
  } finally {
    loading.value = false;
  }
}

// ---- swap flow ----
const dlg = ref(null);
const current = ref({ day: "", meal_type: "" });
const q = ref("");
const filters = ref({ vegetarian: false, lactose_free: false, nut_free: false });
const options = ref([]);
const optsLoading = ref(false);

function openSwap(day, meal_type) {
  current.value = { day, meal_type };
  q.value = "";
  filters.value = { vegetarian: false, lactose_free: false, nut_free: false };
  options.value = [];
  dlg.value.showModal();
  searchFoods(); // preload
}

function close() {
  dlg.value.close();
}

async function searchFoods() {
  optsLoading.value = true;
  try {
    const params = { q: q.value };
    if (filters.value.vegetarian) params.vegetarian = "true";
    if (filters.value.lactose_free) params.lactose_free = "true";
    if (filters.value.nut_free) params.nut_free = "true";
    const { data } = await api.get("/nutrition/foods/", { params });
    // Offer at least 2 alternatives (show up to 12)
    options.value = data.slice(0, 12);
  } finally {
    optsLoading.value = false;
  }
}

async function swapTo(food) {
  await api.post("/nutrition/meal-plan/swap/", {
    day: current.value.day,
    meal_type: current.value.meal_type,
    new_food_id: food.id,
  });
  await fetchMealPlan(); // reflect instantly
  close();
}

onMounted(fetchMealPlan);
</script>

<style scoped>
/* page */
.page { padding: 16px; }
.page__header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.title { margin:0; font-size:22px; font-weight:700; color:#0b3d2e; }
.subtitle { margin:4px 0 0; color:#3e6b5c; font-size:13px; }
.refresh { background:#065f46; color:#fff; border:none; padding:8px 12px; border-radius:10px; cursor:pointer; }
.refresh[disabled]{ opacity:.7; cursor:default; }

/* grid of days */
.days { display:grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap:12px; }
@media (min-width: 720px) { .days { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1100px){ .days { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.daycard { background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; box-shadow:0 1px 0 rgba(0,0,0,.04); overflow:hidden; }
.daycard__head { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:#d1fae5; }
.dayname { font-weight:700; color:#064e3b; }
.badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#10b981; color:#fff; }

/* meals list */
.meals { list-style:none; margin:0; padding:10px; display:flex; flex-direction:column; gap:8px; }
.meal { display:flex; align-items:center; justify-content:space-between; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px 12px; }
.meal__meta { display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; }
.chip { font-size:12px; padding:2px 8px; border-radius:999px; background:#eff6ff; color:#1e3a8a; border:1px solid #bfdbfe; }
.meal__food { font-weight:600; color:#0f172a; }
.muted { color:#6b7280; font-size:12px; }

/* swap button */
.swapbtn { background:#059669; color:#fff; border:none; padding:8px 12px; border-radius:10px; cursor:pointer; }
.swapbtn:hover { background:#047857; }

/* dialog */
.dlg { border:none; padding:0; }
.dlg::backdrop { background: rgba(0,0,0,.35); }
.dlg__panel { width:min(720px, 92vw); background:#fff; border-radius:14px; overflow:hidden; border:1px solid #e5e7eb; }
.dlg__head { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#ecfdf5; border-bottom:1px solid #a7f3d0; }
.dlg__title { font-weight:700; color:#064e3b; }
.iconbtn { background:transparent; border:none; font-size:16px; cursor:pointer; color:#065f46; }

.dlg__body { padding:12px 14px; display:flex; flex-direction:column; gap:10px; }
.searchrow { display:flex; flex-direction:column; gap:8px; }
.input { width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px; }
.filters { display:flex; gap:16px; font-size:13px; color:#065f46; flex-wrap:wrap; }

.options { max-height:340px; overflow:auto; display:flex; flex-direction:column; gap:8px; }
.option { text-align:left; background:#fff; border:1px solid #e5e7eb; padding:10px 12px; border-radius:12px; cursor:pointer; }
.option:hover { background:#f0fdf4; border-color:#bbf7d0; }
.option__name { font-weight:600; color:#0f172a; }
.option__meta { font-size:12px; color:#6b7280; }

.loadingrow, .empty { color:#6b7280; font-size:13px; padding:8px 4px; text-align:center; }

.dlg__foot { padding:10px 14px; border-top:1px solid #e5e7eb; display:flex; justify-content:flex-end; gap:8px; }
.btn { padding:8px 12px; border-radius:10px; border:1px solid #d1d5db; background:#fff; cursor:pointer; }
.btn.ghost:hover { background:#f9fafb; }
</style>
