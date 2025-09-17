<template>
  <section class="page">
    <!-- Header -->
    <header class="page__header">
      <h2 class="title">Nutrition Tips</h2>
      <p class="subtitle">Practical advice linking food choices with vitamin D and brain health</p>
    </header>

    <!-- Tips -->
    <div v-if="loading" class="loadingrow">Loading tips…</div>

    <div v-else class="grid">
      <article v-for="t in tips" :key="t.id" class="card">
        <header class="card__head">
          <h3 class="card__title">{{ t.title }}</h3>
        </header>

        <p class="card__tip">{{ t.tip_text }}</p>

        <details class="card__expand">
          <summary class="expand__btn">Brain Health Connection</summary>
          <p class="expand__text">{{ t.expanded_text }}</p>
        </details>

        <div v-if="t.related_foods?.length" class="foods">
          <span v-for="f in t.related_foods" :key="f.id" class="foodchip">
            {{ f.name }}
          </span>
        </div>
      </article>
      <div v-if="tips.length === 0" class="empty">No nutrition tips available</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const tips = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const { data } = await api.get("/nutrition/nutrition-tips/");
    tips.value = data;
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

.grid { display:grid; grid-template-columns:repeat(1, minmax(0,1fr)); gap:14px; }
@media (min-width:720px){ .grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
@media (min-width:1100px){ .grid { grid-template-columns:repeat(3, minmax(0,1fr)); } }

.card { background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:8px; }
.card__head { border-bottom:1px solid #bbf7d0; padding-bottom:4px; margin-bottom:6px; }
.card__title { font-weight:600; margin:0; color:#064e3b; }
.card__tip { font-size:14px; color:#0f172a; }
.card__expand { font-size:13px; }
.expand__btn { color:#065f46; cursor:pointer; font-weight:500; }
.expand__text { margin-top:6px; color:#374151; }

.foods { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
.foodchip { font-size:12px; padding:4px 8px; border-radius:999px; background:#10b981; color:#fff; }

.loadingrow, .empty { color:#6b7280; font-size:13px; text-align:center; padding:12px; }
</style>
