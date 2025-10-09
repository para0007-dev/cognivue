<template>
  <div class="meal-planner">
    <!-- Jumbotron Header -->
    <div class="jumbotron">
      <div class="jumbotron-content">
        <div class="title-section">
          <div class="title-icon">
            <Icon icon="material-symbols:restaurant-menu" :width="48" :height="48" />
          </div>
          <h1 class="jumbotron-title">AI Vitamin D Meal Planner</h1>
          <p class="jumbotron-subtitle">Personalised Australian meal plans for optimal brain health</p>
          <!-- Daily Goal -->
          <div class="daily-goal-jumbotron">
            <span class="goal-text">Daily Goal: 1000 IU Vitamin D</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="main-content" :class="{ 'has-meal-plan': mealPlan }">
      <!-- Left Configuration Panel -->
      <div class="config-panel">
      <!-- Preferences Section -->
      <div class="preferences-section">
        <h2 class="section-title">Tell us about your preferences</h2>

        <div class="preferences-grid">
          <!-- Dietary Requirements -->
          <div class="preference-group">
            <div class="group-header">
              <span class="icon-text">Diet</span>
              <h3 class="group-title">Dietary Requirements</h3>
            </div>
            <div class="dietary-options">
              <button 
                v-for="diet in dietaryOptions" 
                :key="diet.id"
                :class="['diet-btn', { active: selectedDiets.includes(diet.id) }]"
                @click="toggleDiet(diet.id)"
              >
                {{ diet.label }}
              </button>
              <button class="diet-btn restrictions">No Restrictions</button>
            </div>
          </div>

          <!-- Weekly Budget -->
          <div class="preference-group">
            <div class="group-header">
              <span class="icon-text">Budget</span>
              <h3 class="group-title">Weekly Budget</h3>
            </div>
            <div class="budget-section">
              <div class="budget-display">
                <span class="budget-amount">${{ weeklyBudget }} AUD/week</span>
                <span class="daily-budget">Daily budget: ${{ (weeklyBudget / 7).toFixed(2) }}</span>
              </div>
              <div class="budget-range">
                <span class="range-label">$50</span>
                <input 
                  type="range" 
                  v-model="weeklyBudget" 
                  min="50" 
                  max="500" 
                  step="10"
                  class="budget-slider"
                />
                <span class="range-label">$500</span>
              </div>
            </div>
          </div>

          <!-- Meal Types Needed -->
          <div class="preference-group">
            <div class="group-header">
              <span class="icon-text">Meals</span>
              <h3 class="group-title">Meal Types Needed</h3>
            </div>
            <div class="meal-types-container">
              <div class="meal-types">
                <button 
                  v-for="meal in mealTypes" 
                  :key="meal.id"
                  :class="['meal-btn', { active: selectedMeals.includes(meal.id) }]"
                  @click="toggleMeal(meal.id)"
                >
                  <span class="meal-icon">{{ meal.icon }}</span>
                  <span class="meal-label">{{ meal.label }}</span>
                </button>
              </div>
              <div class="selected-info">
                <span class="selected-text">Selected: {{ getSelectedMealsText() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Personalized Meal Plan Preview -->
        <div v-if="showMealPlanPreview" class="meal-plan-preview">
          <div class="preview-header">
            <h3 class="preview-title">Your Personalized Meal Plan</h3>
            <div class="preview-stats">
              <span class="stat-badge vitamin">970 IU Vitamin D</span>
              <span class="stat-badge cost">$195 Weekly Cost</span>
              <span class="stat-badge days">7 Days Covered</span>
            </div>
          </div>

          <div class="meal-cards">
            <!-- Breakfast Card -->
            <div class="meal-card">
              <div class="meal-card-header">
                <div class="meal-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 3H6C4.9 3 4 3.9 4 5v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6z"/>
                  </svg>
                </div>
                <div class="meal-info">
                  <h4 class="meal-title">Vitamin D Fortified Cereal Bowl</h4>
                  <span class="meal-type-label">Breakfast</span>
                </div>
                <span class="vitamin-badge">400 IU Vitamin D</span>
              </div>

              <div class="meal-details">
                <div class="ingredients-section">
                  <h5>Ingredients</h5>
                  <ul class="ingredients-list">
                    <li>Fortified cereal (1 cup)</li>
                    <li>Fortified milk (200ml)</li>
                    <li>Banana slices</li>
                    <li>Almonds (handful)</li>
                  </ul>
                </div>

                <div class="nutrition-section">
                  <h5>Nutrition Facts</h5>
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <span class="label">Calories:</span>
                      <span class="value">350</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Protein:</span>
                      <span class="value">12g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Carbs:</span>
                      <span class="value">58g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Fat:</span>
                      <span class="value">9g</span>
                    </div>
                  </div>
                </div>

                <div class="meal-footer">
                  <div class="cost-time">
                    <span class="cost">$4.50 AUD per serving</span>
                    <span class="time">5 mins</span>
                  </div>
                  <div class="health-tip">
                    <div class="tip-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                      </svg>
                    </div>
                    <span class="tip-text">Choose cereals fortified with at least 100 IU vitamin D per serving for maximum benefit.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lunch Card -->
            <div class="meal-card">
              <div class="meal-card-header">
                <div class="meal-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div class="meal-info">
                  <h4 class="meal-title">Tuna & Egg Power Salad</h4>
                  <span class="meal-type-label">Lunch</span>
                </div>
                <span class="vitamin-badge">480 IU Vitamin D</span>
              </div>

              <div class="meal-details">
                <div class="ingredients-section">
                  <h5>Ingredients</h5>
                  <ul class="ingredients-list">
                    <li>Canned tuna (1 can)</li>
                    <li>Hard-boiled eggs (2)</li>
                    <li>Mixed greens</li>
                    <li>Cherry tomatoes</li>
                    <li>Olive oil dressing</li>
                  </ul>
                </div>

                <div class="nutrition-section">
                  <h5>Nutrition Facts</h5>
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <span class="label">Calories:</span>
                      <span class="value">380</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Protein:</span>
                      <span class="value">35g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Carbs:</span>
                      <span class="value">8g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Fat:</span>
                      <span class="value">22g</span>
                    </div>
                  </div>
                </div>

                <div class="meal-footer">
                  <div class="cost-time">
                    <span class="cost">$6.80 AUD per serving</span>
                    <span class="time">15 mins</span>
                  </div>
                  <div class="health-tip">
                    <div class="tip-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                      </svg>
                    </div>
                    <span class="tip-text">Egg yolks are rich in vitamin D. Free-range eggs from pasture-raised hens have higher levels.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dinner Card -->
            <div class="meal-card">
              <div class="meal-card-header">
                <div class="meal-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div class="meal-info">
                  <h4 class="meal-title">Grilled Barramundi with Herbs</h4>
                  <span class="meal-type-label">Dinner</span>
                </div>
                <span class="vitamin-badge">500 IU Vitamin D</span>
              </div>

              <div class="meal-details">
                <div class="ingredients-section">
                  <h5>Ingredients</h5>
                  <ul class="ingredients-list">
                    <li>Barramundi fillet (200g)</li>
                    <li>Lemon herbs</li>
                    <li>Roasted vegetables</li>
                    <li>Sweet potato</li>
                    <li>Olive oil</li>
                  </ul>
                </div>

                <div class="nutrition-section">
                  <h5>Nutrition Facts</h5>
                  <div class="nutrition-grid">
                    <div class="nutrition-item">
                      <span class="label">Calories:</span>
                      <span class="value">480</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Protein:</span>
                      <span class="value">42g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Carbs:</span>
                      <span class="value">35g</span>
                    </div>
                    <div class="nutrition-item">
                      <span class="label">Fat:</span>
                      <span class="value">18g</span>
                    </div>
                  </div>
                </div>

                <div class="meal-footer">
                  <div class="cost-time">
                    <span class="cost">$12.50 AUD per serving</span>
                    <span class="time">25 mins</span>
                  </div>
                  <div class="health-tip">
                    <div class="tip-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                      </svg>
                    </div>
                    <span class="tip-text">Fatty fish like barramundi are excellent sources of vitamin D and omega-3 fatty acids.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <button 
        class="generate-btn" 
        @click="generateMealPlan"
        :disabled="loading || selectedMeals.length === 0"
      >
        {{ loading ? 'Generating...' : 'Generate My AI Meal Plan' }}
      </button>
    </div>

    <!-- Meal Plan Display (only when generated) -->
    <div v-if="mealPlan" class="meal-plan-display">
      <div class="meal-plan-content">
        <div class="plan-header">
          <h2>Your Personalised Meal Plan</h2>
          <div class="plan-actions">
            <button class="action-btn save">Save</button>
            <button class="action-btn share">Share</button>
            <button class="action-btn print">Print</button>
          </div>
        </div>

        <!-- Daily Meal Cards -->
        <div class="daily-meals">
          <div 
            v-for="day in mealPlan" 
            :key="day.day"
            class="day-card"
          >
            <div class="day-header">
              <h3 class="day-name">{{ day.day }}</h3>
              <div class="day-total">{{ day.totalVitaminD }} IU total per serving</div>
            </div>

            <div class="meals-list">
              <div 
                v-for="meal in day.meals" 
                :key="meal.type"
                class="meal-item"
              >
                <div class="meal-header">
                  <span class="meal-type">{{ meal.type }}</span>
                  <button class="swap-btn" @click="openSwapDialog(day.day, meal.type)">
                    Swap
                  </button>
                </div>
                <div class="meal-details">
                  <h4 class="meal-name">{{ meal.name }}</h4>
                  <div class="meal-info">
                    <span class="vitamin-d">{{ meal.vitaminD }} IU</span>
                    <span class="calories">{{ meal.calories }} cal</span>
                    <span class="prep-time">{{ meal.prepTime }} min</span>
                  </div>
                  <div class="meal-tags">
                    <span 
                      v-for="tag in meal.tags" 
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Swap Dialog -->
    <dialog ref="swapDialog" class="swap-dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>Swap {{ currentSwap.day }} - {{ currentSwap.mealType }}</h3>
          <button class="close-btn" @click="closeSwapDialog">×</button>
        </div>
        <div class="dialog-body">
          <input 
            v-model="searchQuery"
            placeholder="Search alternative meals..."
            class="search-input"
            @input="searchAlternatives"
          />
          <div class="alternatives-list">
            <div 
              v-for="alt in alternatives" 
              :key="alt.id"
              class="alternative-item"
              @click="swapMeal(alt)"
            >
              <div class="alt-name">{{ alt.name }}</div>
              <div class="alt-info">{{ alt.vitaminD }} IU - {{ alt.calories }} cal</div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { nutritionAPI } from '@/services/api'
import { Icon } from '@iconify/vue'

// Reactive data
const loading = ref(false)
const weeklyBudget = ref(150)
const selectedDiets = ref([])
const selectedMeals = ref(['breakfast', 'snacks'])
const mealPlan = ref(null)
const searchQuery = ref('')
const alternatives = ref([])
const currentSwap = ref({ day: '', mealType: '' })
const swapDialog = ref(null)
const showMealPlanPreview = ref(true)

// Options data
const dietaryOptions = ref([
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'lactose-free', label: 'Lactose-Free' },
  { id: 'keto', label: 'Keto' },
  { id: 'low-sodium', label: 'Low-Sodium' }
])

const mealTypes = ref([
  { id: 'breakfast', label: 'Breakfast', icon: 'B' },
  { id: 'lunch', label: 'Lunch', icon: 'L' },
  { id: 'dinner', label: 'Dinner', icon: 'D' },
  { id: 'snacks', label: 'Snacks', icon: 'S' }
])

// Methods
const toggleDiet = (dietId) => {
  const index = selectedDiets.value.indexOf(dietId)
  if (index > -1) {
    selectedDiets.value.splice(index, 1)
  } else {
    selectedDiets.value.push(dietId)
  }
}

const toggleMeal = (mealId) => {
  const index = selectedMeals.value.indexOf(mealId)
  if (index > -1) {
    selectedMeals.value.splice(index, 1)
  } else {
    selectedMeals.value.push(mealId)
  }
}

const getSelectedMealsText = () => {
  if (selectedMeals.value.length === 0) return 'None selected'
  return selectedMeals.value.map(id => 
    mealTypes.value.find(m => m.id === id)?.label
  ).join(', ')
}

const transformMealPlanData = (backendData) => {
  // Group meals by day
  const dayGroups = {}
  
  backendData.forEach(meal => {
    if (!dayGroups[meal.day]) {
      dayGroups[meal.day] = {
        day: meal.day,
        meals: [],
        totalVitaminD: 0
      }
    }
    
    const transformedMeal = {
      type: meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1),
      name: meal.food.name,
      vitaminD: meal.food.vitamin_d_per_100g || 0,
      calories: meal.food.calories_per_100g || 0,
      prepTime: Math.floor(Math.random() * 20) + 5, // Random prep time since not in backend
      tags: meal.food.description ? [meal.food.description.split(' ')[0]] : ['Healthy']
    }
    
    dayGroups[meal.day].meals.push(transformedMeal)
    dayGroups[meal.day].totalVitaminD += transformedMeal.vitaminD
  })
  
  // Convert to array and sort by day
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return dayOrder
    .filter(day => dayGroups[day])
    .map(day => dayGroups[day])
}

