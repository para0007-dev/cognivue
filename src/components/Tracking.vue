<template>
  <section class="tracking-section">
    <!-- Background decoration elements -->
    <div class="background-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
    </div>
    
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-gradient">Comprehensive</span>
          <span class="title-highlight">Vitamin D Tracking</span>
        </h2>
        <p class="section-description">
          Our website helps middle-aged Australians who work indoors monitor and improve their vitamin D levels for better brain health and cognitive protection.
        </p>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-dot"></div>
          <div class="decoration-line"></div>
        </div>
      </div>
      
      <div class="tracking-cards">
        <div class="tracking-card orange" data-aos="fade-up" data-aos-delay="100" @click="goToLetsGetOutside">
          <div class="card-glow orange-glow"></div>
          <div class="card-icon orange-icon">
            <Icon icon="wi:day-sunny" :width="48" :height="48" />
          </div>
          <h3>Let's Get Outside Tracking</h3>
          <p>Monitor your daily safe sun exposure for optimal vitamin D production</p>
          <div class="card-footer">
            <span class="learn-more">Learn More &rarr;</span>
          </div>
        </div>
        
        <div class="tracking-card green" data-aos="fade-up" data-aos-delay="200" @click="goToMealPlanner">
          <div class="card-glow green-glow"></div>
          <div class="card-icon green-icon">
            <Icon icon="material-symbols:restaurant" :width="48" :height="48" />
          </div>
          <h3>Meal Planner</h3>
          <p>Log vitamin D-rich foods and track your daily intake in IU</p>
          <div class="card-footer">
            <span class="learn-more">Learn More &rarr;</span>
          </div>
        </div>
        
        <div class="tracking-card blue" data-aos="fade-up" data-aos-delay="300" @click="goToEducationHub">
          <div class="card-glow blue-glow"></div>
          <div class="card-icon blue-icon">
            <Icon icon="mdi:brain" :width="48" :height="48" />
          </div>
          <h3>Brain Health Insights</h3>
          <p>Learn how vitamin D protects your brain and cognitive function</p>
          <div class="card-footer">
            <span class="learn-more">Learn More &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'Tracking',
  components: {
    Icon
  },
  methods: {
    goToLetsGetOutside() {
      this.$router.push('/sun-exposure')
    },
    goToMealPlanner() {
      this.$router.push('/nutrition')
    },
    goToEducationHub() {
      this.$router.push('/data-awareness')
    }
  }
}
</script>

<style scoped>
.tracking-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #f0fdf4 75%, #dcfce7 100%);
  padding: 100px 0;
  position: relative;
  overflow: hidden;
}

/* Background decoration elements */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #10b981, #059669);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #f59e0b, #d97706);
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.container {
  max-width: 1400px; /* widen container for desktop */
  margin: 0 auto;
  padding: 0 12px; /* reduce side padding so cards get closer to edges */
  position: relative;
  z-index: 2;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}



.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.2;
}

.title-gradient {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-highlight {
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-top: 8px;
}

.section-description {
  font-size: 1.25rem;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto 32px;
  line-height: 1.7;
  font-weight: 400;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.decoration-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
}

.decoration-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.tracking-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  align-items: start;
}

.tracking-card {
  padding: 40px 32px;
  border-radius: 20px;
  text-align: left;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  cursor: pointer;
}

.tracking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  z-index: 1;
}

.tracking-card > * {
  position: relative;
  z-index: 2;
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.tracking-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.tracking-card:hover .card-glow {
  opacity: 1;
}

.tracking-card.orange {
  background: linear-gradient(135deg, rgba(255, 237, 213, 0.9) 0%, rgba(254, 215, 170, 0.9) 100%);
}

.orange-glow {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.tracking-card.green {
  background: linear-gradient(135deg, rgba(220, 252, 231, 0.9) 0%, rgba(187, 247, 208, 0.9) 100%);
}

.green-glow {
  background: linear-gradient(135deg, #10b981, #059669);
}

.tracking-card.blue {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.9) 100%);
}

.blue-glow {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  position: relative;
}

.card-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tracking-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.tracking-card:hover .card-icon::before {
  opacity: 1;
}

.card-icon img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.orange-icon {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
}

.orange-icon::before {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.green-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.green-icon::before {
  background: linear-gradient(135deg, #10b981, #059669);
}

.blue-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.blue-icon::before {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.tracking-card h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.tracking-card:hover h3 {
  color: #0f172a;
}

.tracking-card p {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 24px 0;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
  padding-top: 20px;
}

.learn-more {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.learn-more:hover {
  color: #059669;
  transform: translateX(4px);
}

/* Responsive design */
@media (max-width: 1024px) {
  .tracking-cards {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .floating-shape {
    opacity: 0.05;
  }
}

@media (max-width: 768px) {
  .tracking-section {
    padding: 80px 0 60px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .section-header {
    margin-bottom: 60px;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .section-description {
    font-size: 1.125rem;
    max-width: 100%;
  }
  
  .tracking-cards {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .tracking-card {
    padding: 32px 24px;
  }
  
  .tracking-card:hover {
    transform: translateY(-8px) scale(1.01);
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }
  
  .card-icon img {
    width: 28px;
    height: 28px;
  }
  
  .tracking-card h3 {
    font-size: 22px;
  }
  
  .tracking-card p {
    font-size: 15px;
  }
  
  .floating-shape {
    display: none;
  }
}

@media (max-width: 480px) {
  .tracking-section {
    padding: 60px 0 40px;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  

  
  .section-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  .section-description {
    font-size: 1rem;
    margin-bottom: 24px;
  }
  
  .title-decoration {
    margin-top: 24px;
  }
  
  .decoration-line {
    width: 40px;
  }
  
  .tracking-cards {
    gap: 20px;
  }
  
  .tracking-card {
    padding: 24px 20px;
    border-radius: 16px;
  }
  
  .tracking-card:hover {
    transform: translateY(-6px);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    margin-bottom: 20px;
  }
  
  .card-icon img {
    width: 24px;
    height: 24px;
  }
  
  .tracking-card h3 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .tracking-card p {
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .card-footer {
    padding-top: 16px;
  }
  
  .learn-more {
    font-size: 13px;
  }
}
@media (min-width: 1440px) {
  .container {
    max-width: none; /* allow full-width on wide desktop */
    width: 100%;
    padding: 0 8px; /* very small side padding to get closer to page edges */
  }
}
</style>