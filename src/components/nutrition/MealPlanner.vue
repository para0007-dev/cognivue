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
    <div class="main-content">
      <!-- Configuration Panel -->
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
          </div>

          <!-- Generate Button -->
          <div class="generate-section">
            <button 
              class="generate-btn" 
              @click="generateMealPlan"
              :disabled="loading"
            >
              {{ loading ? 'Generating...' : 'Generate My AI Meal Plan' }}
            </button>
          </div>
        </div>

        <!-- Meal Plan Display (only when generated) -->
        <div v-if="mealPlan" class="meal-plan-display">
          <div class="meal-plan-content">
            <div class="plan-header">
              <div class="plan-header-content">
                <div class="plan-title-section">
                  <div class="plan-icon">
                    <Icon icon="material-symbols:restaurant-menu-rounded" :width="32" :height="32" color="#16a34a" />
                  </div>
                  <div class="plan-title-text">
                    <h2 class="plan-title">Here's your personalised meal plan:</h2>
                    <p class="plan-subtitle">Carefully crafted to meet your vitamin D goals and dietary preferences</p>
                  </div>
                </div>
                <div class="plan-summary">
                  <div class="summary-card total-card">
                    <div class="summary-icon">
                      <Icon icon="material-symbols:payments-rounded" :width="20" :height="20" color="#059669" />
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Total Cost</span>
                      <span class="summary-value">${{ totalCost.toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="summary-card budget-card">
                    <div class="summary-icon">
                      <Icon icon="material-symbols:account-balance-wallet-rounded" :width="20" :height="20" color="#0369a1" />
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Weekly Budget</span>
                      <span class="summary-value">${{ weeklyBudget.toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="summary-card status-card" :class="budgetStatusClass">
                    <div class="summary-icon">
                      <Icon v-if="budgetStatusClass === 'within-budget'" icon="material-symbols:check-circle-rounded" :width="20" :height="20" color="#059669" />
                      <Icon v-else icon="material-symbols:warning-rounded" :width="20" :height="20" color="#dc2626" />
                    </div>
                    <div class="summary-content">
                      <span class="summary-label">Budget Status</span>
                      <span class="summary-value">{{ budgetStatus }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Meal Cards -->
            <div class="meal-cards-container">
              <div 
                v-for="meal in mealPlan" 
                :key="meal.type"
                class="meal-card"
              >
                <div class="meal-card-header">
                  <div class="meal-image-container">
                    <div class="meal-image-placeholder">
                      <!-- Image interface reserved for backend integration -->
                      <div class="image-placeholder">
                        <Icon icon="material-symbols:restaurant" :width="32" :height="32" color="#9CA3AF" />
                        <span class="placeholder-text">{{ meal.type }} Image</span>
                      </div>
                    </div>
                    <div class="meal-type-badge">{{ meal.type }}</div>
                  </div>
                  
                  <div class="meal-header-info">
                    <h3 class="meal-title">{{ meal.name }}</h3>
                    <div class="meal-stats-grid">
                      <div class="stat-item vitamin-stat">
                        <Icon icon="material-symbols:vitamins" :width="16" :height="16" color="#f59e0b" />
                        <span class="stat-label">Vitamin D</span>
                        <span class="stat-value">{{ meal.vitaminDUnit }}</span>
                      </div>
                      <div class="stat-item time-stat">
                        <Icon icon="material-symbols:schedule" :width="16" :height="16" color="#3b82f6" />
                        <span class="stat-label">Prep Time</span>
                        <span class="stat-value">{{ meal.prepTime }} min</span>
                      </div>
                      <div class="stat-item cost-stat">
                        <Icon icon="material-symbols:attach-money" :width="16" :height="16" color="#059669" />
                        <span class="stat-label">Cost</span>
                        <span class="stat-value">${{ meal.cost.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="meal-card-body">
                  <div class="meal-details-grid">
                    <div class="ingredients-section">
                      <div class="section-header">
                        <Icon icon="material-symbols:grocery" :width="20" :height="20" color="#059669" />
                        <h4 class="section-title">Ingredients</h4>
                      </div>
                      <ul class="ingredients-list">
                        <li v-for="ingredient in meal.ingredients" :key="ingredient" class="ingredient-item">
                          <Icon icon="material-symbols:check-circle" :width="14" :height="14" color="#059669" />
                          <span>{{ ingredient }}</span>
                        </li>
                      </ul>
                    </div>

                    <div class="recipe-section">
                      <div class="section-header">
                        <Icon icon="material-symbols:menu-book" :width="20" :height="20" color="#3b82f6" />
                        <h4 class="section-title">Recipe Steps</h4>
                      </div>
                      <ol class="recipe-steps">
                        <li v-for="(step, index) in meal.recipe" :key="index" class="recipe-step">
                          {{ step }}
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div class="meal-footer">
                    <div class="meal-tags">
                      <span 
                        v-for="tag in meal.tags" 
                        :key="tag"
                        class="tag"
                      >
                        {{ tag }}
                      </span>
                    </div>
                    <button class="action-button">
                      <Icon icon="material-symbols:favorite-border" :width="16" :height="16" />
                      Save Recipe
                    </button>
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

const mealPlan = ref(null)
const searchQuery = ref('')
const alternatives = ref([])
const currentSwap = ref({ day: '', mealType: '' })
const swapDialog = ref(null)

// Options data
const dietaryOptions = ref([
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'lactose-free', label: 'Lactose-Free' },
  { id: 'keto', label: 'Keto' },
  { id: 'low-sodium', label: 'Low-Sodium' }
])

// Computed properties
const totalCost = computed(() => {
  if (!mealPlan.value) return 0
  return mealPlan.value.reduce((total, meal) => total + meal.cost, 0)
})

const budgetStatus = computed(() => {
  const total = totalCost.value
  const budget = weeklyBudget.value
  if (total <= budget) return 'Within budget'
  return 'Over budget'
})

const budgetStatusClass = computed(() => {
  const total = totalCost.value
  const budget = weeklyBudget.value
  return total <= budget ? 'within-budget' : 'over-budget'
})

// Methods
const toggleDiet = (dietId) => {
  const index = selectedDiets.value.indexOf(dietId)
  if (index > -1) {
    selectedDiets.value.splice(index, 1)
  } else {
    selectedDiets.value.push(dietId)
  }
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
  
  // Simulate short loading time to show loading state
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Using mock data for frontend template - your teammate can replace with real API call later
  // const response = await nutritionAPI.getMealPlan()
  // const transformedData = transformMealPlanData(response)
  // mealPlan.value = transformedData
  
  // Current mock data for style template
  mealPlan.value = [
      {
        type: 'Breakfast',
        name: 'Smoked Salmon & Avocado Toast',
        vitaminD: 10.5,
        vitaminDUnit: '420 IU',
        prepTime: 10,
        cost: 6.00,
        ingredients: [
          '80 g Smoked salmon',
          '2 slice Wholegrain bread',
          '0.5 Avocado',
          '1 tbsp Cream cheese'
        ],
        recipe: [
          'Toast the bread slices.',
          'Spread cream cheese on each slice.',
          'Top with sliced avocado.',
          'Arrange smoked salmon on top.',
          'Serve immediately.'
        ],
        tags: ['budget-friendly', 'meal', 'mid-age', 'vitamin d', 'au'],
        image: '/api/placeholder/300/200'
      },
      {
        type: 'Lunch',
        name: 'Spinach & Feta Egg Bake',
        vitaminD: 3.2,
        vitaminDUnit: '128 IU',
        prepTime: 25,
        cost: 4.00,
        ingredients: [
          '3 Eggs',
          '100 g Fresh spinach',
          '30 g Feta cheese',
          '50 ml Milk'
        ],
        recipe: [
          'Preheat oven to 180°C.',
          'Whisk eggs with milk, salt, and pepper.',
          'Stir in chopped spinach and crumbled feta.',
          'Pour mixture into a greased baking dish.',
          'Bake for 20-25 minutes until set.'
        ],
        tags: ['vegetarian', 'protein', 'vitamin d', 'healthy'],
        image: '/api/placeholder/300/200'
      },
      {
        type: 'Dinner',
        name: 'Grilled Barramundi with Herbs',
        vitaminD: 8.7,
        vitaminDUnit: '348 IU',
        prepTime: 30,
        cost: 12.50,
        ingredients: [
          '200 g Barramundi fillet',
          '1 tbsp Olive oil',
          '1 Lemon (juiced)',
          'Fresh herbs (parsley, dill)',
          '150 g Sweet potato'
        ],
        recipe: [
          'Preheat grill to medium-high heat.',
          'Season fish with salt, pepper, and herbs.',
          'Brush with olive oil and lemon juice.',
          'Grill for 4-5 minutes each side.',
          'Serve with roasted sweet potato.'
        ],
        tags: ['seafood', 'omega-3', 'vitamin d', 'healthy'],
        image: '/api/placeholder/300/200'
      }
    ]
  
  loading.value = false
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
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 30%, #f1f5f9 70%, #e2e8f0 100%);
  position: relative;
}

.meal-planner::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* Jumbotron Styles */
.jumbotron {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  padding: 80px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 32px;
  margin: 24px;
  margin-bottom: 40px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.jumbotron::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ff8c00 0%, #ffa500 50%, #ff8c00 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.jumbotron::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.03) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

.jumbotron:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 16px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
}

/* Page Load Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Apply animations to elements */
.jumbotron {
  animation: fadeInUp 0.8s ease-out;
}

.config-panel {
  animation: fadeInLeft 0.8s ease-out 0.2s both;
}

.meal-plan-display {
  animation: fadeInRight 0.8s ease-out 0.4s both;
}

.preference-group {
  animation: fadeInUp 0.6s ease-out calc(0.1s * var(--animation-order, 0)) both;
}

.meal-card {
  animation: scaleIn 0.6s ease-out calc(0.1s * var(--animation-order, 0)) both;
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
  background: #ff8c00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: pulse 2s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.title-icon:hover {
  transform: scale(1.1) rotate(10deg);
  animation-play-state: paused;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 140, 0, 0);
  }
}

.jumbotron-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-shadow: 0 4px 8px rgba(22, 163, 74, 0.2);
  letter-spacing: -0.02em;
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
  background: #ff8c00;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
}

/* Main Content Container */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 24px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Configuration Panel */
.config-panel {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 20px 40px rgba(16, 185, 129, 0.15),
    0 8px 16px rgba(16, 185, 129, 0.08),
    0 0 0 1px rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.1);
  transition: all 0.3s ease;
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
  background: #ff8c00;
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

.generate-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 24px;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
  max-width: 1000px;
  margin: 0 auto;
}

/* Responsive design */
@media (max-width: 1024px) {
  .preferences-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 600px;
  }
  
  .preference-group {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .preferences-grid {
    gap: 16px;
  }
  
  .preference-group {
    padding: 20px;
  }
  
  .dietary-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .group-title {
    font-size: 15px;
  }
  
  .budget-amount {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .dietary-options {
    grid-template-columns: 1fr;
  }
  
  .diet-btn {
    padding: 14px 16px;
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
  padding: 28px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.08), 0 2px 4px rgba(34, 197, 94, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.preference-group::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #16a34a, #22c55e);
  opacity: 0.8;
}

.preference-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.12), 0 4px 8px rgba(34, 197, 94, 0.08);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.1);
}

.icon-text {
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  padding: 6px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.1);
}

