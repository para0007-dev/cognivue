import { createRouter, createWebHistory } from 'vue-router'

// Views you actually have
import LoginView from '@/views/LoginView.vue'
import HomePageView from '@/views/HomePageView.vue'
import LetsGetOutsideView from '@/views/LetsGetOutsideView.vue'
import TimerTestView from '@/views/TimerTestView.vue'
import VitaminDQuestionnaireView from '@/views/VitaminDQuestionnaireView.vue'
import VitaminDResultView from '@/views/VitaminDResultView.vue'
import VitaminDInadequateView from '@/views/VitaminDInadequateView.vue'
import HealthImpactView from '@/views/HealthImpactView.vue'
import MealPlannerView from '@/views/MealPlannerView.vue'
import DataAwareness from '@/views/DataAwareness.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: HomePageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sun-exposure',
    name: 'LetsGetOutside',
    component: LetsGetOutsideView,
    meta: { requiresAuth: true }
  },
  {
    path: '/nutrition',
    name: 'MealPlanner',
    component: MealPlannerView,
    meta: { requiresAuth: true }
  },
  {
    path: '/timer-test',
    name: 'TimerTest',
    component: TimerTestView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vitamin-d-questionnaire',
    name: 'VitaminDQuestionnaire',
    component: VitaminDQuestionnaireView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vitamin-d-result',
    name: 'VitaminDResult',
    component: VitaminDResultView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vitamin-d-inadequate',
    name: 'VitaminDInadequate',
    component: VitaminDInadequateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/health-impact',
    name: 'HealthImpact',
    component: HealthImpactView,
    meta: { requiresAuth: true }
  },
  {
    path: '/data-awareness',
    name: 'DataAwareness',
    component: DataAwareness,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔒 Route guard
router.beforeEach((to, from, next) => {
  const loggedIn = sessionStorage.getItem("logged_in") === "true"

  // If route requires authentication and user not logged in → redirect
  if (to.meta.requiresAuth && !loggedIn) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // If already logged in and trying to go to /login → send to home
  if (to.name === 'Login' && loggedIn) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