const generateMealPlan = async () => {
  loading.value = true
  try {
    // Call the real backend API
    const response = await nutritionAPI.getMealPlan()
    
    // Transform the backend data to match the frontend format
    const transformedData = transformMealPlanData(response)
    mealPlan.value = transformedData
    
  } catch (error) {
    console.error('Error generating meal plan:', error)
    // Fallback to mock data if API fails
    mealPlan.value = [
      {
        day: 'Day 1: Egg Protein Cereal Bowl',
        totalVitaminD: 245,
        meals: [
          {
            type: 'Breakfast',
            name: 'Vitamin D Fortified Cereal Bowl',
            vitaminD: 120,
            calories: 350,
            prepTime: 5,
            tags: ['Quick', 'High Protein']
          },
          {
            type: 'Snacks',
            name: 'Mixed Nuts & Seeds',
            vitaminD: 125,
            calories: 180,
            prepTime: 0,
            tags: ['Portable', 'Healthy Fats']
          }
        ]
      }
    ]
  } finally {
    loading.value = false
  }
}

const openSwapDialog = (day, mealType) => {
  currentSwap.value = { day, mealType }
  searchQuery.value = ''
  alternatives.value = []
  swapDialog.value.showModal()
  searchAlternatives()
}

const closeSwapDialog = () => {
  swapDialog.value.close()
}

