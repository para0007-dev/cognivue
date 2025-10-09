<template>
  <div class="sun-exposure-page">
    <Header />
    <main class="main-content">
      <div class="container">
        <!-- Let's Get Outside Section -->
        <div class="lets-get-outside">
          <div class="outside-header">
            <div class="sun-icon">
              <Icon icon="wi:day-sunny" :width="48" :height="48" />
            </div>
            <h1 class="outside-title">Let's Get Outside</h1>
          </div>
          
          <!-- Location Search Box -->
          <div class="location-search-container">
            <div class="search-box">
              <div class="location-icon">
                <Icon icon="material-symbols:location-on" :width="20" :height="20" />
              </div>
              <input 
                type="text" 
                v-model="searchLocation"
                @keyup.enter="updateLocation"
                placeholder="Enter city (e.g., Carlton, AU)"
                class="location-input"
              />
              <button @click="updateLocation" class="update-btn">
                <Icon icon="material-symbols:search" :width="18" :height="18" />
                Update
              </button>
            </div>
            <div class="current-location">
              <Icon icon="material-symbols:location-on" :width="16" :height="16" />
              {{ weatherData?.name || 'Melbourne' }}, Victoria
            </div>
            <div class="weather-info-summary">
              <span class="temperature">{{ Math.round(weatherData?.main?.temp || 22) }}°C</span>
              <span class="weather-condition">{{ weatherData?.weather?.[0]?.description || 'Partly Cloudy' }}</span>
            </div>
          </div>
          
          <div class="outside-content">
            <!-- Safe Sun Exposure Card -->
            <div class="safe-sun-card">
              <div class="safe-sun-header">
                <div class="warning-icon">!</div>
                <h3>Safe Sun Exposure</h3>
                <span class="today-label">Today</span>
              </div>
              
              <div class="uv-index-display">
                <div class="uv-number">{{ weatherData?.uv_index || 6 }}</div>
                <div class="uv-level-text">{{ getUVLevelText(weatherData?.uv_index || 6) }}</div>
              </div>
              
              <div class="time-recommendations">
                <div class="time-slot optimal">
                  <div class="time-icon">
                    <Icon icon="wi:sunrise" :width="24" :height="24" />
                  </div>
                  <div class="time-info">
                    <div class="time-range">7:30 AM - 9:30 AM</div>
                    <div class="time-desc">Optimal window for Vitamin D synthesis</div>
                    <div class="time-note">15-20 mins recommended for your skin type</div>
                  </div>
                </div>
                
                <div class="time-slot moderate">
                  <div class="time-icon">
                    <Icon icon="material-symbols:warning" :width="24" :height="24" />
                  </div>
                  <div class="time-info">
                    <div class="time-range">10:00 AM - 3:00 PM</div>
                    <div class="time-desc">High UV - Seek shade</div>
                    <div class="time-note">Use SPF 30+ if outdoors</div>
                  </div>
                </div>
                
                <div class="time-slot safe">
                  <div class="time-icon">
                    <Icon icon="wi:cloudy" :width="24" :height="24" />
                  </div>
                  <div class="time-info">
                    <div class="time-range">4:00 PM - 5:30 PM</div>
                    <div class="time-desc">Safe for outdoor activities</div>
                    <div class="time-note">Great for exercise & relaxation</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Today's Activities Card -->
            <div class="todays-activities-card">
              <div class="activities-header">
                <div class="person-icon">
                  <Icon icon="mdi:account" :width="20" :height="20" />
                </div>
                <h3>Today's Activities</h3>
                <span class="suggestions-count">3 Suggestions</span>
              </div>
              
              <div class="weather-summary">
                <div class="weather-icon">
                  <Icon icon="wi:day-cloudy" :width="32" :height="32" />
                </div>
                <div class="weather-info">
                  <div class="temperature">{{ Math.round(weatherData?.main?.temp || 22) }}°C</div>
                  <div class="weather-desc">Partly cloudy, perfect for outdoors</div>
                </div>
              </div>
              
              <div class="activity-suggestions">
                <div class="activity-item">
                  <div class="activity-icon">
                    <Icon icon="mdi:walk" :width="24" :height="24" />
                  </div>
                  <div class="activity-details">
                    <div class="activity-name">Morning Beach Walk</div>
                    <div class="activity-meta">25 mins | Low intensity | 4.2 Kms Beach</div>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon">
                    <Icon icon="mdi:tree" :width="24" :height="24" />
                  </div>
                  <div class="activity-details">
                    <div class="activity-name">Royal Botanic Gardens</div>
                    <div class="activity-meta">45 mins | Moderate | Nature immersion</div>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon">
                    <Icon icon="mdi:bike" :width="24" :height="24" />
                  </div>
                  <div class="activity-details">
                    <div class="activity-name">Yarra River Trail</div>
                    <div class="activity-meta">60 mins | Moderate | Scenic cycling</div>
                  </div>
                </div>
              </div>
              
              <button class="view-more-btn">View More Activities</button>
            </div>
          </div>
          
          <!-- Week at a Glance -->
          <div class="week-glance">
            <div class="week-header">
              <div class="calendar-icon">
                <Icon icon="mdi:calendar" :width="20" :height="20" />
              </div>
              <h3>Week at a Glance</h3>
              <button class="discover-btn" @click="toggleActivityGallery">Discover New Activities</button>
            </div>
            
            <div class="week-days">
              <div class="day-card" v-for="day in weekDays" :key="day.name" :class="{ active: day.isToday }">
                <div class="day-name">{{ day.name }}</div>
                <div class="day-image" :style="{ backgroundImage: `url(${day.image})` }"></div>
                <div class="day-activity">{{ day.activity }}</div>
              </div>
            </div>
          </div>
          
          <!-- Activity Gallery -->
          <div v-if="showActivityGallery" class="activity-gallery">
            <div class="gallery-container">
              <div class="gallery-header">
                <h3>Discover New Activities</h3>
                <button class="close-gallery-btn" @click="toggleActivityGallery">
                  <Icon icon="mdi:close" :width="20" :height="20" />
                </button>
              </div>
              
              <!-- Stacked Images Gallery -->
              <div class="stacked-gallery">
                <div class="stacked-container" v-if="activityGallery.length > 0">
                  <!-- Navigation arrows -->
                  <button class="nav-arrow nav-left" @click="prevMainImage">
                    <Icon icon="mdi:chevron-left" :width="24" :height="24" />
                  </button>
                  <button class="nav-arrow nav-right" @click="nextMainImage">
                    <Icon icon="mdi:chevron-right" :width="24" :height="24" />
                  </button>
                  
                  <!-- Stacked images -->
                  <div class="images-stack">
                    <div 
                      v-for="(activity, index) in activityGallery" 
                      :key="activity.id"
                      class="stacked-image"
                      :class="{ 
                        'front': index === currentSlide,
                        'back-1': index === (currentSlide + 1) % activityGallery.length,
                        'back-2': index === (currentSlide + 2) % activityGallery.length,
                        'back-3': index === (currentSlide + 3) % activityGallery.length,
                        'back-4': index === (currentSlide + 4) % activityGallery.length
                      }"
                      :style="{ backgroundImage: `url(${activity.image})` }"
                      @click="setMainImage(index)"
                    >
                      <!-- Only show overlay on front image -->
                      <div v-if="index === currentSlide" class="image-overlay">
                        <h4>{{ activity.title }}</h4>
                        <p>{{ activity.subtitle }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Did You Know -->
          <div class="did-you-know">
            <div class="knowledge-icon">
              <Icon icon="mdi:lightbulb" :width="24" :height="24" />
            </div>
            <h4>Did You Know?</h4>
            <p>Just 15 minutes of morning sun exposure can help regulate your circadian rhythm, improve mood, and boost vitamin D production. Melbourne's UV levels are perfect for safe outdoor activities before 10 AM!</p>
          </div>
        </div>
      </div>


  </main>
  

  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { weatherAPI, recommendationAPI } from '@/services/api.js'
import { Icon } from '@iconify/vue'

export default {
  name: 'LetsGetOutsideView',
  components: {
    Header,
    Icon
  },
  data() {
    return {
      currentTime: new Date().toLocaleTimeString(),
      // Timer state now managed by timerService

      // Weather and location data
      weatherData: {
        main: { temp: 0 },
        weather: [{ description: 'Loading...' }],
        name: 'Melbourne',
        uv_index: 0
      },
      // Week at a glance data
      weekDays: [
        {
          name: 'Mon',
          activity: 'Morning Walk',
          image: new URL('@/assets/images/activities/morning walk.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Tue',
          activity: 'Beach Yoga',
          image: new URL('@/assets/images/activities/beach yoga.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Wed',
          activity: 'Park Cycling',
          image: new URL('@/assets/images/activities/park cycling.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Thu',
          activity: 'Garden Visit',
          image: new URL('@/assets/images/activities/garden visit.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Fri',
          activity: 'River Trail',
          image: new URL('@/assets/images/activities/river trial.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Sat',
          activity: 'Outdoor Fitness',
          image: new URL('@/assets/images/activities/outdoor fitness.jpg', import.meta.url).href,
          isToday: false
        },
        {
          name: 'Sun',
          activity: 'Nature Hike',
          image: new URL('@/assets/images/activities/nature hike.jpg', import.meta.url).href,
          isToday: false
        }
       ],
        locationData: {
        city: 'Melbourne',
        state: 'Victoria',
        lat: null,
        lon: null
      },
      isLoadingWeather: false,
      weatherError: null,

      manualCity: '',
      manualError: null,
      
      // Search functionality
      searchLocation: '',
      
      // Activity Gallery
      showActivityGallery: false,
      currentSlide: 0,
      activityGallery: [
        {
          id: 1,
          title: 'Surfing Adventure',
          subtitle: 'Ride the Perfect Wave',
          description: 'Experience the thrill of surfing on pristine beaches',
          date: '29/08',
          image: new URL('@/assets/images/new-activities/Surfing.jpg', import.meta.url).href
        },
        {
          id: 2,
          title: 'Basketball Training',
          subtitle: 'Court Skills Development',
          description: 'Improve your basketball skills with professional coaching',
          date: '30/08',
          image: new URL('@/assets/images/new-activities/play basketball.jpg', import.meta.url).href
        },
        {
          id: 3,
          title: 'Tennis Match',
          subtitle: 'Competitive Court Action',
          description: 'Join exciting tennis matches and tournaments',
          date: '31/08',
          image: new URL('@/assets/images/new-activities/play tennis.jpg', import.meta.url).href
        },
        {
          id: 4,
          title: 'Horse Riding',
          subtitle: 'Equestrian Adventure',
          description: 'Explore scenic trails on horseback through beautiful landscapes',
          date: '01/09',
          image: new URL('@/assets/images/new-activities/riding.jpg', import.meta.url).href
        },
        {
          id: 5,
          title: 'Outdoor Swimming',
          subtitle: 'Natural Water Experience',
          description: 'Enjoy refreshing swims in natural outdoor pools and lakes',
          date: '02/09',
          image: new URL('@/assets/images/new-activities/swimming outside.jpg', import.meta.url).href
        }
      ]
    }
  },

  methods: {
    // Activity Gallery Methods
    toggleActivityGallery() {
      this.showActivityGallery = !this.showActivityGallery;
      if (this.showActivityGallery) {
        this.currentSlide = 0; // Reset to first image when opening
      }
    },
    
    nextMainImage() {
      this.currentSlide = (this.currentSlide + 1) % this.activityGallery.length;
    },
    
    prevMainImage() {
      this.currentSlide = this.currentSlide === 0 ? this.activityGallery.length - 1 : this.currentSlide - 1;
    },
    
    setMainImage(index) {
      this.currentSlide = index;
    },

    // Week Days Methods
    setTodayInWeekDays() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayName = dayNames[dayOfWeek];
      
      // Reset all days to false first
      this.weekDays.forEach(day => {
        day.isToday = false;
      });
      
      // Set today to true
      const todayDay = this.weekDays.find(day => day.name === todayName);
      if (todayDay) {
        todayDay.isToday = true;
      }
    },

    // UV Level Methods
    getUVLevelText(uvIndex) {
      if (uvIndex <= 2) return 'Low'
      if (uvIndex <= 5) return 'Moderate'
      if (uvIndex <= 7) return 'High'
      if (uvIndex <= 10) return 'Very High'
      return 'Extreme'
    },

    
    // API Methods

    
    async fetchWeatherData() {
      this.isLoadingWeather = true;
      this.weatherError = null;

      try {
        let response;

        // Try browser geolocation (no DB write)
        try {
          const pos = await this.getCurrentPosition();
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          this.locationData.lat = lat;
          this.locationData.lon = lon;
          response = await weatherAPI.getWeatherByCoords(lat, lon);
        } catch {
          // Fallback: server-chosen location (profile or default)
          response = await weatherAPI.getWeather();
        }

        if (response.success) {
          this.weatherData = {
            main: { temp: response.weather.temp },
            weather: [{ description: response.weather.condition }],
            name: response.weather.location || this.manualCity,
            uv_index: response.weather.uv_index
          }

          // update UI location text
          const [city, state = ''] = (response.weather.location || this.manualCity).split(', ')
          this.locationData.city = city
          this.locationData.state = state

          // (optional) clear stored lat/lon since we're in manual mode
          this.locationData.lat = null
          this.locationData.lon = null
        } else {
          throw new Error(response.error || 'Failed to fetch weather data');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        // Soft fallback so UI still renders
        this.weatherData = {
          main: { temp: 22 },
          weather: [{ description: 'Partly Cloudy' }],
          name: this.locationData.city || 'Melbourne',
          uv_index: 3
        };
        this.weatherError = null;
      } finally {
        this.isLoadingWeather = false;
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
     },

     // Location search functionality
     async updateLocation() {
       if (!this.searchLocation.trim()) return
       
       this.isLoadingWeather = true
       this.weatherError = null
       
       try {
         const response = await weatherAPI.getWeatherByCity(this.searchLocation.trim())
         if (!response.success) throw new Error(response.error || 'Failed to fetch weather data for this location')

         this.weatherData = {
           main: { temp: response.weather.temp },
           weather: [{ description: response.weather.condition }],
           name: response.weather.location || this.searchLocation.trim(),
           uv_index: response.weather.uv_index
         }

         // Update location data
         const [city, state = ''] = (response.weather.location || this.searchLocation.trim()).split(', ')
         this.locationData.city = city
         this.locationData.state = state

         // Clear coordinates since we're using manual search
         this.locationData.lat = null
         this.locationData.lon = null

         // Clear search input after successful update
         this.searchLocation = ''
         
       } catch (error) {
         console.error('Error updating location:', error)
         this.weatherError = error.message
         // Keep current weather data on error
       } finally {
         this.isLoadingWeather = false
       }
     },

     async applyManualCity() {
      if (!this.manualCity) return
      this.isLoadingWeather = true
      this.manualError = null
      try {
        const response = await weatherAPI.getWeatherByCity(this.manualCity) // uses /api/weather?city=
        if (!response.success) throw new Error(response.error || 'Failed to fetch city weather')

        this.weatherData = {
          main: { temp: response.weather.temp },
          weather: [{ description: response.weather.condition }],
          name: response.weather.location || this.manualCity,
          uv_index: response.weather.uv_index
        }

        // update UI location text
        const [city, state = ''] = (response.weather.location || this.manualCity).split(', ')
        this.locationData.city = city
        this.locationData.state = state

        // (optional) clear stored lat/lon since we're in manual mode
        this.locationData.lat = null
        this.locationData.lon = null

        // (optional) if your backend returns coords in JSON, you can persist as default:
        // if (response.weather.coord) {
        //   await fetch('/vitamin-d-helper/api/update-location/', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     credentials: 'include',
        //     body: JSON.stringify({
        //       latitude: response.weather.coord.lat,
        //       longitude: response.weather.coord.lon
        //     })
        //   })
        // }
      } catch (e) {
        console.error(e)
        this.manualError = 'Could not find that location. Try "Suburb, AU".'
      } finally {
        this.isLoadingWeather = false
      }
    },

  },
  async mounted() {
    // Set today in week days
    this.setTodayInWeekDays()
    // Fetch data from backend
    this.fetchWeatherData()
  }
}
</script>

<style scoped>

.manual-loc { display:flex; gap:.5rem; margin-top:.5rem; margin-bottom: 1rem;}
.loc-input {
  flex:1; min-width: 0; padding:.5rem .75rem; border:1px solid #e5e7eb;
  border-radius:8px; font:inherit;
}
.loc-input:focus { outline:none; border-color:#93c5fd; box-shadow:0 0 0 3px rgba(147,197,253,.35); }
.loc-btn {
  padding:.5rem .9rem; border:none; border-radius:8px; cursor:pointer; font-weight:600;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color:#fff;
}
.loc-error { color:#b91c1c; margin-top:.5rem; font-size:.875rem; }


.sun-exposure-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.main-content {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  position: relative;
  overflow-x: hidden;

}

.main-content::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 206, 84, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
  animation: backgroundFloat 20s ease-in-out infinite;
}

@keyframes pageLoad {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes backgroundFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
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
  .exposure-times {
    padding: 1rem;
  }
  
  .time-range {
    font-size: 1.25rem;
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
  

}



/* Let's Get Outside Section */
.lets-get-outside {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fed7aa 100%);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 2px solid #f59e0b;
  box-shadow: 
    0 12px 40px rgba(245, 158, 11, 0.2),
    0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  transition: all 0.3s ease;
}

.lets-get-outside::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #d97706, #b45309, #f59e0b);
  background-size: 200% 100%;
  animation: gradientShift 3s ease-in-out infinite;
}

.lets-get-outside::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: backgroundGlow 4s ease-in-out infinite;
  pointer-events: none;
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

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes backgroundGlow {
  0%, 100% { 
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.lets-get-outside:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 16px 50px rgba(245, 158, 11, 0.25),
    0 8px 20px rgba(0, 0, 0, 0.15);
}

.outside-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;
}

.outside-header .sun-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  animation: iconFloat 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

.outside-header .sun-icon:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.outside-header .sun-icon img {
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.outside-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(146, 64, 14, 0.1);
  animation: titleGlow 2s ease-in-out infinite alternate;
  position: relative;
}

@keyframes titleGlow {
  from {
    filter: drop-shadow(0 0 5px rgba(146, 64, 14, 0.3));
  }
  to {
    filter: drop-shadow(0 0 15px rgba(146, 64, 14, 0.5));
  }
}

.outside-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #92400e, #d97706);
  transition: width 0.8s ease;
  border-radius: 2px;
}

.outside-header:hover .outside-title::after {
  width: 100%;
}

/* Location Search Container */
.location-search-container {
  margin: 1.5rem 0 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.8) 100%);
  border-radius: 20px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 
    0 8px 32px rgba(245, 158, 11, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

}

.location-search-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #d97706, #b45309);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 16px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.search-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
  transition: left 0.6s ease;
}

.search-box:focus-within {
  border-color: #f59e0b;
  box-shadow: 
    0 0 0 4px rgba(245, 158, 11, 0.15),
    0 8px 25px rgba(245, 158, 11, 0.2);
  transform: translateY(-2px);
}

.search-box:focus-within::before {
  left: 100%;
}

.location-icon {
  color: #f59e0b;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  transition: all 0.3s ease;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.search-box:focus-within .location-icon {
  color: #d97706;
  transform: scale(1.1);
}

.location-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  color: #374151;
  background: transparent;
  transition: all 0.3s ease;
}

.location-input::placeholder {
  color: #9ca3af;
  transition: color 0.3s ease;
}

.location-input:focus::placeholder {
  color: #d1d5db;
}

.update-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.update-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.4s ease;
  transform: translate(-50%, -50%);
}

.update-btn:hover::before {
  width: 300px;
  height: 300px;
}

.update-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.update-btn:active {
  transform: translateY(0) scale(0.98);
}

.current-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(245, 158, 11, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;

}

@keyframes locationFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.current-location:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.weather-info-summary {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(254, 243, 199, 0.6) 100%);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);

  transition: all 0.3s ease;
}

