<template>
  <Header />
  <section class="nutrition">
    <!-- Header -->
    <header class="header">
      <h1 class="title">Food Plan Tracker</h1>
    </header>

    <!-- Tab Switcher -->
    <div class="tab-switcher">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="currentTab = tab"
        class="pill"
        :class="{ active: currentTab === tab }"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Dynamic Tab Content -->
    <div class="content">
      <MealPlanner v-if="currentTab === 'Meal Planner'" />
      <FoodSearch v-if="currentTab === 'Food Search'" />
      <NutritionTips v-if="currentTab === 'Nutrition Tips'" />
    </div>
  </section>
</template>

<script setup>
import Header from '@/components/Header.vue';
import { ref } from "vue";
import MealPlanner from "@/components/nutrition/MealPlanner.vue";
import FoodSearch from "@/components/nutrition/FoodSearch.vue";
import NutritionTips from "@/components/nutrition/NutritionTips.vue";

const tabs = ["Meal Planner", "Food Search", "Nutrition Tips"];
const currentTab = ref("Meal Planner");
</script>

<style scoped>
.nutrition { padding: 16px; }

.header { margin-bottom: 12px; text-align: center; }
.title { font-size: 26px; font-weight: 700; color: #064e3b; }

.tab-switcher {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.pill {
  padding: 8px 18px;
  border-radius: 9999px;
  border: 1px solid #10b981;
  background: #ecfdf5;
  color: #065f46;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.pill:hover {
  background: #d1fae5;
}

.pill.active {
  background: #10b981;
  color: white;
  border-color: #059669;
}

.content { margin-top: 20px; }
</style>
