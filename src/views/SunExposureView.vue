<template>
  <div class="sun-exposure-page">
    <Header />
    <main class="main-content">
      <div class="container">
        <!-- Title Section -->
        <div class="title-section">
          <h1 class="page-title">Sun Exposure Tracker</h1>
          <p class="page-description">
            Monitor your daily safe sun exposure for optimal vitamin D production with
            <span class="highlight">personalized weather-based recommendations</span>
          </p>
        </div>

        <!-- Today's Vitamin D Helper Card -->
        <div class="helper-card">
          <div class="helper-header">
            <div class="helper-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="#f59e0b" stroke-width="2" fill="#fbbf24"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#f59e0b" stroke-width="2"/>
              </svg>
            </div>
            <h2 class="helper-title">Today's Vitamin D Helper</h2>
          </div>
          
          <div class="helper-content">
            <!-- Location Card -->
            <div class="location-card">
              <div class="location-header">
                <div class="location-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#ef4444" stroke-width="2" fill="#ef4444"/>
                    <circle cx="12" cy="10" r="3" stroke="white" stroke-width="2" fill="white"/>
                  </svg>
                </div>
                <span class="location-text">{{ locationData.city }}, {{ locationData.state }}</span>
              </div>
              
              <div class="weather-info" v-if="!isLoadingWeather">
                <div class="weather-item" v-if="weatherData">
                  <span class="weather-label">Temperature:</span>
                  <span class="weather-value">{{ Math.round(weatherData.main.temp) }}°C</span>
                </div>
                <div class="weather-item" v-if="weatherData">
                  <span class="weather-label">Weather:</span>
                  <span class="weather-value">{{ weatherData.weather[0].description }}</span>
                </div>
                <div class="weather-item" v-if="weatherError">
                  <span class="weather-error">{{ weatherError }}</span>
                </div>
              </div>
              <div class="weather-loading" v-else>
                <span>Loading weather data...</span>
              </div>
            </div>

            <!-- UV Index Card -->
            <div class="uv-card">
              <div class="uv-header">
                <h3 class="uv-title">Current UV Index</h3>
                <div class="uv-value">{{ weatherData && weatherData.uv_index !== undefined ? weatherData.uv_index : 'N/A' }}</div>
              </div>
              <div class="uv-level" :class="getUVLevelClass(weatherData?.uv_index)">{{ getUVLevelText(weatherData?.uv_index) }}</div>
              <p class="uv-description">
                {{ getUVDescription(weatherData?.uv_index) }}
              </p>
            </div>

            <!-- Best Time Today -->
            <div class="best-time-card">
              <div class="best-time-header">
                <div class="best-time-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2" fill="none"/>
                    <polyline points="12,6 12,12 16,14" stroke="#3b82f6" stroke-width="2"/>
                  </svg>
                </div>
                <h3 class="best-time-title">Best Time Today</h3>
              </div>
              <div class="best-time-content">
                <div class="time-range">10:00 AM - 2:00 PM</div>
                <div class="time-description">Autumn sun is gentler - perfect for longer exposure sessions</div>
              </div>
            </div>

            <!-- Personalized Settings -->
            <div class="personalized-settings">
              <h3 class="settings-title">Personalized Settings</h3>
              
              <!-- Skin Type Selection -->
              <div class="skin-type-selection">
                <h4 class="selection-subtitle">Select Your Skin Type</h4>
                <div class="skin-type-options">
                  <div 
                    v-for="(type, index) in skinTypes" 
                    :key="index"
                    class="skin-type-option"
                    :class="{ active: selectedSkinType === index }"
                    @click="selectSkinType(index)"
                  >
                    <div class="skin-color-circle" :class="type.colorClass"></div>
                    <div class="skin-type-info">
                      <span class="skin-type-name">{{ type.name }}</span>
                      <span class="skin-type-description">{{ type.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sun Exposure Timer -->
            <div class="timer-section">
              <h3 class="timer-title">Sun Exposure Timer</h3>
              <div class="timer-card">
                <div class="timer-display">
                  <span class="timer-time">{{ formatTime(remainingTime) }}</span>
                  <span class="timer-label">{{ timerStatus }}</span>
                  <div class="timer-progress">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: progressPercentage + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ Math.round(progressPercentage) }}% Complete</span>
                  </div>
                </div>
                <div class="timer-controls">
                  <button 
                    class="timer-btn start" 
                    @click="startTimer"
                    :disabled="isRunning || remainingTime === 0 || selectedSkinType === null"
                  >
                    {{ remainingTime === selectedDuration * 60 ? 'Start' : 'Resume' }}
                  </button>
                  <button 
                    class="timer-btn pause" 
                    @click="pauseTimer"
                    :disabled="!isRunning"
                  >
                    Pause
                  </button>
                  <button 
                    class="timer-btn reset" 
                    @click="resetTimer"
                  >
                    Reset
                  </button>
                  <button 
                     class="timer-btn test" 
                     @click="goToTestPage"
                   >
                     Test Page
                   </button>
                </div>
                <div v-if="selectedSkinType === null" class="timer-instruction">
                  <p>Please select your skin type above to get personalized recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Sun Exposure History & Stats Section -->
    <div class="history-stats-section">
      <div class="container">
        <div class="section-header">
          <div class="section-title-with-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#dc2626" stroke-width="2" fill="none"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="#dc2626" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="#dc2626" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="#dc2626" stroke-width="2"/>
            </svg>
            <h2 class="section-title">Sun Exposure History & Stats</h2>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card green">
            <div class="stat-label">This Week</div>
            <div class="stat-value">5</div>
            <div class="stat-unit">sessions</div>
          </div>
          <div class="stat-card blue">
            <div class="stat-label">Weekly Avg</div>
            <div class="stat-value">18</div>
            <div class="stat-unit">minutes</div>
          </div>
          <div class="stat-card purple">
            <div class="stat-label">Total Points</div>
            <div class="stat-value">140</div>
            <div class="stat-unit">earned</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-label">Current Streak</div>
            <div class="stat-value">7</div>
            <div class="stat-unit">days</div>
          </div>
        </div>

        <!-- Recent Sessions -->
        <div class="recent-sessions">
          <h3 class="sessions-title">Recent Sessions</h3>
          <div class="sessions-list">
            <div class="session-item completed">
              <div class="session-indicator"></div>
              <div class="session-info">
                <div class="session-date">Mon, 15 Jan</div>
                <div class="session-duration">20 minutes</div>
              </div>
              <div class="session-status completed-status">Completed</div>
            </div>
            <div class="session-item completed">
              <div class="session-indicator"></div>
              <div class="session-info">
                <div class="session-date">Sun, 14 Jan</div>
                <div class="session-duration">15 minutes</div>
              </div>
              <div class="session-status completed-status">Completed</div>
            </div>
            <div class="session-item completed">
              <div class="session-indicator"></div>
              <div class="session-info">
                <div class="session-date">Sat, 13 Jan</div>
                <div class="session-duration">25 minutes</div>
              </div>
              <div class="session-status completed-status">Completed</div>
            </div>
            <div class="session-item incomplete">
              <div class="session-indicator"></div>
              <div class="session-info">
                <div class="session-date">Fri, 12 Jan</div>
                <div class="session-duration">18 minutes</div>
              </div>
              <div class="session-status incomplete-status">Incomplete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  
    <!-- Completion Alert Modal -->
     <div v-if="showCompletionModal" class="completion-modal-overlay" @click="closeCompletionModal">
       <div class="completion-modal" @click.stop>
         <div class="modal-icon sun-icon"></div>
         <h3 class="modal-title">Sun Exposure Complete!</h3>
         <p class="modal-message">Time to seek shade and protect your skin. Great job staying safe!</p>
         <div class="modal-actions">
           <button class="modal-btn primary" @click="closeCompletionModal">Got it</button>
           <button class="modal-btn secondary" @click="resetAndClose">Start Again</button>
         </div>
       </div>
     </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { weatherAPI, skinTypesAPI, recommendationAPI } from '@/services/api.js'
