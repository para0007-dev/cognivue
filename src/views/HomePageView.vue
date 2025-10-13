<template>
  <div class="home-page page-content">
    <Header />
    <Hero />
    <Stats />
    <Tracking />
    <BrainHealth />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Hero from '@/components/Hero.vue'
import Stats from '@/components/Stats.vue'
import Tracking from '@/components/Tracking.vue'
import BrainHealth from '@/components/BrainHealth.vue'

export default {
  name: 'HomePageView',
  components: {
    Header,
    Hero,
    Stats,
    Tracking,
    BrainHealth
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}
</style>