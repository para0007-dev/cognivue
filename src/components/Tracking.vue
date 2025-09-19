<template>
  <section class="tracking-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Comprehensive Vitamin D Tracking</h2>
        <p class="section-description">
          Our website helps middle-aged Australians who work indoors monitor and improve their vitamin D levels for better brain health and cognitive protection.
        </p>
      </div>
      <div class="tracking-cards">
        <div class="tracking-card orange">
          <div class="card-icon orange-icon">
            <img :src="sunIcon" alt="Sun Icon" />
          </div>
          <h3>Sun Exposure Tracking</h3>
          <p>Monitor your daily safe sun exposure for optimal vitamin D production</p>
        </div>
        
        <div class="tracking-card green">
          <div class="card-icon green-icon">
            <img :src="foodIcon" alt="Food Icon" />
          </div>
          <h3>Nutrition Tracking</h3>
          <p>Log vitamin D-rich foods and track your daily intake in IU</p>
        </div>
        
        <div class="tracking-card blue">
          <div class="card-icon blue-icon">
            <img :src="brainIcon" alt="Brain Icon" />
          </div>
          <h3>Brain Health Insights</h3>
          <p>Learn how vitamin D protects your brain and cognitive function</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import sunIcon from '@/assets/images/sun-icon.svg'
import foodIcon from '@/assets/images/food-icon.svg'
import brainIcon from '@/assets/images/brain-icon.svg'
import gardenIcon from '@/assets/images/garden-icon.svg'

export default {
  name: 'Tracking',
  data() {
    return {
      sunIcon,
      foodIcon,
      brainIcon,
      gardenIcon
    }
  }
}
</script>

<style scoped>
.tracking-section {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f0fdf4 100%);
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tracking-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  align-items: start;
}

.tracking-card {
  padding: 32px 24px;
  border-radius: 12px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tracking-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.2);
}

.tracking-card.orange {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #16a34a;
}

.tracking-card.green {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #10b981;
}

.tracking-card.blue {
  background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
  border: 1px solid #059669;
}

.tracking-card.purple {
  background: linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%);
  border: 1px solid #65a30d;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card-icon img {
  width: 24px;
  height: 24px;
}

.orange-icon {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.green-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.blue-icon {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.purple-icon {
  background: linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(101, 163, 13, 0.3);
}

.tracking-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.3;
}

.tracking-card p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .tracking-section {
    padding: 60px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .tracking-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .tracking-card {
    padding: 24px 20px;
  }
  
  .tracking-card h3 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .tracking-section {
    padding: 40px 0;
  }
  
  .tracking-card {
    padding: 20px 16px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 16px;
  }
  
  .card-icon img {
    width: 20px;
    height: 20px;
  }
  
  .tracking-card h3 {
    font-size: 16px;
  }
  
  .tracking-card p {
    font-size: 13px;
  }
}
</style>