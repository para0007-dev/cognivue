<template>
  <section class="brain-health-section">
    <div class="container">
      <div class="content-wrapper">
        <div class="text-content">
          <h2>Why Vitamin D Matters for Your Brain</h2>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#16a34a"/>
                </svg>
              </div>
              <div class="benefit-content">
                <h3>Protects Brain Volume</h3>
                <p>Maintains hippocampus size and structure crucial for memory</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#22c55e"/>
                </svg>
              </div>
              <div class="benefit-content">
                <h3>Reduces Dementia Risk</h3>
                <p>Up to 17% lower risk with adequate vitamin D levels</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#22c55e"/>
                </svg>
              </div>
              <div class="benefit-content">
                <h3>Supports Cognitive Function</h3>
                <p>Improves processing speed and executive function</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#22c55e"/>
                </svg>
              </div>
              <div class="benefit-content">
                <h3>Prevents Cognitive Decline</h3>
                <p>Slows age-related brain changes and cognitive deterioration</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="research-content">
          <div class="research-card">
            <h3>Research Source</h3>
            <div class="source-info">
              <div class="source-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#16a34a"/>
                  <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="source-details">
                <h4>Queensland Brain Institute</h4>
                <p class="university">University of Queensland</p>
              </div>
            </div>
            
            <blockquote>
              "Vitamin D deficiency impacts the volume and function of the hippocampus, leading to reduced cognitive ability, potentially increasing the risk of stroke, or some forms of dementia."
            </blockquote>
            
            <div class="statistic">
              <p class="stat-text">Approximately 887,500 Australians currently live with dementia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'BrainHealth'
}
</script>

<style scoped>
.brain-health-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%);
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

.text-content h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 40px;
  line-height: 1.2;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.check-icon {
  width: 40px;
  height: 40px;
  background-color: #dcfce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.benefit-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.benefit-content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.research-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.1);
  border: 1px solid #bbf7d0;
  height: fit-content;
}

.research-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.source-icon {
  flex-shrink: 0;
}

.source-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.university {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

blockquote {
  font-size: 16px;
  font-style: italic;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 24px 0;
  padding: 20px;
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  border-radius: 0 8px 8px 0;
}

.statistic {
  padding: 16px;
  background-color: #eff6ff;
  border-radius: 8px;
}

.stat-text {
  font-size: 14px;
  color: #1e40af;
  margin: 0;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 968px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .text-content h2 {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .brain-health-section {
    padding: 60px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .text-content h2 {
    font-size: 28px;
    margin-bottom: 32px;
  }
  
  .benefits-list {
    gap: 20px;
  }
  
  .benefit-item {
    gap: 12px;
  }
  
  .check-icon {
    width: 36px;
    height: 36px;
  }
  
  .benefit-content h3 {
    font-size: 16px;
  }
  
  .research-card {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .brain-health-section {
    padding: 40px 0;
  }
  
  .text-content h2 {
    font-size: 24px;
  }
  
  .benefit-content h3 {
    font-size: 15px;
  }
  
  .benefit-content p {
    font-size: 13px;
  }
  
  .research-card {
    padding: 20px;
  }
  
  blockquote {
    font-size: 14px;
    padding: 16px;
  }
}
</style>