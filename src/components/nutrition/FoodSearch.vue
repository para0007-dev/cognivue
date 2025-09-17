<template>
  <section class="page">
    <!-- Header -->
    <header class="page__header">
      <h2 class="title">Search Vitamin D Foods</h2>
      <p class="subtitle">Look up foods and check how much vitamin D they provide</p>
    </header>

    <!-- Search + filters -->
    <div class="searchrow">
      <input
        v-model="q"
        @input="load"
        placeholder="Search foods (e.g. salmon, milk, mushroom)…"
        class="input"
      />
      <div class="filters">
        <label><input type="checkbox" v-model="filters.vegetarian" @change="load" /> Vegetarian</label>
        <label><input type="checkbox" v-model="filters.lactose_free" @change="load" /> Lactose-Free</label>
        <label><input type="checkbox" v-model="filters.nut_free" @change="load" /> Nut-Free</label>
      </div>
    </div>

    <!-- Results -->
    <div v-if="loading" class="loadingrow">Loading…</div>

    <div v-else class="results">
      <article v-for="f in foods" :key="f.id" class="card">
        <div class="card__main">
          <h3 class="card__title">{{ f.name }}</h3>
          <p class="card__meta">{{ f.category }}</p>
        </div>
        <div class="badge">{{ f.vitamin_d_iu }} IU</div>
      </article>
      <div v-if="foods.length === 0" class="empty">No results found</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const foods = ref([]);
const q = ref("");
const loading = ref(false);
const filters = ref({ vegetarian: false, lactose_free: false, nut_free: false });

async function load() {
  loading.value = true;
  try {
    const params = { q: q.value };
    if (filters.value.vegetarian) params.vegetarian = "true";
    if (filters.value.lactose_free) params.lactose_free = "true";
    if (filters.value.nut_free) params.nut_free = "true";
    const { data } = await api.get("/nutrition/foods/", { params });
    foods.value = data;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
.page { padding:16px; }
.page__header { margin-bottom:12px; }
.title { margin:0; font-size:22px; font-weight:700; color:#0b3d2e; }
.subtitle { margin:4px 0 0; color:#3e6b5c; font-size:13px; }

.searchrow { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
.input { width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px; }
.filters { display:flex; gap:16px; font-size:13px; color:#065f46; flex-wrap:wrap; }

.results { display:grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap:10px; }
@media (min-width:720px) { .results { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width:1100px){ .results { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.card { background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; padding:12px; display:flex; align-items:center; justify-content:space-between; }
.card__main { display:flex; flex-direction:column; }
.card__title { font-weight:600; margin:0; color:#064e3b; }
.card__meta { font-size:12px; color:#6b7280; }
.badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#10b981; color:#fff; }

.loadingrow, .empty { color:#6b7280; font-size:13px; text-align:center; padding:12px; }
</style>