const searchAlternatives = async () => {
  // Mock search - replace with actual API
  alternatives.value = [
    { id: 1, name: 'Salmon Fillet', vitaminD: 200, calories: 280 },
    { id: 2, name: 'Tuna Sandwich', vitaminD: 150, calories: 320 },
    { id: 3, name: 'Fortified Milk', vitaminD: 120, calories: 150 }
  ]
}

const swapMeal = (alternative) => {
  // Implement meal swapping logic
  console.log('Swapping meal:', alternative)
  closeSwapDialog()
}

onMounted(() => {
  // Initialize component
})
</script>

<style scoped>
.meal-planner {
  min-height: 100vh;
  background: #ffffff;
}

/* Jumbotron Styles */
.jumbotron {
  background: #ffffff;
  padding: 60px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  border-radius: 24px;
  margin: 24px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.jumbotron::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #16a34a;
  border-radius: 2px;
}

.jumbotron:hover {
  transform: translateY(-2px);
}

.jumbotron-content {
  max-width: 800px;
  margin: 0 auto;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.jumbotron-title {
  font-size: 3rem;
  font-weight: 700;
  color: #16a34a;
  margin: 0;
  line-height: 1.2;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.jumbotron-title:hover::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -20px;
  width: 60px;
  height: 3px;
  background: #16a34a;
  border-radius: 2px;
  animation: shortLineSlide 0.3s ease-out;
}

.jumbotron-title:hover::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%);
  border-radius: 2px;
  animation: longLineSlide 0.3s ease-out;
}

