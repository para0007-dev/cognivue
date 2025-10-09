<template>
  <section class="nutrition">
    <Header />
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

<script>
export default {
  name: 'MealPlannerView'
}
</script>

<style scoped>
.nutrition { padding: 16px; }

.content { margin-top: 20px; }
</style>