import timerService from '@/services/timerService'

export default {
  name: 'SunExposureView',
  components: {
    Header
  },
  data() {
    return {
      currentTime: new Date().toLocaleTimeString(),
      // Timer state now managed by timerService
      timerState: {
        isRunning: false,
        remainingTime: 900,
        selectedDuration: 15,
        selectedSkinType: null,
        progressPercentage: 0,
        timerStatus: 'Ready to Start'
      },
      timerUnsubscribe: null, // Function to unsubscribe from timer service
      notificationPermission: 'default',
      showCompletionModal: false,
      // Weather and location data
      weatherData: {
        main: { temp: 0 },
        weather: [{ description: 'Loading...' }],
        name: 'Melbourne',
        uv_index: 0
      },
      locationData: {
        city: 'Melbourne',
        state: 'Victoria',
        lat: null,
        lon: null
      },
      isLoadingWeather: false,
      weatherError: null,
      // Skin types from backend
      skinTypes: [],
      isLoadingSkinTypes: false,
      skinTypesError: null
    }
  },
  computed: {
    // Timer computed properties now come from timerService via timerState
    isRunning() {
      return this.timerState.isRunning
    },
    remainingTime() {
      return this.timerState.remainingTime
    },
    selectedDuration() {
      return this.timerState.selectedDuration
    },
    selectedSkinType() {
      return this.timerState.selectedSkinType
    },
    progressPercentage() {
      return this.timerState.progressPercentage
    },
    timerStatus() {
      return this.timerState.timerStatus
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },
    selectSkinType(index) {
      // Use timerService to select skin type
      timerService.selectSkinType(index, this.skinTypes)
    },
    startTimer() {
      timerService.startTimer()
    },

    pauseTimer() {
      timerService.pauseTimer()
    },
    resetTimer() {
      timerService.resetTimer()
    },
    goToTestPage() {
      this.$router.push('/timer-test')
    },
    async handleTimerCompletion() {
       // Show completion modal
       this.showCompletionModal = true
       
       // Play notification sound
       this.playNotificationSound()
       
       // Send browser notification
       await this.sendBrowserNotification()
       
       // Flash page effect
       this.flashPage()
     },
    async sendBrowserNotification() {
      if (this.notificationPermission === 'granted') {
        new Notification('Sun Exposure Complete!', {
          body: 'Time to seek shade and protect your skin.',
          icon: '/favicon.ico',
          tag: 'sun-exposure-timer'
        })
      } else if (this.notificationPermission === 'default') {
        const permission = await Notification.requestPermission()
        this.notificationPermission = permission
        if (permission === 'granted') {
          this.sendBrowserNotification()
        }
      }
    },
    playNotificationSound() {
       // Create audio context for notification sound
       const audioContext = new (window.AudioContext || window.webkitAudioContext)()
       const oscillator = audioContext.createOscillator()
       const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    },
    flashPage() {
      document.body.style.transition = 'background-color 0.2s'
      document.body.style.backgroundColor = '#fef3c7'
      setTimeout(() => {
        document.body.style.backgroundColor = ''
      }, 200)
      setTimeout(() => {
        document.body.style.backgroundColor = '#fef3c7'
      }, 400)
      setTimeout(() => {
        document.body.style.backgroundColor = ''
      }, 600)
    },
    closeCompletionModal() {
      this.showCompletionModal = false
    },
    resetAndClose() {
      this.showCompletionModal = false
      this.resetTimer()
    },

    
    // API Methods
    async fetchSkinTypes() {
      this.isLoadingSkinTypes = true
      this.skinTypesError = null
      
      try {
        const response = await skinTypesAPI.getAll()
        if (response.success) {
          this.skinTypes = response.skin_types.map(skinType => ({
            id: skinType.id,
            name: skinType.name,
            description: skinType.description || `Skin Type ${skinType.type}`,
            colorClass: this.getSkinTypeColorClass(skinType.name),
            recommendedTime: this.calculateRecommendedTime(skinType, this.weatherData?.uv_index),
            minTime: skinType.min_exposure_minutes,
            maxTime: skinType.max_exposure_minutes
          }))
        } else {
          throw new Error(response.error || 'Failed to fetch skin types')
        }
      } catch (error) {
        console.error('Error fetching skin types:', error)
        this.skinTypesError = 'Failed to load skin types. Using default values.'
        // Fallback to default skin types
        this.skinTypes = [
          {
            id: 1,
            name: 'Light Skin',
            description: 'Burns easily, tans minimally',
            colorClass: 'light',
            recommendedTime: 10
          },
          {
            id: 2,
            name: 'Medium Skin',
            description: 'Burns moderately, tans gradually',
            colorClass: 'medium',
            recommendedTime: 20
          },
          {
            id: 3,
            name: 'Dark Skin',
            description: 'Burns minimally, tans well',
            colorClass: 'dark',
            recommendedTime: 30
          }
        ]
      } finally {
        this.isLoadingSkinTypes = false
      }
    },
    
    async fetchWeatherData() {
      this.isLoadingWeather = true
      this.weatherError = null
      
      try {
        // Use fixed coordinates for Melbourne to avoid geolocation issues
        this.locationData.lat = -37.8136
        this.locationData.lon = 144.9631
        
        const response = await weatherAPI.getWeatherByCoords(this.locationData.lat, this.locationData.lon)
        
        if (response.success) {
          // Adapt backend weather data to frontend format
          this.weatherData = {
            main: { temp: response.weather.temp },
            weather: [{ description: response.weather.condition }],
            name: response.weather.location || this.locationData.city,
            uv_index: response.weather.uv_index
          }
          // Update location data from weather response
          if (response.weather.location) {
            const locationParts = response.weather.location.split(', ')
            if (locationParts.length >= 2) {
              this.locationData.city = locationParts[0]
              this.locationData.state = locationParts[1]
            } else {
              // Handle single location name
              this.locationData.city = response.weather.location
              this.locationData.state = ''
            }
          }
        } else {
          throw new Error(response.error || 'Failed to fetch weather data')
        }
      } catch (error) {
        console.error('Error fetching weather data:', error)
        // Set default weather data when API fails
        this.weatherData = {
          main: { temp: 22 },
          weather: [{ description: 'Partly Cloudy' }],
          name: this.locationData.city,
          uv_index: 3
        }
        // Clear error since we're providing default data
        this.weatherError = null
      } finally {
        this.isLoadingWeather = false
      }
    },
    
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        })
      })
    },
    
    calculateRecommendedTime(skinType, uvIndex = 3) {
      // Base time calculation based on skin type and UV index
      let baseTime = skinType.min_exposure_minutes || 10
      
      // Adjust based on UV index
      if (uvIndex <= 2) {
        // Low UV: can expose longer
        baseTime = Math.min(skinType.max_exposure_minutes || 30, baseTime * 1.5)
      } else if (uvIndex <= 5) {
        // Moderate UV: use recommended range
        baseTime = Math.round((skinType.min_exposure_minutes + skinType.max_exposure_minutes) / 2) || 15
      } else if (uvIndex <= 7) {
        // High UV: reduce time
        baseTime = Math.max(skinType.min_exposure_minutes || 5, baseTime * 0.8)
      } else {
        // Very high/extreme UV: minimal time
        baseTime = Math.max(5, skinType.min_exposure_minutes * 0.6) || 5
      }
      
      return Math.round(baseTime)
    },
    
    getSkinTypeColorClass(skinTypeName) {
      const name = skinTypeName.toLowerCase()
      if (name.includes('light') || name.includes('fair')) return 'light'
      if (name.includes('medium') || name.includes('olive')) return 'medium'
      if (name.includes('dark') || name.includes('deep')) return 'dark'
      return 'medium' // default
    },
    
    getUVLevelClass(uvIndex) {
      if (uvIndex === null || uvIndex === undefined) return 'unknown'
      if (uvIndex <= 2) return 'low'
      if (uvIndex <= 5) return 'moderate'
      if (uvIndex <= 7) return 'high'
      if (uvIndex <= 10) return 'very-high'
      return 'extreme'
    },
    
    getUVLevelText(uvIndex) {
      if (uvIndex === null || uvIndex === undefined) return 'Unknown'
      if (uvIndex <= 2) return 'Low'
      if (uvIndex <= 5) return 'Moderate'
      if (uvIndex <= 7) return 'High'
      if (uvIndex <= 10) return 'Very High'
      return 'Extreme'
    },
    
    getUVDescription(uvIndex) {
       if (uvIndex === null || uvIndex === undefined) {
         return 'UV index data not available'
       }
       if (uvIndex <= 2) {
         return 'Low UV levels - safe for extended outdoor activities'
       }
       if (uvIndex <= 5) {
         return 'Moderate UV levels - some protection recommended after 30+ minutes'
       }
       if (uvIndex <= 7) {
         return 'High UV levels - protection needed after 15-20 minutes'
       }
       if (uvIndex <= 10) {
         return 'Very high UV levels - protection essential, limit exposure'
       }
       return 'Extreme UV levels - avoid outdoor activities during peak hours'
     }
  },
  async mounted() {
    // Request notification permission on component mount
    if ('Notification' in window) {
      this.notificationPermission = Notification.permission
      if (this.notificationPermission === 'default') {
        const permission = await Notification.requestPermission()
        this.notificationPermission = permission
      }
    }
    
    // Fetch data from backend
    await Promise.all([
      this.fetchSkinTypes(),
      this.fetchWeatherData()
    ])
    
    // Subscribe to timer service updates
    this.timerUnsubscribe = timerService.subscribe((state) => {
      this.timerState = { ...state }
      
      // Handle timer completion
      if (state.timerStatus === 'Completed' && state.remainingTime === 0) {
        this.handleTimerCompletion()
      }
    })
    
    // Initialize timer service with current state
    timerService.initialize()
  },
  beforeUnmount() {
    // Unsubscribe from timer service
    if (this.timerUnsubscribe) {
      this.timerUnsubscribe()
    }
  }
}
</script>