@keyframes shortLineSlide {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 60px;
    opacity: 1;
  }
}

@keyframes longLineSlide {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 120px;
    opacity: 1;
  }
}



.jumbotron-subtitle {
  font-size: 1.25rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  max-width: 600px;
}

.daily-goal-jumbotron {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

/* Main Content Container */
.main-content {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 0 24px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Left Configuration Panel */
.config-panel {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 20px 40px rgba(16, 185, 129, 0.15),
    0 8px 16px rgba(16, 185, 129, 0.08),
    0 0 0 1px rgba(16, 185, 129, 0.05);
  height: fit-content;
  border: 1px solid rgba(34, 197, 94, 0.1);
  transition: all 0.3s ease;
  position: sticky;
  top: 24px;
  width: 100%;
}

.config-panel:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 32px 64px rgba(16, 185, 129, 0.2),
    0 16px 32px rgba(16, 185, 129, 0.12),
    0 0 0 1px rgba(16, 185, 129, 0.08);
}



.daily-goal {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 24px;
}

.preferences-section {
  margin-bottom: 24px;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: stretch;
}

/* Responsive design */
@media (max-width: 1024px) {
  .preferences-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(34, 197, 94, 0.1);
}

.section-title svg {
  width: 24px;
  height: 24px;
  color: #16a34a;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2));
}

.preference-group {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 12px;
  border: 1px solid #bbf7d0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(34, 197, 94, 0.1);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.icon-text {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
  background: #dcfce7;
  padding: 4px 8px;
  border-radius: 6px;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.dietary-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  flex-grow: 1;
}

.diet-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.diet-btn:hover {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.05);
}

