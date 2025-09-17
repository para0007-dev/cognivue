<template>
  <section>
    <h2 class="text-xl font-semibold mb-3">Search Vitamin D Foods</h2>

    <div class="flex items-center gap-3 mb-3">
      <input v-model="q" @input="load" placeholder="Search foods…" class="flex-1 border rounded px-3 py-2"/>
      <label class="text-sm"><input type="checkbox" v-model="filters.vegetarian" @change="load"/> Vegetarian</label>
      <label class="text-sm"><input type="checkbox" v-model="filters.lactose_free" @change="load"/> Lactose-Free</label>
      <label class="text-sm"><input type="checkbox" v-model="filters.nut_free" @change="load"/> Nut-Free</label>
    </div>

    <div v-if="loading" class="text-sm opacity-70">Loading…</div>

    <div v-else class="space-y-2">
      <div v-for="f in foods" :key="f.id" class="border rounded p-3 bg-white">
        <div class="font-medium">{{ f.name }}</div>
        <div class="text-sm opacity-70">{{ f.category }} • {{ f.vitamin_d_iu }} IU</div>
      </div>
      <div v-if="foods.length===0" class="text-sm opacity-70">No results.</div>
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
