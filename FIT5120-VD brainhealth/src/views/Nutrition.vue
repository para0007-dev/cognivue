<template>
  <main class="max-w-5xl mx-auto p-4 space-y-4">
    <h1 class="text-2xl font-bold">Food Plan Tracker</h1>

    <nav class="flex gap-2">
      <button :class="btn('planner')" @click="tab='planner'">Meal Planner</button>
      <button :class="btn('search')"  @click="tab='search'">Food Search</button>
      <button :class="btn('tips')"    @click="tab='tips'">Nutrition Tips</button>
    </nav>

    <MealPlanner v-if="tab==='planner'" />
    <FoodSearch  v-else-if="tab==='search'" />
    <NutritionTips v-else />
  </main>
</template>

<script setup>
import { ref } from "vue";
import MealPlanner from "@/components/nutrition/MealPlanner.vue";
import FoodSearch from "@/components/nutrition/FoodSearch.vue";
import NutritionTips from "@/components/nutrition/NutritionTips.vue";

const tab = ref("planner");
const btn = (name) => [
  "px-3 py-2 rounded border",
  tab.value===name ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
].join(" ");
</script>

<style>
:root { font-family: Inter, ui-sans-serif, system-ui; background:#f7faf9; }
</style>