.diet-btn.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.diet-btn.restrictions {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.budget-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.budget-display {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.budget-amount {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.daily-budget {
  font-size: 14px;
  color: #64748b;
}

.budget-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.budget-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  cursor: pointer;
}

.meal-types-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.meal-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  flex-grow: 1;
}

.meal-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.meal-btn:hover {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.05);
}

.meal-btn.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.meal-icon {
  font-size: 24px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meal-btn.active .meal-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.meal-label {
  font-size: 14px;
  font-weight: 500;
}

.selected-info {
  padding: 12px;
  background: #dbeafe;
  border-radius: 8px;
  border: 1px solid #93c5fd;
}

.selected-text {
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
}

.generate-btn {
  width: 100%;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #34d399 100%);
  color: white;
  border: none;
  padding: 18px 28px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: 
    0 8px 20px rgba(16, 185, 129, 0.25),
    0 4px 8px rgba(16, 185, 129, 0.15);
  position: relative;
  overflow: hidden;
}

.generate-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.generate-btn:hover::before {
  left: 100%;
}

.generate-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%);
  transform: translateY(-3px);
  box-shadow: 
    0 16px 32px rgba(16, 185, 129, 0.35),
    0 8px 16px rgba(16, 185, 129, 0.25);
}

.generate-btn:active {
  transform: translateY(-1px);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 
    0 4px 8px rgba(16, 185, 129, 0.15),
    0 2px 4px rgba(16, 185, 129, 0.1);
}

.btn-icon {
  font-size: 14px;
  font-weight: 600;
}

/* Right Meal Plan Display */
.meal-plan-display {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 20px 40px rgba(16, 185, 129, 0.12),
    0 8px 16px rgba(16, 185, 129, 0.06),
    0 0 0 1px rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(34, 197, 94, 0.08);
  transition: all 0.3s ease;
  min-height: 600px;
  width: 100%;
  overflow-x: auto;
}

.meal-plan-display:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 24px 48px rgba(16, 185, 129, 0.15),
    0 12px 20px rgba(16, 185, 129, 0.08),
    0 0 0 1px rgba(16, 185, 129, 0.06);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}

.placeholder-content {
  text-align: center;
  color: #64748b;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #374151;
}

.placeholder-content p {
  font-size: 16px;
  max-width: 400px;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.plan-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.plan-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8fafc;
}

