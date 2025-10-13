<template>
  <section class="brain-health-section">
    <div class="container">
      <div class="content-wrapper">
        <div class="text-content">
          <h2>Why Vitamin D Matters for Your Brain</h2>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="check-icon">
                <Icon icon="material-symbols:check-circle" :width="20" :height="20" color="#16a34a" />
              </div>
              <div class="benefit-content">
                <h3>Protects Brain Volume</h3>
                <p>Maintains hippocampus size and structure crucial for memory</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <Icon icon="material-symbols:check-circle" :width="20" :height="20" color="#22c55e" />
              </div>
              <div class="benefit-content">
                <h3>Reduces Dementia Risk</h3>
                <p>Up to 17% lower risk with adequate vitamin D levels</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <Icon icon="material-symbols:check-circle" :width="20" :height="20" color="#22c55e" />
              </div>
              <div class="benefit-content">
                <h3>Supports Cognitive Function</h3>
                <p>Improves processing speed and executive function</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="check-icon">
                <Icon icon="material-symbols:check-circle" :width="20" :height="20" color="#22c55e" />
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
                <Icon icon="material-symbols:school" :width="24" :height="24" color="#16a34a" />
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
import { Icon } from '@iconify/vue'

export default {
  name: 'BrainHealth',
  components: {
    Icon
  }
}
</script>

<style scoped>
.brain-health-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%);
  padding: 80px 0;
  opacity: 0;
  animation: sectionFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s forwards;
  position: relative;
  overflow: hidden;
}

.brain-health-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.03) 0%, transparent 50%);
  animation: backgroundFloat 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes backgroundFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-20px, -10px) rotate(1deg);
  }
  66% {
    transform: translate(20px, 10px) rotate(-1deg);
  }
}

@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.text-content {
  opacity: 0;
  animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  gap: 20px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
}

.benefit-item:nth-child(1) {
  animation: benefitSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
}

.benefit-item:nth-child(2) {
  animation: benefitSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
}

.benefit-item:nth-child(3) {
  animation: benefitSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.0s forwards;
}

.benefit-item:nth-child(4) {
  animation: benefitSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s forwards;
}

@keyframes benefitSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.benefit-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #22c55e, #34d399);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
  border-color: #a7f3d0;
}

.benefit-item:hover::before {
  opacity: 1;
}

.check-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.check-icon::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  opacity: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}

.benefit-item:hover .check-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.benefit-content {
  flex: 1;
}

.benefit-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  transition: color 0.3s ease;
}

.benefit-item:hover .benefit-content h3 {
  color: #059669;
}

.benefit-content p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.research-content {
  opacity: 0;
  animation: slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.research-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.12);
  border: 1px solid #d1fae5;
  height: fit-content;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.research-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #059669, #10b981, #34d399);
}

.research-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.18);
  border-color: #a7f3d0;
}

.research-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.research-card:hover::after {
  opacity: 1;
}

.research-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.research-card h3::before {
  content: '\1F393';
  font-size: 20px;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}

.source-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.source-details h4 {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.university {
  font-size: 14px;
  color: #059669;
  margin: 0;
  font-weight: 500;
}

blockquote {
  font-size: 16px;
  font-style: italic;
  color: #374151;
  line-height: 1.7;
  margin: 0 0 28px 0;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-left: 5px solid #3b82f6;
  border-radius: 0 12px 12px 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

blockquote::before {
  content: '"';
  font-size: 48px;
  color: #3b82f6;
  position: absolute;
  top: 8px;
  left: 12px;
  font-family: serif;
  opacity: 0.3;
}

.statistic {
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  border: 1px solid #bfdbfe;
  position: relative;
}

.statistic::before {
  content: '\1F4CA';
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 20px;
  opacity: 0.6;
}

.stat-text {
  font-size: 15px;
  color: #1e40af;
  margin: 0;
  font-weight: 600;
  line-height: 1.5;
}

/* Responsive design */
@media (max-width: 1024px) {
  .brain-health-section {
    padding: 60px 0;
  }
  
  .content-wrapper {
    gap: 40px;
  }
  
  .text-content h2 {
    font-size: 32px;
  }
  
  .benefit-item {
    padding: 18px;
  }
  
  .research-card {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .brain-health-section {
    padding: 40px 0;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .text-content h2 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .benefit-item {
    padding: 16px;
    gap: 12px;
  }
  
  .benefit-content h3 {
    font-size: 16px;
  }
  
  .benefit-content p {
    font-size: 14px;
  }
  
  .research-card {
    padding: 24px;
  }
  
  .research-card h3 {
    font-size: 20px;
  }
  
  .source-info {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .source-icon {
    width: 40px;
    height: 40px;
  }
  
  blockquote {
    padding: 16px;
    font-size: 14px;
  }
  
  .statistic {
    padding: 16px;
  }
  
  .statistic .number {
    font-size: 20px;
  }
  
  .statistic .label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .brain-health-section {
    padding: 30px 0;
  }
  
  .container {
    padding: 0 12px;
  }
  
  .text-content h2 {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .benefits-list {
    gap: 16px;
  }
  
  .benefit-item {
    padding: 14px;
    flex-direction: column;
    text-align: center;
  }
  
  .check-icon {
    width: 20px;
    height: 20px;
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
  
  .research-card h3 {
    font-size: 18px;
  }
  
  .source-info {
    padding: 14px;
  }
  
  .source-icon {
    width: 36px;
    height: 36px;
  }
  
  blockquote {
    padding: 14px;
    font-size: 13px;
  }
  
  .statistic {
    padding: 14px;
  }
  
  .statistic .number {
    font-size: 18px;
  }
  
  .statistic .label {
    font-size: 11px;
  }
}
</style>