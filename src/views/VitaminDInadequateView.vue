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
  background: linear-gradient(135deg, #C7EED0 0%, #9BC7AF 100%);
  padding: 2rem;
}
</style>