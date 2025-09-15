import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '@/views/HomePageView.vue'
import SunExposureView from '../views/SunExposureView.vue'
import TimerTestView from '../views/TimerTestView.vue'
import VitaminDQuestionnaireView from '@/views/VitaminDQuestionnaireView.vue'
import VitaminDResultView from '@/views/VitaminDResultView.vue'
import VitaminDInadequateView from '@/views/VitaminDInadequateView.vue'
import HealthImpactView from '@/views/HealthImpactView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePageView
  },
  {
    path: '/sun-exposure',
    name: 'SunExposure',
    component: SunExposureView
  },
  {
    path: '/timer-test',
    name: 'TimerTest',
    component: TimerTestView
  },
  {
    path: '/vitamin-d-questionnaire',
    name: 'VitaminDQuestionnaire',
    component: VitaminDQuestionnaireView
  },
  {
    path: '/vitamin-d-result',
    name: 'VitaminDResult',
    component: VitaminDResultView
  },
  {
    path: '/vitamin-d-inadequate',
    name: 'VitaminDInadequate',
    component: VitaminDInadequateView
  },
  {
    path: '/health-impact',
    name: 'HealthImpact',
    component: HealthImpactView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router