@keyframes weatherFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.weather-info-summary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.temperature {
  font-weight: 700;
  color: #f59e0b;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
  animation: temperaturePulse 3s ease-in-out infinite;
}

@keyframes temperaturePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.temperature::before {
  content: '°';
  font-size: 1.5rem;
  margin-right: 0.25rem;
  color: #d97706;
}

.weather-condition {
  color: #6b7280;
  text-transform: capitalize;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(107, 114, 128, 0.2);
  transition: all 0.3s ease;
}

.weather-condition:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
}

.outside-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Safe Sun Exposure Card */
.safe-sun-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  color: #1f2937;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(245, 158, 11, 0.1);
  position: relative;
  overflow: hidden;

  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.safe-sun-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #d97706, #b45309, #f59e0b);
  background-size: 200% 100%;
  animation: cardGradient 3s ease-in-out infinite;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes cardGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.safe-sun-card:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(245, 158, 11, 0.2);
}

.safe-sun-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.safe-sun-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  flex: 1;
}

.today-label {
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.uv-index-display {
  text-align: center;
  margin-bottom: 1.5rem;
}

.uv-number {
  font-size: 3rem;
  font-weight: 700;
  color: #f59e0b;
  line-height: 1;
}

.uv-level-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.time-recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.time-slot {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.time-slot.optimal {
  background: #f0fdf4;
  border-left-color: #22c55e;
}

.time-slot.moderate {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.time-slot.safe {
  background: #eff6ff;
  border-left-color: #3b82f6;
}

.time-icon {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.time-info {
  flex: 1;
}

.time-range {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.time-desc {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.time-note {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Today's Activities Card */
.todays-activities-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.activities-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.activities-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  flex: 1;
}

.suggestions-count {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.weather-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.weather-icon {
  font-size: 2rem;
}

.weather-info .temperature {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.weather-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.activity-suggestions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

}



@keyframes activitySlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.activity-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  transform-origin: bottom;
}

.activity-item:hover::before {
  transform: scaleY(1);
}

.activity-item:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
  transform: translateX(8px);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.04);
  border-color: rgba(59, 130, 246, 0.2);
}

.activity-icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  color: #6b7280;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.activity-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.activity-item:hover .activity-icon {
  color: white;
  transform: scale(1.1);
}

.activity-item:hover .activity-icon::before {
  opacity: 1;
}

.activity-icon svg {
  position: relative;
  z-index: 1;
}

.activity-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.activity-meta {
  font-size: 0.75rem;
  color: #6b7280;
}

.view-more-btn {
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(59, 130, 246, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);

}

.view-more-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.view-more-btn:hover::before {
  left: 100%;
}

@keyframes buttonFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.view-more-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(59, 130, 246, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15);
}

.view-more-btn:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 8px rgba(59, 130, 246, 0.3),
    0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Week at a Glance */
.week-glance {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(34, 197, 94, 0.1);
  position: relative;
  overflow: hidden;

  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.week-glance::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #16a34a, #22c55e, #10b981, #16a34a);
  background-size: 200% 100%;
  animation: weekGradient 4s ease-in-out infinite;
}

@keyframes weekGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.week-glance:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}

.week-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.week-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  flex: 1;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.discover-btn {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #10b981 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(34, 197, 94, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.discover-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.discover-btn:hover::before {
  left: 100%;
}

.discover-btn:hover {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 50%, #059669 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(34, 197, 94, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.15);
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1.25rem;
  position: relative;
  z-index: 1;
}

.day-card {
  text-align: center;
  padding: 1.25rem 0.75rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%);
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);

}



