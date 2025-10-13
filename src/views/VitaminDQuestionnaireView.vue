<template>
  <div class="questionnaire-page page-content">
    <Header />
    <main class="main-content">
      <div class="container">
        <!-- Progress Header -->
        <div class="progress-section">
          <h1 class="page-title">Vitamin D Questionnaire</h1>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <p class="progress-text">Question {{ currentQuestion }} of {{ totalQuestions }}</p>
        </div>

        <!-- Question Card -->
        <div class="question-card">
          <div class="question-content">
            <!-- Question 1: Outdoor Time -->
            <div v-if="currentQuestion === 1" class="question">
              <h2 class="question-title">Typical weekday outdoor time between 10am-3pm:</h2>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.outdoorTime" value=">30min" name="outdoorTime">
                  <span class="option-text">&gt; 30 min</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.outdoorTime" value="10-29min" name="outdoorTime">
                  <span class="option-text">10-29 min</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.outdoorTime" value="<10min" name="outdoorTime">
                  <span class="option-text">&lt; 10 min</span>
                </label>
              </div>
            </div>

            <!-- Question 2: Work/Study Pattern -->
            <div v-if="currentQuestion === 2" class="question">
              <h2 class="question-title">Work/study pattern:</h2>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.workPattern" value="outdoor" name="workPattern">
                  <span class="option-text">Mostly outdoor</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.workPattern" value="mixed" name="workPattern">
                  <span class="option-text">Mixed</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.workPattern" value="indoor" name="workPattern">
                  <span class="option-text">Mostly indoor / night-shift</span>
                </label>
              </div>
            </div>

            <!-- Question 3: Skin Type -->
            <div v-if="currentQuestion === 3" class="question">
              <h2 class="question-title">Skin type &mdash; Fitzpatrick:</h2>
              <div class="options">
                <label class="option skin-type-option">
                  <input type="radio" v-model="answers.skinType" value="I-II" name="skinType">
                  <div class="skin-color-card skin-type-1"></div>
                  <span class="option-text">I-II (very fair / fair)</span>
                </label>
                <label class="option skin-type-option">
                  <input type="radio" v-model="answers.skinType" value="III-IV" name="skinType">
                  <div class="skin-color-card skin-type-2"></div>
                  <span class="option-text">III-IV (medium / olive)</span>
                </label>
                <label class="option skin-type-option">
                  <input type="radio" v-model="answers.skinType" value="V-VI" name="skinType">
                  <div class="skin-color-card skin-type-3"></div>
                  <span class="option-text">V-VI (dark / very dark)</span>
                </label>
              </div>
            </div>

            <!-- Question 4: Location & Season -->
            <div v-if="currentQuestion === 4" class="question">
              <h2 class="question-title">Location & season for the next 2-3 months:</h2>
              <p class="question-subtitle">Choose the highest that applies.</p>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.location" value="QLD-NT-year-round" name="location">
                  <span class="option-text">QLD/NT year-round OR WA/NSW summer/spring</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.location" value="NSW-WA-autumn-winter" name="location">
                  <span class="option-text">NSW/WA autumn/winter OR SA spring</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.location" value="VIC-TAS-ACT-autumn-winter" name="location">
                  <span class="option-text">VIC/TAS/ACT in autumn/winter</span>
                </label>
              </div>
            </div>

            <!-- Question 5: Clothing Coverage -->
            <div v-if="currentQuestion === 5" class="question">
              <h2 class="question-title">Clothing coverage when outdoors:</h2>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.clothingCoverage" value="arms-legs-exposed" name="clothingCoverage">
                  <span class="option-text">Arms & lower legs exposed (short sleeves/shorts/dress)</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.clothingCoverage" value="one-area-covered" name="clothingCoverage">
                  <span class="option-text">Long sleeves OR long pants (one area covered)</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.clothingCoverage" value="full-coverage" name="clothingCoverage">
                  <span class="option-text">Long sleeves AND long pants, head covering/veil</span>
                </label>
              </div>
            </div>

            <!-- Question 6: Vitamin D Supplement -->
            <div v-if="currentQuestion === 6" class="question">
              <h2 class="question-title">Vitamin D supplement (&ge; 600 IU / 15 &mu;g most days):</h2>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.vitaminDSupplement" value="yes" name="vitaminDSupplement">
                  <span class="option-text">Yes</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.vitaminDSupplement" value="no" name="vitaminDSupplement">
                  <span class="option-text">No</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.vitaminDSupplement" value="not-sure" name="vitaminDSupplement">
                  <span class="option-text">Not sure</span>
                </label>
              </div>
            </div>


            <!-- Question 7: Vitamin D Rich Foods -->
            <div v-if="currentQuestion === 7" class="question">
              <h2 class="question-title">Vitamin D-rich foods &ge; 4 servings/week (oily fish, fortified milk/margarine, eggs):</h2>
              <div class="options">
                <label class="option">
                  <input type="radio" v-model="answers.vitaminDFoods" value="yes" name="vitaminDFoods">
                  <span class="option-text">Yes</span>
                </label>
                <label class="option">
                  <input type="radio" v-model="answers.vitaminDFoods" value="no" name="vitaminDFoods">
                  <span class="option-text">No / rare</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="navigation">
            <!-- If on Q1, show "Back to Home" -->
            <button 
              v-if="currentQuestion === 1"
              class="nav-btn back-btn"
              @click="$router.push('/')"
            >
              Back to Home
            </button>

            <!-- Otherwise, normal Back -->
            <button 
              v-else
              class="nav-btn back-btn" 
              @click="previousQuestion"
            >
              Back
            </button>

            <!-- Next / Submit button aligned right -->
            <button 
              class="nav-btn next-btn" 
              @click="nextQuestion" 
              :disabled="!isCurrentQuestionAnswered"
            >
              {{ currentQuestion === totalQuestions ? 'Submit' : 'Next' }}
            </button>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'VitaminDQuestionnaireView',
  components: {
    Header
  },
  data() {
    return {
      currentQuestion: 1,
      totalQuestions: 7,
      answers: {
         outdoorTime: '',
         workPattern: '',
         skinType: '',
         location: '',
         clothingCoverage: '',
         vitaminDSupplement: '',
         vitaminDFoods: ''
       }
    }
  },
  computed: {
    progressPercentage() {
      return (this.currentQuestion / this.totalQuestions) * 100
    },
    isCurrentQuestionAnswered() {
      const questionKeys = [
         'outdoorTime',
         'workPattern',
         'skinType',
         'location',
         'clothingCoverage',
         'vitaminDSupplement',
         'vitaminDFoods'
       ]
      return this.answers[questionKeys[this.currentQuestion - 1]] !== ''
    }
  },
  methods: {
    nextQuestion() {
      if (this.currentQuestion < this.totalQuestions) {
        this.currentQuestion++
      } else {
        this.submitQuestionnaire()
      }
    },
    previousQuestion() {
      if (this.currentQuestion > 1) {
        this.currentQuestion--
      }
    },
    submitQuestionnaire() {
      // Handle questionnaire submission
      console.log('Questionnaire submitted:', this.answers)
      
      // Calculate vitamin D risk score
       const riskScore = this.calculateVitaminDScore()
       console.log('Vitamin D Risk Score:', riskScore)
       

       // Navigate to appropriate results page based on risk score
       // Risk Score >= 35: Likely Vitamin D Deficient
       // Risk Score < 35: Not Likely Deficient
       if (riskScore >= 35) {
         this.$router.push('/vitamin-d-inadequate') // Deficient
       } else {
         this.$router.push('/vitamin-d-result') // Adequate
       }
    },
    calculateVitaminDScore() {
      let riskScore = 0
      console.log('=== Vitamin D Risk Score Calculation ===')
      console.log('Answers:', this.answers)
      
      // A) Sun exposure & lifestyle (max 20)
      // Outdoor time scoring
      if (this.answers.outdoorTime === '>30min') {
        riskScore += 0
        console.log('Outdoor time: >30min (+0 points)')
      } else if (this.answers.outdoorTime === '10-29min') {
        riskScore += 8
        console.log('Outdoor time: 10-29min (+8 points)')
      } else if (this.answers.outdoorTime === '<10min') {
        riskScore += 14
        console.log('Outdoor time: <10min (+14 points)')
      }
      
      // Work pattern scoring
      if (this.answers.workPattern === 'outdoor') {
        riskScore += 0
        console.log('Work pattern: outdoor (+0 points)')
      } else if (this.answers.workPattern === 'mixed') {
        riskScore += 2
        console.log('Work pattern: mixed (+2 points)')
      } else if (this.answers.workPattern === 'indoor') {
        riskScore += 6
        console.log('Work pattern: indoor (+6 points)')
      }
      
      // B) Skin type - Fitzpatrick (max 15)
      if (this.answers.skinType === 'I-II') {
        riskScore += 0
        console.log('Skin type: I-II (+0 points)')
      } else if (this.answers.skinType === 'III-IV') {
        riskScore += 8
        console.log('Skin type: III-IV (+8 points)')
      } else if (this.answers.skinType === 'V-VI') {
        riskScore += 15
        console.log('Skin type: V-VI (+15 points)')
      }
      
      // C) Location & season (max 15)
      if (this.answers.location === 'QLD-NT-year-round') {
        riskScore += 0
        console.log('Location: QLD-NT-year-round (+0 points)')
      } else if (this.answers.location === 'NSW-WA-autumn-winter') {
        riskScore += 6
        console.log('Location: NSW-WA-autumn-winter (+6 points)')
      } else if (this.answers.location === 'VIC-TAS-ACT-autumn-winter') {
        riskScore += 15
        console.log('Location: VIC-TAS-ACT-autumn-winter (+15 points)')
      }
      
      // D) Clothing coverage when outdoors (max 10)
      if (this.answers.clothingCoverage === 'arms-legs-exposed') {
        riskScore += 0
        console.log('Clothing: arms-legs-exposed (+0 points)')
      } else if (this.answers.clothingCoverage === 'one-area-covered') {
        riskScore += 6
        console.log('Clothing: one-area-covered (+6 points)')
      } else if (this.answers.clothingCoverage === 'full-coverage') {
        riskScore += 10
        console.log('Clothing: full-coverage (+10 points)')
      }
      
      // E) Diet & supplements (can reduce risk score)
      // Vitamin D supplement
      if (this.answers.vitaminDSupplement === 'yes') {
        riskScore -= 10
        console.log('Vitamin D supplement: yes (-10 points)')
      } else if (this.answers.vitaminDSupplement === 'not-sure') {
        console.log('Vitamin D supplement: not sure (+0 points)')
      } else {
        console.log('Vitamin D supplement: no (+0 points)')
      }

      
      // Vitamin D-rich foods
      if (this.answers.vitaminDFoods === 'yes') {
        riskScore -= 5
        console.log('Vitamin D foods: yes (-5 points)')
      } else {
        console.log('Vitamin D foods: no (+0 points)')
      }
      
      // Floor at zero (don't go negative overall)
      riskScore = Math.max(0, riskScore)
      console.log('Final Risk Score:', riskScore)
      console.log('=== End Calculation ===')
      
      return riskScore
    }
  }
}
</script>

