<template>
  <div class="health-impact-page page-content">
    <Header />
    <main class="main-content">
      <div class="container">
        <!-- Title Section -->
        <div class="title-section">
          <h1 class="page-title">Health Impact Research</h1>
          <p class="page-description">
            Explore the scientific evidence behind vitamin D's profound impact on brain health, cognitive
            function, and dementia prevention.
          </p>
        </div>

        <!-- Brain Protection Section -->
        <div class="protection-section">
          <div class="section-header">
            <h2 class="section-title">How Vitamin D Protects Your Brain</h2>
            <p class="section-subtitle">Understanding the critical connection between vitamin D and cognitive function</p>
          </div>
          
          <div class="protection-items">
            <!-- Hippocampus Protection -->
             <div class="protection-item">
               <div class="item-icon">
                 <Icon icon="mdi:brain" :width="24" :height="24" color="#10b981" />
               </div>
               <div class="item-content">
                 <h3>Hippocampus Protection</h3>
                 <p>Maintains brain volume and structure critical for memory formation</p>
                 <button class="research-button">Read Research Paper</button>
               </div>
             </div>

             <!-- Cognitive Protection -->
             <div class="protection-item">
               <div class="item-icon">
                 <Icon icon="material-symbols:shield" :width="24" :height="24" color="#3b82f6" />
               </div>
               <div class="item-content">
                 <h3>Cognitive Protection</h3>
                 <p>Reduces risk of cognitive decline and dementia</p>
                 <button class="research-button">Read Research Paper</button>
               </div>
             </div>

             <!-- Stroke Prevention -->
             <div class="protection-item">
               <div class="item-icon">
                 <Icon icon="material-symbols:favorite" :width="24" :height="24" color="#ef4444" />
               </div>
               <div class="item-content">
                 <h3>Stroke Prevention</h3>
                 <p>Supports vascular health and reduces stroke risk</p>
                 <button class="research-button">Read Research Paper</button>
               </div>
             </div>

             <!-- Mental Performance -->
             <div class="protection-item">
               <div class="item-icon">
                 <Icon icon="material-symbols:psychology" :width="24" :height="24" color="#8b5cf6" />
               </div>
               <div class="item-content">
                 <h3>Mental Performance</h3>
                 <p>Improves processing speed and executive function</p>
                 <button class="research-button">Read Research Paper</button>
               </div>
             </div>
          </div>
        </div>

        <!-- Research Insights Section -->
        <div class="insights-section">

        </div>

        <!-- Health Information Section -->
        <div class="health-info-section">
          
          <!-- Test Your Vitamin D Level Card -->
          <div class="test-vitamin-d-card">
            <div class="test-card-icon">
              <Icon icon="material-symbols:science" :width="48" :height="48" color="#10b981" />
            </div>
            <div class="test-card-content">
              <h3>Test Your Vitamin D Level</h3>
              <p>Review your vitamin D status and personalized recommendations for brain health protection.</p>
              <router-link to="/vitamin-d-questionnaire" class="test-btn">
                 View Your Vitamin D Level
               </router-link>
              <p class="previous-results" @click="goToPreviousResults">View your previous assessment results</p>
            </div>
          </div>
          

        </div>

        <!-- Key Statistics & Evidence Section -->
        <div class="statistics-section">
          <div class="statistics-header">
            <div class="statistics-icon">
              <Icon icon="material-symbols:analytics" :width="24" :height="24" color="#8b5cf6" />
            </div>
            <h2>Key Statistics & Evidence</h2>
          </div>
          
          <div class="statistics-grid">
            <div class="stat-card optimal-levels">
              <div class="stat-header">
                <div class="stat-icon success">
                  <Icon icon="material-symbols:check" :width="16" :height="16" color="#10b981" />
                </div>
                <h3>Optimal Levels</h3>
              </div>
              <ul class="stat-list">
                <li>17% lower dementia risk</li>
                <li>Optimal cognitive function</li>
                <li>Enhanced hippocampus size</li>
              </ul>
            </div>
            
            <div class="stat-card global-impact">
              <div class="stat-header">
                <div class="stat-icon warning">
                  <Icon icon="material-symbols:warning" :width="16" :height="16" color="#ef4444" />
                </div>
                <h3>Global Impact</h3>
              </div>
              <ul class="stat-list">
                <li>1+ billion people deficient worldwide</li>
                <li>487,500 Australians with dementia</li>
                <li>Risk increases with age</li>
              </ul>
            </div>
          </div>
          
          <div class="learn-more">
            <a href="#" class="learn-more-link">Learn More</a>
          </div>
        </div>

        <!-- Medical Disclaimer Section -->
        <div class="disclaimer-section">
          <div class="disclaimer-header">
            <div class="disclaimer-icon">
              <Icon icon="material-symbols:info" :width="20" :height="20" color="#f59e0b" />
            </div>
            <h3>Medical Disclaimer</h3>
          </div>
          <p class="disclaimer-text">
            The information provided on this website is for educational and informational purposes only and does not constitute medical advice. It is not intended to diagnose, treat, cure, or prevent any disease or health condition. Always consult with a qualified healthcare provider before making any decisions about your health, including vitamin D supplementation or treatment plans. Individual results may vary, and any health-related decisions should be made in consultation with your doctor or healthcare professional.
          </p>
        </div>

        
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { Icon } from '@iconify/vue'