@keyframes dayCardFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.day-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.day-card:hover::before {
  opacity: 1;
}

.day-card:hover {
  background: linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 0.9) 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.12),
    0 4px 15px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.day-card.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
  border-color: #3b82f6;
  color: #1f2937;
  box-shadow: 
    0 8px 25px rgba(59, 130, 246, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px) scale(1.05);
}

.day-card.active::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  opacity: 1;
}

.day-name {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.day-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 auto 0.75rem;
}

.day-activity {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Did You Know */
.did-you-know {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;

  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.did-you-know::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
  background-size: 200% 100%;
  animation: knowledgeGradient 4s ease-in-out infinite;
}

.did-you-know::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: knowledgeGlow 3s ease-in-out infinite;
}

@keyframes knowledgeFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes knowledgeGradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes knowledgeGlow {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.2);
  }
}

.did-you-know:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}

.knowledge-icon {
  font-size: 2rem;
  margin-top: 0.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: iconBounce 2s ease-in-out infinite;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.05); }
}

.knowledge-icon:hover {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
}

.did-you-know h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.did-you-know h4::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.6s ease;
  border-radius: 1px;
}

.did-you-know:hover h4::after {
  width: 100%;
}

.did-you-know p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 0.95rem;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.did-you-know:hover p {
  color: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .lets-get-outside {
    padding: 1.5rem;
  }
  
  .outside-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .week-days {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }
  
  .day-image {
    width: 50px;
    height: 50px;
  }
  
  .outside-title {
    font-size: 1.5rem;
  }
  
  .location-search-container {
    padding: 1rem;
    margin: 1rem 0 1.5rem 0;
  }
  
  .search-box {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .location-input {
    padding: 0.75rem;
    text-align: center;
  }
  
  .update-btn {
    width: 100%;
    justify-content: center;
    padding: 0.875rem;
  }
  
  .weather-info-summary {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  
  .lets-get-outside {
    padding: 1rem;
  }
  
  .week-days {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .time-slot {
    padding: 0.75rem;
  }
  
  .did-you-know {
    flex-direction: column;
    text-align: center;
  }
  
  .location-search-container {
    padding: 0.75rem;
    margin: 0.75rem 0 1rem 0;
  }
  
  .search-box {
    padding: 0.75rem;
  }
  
  .location-input {
    font-size: 0.9rem;
  }
  
  .update-btn {
    font-size: 0.85rem;
    padding: 0.75rem;
  }
  
  .current-location {
    font-size: 0.8rem;
    justify-content: center;
  }
  
  .weather-info-summary {
    font-size: 0.85rem;
  }
}

/* Activity Gallery Styles */
.activity-gallery {
  margin-top: 1.5rem;

}

@keyframes gallerySlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}



.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.gallery-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
}

.close-gallery-btn {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ef4444;
}

.close-gallery-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

.gallery-slider {
  position: relative;
}

.slider-container {
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.slides-wrapper {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide {
  min-width: 100%;
  padding: 2rem;
}

.slide-content {
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.slide-image {
  position: relative;
  flex: 1;
  min-height: 300px;
  border-radius: 15px;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  border: 2px dashed #d1d5db;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.placeholder-image:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  transform: scale(1.02);
}

.placeholder-image p {
  margin: 0.5rem 0 0 0;
  font-weight: 500;
  font-size: 0.9rem;
}



.slide-info {
  flex: 1;
  padding-left: 1rem;
}

.slide-info h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.slide-info .subtitle {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3b82f6;
}

.slide-info .description {
  margin: 0;
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;
  z-index: 3;
  backdrop-filter: blur(10px);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.prev-btn {
  left: 15px;
}

.next-btn {
  right: 15px;
}

.dots-indicator {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #3b82f6;
  transform: scale(1.2);
}

.dot:hover {
  background: #3b82f6;
  transform: scale(1.1);
}

/* Stacked Images Gallery Styles */
.stacked-gallery {
  margin-top: 1.5rem;

}

.stacked-container {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.images-stack {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stacked-image {
  position: absolute;
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

/* Front image - largest and most prominent */
.stacked-image.front {
  width: 500px;
  height: 350px;
  z-index: 5;
  transform: translateX(0) scale(1);
  opacity: 1;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

/* Back images with decreasing sizes and positions */
.stacked-image.back-1 {
  width: 420px;
  height: 300px;
  z-index: 4;
  transform: translateX(180px) scale(0.9);
  opacity: 0.8;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stacked-image.back-2 {
  width: 360px;
  height: 260px;
  z-index: 3;
  transform: translateX(320px) scale(0.8);
  opacity: 0.6;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stacked-image.back-3 {
  width: 320px;
  height: 230px;
  z-index: 2;
  transform: translateX(-180px) scale(0.7);
  opacity: 0.5;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.stacked-image.back-4 {
  width: 280px;
  height: 200px;
  z-index: 1;
  transform: translateX(-320px) scale(0.6);
  opacity: 0.4;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Hover effects */
.stacked-image:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.stacked-image.front:hover {
  transform: translateX(0) scale(1.02);
}

.stacked-image.back-1:hover {
  transform: translateX(180px) scale(0.92);
}

.stacked-image.back-2:hover {
  transform: translateX(320px) scale(0.82);
}

.stacked-image.back-3:hover {
  transform: translateX(-180px) scale(0.72);
}

.stacked-image.back-4:hover {
  transform: translateX(-320px) scale(0.62);
}



/* Image overlay for front image only */
.stacked-image .image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  z-index: 2;
}

.stacked-image .image-overlay h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stacked-image .image-overlay p {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
}

/* Navigation arrows */
.stacked-container .nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stacked-container .nav-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.stacked-container .nav-left {
  left: 20px;
}

.stacked-container .nav-right {
  right: 20px;
}

/* Responsive Design for Stacked Gallery */
@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
    margin: 1rem 0;
  }
  
  .stacked-container {
    height: 300px;
  }
  
  /* Mobile stacked images - smaller and closer together */
  .stacked-image.front {
    width: 280px;
    height: 200px;
  }
  
  .stacked-image.back-1 {
    width: 240px;
    height: 170px;
    transform: translateX(100px) scale(0.9);
  }
  
  .stacked-image.back-2 {
    width: 200px;
    height: 140px;
    transform: translateX(180px) scale(0.8);
  }
  
  .stacked-image.back-3 {
    width: 180px;
    height: 130px;
    transform: translateX(-100px) scale(0.7);
  }
  
  .stacked-image.back-4 {
    width: 160px;
    height: 120px;
    transform: translateX(-180px) scale(0.6);
  }
  
  /* Mobile hover effects */
  .stacked-image.front:hover {
    transform: translateX(0) scale(1.02);
  }
  
  .stacked-image.back-1:hover {
    transform: translateX(100px) scale(0.92);
  }
  
  .stacked-image.back-2:hover {
    transform: translateX(180px) scale(0.82);
  }
  
  .stacked-image.back-3:hover {
    transform: translateX(-100px) scale(0.72);
  }
  
  .stacked-image.back-4:hover {
    transform: translateX(-180px) scale(0.62);
  }
  
  .stacked-image .image-overlay {
    padding: 1.5rem 1rem 1rem;
  }
  
  .stacked-image .image-overlay h4 {
    font-size: 1.25rem;
  }
  
  .stacked-container .nav-arrow {
    width: 40px;
    height: 40px;
  }
  
  .stacked-container .nav-left {
    left: 15px;
  }
  
  .stacked-container .nav-right {
    right: 15px;
  }
  
  /* Legacy styles for other gallery components */
  .slide-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .slide-image {
    min-height: 200px;
  }
  
  .slide-info {
    padding-left: 0;
    text-align: center;
  }
  
  .slide-info h4 {
    font-size: 1.5rem;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .prev-btn {
    left: 10px;
  }
  
  .next-btn {
    right: 10px;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .stacked-container {
    height: 250px;
  }
  
  .stacked-image.front {
    width: 220px;
    height: 160px;
  }
  
  .stacked-image.back-1 {
    width: 180px;
    height: 130px;
    transform: translateX(80px) scale(0.9);
  }
  
  .stacked-image.back-2 {
    width: 150px;
    height: 110px;
    transform: translateX(140px) scale(0.8);
  }
  
  .stacked-image.back-3 {
    width: 130px;
    height: 100px;
    transform: translateX(-80px) scale(0.7);
  }
  
  .stacked-image.back-4 {
    width: 110px;
    height: 90px;
    transform: translateX(-140px) scale(0.6);
  }
}
</style>