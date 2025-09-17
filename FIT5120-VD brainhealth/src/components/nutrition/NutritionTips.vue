<template>
  <section>
    <h2 class="text-xl font-semibold mb-3">Nutrition Tips</h2>
    <div v-if="loading" class="text-sm opacity-70">Loading…</div>

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <article v-for="t in tips" :key="t.id" class="border rounded p-3 bg-white">
        <div class="font-semibold mb-1">{{ t.title }}</div>
        <div class="text-sm">{{ t.tip_text }}</div>
        <details class="mt-2">
          <summary class="text-sm text-emerald-700 cursor-pointer">Brain health link</summary>
          <p class="text-sm mt-1 opacity-80">{{ t.expanded_text }}</p>
        </details>
        <div v-if="t.related_foods?.length" class="mt-2 text-xs opacity-70">
          Recommended: {{ t.related_foods.map(r => r.name).join(", ") }}
        </div>
      </article>
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
