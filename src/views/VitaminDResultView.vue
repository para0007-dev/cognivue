<template>
  <div class="vitamin-d-result">
    <Header />
    <!-- Background -->
    <div class="background"></div>
    
    <!-- Main Content -->
    <div class="content-container">
      <!-- Header Section -->
      <div class="header-section" :class="{ 'inadequate': isInadequate }">
        <div class="result-header">
          <div class="result-info">
            <div class="result-icon" :class="{ 'inadequate': isInadequate }">
              <!-- Adequate Icon -->
              <svg v-if="!isInadequate" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#22c55e" stroke="white" stroke-width="2"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <!-- Inadequate Warning Icon -->
              <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#f97316" stroke="white" stroke-width="2"/>
                <path d="M12 8v4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16h.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="result-title">Your Vitamin D Level:</h2>
            <div class="result-badge" :class="{ 'inadequate': isInadequate }">
              <span class="badge-text">{{ isInadequate ? 'Inadequate' : 'Adequate' }}</span>
            </div>
          </div>
        </div>
        <p class="result-description">
          {{ isInadequate ? 'Your vitamin D levels may need improvement for optimal brain health protection.' : 'Great job! Your current habits support healthy vitamin D levels and brain protection.' }}
        </p>
      </div>

      <!-- Cards Section -->
      <div class="cards-section">
        <!-- Brain Health Impact Card -->
        <div class="card brain-health-card" :class="{ 'inadequate': isInadequate }">
          <div class="card-icon">
            <div class="icon-placeholder brain-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4C6.5 13 6 14.5 6 16c0 3.5 2.5 6 6 6s6-2.5 6-6c0-1.5-.5-3-1.5-4 1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6z" fill="white"/>
                <circle cx="9" cy="9" r="1" fill="#16a34a"/>
                <circle cx="15" cy="9" r="1" fill="#16a34a"/>
                <path d="M8 13c1 1 3 1 4 0 1 1 3 1 4 0" stroke="#16a34a" stroke-width="1" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <h3 class="card-title">Brain Health Impact</h3>
          <p class="card-content">
            {{ isInadequate ? 'Low vitamin D levels can reduce hippocampus volume and cognitive function. Improving your levels can help protect against cognitive decline.' : 'Your vitamin D levels support hippocampus volume, cognitive function, and may reduce dementia risk by up to 17%.' }}
          </p>
        </div>

        <!-- Recommendations Section -->
        <div class="recommendations-section">
          <h2 class="section-title">
  {{ isInadequate ? 'Recommended Actions 👇' : 'Choose your next steps below 👇' }}
          </h2>

          
          <!-- Sun Exposure Card -->
          <div class="card sun-exposure-card">
            <div class="card-icon">
              <div class="icon-placeholder sun-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="4" fill="white"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <!-- Only the text below is clickable -->
            <router-link to="/sun-exposure" class="card-text-link">
              <h3 class="card-title">{{ isInadequate ? 'Increase Sun Exposure' : 'Maintain Sun Exposure' }}</h3>
              <p class="card-content">
                {{ isInadequate ? 'Aim for 20-30 minutes of safe sun exposure daily' : 'Continue your current outdoor routine of 15-30 minutes daily' }}
              </p>
            </router-link>
          </div>

          <!-- Eating Card -->
          <div class="card eating-card">
            <div class="card-icon">
              <div class="icon-placeholder food-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 2v7c0 5.55 4.45 10 10 10s10-4.45 10-10V2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 15l5-5 5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8 6v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  <path d="M16 6v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <!-- Only the text below is clickable -->
            <router-link to="/nutrition" class="card-text-link">
              <h3 class="card-title">{{ isInadequate ? 'Add Vitamin D Foods' : 'Keep Eating Well' }}</h3>
              <p class="card-content">
                {{ isInadequate ? 'Include fatty fish, eggs, dairy, and fortified foods daily' : 'Continue including vitamin D-rich foods in your diet' }}
              </p>
            </router-link>
          </div>

          <!-- Supplements/Monitor Card -->
          <div class="card monitor-card">
            <div class="card-icon">
              <div class="icon-placeholder monitor-icon">
                <svg v-if="isInadequate" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" fill="none"/>
                  <circle cx="9" cy="9" r="2" stroke="white" stroke-width="2" fill="none"/>
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                  <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <!-- Only the text below is clickable -->
            <router-link to="/activity-plan" class="card-text-link">
              <h3 class="card-title">{{ isInadequate ? 'Consider outdoor activities' : 'Checkout outdoor activities' }}</h3>
              <p class="card-content">
                {{ isInadequate ? 'Try safe outdoor exercises to boost Vitamin D while staying active.' : 'Keep active outdoors to maintain your healthy Vitamin D and fitness' }}
              </p>
            </router-link>
          </div>
        </div>

        <!-- Important Note Card -->
        <div class="card important-note-card" :class="{ 'inadequate': isInadequate }">
          <h3 class="card-title">{{ isInadequate ? 'Take Action Now' : 'Important Note' }}</h3>
          <p class="card-content">
             {{ isInadequate ? 'This assessment suggests you may benefit from improving your vitamin D levels. For accurate levels, consult your doctor for a blood test (25(OH)D). The optimal blood level is >75 nmol/L (>30 ng/mL).' : 'This assessment provides an estimate only. For accurate vitamin D levels, consult your doctor for a blood test (25(OH)D). The optimal blood level is >75 nmol/L (>30 ng/mL).' }}
           </p>
        </div>

    
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'VitaminDResultView',
  components: {
    Header
  },
  props: {
    isInadequate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    returnToHomepage() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.vitamin-d-result {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 0;
}

/* ... all your existing styles unchanged ... */

/* Make only the text area inside the card act like a link, without changing layout */
.card-text-link {
  display: block;
  text-decoration: none;
  color: inherit;
  margin: 0;
  padding: 0;
}

/* Optional: slight underline on hover just for the title (keeps card hover the same) */
.card-text-link:hover .card-title {
  text-decoration: underline;
}

/* keep the rest of your existing CSS exactly as-is */
@keyframes backgroundShift {
  0%, 100% { background: linear-gradient(135deg, #9BC7AF 0%, #FAD3CA 25%, #FAF3C1 50%, #C7EED0 75%, #9BC7AF 100%); }
  50% { background: linear-gradient(135deg, #C7EED0 0%, #9BC7AF 25%, #FAD3CA 50%, #FAF3C1 75%, #C7EED0 100%); }
}

.background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #FAD3CA; z-index: -1; }
.content-container { position: relative; max-width: 800px; margin: 0 auto; z-index: 1; }

.header-section { background: linear-gradient(135deg, #9BC7AF 0%, #C7EED0 100%); border-radius: 25px; padding: 40px; margin-bottom: 30px; color: white; box-shadow: 0 15px 40px rgba(155, 199, 175, 0.4); animation: noteGlow 3s ease-in-out infinite; position: relative; overflow: hidden; }
.header-section.inadequate { background: linear-gradient(135deg, #fbcc75 0%, #fbcc75 100%); box-shadow: 0 15px 40px rgba(251, 204, 117, 0.4); animation: headerPulseWarning 3s ease-in-out infinite; }
@keyframes headerPulseWarning { 0%, 100% { transform: scale(1); box-shadow: 0 15px 40px rgba(251, 204, 117, 0.4); } 50% { transform: scale(1.02); box-shadow: 0 20px 50px rgba(251, 204, 117, 0.6); } }
@keyframes headerPulse { 0%, 100% { transform: scale(1); box-shadow: 0 15px 40px rgba(155, 199, 175, 0.4); } 50% { transform: scale(1.02); box-shadow: 0 20px 50px rgba(155, 199, 175, 0.6); } }

.result-header { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; text-align: center; }
.result-icon { width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%); border-radius: 50%; border: 4px solid rgba(255, 255, 255, 0.5); backdrop-filter: blur(15px); margin: 0 auto 25px auto; animation: badgeGlow 2.5s ease-in-out infinite; position: relative; }
.result-icon.inadequate { animation: badgeGlowWarning 2.5s ease-in-out infinite; }
@keyframes badgeGlowWarning { 0%, 100% { box-shadow: 0 8px 25px rgba(251, 204, 117, 0.4); } 50% { box-shadow: 0 12px 35px rgba(251, 204, 117, 0.7), 0 0 20px rgba(251, 204, 117, 0.5); } }
.result-icon::after { content: ''; position: absolute; width: 120%; height: 120%; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.3); animation: ripple 2s ease-out infinite; }
@keyframes iconBounce { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.2); opacity: 0; } }

.result-info h2 { margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: white; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
.result-badge { display: inline-block; background: linear-gradient(135deg, #FAF3C1 0%, #FAD3CA 100%); border: 2px solid rgba(255, 255, 255, 0.6); border-radius: 25px; padding: 12px 25px; backdrop-filter: blur(10px); animation: iconBounce 2s ease-in-out infinite; box-shadow: 0 8px 25px rgba(250, 243, 193, 0.4); }
.result-badge.inadequate { background: linear-gradient(135deg, #fb651c 0%, #ea580c 100%); color: white; border: 2px solid rgba(251, 101, 28, 0.8); font-weight: 600; font-size: 1.1rem; padding: 12px 24px; box-shadow: 0 4px 15px rgba(251, 101, 28, 0.3); animation: badgeWarningBounce 2s ease-in-out infinite; }
@keyframes badgeWarningBounce { 0%, 100% { transform: translateY(0) scale(1); box-shadow: 0 8px 25px rgba(255, 218, 185, 0.4); } 50% { transform: translateY(-10px) scale(1.05); box-shadow: 0 12px 35px rgba(255, 218, 185, 0.7); } }
@keyframes badgeGlow { 0%, 100% { box-shadow: 0 8px 25px rgba(250, 243, 193, 0.4); } 50% { box-shadow: 0 12px 35px rgba(250, 243, 193, 0.7), 0 0 20px rgba(250, 243, 193, 0.5); } }
.badge-text { color: #2d3748; font-weight: 800; font-size: 16px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); }

.result-description { font-size: 1.2rem; color: rgba(255, 255, 255, 0.95); text-align: center; line-height: 1.7; margin: 0; max-width: 700px; font-weight: 500; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 0 20px; }

.cards-section { display: flex; flex-direction: column; gap: 20px; }

.sun-exposure-card { background: linear-gradient(135deg, #FAF3C1 0%, rgba(255, 255, 255, 0.9) 100%); border: 2px solid #FAF3C1; }
.sun-exposure-card .card-title { color: #8B5A2B; }
.sun-exposure-card .card-content { color: #A0522D; }

.eating-card { background: linear-gradient(135deg, #FAD3CA 0%, rgba(255, 255, 255, 0.9) 100%); border: 2px solid #FAD3CA; }
.eating-card .card-title { color: #8B4513; }
.eating-card .card-content { color: #A0522D; }

.monitor-card { background: linear-gradient(135deg, #C7EED0 0%, rgba(255, 255, 255, 0.9) 100%); border: 2px solid #C7EED0; }
.monitor-card .card-title { color: #2F5233; }
.monitor-card .card-content { color: #4A6741; }

.card { background: rgba(255, 255, 255, 0.9); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; backdrop-filter: blur(10px); }
.card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }

@keyframes cardSlideIn { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }

.brain-health-card { background: linear-gradient(135deg, #9BC7AF 0%, #C7EED0 100%); color: white; border: none; transform-origin: center; }
.brain-health-card.inadequate { background: linear-gradient(135deg, #fbcc75 0%, #f4a261 100%); border: 2px solid #fbcc75; }
.brain-health-card.inadequate .card-title { color: #2c3e50; font-weight: 700; font-size: 1.2rem; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); margin-bottom: 12px; }
.brain-health-card.inadequate .card-content { color: #34495e; font-weight: 500; font-size: 1rem; line-height: 1.6; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); letter-spacing: 0.3px; }

@keyframes cardFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-5px) rotate(0.5deg); } 75% { transform: translateY(5px) rotate(-0.5deg); } }

.brain-health-card .card-title { color: white; }
.brain-health-card .card-content { color: rgba(255, 255, 255, 0.9); }

.good-work-section { margin: 30px 0; }

.section-title { font-size: 24px; font-weight: 700; color: #2d3748; margin-bottom: 20px; text-align: center; text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8); }

.card-icon { width: 24px; height: 24px; margin-bottom: 15px; }
.icon-placeholder { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; border-radius: 12px; background: linear-gradient(135deg, #9BC7AF 0%, #C7EED0 100%); color: white; animation: iconSpin 6s linear infinite; box-shadow: 0 4px 15px rgba(155, 199, 175, 0.3); }
@keyframes iconSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.card-title { font-size: 1.5rem; font-weight: 700; color: #1a202c; margin-bottom: 18px; text-align: center; letter-spacing: 0.5px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7); }
.card-content { font-size: 1.1rem; color: #2d3748; line-height: 1.7; text-align: center; margin: 0; font-weight: 500; padding: 0 15px; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6); }

.important-note-card { background: #FAF3C1; border: 3px solid #F4D03F; border-width: 3px; animation: noteGlow 3s ease-in-out infinite; }
.important-note-card.inadequate { background: linear-gradient(135deg, #fbebba 0%, #f6e58d 100%); border: 2px solid #fbebba; box-shadow: 0 4px 15px rgba(251, 235, 186, 0.3); }
.important-note-card.inadequate .card-title { color: #fb651c; font-weight: 800; }
.important-note-card.inadequate .card-content { color: #1a202c; font-weight: 600; }
@keyframes noteGlow { 0%, 100% { border-color: #F4D03F; box-shadow: 0 8px 25px rgba(244, 208, 63, 0.3); } 50% { border-color: #F7DC6F; box-shadow: 0 12px 35px rgba(247, 220, 111, 0.5); } }
.important-note-card .card-title { color: #92400e; font-weight: 700; font-size: 18px; }
.important-note-card .card-content { color: #a16207; font-size: 16px; line-height: 1.44; }

.return-button-container { display: flex; justify-content: center; margin-top: 30px; }
.return-button { display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #9BC7AF 0%, #C7EED0 100%); border: none; border-radius: 50px; color: white; font-weight: 700; font-size: 16px; padding: 15px 30px; cursor: pointer; transition: all 0.3s ease; text-decoration: none; box-shadow: 0 8px 25px rgba(155, 199, 175, 0.4); animation: buttonPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
.return-button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255, 255, 255, 0.3); border-radius: 50%; transition: all 0.3s ease; transform: translate(-50%, -50%); }
.return-button:hover::before { width: 300px; height: 300px; }
@keyframes buttonPulse { 0%, 100% { box-shadow: 0 8px 25px rgba(155, 199, 175, 0.4); } 50% { box-shadow: 0 12px 35px rgba(155, 199, 175, 0.6); } }
.return-button:hover { background: linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(34, 197, 94, 0.6); }
.button-icon { font-size: 16px; display: inline-flex; align-items: center; justify-content: center; }

/* Responsive */
@media (max-width: 768px) {
  .vitamin-d-result { padding: 15px; }
  .content-container { max-width: 100%; }
  .header-section { padding: 20px; margin-bottom: 20px; }
  .result-header { flex-direction: column; text-align: center; }
  .avatar { margin-right: 0; margin-bottom: 15px; }
  .card { padding: 20px; }
  .section-title { font-size: 20px; }
  .card-title { font-size: 16px; }
  .card-content { font-size: 14px; }
}
@media (max-width: 480px) {
  .vitamin-d-result { padding: 10px; }
  .header-section { padding: 15px; }
  .card { padding: 15px; }
  .return-button { padding: 10px 20px; font-size: 14px; }
}
</style>