<style scoped>
.questionnaire-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.progress-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.question-subtitle {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  font-style: italic;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.option input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #22c55e;
}

.option input[type="radio"]:checked + .option-text {
  color: #16a34a;
  font-weight: 600;
}

.option:has(input[type="radio"]:checked) {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.option-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
}

/* Skin Type Color Cards */
.skin-type-option {
  align-items: center;
}

.skin-color-card {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
}

.skin-type-1 {
  background-color: #f9d7b9; /* very fair / fair */
}

.skin-type-2 {
  background-color: #c68642; /* medium / olive */
}

.skin-type-3 {
  background-color: #8d5524; /* dark / very dark */
}


.skin-type-option:hover .skin-color-card {
  border-color: #22c55e;
  transform: scale(1.1);
}

.skin-type-option:has(input[type="radio"]:checked) .skin-color-card {
  border-color: #22c55e;
  border-width: 3px;
  transform: scale(1.1);
}

.navigation {
  display: flex;
  justify-content: space-between; /* pushes Back left, Next right */
  align-items: center;
  margin-top: 2rem;
}


.nav-btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.back-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.back-btn:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.next-btn {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: white;
}

.next-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .question-card {
    padding: 2rem;
  }
  
  .question-title {
    font-size: 1.25rem;
  }
  
  .navigation {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .question-card {
    padding: 1.5rem;
  }
  
  .question-title {
    font-size: 1.125rem;
  }
  
  .option {
    padding: 0.75rem;
  }
  
  .option-text {
    font-size: 0.9rem;
  }
}
</style>