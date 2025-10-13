<template>
  <div class="meal-planner-page page-content">
    <Header />
    <!-- Dynamic Tab Content -->
    <div class="content">
      <MealPlanner v-if="currentTab === 'Meal Planner'" />
      <FoodSearch v-if="currentTab === 'Food Search'" />
      <NutritionTips v-if="currentTab === 'Nutrition Tips'" />
    </div>
  </div>
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
.meal-planner-page {
  /* Keep consistent with other pages - no padding on main container */
}

.content { 
  margin-top: 20px; 
  padding: 16px; /* Add padding only to content area */
}
</style>
