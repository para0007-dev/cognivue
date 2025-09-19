<template>
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">

          <h1 class="hero-title">
            <span class="title-main">Protect Your Brain with</span>
            <span class="title-highlight">Vitamin D</span>
          </h1>
          <p class="hero-subtitle">
            Research shows vitamin D deficiency can reduce brain volume and increase dementia risk. Track your vitamin D levels, sun exposure, and nutrition to protect your cognitive health.
          </p>
          <button class="cta-button" @click="goToQuestionnaire">
            Test Your Vitamin D Level
            <span class="button-arrow">&rarr;</span>
          </button>
          <p class="assessment-info">
            Quick 5-question assessment &bull; Takes 2 minutes
          </p>
        </div>
        <div class="hero-image">
          <img src="@/assets/images/bg-image.png" alt="Vitamin D and Brain Health" class="hero-img hero-img--base">
          <img src="@/assets/images/target-audience.png" alt="" aria-hidden="true" class="hero-img hero-img--hover">
        </div>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Hero',
  methods: {
    goToQuestionnaire() {
      this.$router.push('/vitamin-d-questionnaire')
    }
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
  padding: 4rem 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  max-width: 500px;
}



.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
}

.title-main {
  color: #2d3748;
}

.title-highlight {
  color: #16a34a;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-button {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.6);
  background: linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%);
}

.button-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .button-arrow {
  transform: translateX(5px);
}

.assessment-info {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 1rem;
  font-weight: 500;
}

.hero-image {
  position: relative;
  text-align: center;
  display: inline-block;   
  border-radius: 20px;
  overflow: hidden;        
}

.hero-img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform .3s ease, opacity .25s ease;
  will-change: transform, opacity;
}

/* stack the hover image on top, invisible by default */
.hero-img--hover {
  position: absolute;
  inset: 0;
  opacity: 0;
}

/* on hover: crossfade + scale */
.hero-image:hover .hero-img--hover { opacity: 1; }
.hero-image:hover .hero-img--base  { opacity: 0; }
.hero-image:hover .hero-img        { transform: scale(1.05); }

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    padding: 2rem 0;
    min-height: auto;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .brain-icon {
    width: 50px;
    height: 50px;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.5rem;
  }
  
  .brain-icon {
    width: 40px;
    height: 40px;
  }
  
  .hero-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  .cta-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>