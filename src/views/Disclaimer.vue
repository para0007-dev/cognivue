<script setup>
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="page-content disclaimer-page">
    <Header />
    <main class="disclaimer-container" role="main" aria-labelledby="disclaimer-title">
      <h1 id="disclaimer-title" class="disclaimer-title">Disclaimer</h1>
      <p class="disclaimer-text">
        Our Vitamin D evaluation is an estimated value based on general nutritional data and is for educational and informational purposes only.
        It does not constitute medical advice, diagnosis, or treatment.
        Please consult a qualified healthcare professional for personalised medical guidance.
      </p>
    </main>
  </div>
</template>

<style scoped>
.disclaimer-container {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 24px;
  text-align: justify;
  color: inherit; /* follow global font color */
}

.disclaimer-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  color: inherit;
}

.disclaimer-text {
  font-size: 16px;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .disclaimer-container {
    margin: 48px auto;
    padding: 0 16px;
  }
  .disclaimer-title { font-size: 24px; }
  .disclaimer-text { font-size: 15px; }
}
</style>