export default {
  name: 'HealthImpactView',
  components: {
    Header,
    Icon
  },
  methods: {
    goToPreviousResults() {
      this.$router.push('/vitamin-d-result')
    }
  }
}
</script>

<style scoped>
.health-impact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
  position: relative;
}

.health-impact-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: radial-gradient(ellipse at top, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Title Section */
.title-section {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  from {
    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3));
  }
  to {
    filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.5));
  }
}

.page-description {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.highlight {
  color: #16a34a;
  font-weight: 600;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
}

/* Protection Section */
.protection-section {
  margin-bottom: 5rem;
}

.protection-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.protection-item {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.protection-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #34d399);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.protection-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.protection-item:hover::before {
  transform: scaleX(1);
}

.item-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.protection-item:hover .item-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.item-content {
  flex: 1;
}

.item-content h3 {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.item-content p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.research-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.research-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.research-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}

.research-button:hover::before {
  left: 100%;
}

/* Research Insights Section */
.insights-section {
  margin-bottom: 5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.research-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.1);
  border: 1px solid #bbf7d0;
}

.research-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.research-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.university {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

blockquote {
  font-size: 1rem;
  font-style: italic;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  padding: 1.25rem;
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  border-radius: 0 8px 8px 0;
}

.statistic {
  padding: 1rem;
  background-color: #eff6ff;
  border-radius: 8px;
}

.stat-text {
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0;
  font-weight: 500;
}

/* Health Information Section */
.health-info-section {
  margin-bottom: 5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.symptoms-list, .levels-info, .sources-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.symptom-item, .level-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.level-label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

.level-value {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.deficient {
  background: #fef2f2;
  color: #dc2626;
}

.insufficient {
  background: #fef3c7;
  color: #d97706;
}

.adequate {
  background: #f0fdf4;
  color: #16a34a;
}

.optimal {
  background: #eff6ff;
  color: #2563eb;
}

.source-category {
  margin-bottom: 1rem;
}

.source-category h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.source-category p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Test Vitamin D Card */
.test-vitamin-d-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  border: 2px solid rgba(16, 185, 129, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.test-vitamin-d-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
}

.test-vitamin-d-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(16, 185, 129, 0.18), 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.test-card-icon {
  flex-shrink: 0;
}

.test-card-content {
  flex: 1;
}

.test-card-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.test-card-content p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.test-btn {
  display: inline-block;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.test-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.test-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.test-btn:hover::before {
  left: 100%;
}

.previous-results {
  font-size: 0.875rem;
  color: #10b981;
  margin: 0;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.previous-results:hover {
  color: #059669;
}

/* Statistics Section */
.statistics-section {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
}

.statistics-section:hover {
  box-shadow: 0 12px 48px rgba(139, 92, 246, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
}

.statistics-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.statistics-icon {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.statistics-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.statistics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  transition: transform 0.3s ease;
  transform: scaleX(0);
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.optimal-levels {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.1);
}

.stat-card.optimal-levels::before {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.stat-card.optimal-levels:hover {
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
}

.stat-card.global-impact {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.1);
}

.stat-card.global-impact::before {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.stat-card.global-impact:hover {
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat-icon {
  border-radius: 4px;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.success {
  background: #dcfce7;
}

.stat-icon.warning {
  background: #fee2e2;
}

.stat-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.optimal-levels .stat-header h3 {
  color: #166534;
}

.global-impact .stat-header h3 {
  color: #991b1b;
}

.stat-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.stat-list li {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.optimal-levels .stat-list li {
  color: #166534;
}

.global-impact .stat-list li {
  color: #991b1b;
}

.stat-list li:last-child {
  margin-bottom: 0;
}

.learn-more {
  text-align: right;
}

.learn-more-link {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.learn-more-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  opacity: 0;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.learn-more-link:hover {
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
}

.learn-more-link:hover::before {
  opacity: 1;
}

/* Disclaimer Section */
.disclaimer-section {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fed7aa;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.disclaimer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.disclaimer-section:hover {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
  transform: translateY(-1px);
}

.disclaimer-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.disclaimer-icon {
  flex-shrink: 0;
}

.disclaimer-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
}

.disclaimer-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #92400e;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .protection-items {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .protection-item {
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .item-icon {
    width: 40px;
    height: 40px;
  }
  
  .test-vitamin-d-card {
    padding: 2rem;
    gap: 1.5rem;
  }
  
  .statistics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .statistics-section {
    padding: 2rem;
  }
  
  .disclaimer-section {
    padding: 1.5rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }

}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .impact-card, .research-card, .info-card {
    padding: 1.25rem;
  }
  

}
</style>