.group-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  flex: 1;
  margin: 0;
}

.dietary-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  flex-grow: 1;
  margin-top: 8px;
}

.diet-btn {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.diet-btn:hover {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.diet-btn.active {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  border-color: #16a34a;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
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
  gap: 20px;
  flex-grow: 1;
  margin-top: 8px;
}

.budget-display {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.1);
}

.budget-amount {
  font-size: 20px;
  font-weight: 800;
  color: #16a34a;
  letter-spacing: -0.5px;
}

.daily-budget {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
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
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e2e8f0 0%, #e2e8f0 100%);
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.budget-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
  transition: all 0.3s ease;
}

.budget-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
}

.budget-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(22, 163, 74, 0.3);
}



.generate-btn {
  width: 100%;
  background: #16a34a;
  color: white;
  border: none;
  padding: 20px 32px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.generate-btn:hover:not(:disabled) {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
}

.generate-btn:active {
  transform: translateY(0);
  transition: all 0.1s ease;
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-icon {
  font-size: 14px;
  font-weight: 600;
}

/* Meal Plan Display */
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
  margin-top: 24px;
  width: 100%;
  overflow-x: auto;
}

/* Plan Summary Styles */
.plan-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.total-card .summary-icon {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
}

.budget-card .summary-icon {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

.status-card .summary-icon {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.status-card.over-budget .summary-icon {
  background: linear-gradient(135deg, #fef2f2, #fecaca);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.status-card.within-budget .summary-value {
  color: #059669;
}

.status-card.over-budget .summary-value {
  color: #dc2626;
}

/* Meal Cards Container */
.meal-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Individual Meal Card */
.meal-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.meal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.meal-card-header {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.meal-image-container {
  position: relative;
}

.meal-image-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.meal-card:hover .meal-image-placeholder {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748b;
  transition: color 0.3s ease;
}

.meal-card:hover .image-placeholder {
  color: #3b82f6;
}

.placeholder-text {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.meal-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.meal-type-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  flex-shrink: 0;
}

.meal-name {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.025em;
}

.meal-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 4px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-item-enhanced {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-item-enhanced:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.stat-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.stat-icon.vitamin-d {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.stat-icon.prep-time {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-icon.cost {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0;
  font-weight: 500;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.meal-card-body {
  padding: 24px;
  background: white;
}

.meal-section {
  margin-bottom: 24px;
}

.meal-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.meal-footer {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
}

.save-recipe-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.save-recipe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.ingredients-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ingredient-item:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.ingredient-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;
  flex-shrink: 0;
}

.recipe-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;
}

.recipe-step {
  counter-increment: step-counter;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  padding-left: 50px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  transition: all 0.3s ease;
}

.recipe-step:hover {
  color: #1e293b;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  margin: 0 -16px;
  padding-left: 66px;
  padding-right: 16px;
  border-radius: 8px;
}

.recipe-step:last-child {
  border-bottom: none;
}

.recipe-step::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 16px;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.meal-plan-display:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 24px 48px rgba(16, 185, 129, 0.15),
    0 12px 20px rgba(16, 185, 129, 0.08),
    0 0 0 1px rgba(16, 185, 129, 0.06);
}

/* Animation keyframes */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Meal card entrance animations */
.meal-card {
  animation: slideInUp 0.6s ease-out;
}

.meal-card:nth-child(1) { animation-delay: 0.1s; }
.meal-card:nth-child(2) { animation-delay: 0.2s; }
.meal-card:nth-child(3) { animation-delay: 0.3s; }

/* Summary card animations */
.summary-card {
  animation: fadeInScale 0.5s ease-out;
}

.summary-card:nth-child(1) { animation-delay: 0.1s; }
.summary-card:nth-child(2) { animation-delay: 0.2s; }
.summary-card:nth-child(3) { animation-delay: 0.3s; }

/* Icon hover effects */
.stat-icon:hover {
  animation: pulse 1.5s infinite;
}

.section-icon:hover {
  animation: pulse 1.5s infinite;
}

/* Button click effects */
.save-recipe-btn:active {
  transform: translateY(-1px) scale(0.98);
}

/* Meal type badge hover effects */
.meal-type-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
  margin-bottom: 32px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
}

.plan-header-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.plan-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.plan-icon {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  border: 2px solid #bbf7d0;
}

.plan-title-text {
  flex: 1;
}

.plan-title {
  font-size: 28px;
  font-weight: 700;
  color: #064e3b;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.plan-subtitle {
  font-size: 16px;
  color: #059669;
  margin: 0;
  font-weight: 500;
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
  padding: 8px 16px;
  background: #ff8c00;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 140, 0, 0.2);
}

.swap-btn:hover {
  background: #ff7f00;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 140, 0, 0.3);
}

.swap-btn:active {
  transform: translateY(0);
  transition: all 0.1s ease;
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
  font-size: 14px;
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
  
  /* Plan header responsive */
  .plan-header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .plan-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .summary-card {
    padding: 16px;
  }
  
  .summary-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  /* Meal card responsive */
  .meal-card-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    text-align: center;
  }
  
  .meal-image-placeholder {
    width: 120px;
    height: 120px;
    align-self: center;
  }
  
  .meal-header-info {
    align-items: center;
    text-align: center;
  }
  
  .meal-title {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .meal-stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-item-enhanced {
    justify-content: center;
    padding: 12px 16px;
  }
  
  .ingredients-list {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .ingredient-item {
    padding: 10px 14px;
    justify-content: center;
  }
  
  .recipe-step {
    padding-left: 40px;
    font-size: 13px;
  }
  
  .recipe-step::before {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
  
  .meal-card-body {
    padding: 20px;
  }
  
  .meal-footer {
    padding: 16px 20px;
  }
  
  .save-recipe-btn {
    padding: 10px 20px;
    font-size: 13px;
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
    font-size: 14px;
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
    padding: 16px;
  }
  
  /* Plan header mobile */
  .plan-header {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .plan-title {
    font-size: 20px;
  }
  
  .plan-subtitle {
    font-size: 12px;
  }
  
  .plan-icon {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
  .summary-card {
    padding: 12px;
  }
  
  .summary-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .summary-label {
    font-size: 9px;
  }
  
  .summary-value {
    font-size: 12px;
  }
  
  /* Meal card mobile */
  .meal-card-header {
    padding: 16px;
    gap: 12px;
  }
  
  .meal-image-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .meal-name {
    font-size: 18px;
  }
  
  .meal-type-badge {
    padding: 4px 10px;
    font-size: 10px;
  }
  
  .stat-item-enhanced {
    padding: 8px 12px;
    gap: 6px;
  }
  
  .stat-icon {
    width: 16px;
    height: 16px;
    font-size: 8px;
  }
  
  .stat-label {
    font-size: 9px;
  }
  
  .stat-value {
    font-size: 11px;
  }
  
  .meal-card-body {
    padding: 16px;
  }
  
  .section-title {
    font-size: 14px;
    gap: 8px;
  }
  
  .section-icon {
    width: 16px;
    height: 16px;
    font-size: 8px;
  }
  
  .ingredient-item {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .ingredient-icon {
    width: 14px;
    height: 14px;
    font-size: 7px;
  }
  
  .recipe-step {
    padding-left: 35px;
    font-size: 12px;
  }
  
  .recipe-step::before {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  .meal-footer {
    padding: 12px 16px;
  }
  
  .save-recipe-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .checkbox-item {
    padding: 12px;
  }
  
  .nutrition-grid {
    grid-template-columns: 1fr 1fr;
  }
}


</style>
