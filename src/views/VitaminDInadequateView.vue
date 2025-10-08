<template>
  <div class="vitamin-d-result">
    <VitaminDResultView :isInadequate="true" />
  </div>
</template>

<script>
import VitaminDResultView from './VitaminDResultView.vue'

export default {
  name: 'VitaminDInadequateView',
  components: {
    VitaminDResultView
  }
}
</script>

<style scoped>
.vitamin-d-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); /* orange pastel */
}
</style>