.daily-meals {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.day-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.day-header {
  background: #f8fafc;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.day-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.day-total {
  background: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.meals-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.meal-type {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.swap-btn {
  padding: 6px 12px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.meal-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.meal-info {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.meal-info span {
  font-size: 14px;
  color: #64748b;
}

.vitamin-d {
  font-weight: 600;
  color: #10b981 !important;
}

.meal-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #e2e8f0;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* Swap Dialog */
.swap-dialog {
  border: none;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90vw;
}

.swap-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
}

.dialog-body {
  padding: 16px;
}

.search-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 15px;
  background: rgba(240, 253, 244, 0.5);
  transition: all 0.3s ease;
  color: #065f46;
}

.search-input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 
    0 0 0 4px rgba(34, 197, 94, 0.1),
    0 4px 12px rgba(16, 185, 129, 0.15);
  background: #ffffff;
  transform: translateY(-1px);
}

.search-input::placeholder {
  color: rgba(6, 95, 70, 0.6);
}

.alternatives-list {
  max-height: 300px;
  overflow-y: auto;
}

.alternative-item {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.alternative-item:hover {
  background: #f8fafc;
  border-color: #3b82f6;
}

.alt-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.alt-info {
  font-size: 14px;
  color: #64748b;
}

/* Checkbox Group Styles */
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(240, 253, 244, 0.3);
  position: relative;
  overflow: hidden;
}

.checkbox-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-item:hover {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(240, 253, 244, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
}

.checkbox-item:hover::before {
  opacity: 1;
}

.checkbox-item.selected {
  border-color: #16a34a;
  background: rgba(240, 253, 244, 0.8);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.checkbox-item.selected::before {
  opacity: 1;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
}

.checkbox-item input[type="checkbox"] {
  margin: 0;
  width: 18px;
  height: 18px;
  accent-color: #16a34a;
  position: relative;
  z-index: 1;
}

.checkbox-item label {
  margin: 0;
  cursor: pointer;
  font-size: 15px;
  color: #065f46;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* Responsive Design */
/* When meal plan is displayed, use grid layout */
.main-content.has-meal-plan {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  align-items: start;
  padding: 0 24px 24px;
}

@media (max-width: 1200px) {
  .main-content.has-meal-plan {
    grid-template-columns: 350px 1fr;
    gap: 20px;
  }
  
  .jumbotron {
    padding: 50px 20px;
  }
  
  .jumbotron-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 1024px) {
  .main-content.has-meal-plan {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 20px 20px;
  }
  
  .main-content {
    flex-direction: column;
    align-items: center;
  }
  
  .config-panel {
    position: static;
  }
  
  .meal-plan-display {
    order: 1;
  }
  
  .jumbotron {
    padding: 40px 16px;
    margin-bottom: 24px;
  }
  
  .jumbotron-title {
    font-size: 2.25rem;
  }
  
  .jumbotron-subtitle {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .dietary-options {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .meal-types {
    grid-template-columns: 1fr;
  }
  
  .plan-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .day-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .meal-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .meal-info {
    flex-direction: column;
    gap: 4px;
  }
  
  .checkbox-group {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .meal-plan-preview {
    padding: 20px;
  }
  
  .meal-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .config-panel,
  .meal-plan-display {
    padding: 24px;
    border-radius: 16px;
  }
  
  .jumbotron {
    padding: 32px 16px;
  }
  
  .jumbotron-title {
    font-size: 2rem;
  }
  
  .title-icon {
    width: 50px;
    height: 50px;
  }
  
  .generate-btn {
    padding: 16px 24px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .dietary-options {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 0 16px 16px;
  }
  
  .jumbotron {
    padding: 24px 12px;
  }
  
  .jumbotron-title {
    font-size: 1.75rem;
  }
  
  .jumbotron-subtitle {
    font-size: 1rem;
  }
  
  .config-panel,
  .meal-plan-display {
    padding: 20px;
  }
  
  .checkbox-item {
    padding: 12px;
  }
  
  .meal-card {
    padding: 16px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Meal Plan Preview Styles */
.meal-plan-preview {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.preview-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.stat-badge.vitamin {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-badge.cost {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-badge.days {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.meal-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.meal-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.meal-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.meal-icon-wrapper {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.meal-info {
  flex: 1;
}

.meal-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.meal-type-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.vitamin-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.meal-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.ingredients-section h5,
.nutrition-section h5 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients-list li {
  padding: 4px 0;
  font-size: 14px;
  color: #64748b;
  position: relative;
  padding-left: 16px;
}

.ingredients-list li::before {
  content: '-';
  color: #3b82f6;
  position: absolute;
  left: 0;
  font-weight: bold;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 13px;
}

.nutrition-item .label {
  color: #64748b;
  font-weight: 500;
}

.nutrition-item .value {
  color: #1e293b;
  font-weight: 600;
}

.meal-footer {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.cost-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.cost {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
}

.time {
  font-size: 14px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 12px;
}

.health-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
}

.tip-icon {
  color: #8b5cf6;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-text {
  font-size: 13px;
  color: #5b21b6;
  line-height: 1.4;
}

/* Responsive adjustments for meal plan preview */
@media (max-width: 768px) {
  .meal-plan-preview {
    padding: 16px;
  }
  
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meal-details {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr;
  }
  
  .cost-time {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