<style scoped>
.sun-exposure-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.main-content {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.page-description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.highlight {
  color: #16a34a;
  font-weight: 600;
}

.helper-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
  border: 1px solid #f59e0b;
}

.helper-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.helper-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.helper-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #92400e;
  margin: 0;
}

.helper-content {
  display: grid;
  gap: 2rem;
}

.location-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.location-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.location-icon {
  display: flex;
  align-items: center;
}

.location-text {
  font-weight: 600;
  color: #2d3748;
}

.coordinates-text {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  margin-top: 0.25rem;
}

.weather-info {
  display: grid;
  gap: 0.5rem;
}

.weather-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.weather-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.weather-value {
  font-weight: 600;
  color: #2d3748;
}

.uv-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.uv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.uv-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.uv-value {
  font-size: 2rem;
  font-weight: bold;
  color: #f59e0b;
}

.uv-level {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.uv-level.low {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.uv-level.moderate {
  background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  color: white;
}

.uv-level.high {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
}

.uv-level.very-high {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
}

.uv-level.extreme {
  background: linear-gradient(135deg, #7c2d12 0%, #451a03 100%);
  color: white;
}

.uv-level.unknown {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.uv-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.best-time-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.best-time-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.best-time-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #93c5fd;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.best-time-card:hover::before {
  left: 100%;
}

.best-time-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.best-time-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.best-time-card:hover .best-time-icon {
  transform: rotate(360deg);
}

.best-time-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #3b82f6;
  margin: 0;
}

.best-time-content {
  text-align: center;
}

.time-range {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.best-time-card:hover .time-range {
  transform: scale(1.05);
  color: #1d4ed8;
}

.time-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Personalized Settings */
.personalized-settings {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.settings-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 2rem 0;
  text-align: center;
}

.selection-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 1rem 0;
}

/* Skin Type Selection */
.skin-type-selection {
  margin-bottom: 2rem;
}

.skin-type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skin-type-option {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.skin-type-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.skin-type-option:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.skin-type-option:hover::before {
  left: 100%;
}

.skin-type-option.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
}

.skin-type-option.active::after {
   content: '\2713';
   position: absolute;
   top: 12px;
   right: 12px;
   width: 24px;
   height: 24px;
   background: #3b82f6;
   color: white;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 12px;
   font-weight: bold;
 }

.skin-color-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  flex-shrink: 0;
  transition: all 0.4s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.skin-type-option.active .skin-color-circle {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.skin-color-circle.light {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%);
}

.skin-color-circle.medium {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 50%, #f97316 100%);
}

.skin-color-circle.dark {
  background: linear-gradient(135deg, #d2b48c 0%, #8b4513 50%, #654321 100%);
}

.skin-type-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.skin-type-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.125rem;
  line-height: 1.2;
}

.skin-type-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 500;
}



.timer-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.timer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.timer-card {
  text-align: center;
}

.timer-display {
  margin-bottom: 2rem;
}

.timer-time {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #16a34a;
  margin-bottom: 0.5rem;
}

.timer-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* Progress Bar */
.timer-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  display: block;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.timer-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.timer-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.timer-btn:hover::before {
  left: 100%;
}

.timer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.timer-btn:disabled::before {
  display: none;
}

.timer-btn.start {
  background: linear-gradient(135deg, #d5e5a9 0%, #c8dd7a 100%);
  color: #4a5d23;
  box-shadow: 0 4px 15px rgba(213, 229, 169, 0.4);
}

.timer-btn.start:hover:not(:disabled) {
  background: linear-gradient(135deg, #c8dd7a 0%, #b8d154 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(213, 229, 169, 0.6);
}

.timer-btn.start:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(213, 229, 169, 0.4);
}

.timer-btn.pause {
  background: linear-gradient(135deg, #fbebba 0%, #f5d982 100%);
  color: #8b6914;
  box-shadow: 0 4px 15px rgba(251, 235, 186, 0.4);
}

.timer-btn.pause:hover:not(:disabled) {
  background: linear-gradient(135deg, #f5d982 0%, #efc441 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(251, 235, 186, 0.6);
}

.timer-btn.pause:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(251, 235, 186, 0.4);
}

.timer-btn.reset {
  background: linear-gradient(135deg, #f9d8d1 0%, #f4b5a8 100%);
  color: #8b3a2e;
  box-shadow: 0 4px 15px rgba(249, 216, 209, 0.4);
}

.timer-btn.reset:hover:not(:disabled) {
  background: linear-gradient(135deg, #f4b5a8 0%, #ee9284 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 216, 209, 0.6);
}

.timer-btn.reset:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(249, 216, 209, 0.4);
}

.timer-instruction {
  margin-top: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  text-align: center;
}

.timer-instruction p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .helper-card {
    padding: 1.5rem;
  }
  
  .helper-header {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .timer-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .timer-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .timer-time {
    font-size: 2rem;
  }
  
  .personalized-settings {
    padding: 1.5rem;
  }
  
  .skin-type-options {
    grid-template-columns: 1fr;
  }
  
  .skin-type-option {
    padding: 1rem;
    gap: 1rem;
  }
  
  .skin-color-circle {
    width: 50px;
    height: 50px;
  }
  
  .skin-type-name {
    font-size: 1rem;
  }
  
  .duration-actions {
    gap: 0.5rem;
  }
  
  .duration-btn {
    padding: 0.5rem 1rem;
    min-width: 60px;
    font-size: 0.875rem;
  }
}

/* History & Stats Section */
.history-stats-section {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 3rem 0;
  margin-top: 2rem;
}

.section-title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card.green {
  border-left: 4px solid #22c55e;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.stat-card.blue {
  border-left: 4px solid #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stat-card.purple {
  border-left: 4px solid #8b5cf6;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
}

.stat-card.orange {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-card.green .stat-value {
  color: #16a34a;
}

.stat-card.blue .stat-value {
  color: #2563eb;
}

.stat-card.purple .stat-value {
  color: #7c3aed;
}

.stat-card.orange .stat-value {
  color: #d97706;
}

.stat-unit {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Recent Sessions */
.recent-sessions {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sessions-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.session-item.completed {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.session-item.incomplete {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.session-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.session-item.completed .session-indicator {
  background: #22c55e;
}

.session-item.incomplete .session-indicator {
  background: #6b7280;
}

.session-info {
  flex: 1;
}

.session-date {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.session-duration {
  font-size: 0.875rem;
  color: #6b7280;
}

.session-status {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.completed-status {
  background: #22c55e;
  color: white;
}

.incomplete-status {
  background: #6b7280;
  color: white;
}

@media (max-width: 768px) {
  .history-stats-section {
    padding: 2rem 0;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .recent-sessions {
    padding: 1.5rem;
  }
  
  .session-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .helper-card {
    padding: 1rem;
  }
  
  .location-card,
  .uv-card,
  .best-time-card,
  .exposure-times,
  .timer-section {
    padding: 1rem;
  }
  
  .time-range {
    font-size: 1.25rem;
  }
  
  .skin-type {
    padding: 0.75rem;
  }
  
  .skin-color {
    width: 30px;
    height: 30px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 1.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .personalized-settings {
    padding: 1rem;
  }
  
  .settings-title {
    font-size: 1.125rem;
  }
  
  .skin-type-options {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .skin-type-option {
    flex-direction: row;
    text-align: left;
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .skin-color-circle {
    width: 45px;
    height: 45px;
  }
  
  .skin-type-name {
    font-size: 0.95rem;
  }
  
  .skin-type-description {
    font-size: 0.8rem;
  }
}

/* Completion Modal Styles */
.completion-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.completion-modal {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}

.sun-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  position: relative;
}

.sun-icon::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fef3c7;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sun-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 40%, #fbbf24 41%, #fbbf24 45%, transparent 46%);
  border-radius: 50%;
  animation: sunRotate 3s linear infinite;
}

@keyframes sunRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.modal-message {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.modal-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.modal-btn.primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.modal-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.modal-btn.secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .completion-modal {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}
</style>