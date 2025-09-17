<template>
  <section>
    <header class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">7-Day Vitamin D Meal Plan</h2>
      <div class="text-sm opacity-70">Click “Swap” to change a meal</div>
    </header>

    <div v-if="loading" class="text-sm opacity-70">Loading…</div>

    <div v-else class="space-y-3">
      <div
        v-for="m in mealPlan"
        :key="m.id"
        class="rounded-lg border p-3 flex items-center justify-between bg-white"
      >
        <div>
          <div class="text-sm opacity-70">{{ m.day }} • {{ pretty(m.meal_type) }}</div>
          <div class="font-medium">
            {{ m.food.name }} <span class="opacity-70">({{ m.food.vitamin_d_iu }} IU)</span>
          </div>
        </div>
        <button class="px-3 py-1 rounded bg-emerald-600 text-white" @click="openSwap(m)">
          Swap
        </button>
      </div>
    </div>

    <!-- super-simple swap dialog -->
    <dialog ref="dlg" class="rounded-lg p-0 border w-[520px]">
      <form method="dialog">
        <header class="p-3 border-b font-semibold">Swap {{ current?.day }} • {{ pretty(current?.meal_type) }}</header>
        <div class="p-3 space-y-2">
          <input
            v-model="q"
            @input="searchFoods"
            placeholder="Search foods (e.g. salmon, milk)…"
            class="w-full border rounded px-2 py-1"
          />

          <div class="flex gap-3 text-sm">
            <label><input type="checkbox" v-model="filters.vegetarian" @change="searchFoods"/> Vegetarian</label>
            <label><input type="checkbox" v-model="filters.lactose_free" @change="searchFoods"/> Lactose-Free</label>
            <label><input type="checkbox" v-model="filters.nut_free" @change="searchFoods"/> Nut-Free</label>
          </div>

          <div class="max-h-64 overflow-auto space-y-2">
            <button
              v-for="f in options"
              :key="f.id"
              class="w-full text-left border rounded p-2 hover:bg-emerald-50"
              @click.prevent="swapTo(f)"
            >
              <div class="font-medium">{{ f.name }}</div>
              <div class="text-sm opacity-70">{{ f.category }} • {{ f.vitamin_d_iu }} IU</div>
            </button>
          </div>

          <div v-if="options.length===0" class="text-sm opacity-70">No matches.</div>
        </div>
        <footer class="p-3 border-t text-right">
          <button class="px-3 py-1 rounded border" @click.prevent="close">Close</button>
        </footer>
      </form>
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const mealPlan = ref([]);
const loading = ref(false);
const current = ref(null);

const dlg = ref(null);
const q = ref("");
const options = ref([]);
const filters = ref({ vegetarian: false, lactose_free: false, nut_free: false });

const pretty = (s) => s ? s[0].toUpperCase() + s.slice(1) : "";

async function fetchMealPlan() {
  loading.value = true;
  try {
    const { data } = await api.get("/nutrition/meal-plan/");
    mealPlan.value = data;
  } finally {
    loading.value = false;
  }
}

function openSwap(m) {
  current.value = m;
  q.value = "";
  filters.value = { vegetarian: false, lactose_free: false, nut_free: false };
  options.value = [];
  dlg.value.showModal();
  searchFoods(); // preload some options
}

function close() {
  dlg.value.close();
}

async function searchFoods() {
  const params = { q: q.value };
  if (filters.value.vegetarian) params.vegetarian = "true";
  if (filters.value.lactose_free) params.lactose_free = "true";
  if (filters.value.nut_free) params.nut_free = "true";
  const { data } = await api.get("/nutrition/foods/", { params });
  // show a small set first (frontend cap). backend is already fast.
  options.value = data.slice(0, 12);
}

async function swapTo(food) {
  const payload = {
    day: current.value.day,
    meal_type: current.value.meal_type,
    new_food_id: food.id,
  };
  await api.post("/nutrition/meal-plan/swap/", payload);
  await fetchMealPlan(); // reflect instantly
  close();
}

onMounted(fetchMealPlan);
</script>

<style scoped>
dialog::backdrop { background: rgba(0,0,0,.3); }
</style>
