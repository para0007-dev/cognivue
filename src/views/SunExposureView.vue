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
              <button
                @click="updateLocation"
                class="update-btn"
                :disabled="updateBusy"           
                :aria-busy="updateBusy ? 'true' : 'false'"  
              >
                <Icon icon="material-symbols:search" :width="18" :height="18" />
                <span v-if="!updateBusy">Update</span>       
                <span v-else>Updating…</span>                
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
          
            <div
              v-if="updateStatus"
              class="status-message"
              :class="updateStatusType"
            >
              <span v-if="updateStatusType==='ok'">✅</span>
              <span v-else-if="updateStatusType==='warn'">⚠️</span>
              <span v-else-if="updateStatusType==='error'">❌</span>
              <span v-else>ℹ️</span>
              {{ updateStatus }}
            </div>

            <!-- Error banner -->
            <div v-if="weatherError" class="error-message">
              {{ weatherError }}
            </div>
          </div>
          
          <div class="outside-content">
            <!-- Safe Sun Exposure Card -->
            <div class="safe-sun-card">
              <div class="safe-sun-header">
                <h3>Safe Sun Exposure</h3>
                <span class="today-label">Today</span>
              </div>
              
              <div class="uv-index-display">
                <div class="uv-range-container">
                  <div class="uv-range-label">Today's UV Range</div>
                  <div class="uv-range-values">
                    <div class="uv-min">
                      <span class="uv-value">{{ todayUVMin }}</span>
                    </div>
                    <div class="uv-arrow">→</div>
                    <div class="uv-max">
                      <span class="uv-value">{{ todayUVMax }}</span>
                    </div>
                  </div>
                  <div class="uv-current-indicator">
                    <span class="current-label">Current:</span>
                    <span class="current-uv" :class="getUVClass(currentUVValue)">
                      UV {{ currentUVValue }}
                    </span>
                    <span class="current-level">{{ getUVLevelText(currentUVValue) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Improved UV Curve Chart -->
              <div v-if="uvSeries.length" class="uv-curve-card">
                <div class="uv-curve-header">
                  <strong>Today's UV Index Curve</strong>
                  <span class="uv-curve-sub">Track UV levels throughout the day</span>
                </div>

                <div class="uv-curve-container">
                  <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="uv-chart">
                    <!-- Background grid -->
                    <g class="grid-lines">
                      <line 
                        v-for="tick in yAxisTicks" 
                        :key="'grid-' + tick.value"
                        :x1="padding.left" 
                        :x2="chartWidth - padding.right" 
                        :y1="getY(tick.value)" 
                        :y2="getY(tick.value)"
                        class="grid-line"
                        :class="{ 'safe-threshold': tick.value === 3 }"
                      />
                    </g>

                    <!-- Y-axis -->
                    <g class="y-axis">
                      <line 
                        :x1="padding.left" 
                        :x2="padding.left" 
                        :y1="padding.top" 
                        :y2="chartHeight - padding.bottom"
                        class="axis-line"
                      />
                      <text 
                        :x="padding.left / 2" 
                        :y="padding.top - 10"
                        class="axis-title"
                        text-anchor="middle"
                      >UV Index</text>
                      
                      <g v-for="tick in yAxisTicks" :key="'y-' + tick.value">
                        <line 
                          :x1="padding.left - 5" 
                          :x2="padding.left" 
                          :y1="getY(tick.value)" 
                          :y2="getY(tick.value)"
                          class="tick-mark"
                        />
                        <text 
                          :x="padding.left - 10" 
                          :y="getY(tick.value)"
                          class="tick-label"
                          text-anchor="end"
                          dominant-baseline="middle"
                        >{{ tick.label }}</text>
                      </g>
                    </g>

                    <!-- X-axis -->
                    <g class="x-axis">
                      <line 
                        :x1="padding.left" 
                        :x2="chartWidth - padding.right" 
                        :y1="chartHeight - padding.bottom" 
                        :y2="chartHeight - padding.bottom"
                        class="axis-line"
                      />
                      <text 
                        :x="chartWidth / 2" 
                        :y="chartHeight - 5"
                        class="axis-title"
                        text-anchor="middle"
                      >Time of Day</text>
                      
                      <g v-for="tick in xAxisTicks" :key="'x-' + tick.index">
                        <line 
                          :x1="getX(tick.index)" 
                          :x2="getX(tick.index)" 
                          :y1="chartHeight - padding.bottom" 
                          :y2="chartHeight - padding.bottom + 5"
                          class="tick-mark"
                        />
                        <text 
                          :x="getX(tick.index)" 
                          :y="chartHeight - padding.bottom + 18"
                          class="tick-label"
                          text-anchor="middle"
                        >{{ tick.label }}</text>
                      </g>
                    </g>

                    <!-- UV curve line -->
                    <path 
                      :d="uvLinePath" 
                      class="uv-line"
                      fill="none"
                    />

                    <!-- Current Time Indicator -->
                    <g v-if="currentTimeIndex !== null" class="current-time-marker">
                      <!-- Vertical line -->
                      <line 
                        :x1="getX(currentTimeIndex)" 
                        :x2="getX(currentTimeIndex)" 
                        :y1="padding.top" 
                        :y2="chartHeight - padding.bottom"
                        class="current-time-line"
                      />
                      
                      <!-- Clock icon at the top -->
                      <g :transform="`translate(${getX(currentTimeIndex)}, ${padding.top - 15})`">
                        <circle cx="0" cy="0" r="12" class="clock-bg" />
                        <circle cx="0" cy="0" r="10" class="clock-face" />
                        <line x1="0" y1="0" x2="0" y2="-5" class="clock-hand-hour" />
                        <line x1="0" y1="0" x2="3" y2="-3" class="clock-hand-minute" />
                        <circle cx="0" cy="0" r="1.5" class="clock-center" />
                      </g>
                      
                      <!-- Current UV value marker -->
                      <circle
                        :cx="getX(currentTimeIndex)"
                        :cy="getY(uvSeries[currentTimeIndex].uv)"
                        r="6"
                        class="current-uv-marker"
                      />
                      <circle
                        :cx="getX(currentTimeIndex)"
                        :cy="getY(uvSeries[currentTimeIndex].uv)"
                        r="6"
                        class="current-uv-marker-pulse"
                      />
                      
                      <!-- Label -->
                      <text 
                        :x="getX(currentTimeIndex)" 
                        :y="chartHeight - padding.bottom + 35"
                        class="current-time-label"
                        text-anchor="middle"
                      >NOW</text>
                    </g>

                    <!-- Data points -->
                    <g class="data-points">
                      <circle
                        v-for="(point, idx) in uvSeries"
                        :key="'point-' + idx"
                        :cx="getX(idx)"
                        :cy="getY(point.uv)"
                        r="3"
                        class="data-point"
                        :class="{ 'safe-point': point.uv <= 3, 'current-point': idx === currentTimeIndex }"
                      >
                        <title>{{ formatTime(point.t) }}: UV {{ point.uv }}</title>
                      </circle>
                    </g>
                  </svg>
                </div>

                <div class="uv-curve-legend">
                  <div class="legend-item">
                    <span class="legend-color current"></span>
                    <span>Current: UV {{ weatherData?.uv_index ?? '—' }} at {{ currentTimeFormatted }}</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color safe"></span>
                    <span>Safe threshold: UV ≤ 3</span>
                  </div>
                </div>
              </div>
              
              <!-- No UV Data Available Message -->
              <div v-else class="no-uv-data">
                <Icon icon="mdi:alert-circle" :width="32" :height="32" />
                <div>
                  <h4>UV Data Not Available</h4>
                  <p>We couldn't retrieve UV forecast data for this location. This may happen for very small cities or remote areas. Try a nearby larger city instead.</p>
                </div>
              </div>

              <div class="time-recommendations">
                <div class="time-slot optimal" v-if="todaySlots.morning">
                  <div class="time-icon"><Icon icon="wi:sunrise" :width="24" :height="24" /></div>
                  <div class="time-info">
                    <div class="time-range">
                      {{ new Date(todaySlots.morning.timeISO).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                    </div>
                    <div class="time-desc">Optimal window for Vitamin D synthesis (UV {{ todaySlots.morning.uv }})</div>
                    <div class="time-note">{{ todaySlots.morning.minutes }} mins recommended</div>
                    <div v-if="todaySlots.morning.warning" class="time-warning">⚠ {{ todaySlots.morning.warning }}</div>
                  </div>
                </div>

                <div class="time-slot safe" v-if="todaySlots.afternoon">
                  <div class="time-icon"><Icon icon="wi:cloudy" :width="24" :height="24" /></div>
                  <div class="time-info">
                    <div class="time-range">
                      {{ new Date(todaySlots.afternoon.timeISO).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                    </div>
                    <div class="time-desc">Safe for outdoor activities (UV {{ todaySlots.afternoon.uv }})</div>
                    <div class="time-note">{{ todaySlots.afternoon.minutes }} mins recommended</div>
                    <div v-if="todaySlots.afternoon.warning" class="time-warning">⚠ {{ todaySlots.afternoon.warning }}</div>
                  </div>
                </div>

                <div v-if="!todaySlots.morning && !todaySlots.afternoon" class="time-slot moderate">
                  <div class="time-icon"><Icon icon="material-symbols:warning" :width="24" :height="24" /></div>
                  <div class="time-info">
                    <div class="time-range">No safe window found</div>
                    <div class="time-desc">Consider shade walks or indoor mobility</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Today's Activities Card -->
            <div class="todays-activities-card">
              <div class="activities-header">
                <div class="person-icon"><Icon icon="mdi:account" :width="20" :height="20" /></div>
                <h3>Today's Activities</h3>
                <span class="suggestions-count">{{ suggestionsCount }} Suggestions</span>
              </div>

              <div class="weather-summary">
                <div class="weather-icon"><Icon icon="wi:day-cloudy" :width="32" :height="32" /></div>
                <div class="weather-info">
                  <div class="temperature">{{ Math.round(weatherData?.main?.temp || 22) }}°C</div>
                  <div class="weather-desc">{{ weatherData?.weather?.[0]?.description || '—' }}</div>
                </div>
              </div>

              <div class="activity-suggestions">
                <div v-if="todaySlots.morning" class="activity-item">
                  <div class="activity-icon"><Icon icon="mdi:walk" :width="24" :height="24" /></div>
                  <div class="activity-details">
                    <div class="activity-name">{{ todaySlots.morning.activity }}</div>
                    <div class="activity-meta">
                      {{ todaySlots.morning.minutes }} mins |
                      UV {{ todaySlots.morning.uv }} |
                      {{ new Date(todaySlots.morning.timeISO).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                    </div>
                  </div>
                </div>

                <div v-if="todaySlots.afternoon" class="activity-item">
                  <div class="activity-icon"><Icon icon="mdi:bike" :width="24" :height="24" /></div>
                  <div class="activity-details">
                    <div class="activity-name">{{ todaySlots.afternoon.activity }}</div>
                    <div class="activity-meta">
                      {{ todaySlots.afternoon.minutes }} mins |
                      UV {{ todaySlots.afternoon.uv }} |
                      {{ new Date(todaySlots.afternoon.timeISO).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }}
                    </div>
                  </div>
                </div>

                <div v-if="!todaySlots.morning && !todaySlots.afternoon" class="activity-item">
                  <div class="activity-icon"><Icon icon="mdi:home" :width="24" :height="24" /></div>
                  <div class="activity-details">
                    <div class="activity-name">Indoor mobility</div>
                    <div class="activity-meta">10–15 mins | Stretching / balance</div>
                  </div>
                </div>
              </div>
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
                  <button class="nav-arrow nav-left" @click="prevMainImage" aria-label="Previous activity">
                    <Icon icon="mdi:chevron-left" :width="24" :height="24" />
                  </button>
                  <button class="nav-arrow nav-right" @click="nextMainImage" aria-label="Next activity">
                    <Icon icon="mdi:chevron-right" :width="24" :height="24" />
                  </button>
                  
                  <!-- Stacked images -->
                  <div class="images-stack">
                    <div 
                      v-for="(activity, index) in activityGallery" 
                      :key="activity.id"
                      class="stacked-image"
                      :class="getStackPosition(index)"
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
            <div>
              <h4>Did You Know?</h4>
              <p>Just 15 minutes of morning sun exposure can help regulate your circadian rhythm, improve mood, and boost vitamin D production. Melbourne's UV levels are perfect for safe outdoor activities before 10 AM!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { weatherAPI } from '@/services/api.js'
import { Icon } from '@iconify/vue'
import { buildWeeklyPlan, vitaminDNudge, getQuestionnaireProfile } from '@/services/plan'

export default {
  name: 'LetsGetOutsideView',
  components: { Header, Icon },

  data() {
    return {
      // Chart dimensions
      chartWidth: 600,
      chartHeight: 300,
      padding: { top: 40, right: 30, bottom: 50, left: 60 },
      
      // Weather data
      weatherData: { main: { temp: 0 }, weather: [{ description: 'Loading...' }], name: 'Melbourne', uv_index: 0 },
      locationData: { city: 'Melbourne', state: 'Victoria', lat: null, lon: null },
      isLoadingWeather: false,
      weatherError: null,

      // Search
      searchLocation: '',
      updateBusy: false,
      updateStatus: '',
      updateStatusType: 'idle',

      // Profile
      profile: null,
      vitaminDStatus: null,
      nudgeText: '',

      // Weekly plan
      planWeek: [],
      todaySlots: { morning: null, afternoon: null },
      suggestionsCount: 0,

      // UV curve data
      uvSeries: [],

      // Auto-refresh interval
      refreshInterval: null,

      // Visuals
      weekDays: [
        { name: 'Mon', activity: 'Morning Walk', image: new URL('@/assets/images/activities/morning walk.jpg', import.meta.url).href, isToday: false },
        { name: 'Tue', activity: 'Beach Yoga', image: new URL('@/assets/images/activities/beach yoga.jpg', import.meta.url).href, isToday: false },
        { name: 'Wed', activity: 'Park Cycling', image: new URL('@/assets/images/activities/park cycling.jpg', import.meta.url).href, isToday: false },
        { name: 'Thu', activity: 'Garden Visit', image: new URL('@/assets/images/activities/garden visit.jpg', import.meta.url).href, isToday: false },
        { name: 'Fri', activity: 'River Trail', image: new URL('@/assets/images/activities/river trial.jpg', import.meta.url).href, isToday: false },
        { name: 'Sat', activity: 'Outdoor Fitness', image: new URL('@/assets/images/activities/outdoor fitness.jpg', import.meta.url).href, isToday: false },
        { name: 'Sun', activity: 'Nature Hike', image: new URL('@/assets/images/activities/nature hike.jpg', import.meta.url).href, isToday: false }
      ],

      showActivityGallery: false,
      currentSlide: 0,
      activityGallery: [
        { id: 1, title: 'Surfing Adventure', subtitle: 'Ride the Perfect Wave', image: new URL('@/assets/images/new-activities/Surfing.jpg', import.meta.url).href },
        { id: 2, title: 'Basketball Training', subtitle: 'Court Skills Development', image: new URL('@/assets/images/new-activities/play basketball.jpg', import.meta.url).href },
        { id: 3, title: 'Tennis Match', subtitle: 'Competitive Court Action', image: new URL('@/assets/images/new-activities/play tennis.jpg', import.meta.url).href },
        { id: 4, title: 'Horse Riding', subtitle: 'Equestrian Adventure', image: new URL('@/assets/images/new-activities/riding.jpg', import.meta.url).href },
        { id: 5, title: 'Outdoor Swimming', subtitle: 'Natural Water Experience', image: new URL('@/assets/images/new-activities/swimming outside.jpg', import.meta.url).href }
      ]
    }
  },

  computed: {
    // Y-axis ticks (UV values)
    yAxisTicks() {
      return [0, 3, 6, 9, 12].map(v => ({
        value: v,
        label: v.toString()
      }))
    },

    // X-axis ticks (time labels)
    xAxisTicks() {
      if (!this.uvSeries.length) return []
      const n = this.uvSeries.length
      const indices = [0, Math.floor(n * 0.25), Math.floor(n * 0.5), Math.floor(n * 0.75), n - 1]
      
      return indices.map(idx => ({
        index: idx,
        label: this.formatTime(this.uvSeries[idx].t)
      }))
    },

    // Generate SVG path for UV line
    uvLinePath() {
      if (!this.uvSeries.length) return ''
      
      const points = this.uvSeries.map((point, idx) => ({
        x: this.getX(idx),
        y: this.getY(point.uv)
      }))

      let path = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`
      }
      
      return path
    },

    // Find the closest data point to current time
    currentTimeIndex() {
      if (!this.uvSeries.length) return null
      
      const now = new Date()
      let closestIndex = 0
      let minDiff = Math.abs(this.uvSeries[0].t - now)
      
      for (let i = 1; i < this.uvSeries.length; i++) {
        const diff = Math.abs(this.uvSeries[i].t - now)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = i
        }
      }
      
      // Only show marker if within 2 hours of a data point
      if (minDiff > 2 * 60 * 60 * 1000) return null
      
      return closestIndex
    },

    // Format current time for legend
    currentTimeFormatted() {
      const now = new Date()
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    // Calculate today's UV min/max from series
    todayUVMin() {
      if (!this.uvSeries.length) return 0
      return Math.round(Math.min(...this.uvSeries.map(p => p.uv)) * 10) / 10
    },

    todayUVMax() {
      if (!this.uvSeries.length) return 0
      return Math.round(Math.max(...this.uvSeries.map(p => p.uv)) * 10) / 10
    },

    // Get current UV value from the curve data at current time
    currentUVValue() {
      // First try to get from the closest point in UV series
      if (this.currentTimeIndex !== null && this.uvSeries[this.currentTimeIndex]) {
        return Math.round(this.uvSeries[this.currentTimeIndex].uv * 10) / 10
      }
      
      // Fallback to weatherData
      if (this.weatherData?.uv_index != null) {
        return Math.round(this.weatherData.uv_index * 10) / 10
      }
      
      return 0
    },

    todayUVMinTime() {
      if (!this.uvSeries.length) return ''
      const minUV = this.todayUVMin
      const point = this.uvSeries.find(p => Math.round(p.uv * 10) / 10 === minUV)
      return point ? this.formatTime(point.t) : ''
    },

    todayUVMaxTime() {
      if (!this.uvSeries.length) return ''
      const maxUV = this.todayUVMax
      const point = this.uvSeries.find(p => Math.round(p.uv * 10) / 10 === maxUV)
      return point ? this.formatTime(point.t) : ''
    }
  },

  methods: {
    // Chart coordinate calculations
    getX(index) {
      const plotWidth = this.chartWidth - this.padding.left - this.padding.right
      const n = Math.max(this.uvSeries.length - 1, 1)
      return this.padding.left + (index / n) * plotWidth
    },

    getY(uvValue) {
      const plotHeight = this.chartHeight - this.padding.top - this.padding.bottom
      const clampedUV = Math.max(0, Math.min(12, uvValue))
      return this.padding.top + plotHeight - (clampedUV / 12) * plotHeight
    },

    formatTime(date) {
      const d = date instanceof Date ? date : new Date(date)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    // Questionnaire
    readQuestionnaire() {
      const raw = localStorage.getItem('vd_questionnaire_result')
      if (!raw) return null
      try { return JSON.parse(raw) } catch { return null }
    },

    // Week "today" highlight
    setTodayInWeekDays() {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const todayName = dayNames[new Date().getDay()]
      this.weekDays.forEach(d => d.isToday = (d.name === todayName))
    },

    // UV label helper
    getUVLevelText(uvIndex) {
      if (uvIndex == null) return 'Unknown'
      if (uvIndex <= 2) return 'Low'
      if (uvIndex <= 5) return 'Moderate'
      if (uvIndex <= 7) return 'High'
      if (uvIndex <= 10) return 'Very High'
      return 'Extreme'
    },

    // Get UV level CSS class
    getUVClass(uvIndex) {
      if (uvIndex <= 2) return 'uv-low'
      if (uvIndex <= 5) return 'uv-moderate'
      if (uvIndex <= 7) return 'uv-high'
      if (uvIndex <= 10) return 'uv-very-high'
      return 'uv-extreme'
    },

    // Weather: current
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true })
      })
    },

    async fetchWeatherData() {
      this.isLoadingWeather = true
      this.weatherError = null
      try {
        let resNow
        try {
          const pos = await this.getCurrentPosition()
          this.locationData.lat = pos.coords.latitude
          this.locationData.lon = pos.coords.longitude
          resNow = await weatherAPI.getWeatherByCoords(this.locationData.lat, this.locationData.lon)
        } catch {
          resNow = await weatherAPI.getWeather()
        }

        if (resNow?.success) {
          this.weatherData = {
            main: { temp: resNow.weather.temp },
            weather: [{ description: resNow.weather.condition }],
            name: resNow.weather.location || this.locationData.city,
            uv_index: resNow.weather.uv_index
          }
          const [city, state = ''] = (resNow.weather.location || this.locationData.city).split(', ')
          this.locationData.city = city
          this.locationData.state = state
        } else {
          throw new Error(resNow?.error || 'Failed to fetch weather data')
        }
      } catch (e) {
        console.error(e)
        this.weatherError = 'Unable to load current weather. Showing defaults.'
        this.weatherData = { main: { temp: 22 }, weather: [{ description: 'Partly Cloudy' }], name: this.locationData.city || 'Melbourne', uv_index: 3 }
      } finally {
        this.isLoadingWeather = false
      }
    },

    // Weather: forecast
    async fetchForecast() {
      try {
        let resFc
        if (this.locationData.lat && this.locationData.lon) {
          resFc = await weatherAPI.getForecastByCoords(this.locationData.lat, this.locationData.lon)
        } else if (this.locationData.city) {
          resFc = await weatherAPI.getForecastByCity(this.locationData.city)
        } else {
          resFc = await weatherAPI.getForecastByCity('Melbourne')
        }

        // Check if forecast data is valid
        if (!resFc || !resFc.days || resFc.days.length === 0) {
          console.warn('No forecast data returned from API')
          this.weatherError = `No UV forecast available for ${this.locationData.city}. UV data may not be available for smaller cities.`
          this.uvSeries = []
          return
        }

        const forecastDaily = (resFc?.days || []).map(d => ({
          dateISO: d.dateISO,
          hours: (d.hours || []).map(h => ({
            timeISO: h.timeISO,
            uv: Number(h.uv) || 0,
            condition: h.condition || '',
            tempC: h.tempC ?? h.temp_c ?? 20
          }))
        }))

        if (!forecastDaily.length) {
          this.weatherError = 'No forecast data available for this location.'
          this.uvSeries = []
          return
        }

        // Build plan
        this.planWeek = buildWeeklyPlan({
          profile: this.profile || { skinType: 'III', clothing: 'normal' },
          forecastDaily
        })

        // Get TODAY's date in the user's local timezone
        const now = new Date()
        const todayISO = now.toISOString().slice(0, 10)
        
        console.log('Current date:', todayISO, 'Current time:', now.toLocaleTimeString())

        // Pick today's data
        const today = this.planWeek.find(d => (d.dateISO || '').slice(0, 10) === todayISO) || this.planWeek[0]
        this.todaySlots = { morning: today?.morning || null, afternoon: today?.afternoon || null }
        this.suggestionsCount = [this.todaySlots.morning, this.todaySlots.afternoon].filter(Boolean).length

        // Fill Week cards
        const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        this.planWeek.forEach((d, i) => {
          const card = this.weekDays.find(x => x.name === order[i % 7])
          if (card) card.activity = (d.morning?.activity || d.afternoon?.activity || card.activity)
        })

        // UV series for TODAY only
        const todayRaw = (resFc?.days || []).find(d => {
          const dayDate = (d.dateISO || '').slice(0, 10)
          return dayDate === todayISO
        })
        
        if (!todayRaw || !todayRaw.hours || todayRaw.hours.length === 0) {
          console.warn('No hourly UV data for today')
          this.weatherError = `Limited UV data for ${this.locationData.city}. Try a larger nearby city for detailed UV forecasts.`
          this.uvSeries = []
          return
        }

        // Parse and filter today's UV data
        this.uvSeries = (todayRaw?.hours || [])
          .filter(h => {
            if (!h.timeISO) return false
            // Ensure the hour belongs to TODAY
            const hourDate = new Date(h.timeISO)
            const hourDateISO = hourDate.toISOString().slice(0, 10)
            return hourDateISO === todayISO
          })
          .map(h => ({ 
            t: new Date(h.timeISO), 
            uv: Number(h.uv) || 0 
          }))
          .sort((a, b) => a.t - b.t)

        console.log(`UV data loaded for ${todayISO}: ${this.uvSeries.length} data points`)
        
        if (this.uvSeries.length > 0) {
          console.log('First point:', this.uvSeries[0].t.toLocaleString(), 'UV:', this.uvSeries[0].uv)
          console.log('Last point:', this.uvSeries[this.uvSeries.length - 1].t.toLocaleString(), 'UV:', this.uvSeries[this.uvSeries.length - 1].uv)
        }

        // If we got UV data, clear any previous errors related to UV
        if (this.uvSeries.length > 0 && this.weatherError && this.weatherError.includes('UV')) {
          this.weatherError = null
        }

        // Update current UV from the series if available
        if (this.currentTimeIndex !== null && this.uvSeries[this.currentTimeIndex]) {
          this.weatherData.uv_index = Math.round(this.uvSeries[this.currentTimeIndex].uv)
        } else {
          // Otherwise use the minimum safe UV from today's slots
          const uvPick = Math.min(
            ...[this.todaySlots.morning?.uv, this.todaySlots.afternoon?.uv].filter(v => typeof v === 'number' && v > 0),
            this.weatherData.uv_index || 99
          )
          if (isFinite(uvPick)) this.weatherData.uv_index = Math.round(uvPick)
        }
        
      } catch (e) {
        console.error('Forecast fetch error:', e)
        this.weatherError = `Failed to load forecast for ${this.locationData.city}. ${e.message || 'Please try again or use a different location.'}`
        this.uvSeries = []
      }
    },

    // Manual city search
    async updateLocation() {
      if (!this.searchLocation.trim()) {
        this.updateStatus = 'Please enter a city name to update.'
        this.updateStatusType = 'warn'
        return
      }

      this.updateBusy = true
      this.updateStatus = 'Searching for location...'
      this.updateStatusType = 'idle'
      this.weatherError = null

      const cityQuery = this.searchLocation.trim()

      try {
        // Validate city name format (basic check)
        if (cityQuery.length < 2) {
          throw new Error('City name too short. Please enter at least 2 characters.')
        }

        if (/[^a-zA-Z\s,\-']/.test(cityQuery)) {
          throw new Error('Invalid characters in city name. Use only letters, spaces, commas, and hyphens.')
        }

        const resNow = await weatherAPI.getWeatherByCity(cityQuery)

        if (!resNow?.success) {
          const msg = (resNow?.error || '').toLowerCase().includes('not found')
            ? `City not found: "${cityQuery}". Please check spelling or try a larger nearby city.`
            : (resNow?.error || 'Failed to fetch weather data')
          throw new Error(msg)
        }

        this.weatherData = {
          main: { temp: resNow.weather.temp },
          weather: [{ description: resNow.weather.condition }],
          name: resNow.weather.location || cityQuery,
          uv_index: resNow.weather.uv_index
        }
        const [city, state = ''] = (resNow.weather.location || cityQuery).split(', ')
        this.locationData = { city, state, lat: null, lon: null }

        // Fetch forecast
        this.updateStatus = 'Loading UV forecast...'
        await this.fetchForecast()

        // Check if we got UV data
        if (this.uvSeries.length === 0) {
          this.updateStatus = `Weather data loaded for ${this.locationData.city}, but UV forecast is unavailable. Try a larger city.`
          this.updateStatusType = 'warn'
        } else {
          this.updateStatus = `Updated successfully for ${this.locationData.city}${this.locationData.state ? ', ' + this.locationData.state : ''} at ${new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}`
          this.updateStatusType = 'ok'
        }

      } catch (e) {
        console.error('Update location error:', e)
        
        // Provide specific error messages
        let errorMessage = e.message || 'Unable to update location.'
        
        if (errorMessage.includes('not found') || errorMessage.includes('City not found')) {
          errorMessage = `"${cityQuery}" not found. Please try:\n• Check spelling (e.g., "Melbourne" not "Melbourn")\n• Use a larger nearby city\n• Add country code (e.g., "Carlton, AU")`
        } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.'
        } else if (errorMessage.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.'
        }
        
        this.weatherError = errorMessage
        this.updateStatus = 'Update failed. Please try again.'
        this.updateStatusType = 'error'
      } finally {
        this.updateBusy = false
      }
    },

    // Gallery controls
    toggleActivityGallery() {
      this.showActivityGallery = !this.showActivityGallery
      if (this.showActivityGallery) this.currentSlide = 0
    },
    
    nextMainImage() {
      this.currentSlide = (this.currentSlide + 1) % this.activityGallery.length
    },
    
    prevMainImage() {
      this.currentSlide = this.currentSlide === 0 ? this.activityGallery.length - 1 : this.currentSlide - 1
    },
    
    setMainImage(i) {
      this.currentSlide = i
    },

    getStackPosition(index) {
      const diff = (index - this.currentSlide + this.activityGallery.length) % this.activityGallery.length
      if (diff === 0) return 'front'
      if (diff === 1) return 'back-1'
      if (diff === 2) return 'back-2'
      if (diff === 3) return 'back-3'
      return 'back-4'
    }
  },

  async mounted() {
    // Questionnaire → profile
    const q = this.readQuestionnaire()
    this.profile = {
      skinType: q?.skinType || 'III',
      clothing: q?.clothing || 'normal',
      location: q?.location || null
    }
    this.vitaminDStatus = q?.vitaminDStatus || null
    this.nudgeText = vitaminDNudge(this.vitaminDStatus)

    // Visuals
    this.setTodayInWeekDays()

    // Data → plan
    await this.fetchWeatherData()
    await this.fetchForecast()

    // Auto-refresh every 30 minutes to ensure we have current data
    this.refreshInterval = setInterval(() => {
      console.log('Auto-refreshing weather data...')
      this.fetchWeatherData()
      this.fetchForecast()
    }, 30 * 60 * 1000) // 30 minutes
  },

  beforeUnmount() {
    // Clear interval when component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }
}
</script>

<style scoped>
/* Main Layout */
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

@keyframes backgroundFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Let's Get Outside Section */
.lets-get-outside {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fed7aa 100%);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 2px solid #f59e0b;
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1);
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

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.outside-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;
}

.sun-icon {
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
  color: #f59e0b;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

.outside-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Location Search Container */
.location-search-container {
  margin: 1.5rem 0 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.8) 100%);
  border-radius: 20px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
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
}

.search-box:focus-within {
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15), 0 8px 25px rgba(245, 158, 11, 0.2);
  transform: translateY(-2px);
}

.location-icon {
  color: #f59e0b;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
}

.location-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  color: #374151;
  background: transparent;
}

.location-input::placeholder {
  color: #9ca3af;
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
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.update-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.update-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
}

.temperature {
  font-weight: 700;
  color: #f59e0b;
  font-size: 1.2rem;
}

.weather-condition {
  color: #6b7280;
  text-transform: capitalize;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

/* Status Messages */
.status-message, .error-message {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.5;
  white-space: pre-line;
}

.status-message.ok {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.status-message.warn {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

.status-message.error, .error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.status-message.idle {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
}

/* Outside Content Grid */
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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.safe-sun-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08);
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

/* UV Index Display - Improved Range View */
.uv-index-display {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 16px;
  border: 2px solid #fde68a;
}

.uv-range-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.uv-range-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.uv-range-values {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.uv-min,
.uv-max {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.uv-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f59e0b;
  line-height: 1;
}

.uv-arrow {
  font-size: 2rem;
  color: #d97706;
  font-weight: 700;
}

.uv-current-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.current-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.current-uv {
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
}

.current-uv.uv-low {
  background: #d1fae5;
  color: #065f46;
}

.current-uv.uv-moderate {
  background: #fef3c7;
  color: #92400e;
}

.current-uv.uv-high {
  background: #fed7aa;
  color: #9a3412;
}

.current-uv.uv-very-high {
  background: #fecaca;
  color: #991b1b;
}

.current-uv.uv-extreme {
  background: #ddd6fe;
  color: #5b21b6;
}

.current-level {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
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

/* UV Curve Chart - IMPROVED */
.uv-curve-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.uv-curve-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.uv-curve-header strong {
  font-size: 1rem;
  color: #1f2937;
}

.uv-curve-sub {
  color: #6b7280;
  font-size: 0.8rem;
}

.uv-curve-container {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #f3f4f6;
}

.uv-chart {
  width: 100%;
  height: auto;
  display: block;
}

/* Grid lines */
.grid-line {
  stroke: #f3f4f6;
  stroke-width: 1;
}

.grid-line.safe-threshold {
  stroke: #22c55e;
  stroke-width: 1.5;
  stroke-dasharray: 5 5;
  opacity: 0.5;
}

/* Axes */
.axis-line {
  stroke: #9ca3af;
  stroke-width: 2;
}

.axis-title {
  fill: #374151;
  font-size: 12px;
  font-weight: 600;
}

.tick-mark {
  stroke: #9ca3af;
  stroke-width: 1;
}

.tick-label {
  fill: #6b7280;
  font-size: 11px;
}

/* UV line */
.uv-line {
  stroke: #f59e0b;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
}

/* Data points */
.data-point {
  fill: #f59e0b;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point:hover {
  r: 5;
  fill: #d97706;
}

.data-point.safe-point {
  fill: #22c55e;
}

.data-point.safe-point:hover {
  fill: #16a34a;
}

.data-point.current-point {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 3;
}

/* Current Time Marker Styles */
.current-time-line {
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-dasharray: 5 5;
  opacity: 0.7;
}

.clock-bg {
  fill: #3b82f6;
  opacity: 0.9;
}

.clock-face {
  fill: #ffffff;
  stroke: #3b82f6;
  stroke-width: 1;
}

.clock-hand-hour,
.clock-hand-minute {
  stroke: #3b82f6;
  stroke-width: 1.5;
  stroke-linecap: round;
}

.clock-center {
  fill: #3b82f6;
}

.current-uv-marker {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 3;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4));
}

.current-uv-marker-pulse {
  fill: #3b82f6;
  stroke: none;
  opacity: 0.4;
  animation: uvPulse 2s ease-in-out infinite;
}

@keyframes uvPulse {
  0%, 100% {
    r: 6;
    opacity: 0.4;
  }
  50% {
    r: 12;
    opacity: 0;
  }
}

.current-time-label {
  fill: #3b82f6;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* No UV Data Message */
.no-uv-data {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  color: #991b1b;
}

.no-uv-data h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #b91c1c;
}

.no-uv-data p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #7f1d1d;
}

/* Legend */
.uv-curve-legend {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.legend-color {
  width: 20px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.current {
  background: #f59e0b;
}

.legend-color.safe {
  background: #22c55e;
}

/* Time Recommendations */
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
  transition: all 0.3s ease;
}

.time-slot:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 1.05rem;
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

.time-warning {
  font-size: 0.75rem;
  color: #d97706;
  margin-top: 0.5rem;
}

/* Today's Activities Card */
.todays-activities-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  color: #1f2937;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
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

.person-icon {
  color: #3b82f6;
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
  color: #f59e0b;
}

.weather-info .temperature {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.weather-desc {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

.activity-suggestions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 100%);
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

/* Week at a Glance */
.week-glance {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(10px);
}

.week-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.week-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  flex: 1;
  color: #1f2937;
}

.calendar-icon {
  color: #22c55e;
}

.discover-btn {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.discover-btn:hover {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
}

.week-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-card {
  text-align: center;
  padding: 1rem 0.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%);
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.day-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.day-card.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
  transform: translateY(-2px) scale(1.02);
}

.day-name {
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.day-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin: 0 auto 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.day-activity {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

/* Activity Gallery */
.activity-gallery {
  margin-top: 1.5rem;
}

.gallery-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
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
  color: #1f2937;
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

/* Stacked Images Gallery */
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

.stacked-image.front {
  width: 500px;
  height: 350px;
  z-index: 5;
  transform: translateX(0) scale(1);
  opacity: 1;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.stacked-image.back-1 {
  width: 420px;
  height: 300px;
  z-index: 4;
  transform: translateX(180px) scale(0.9);
  opacity: 0.8;
}

.stacked-image.back-2 {
  width: 360px;
  height: 260px;
  z-index: 3;
  transform: translateX(320px) scale(0.8);
  opacity: 0.6;
}

.stacked-image.back-3 {
  width: 320px;
  height: 230px;
  z-index: 2;
  transform: translateX(-180px) scale(0.7);
  opacity: 0.5;
}

.stacked-image.back-4 {
  width: 280px;
  height: 200px;
  z-index: 1;
  transform: translateX(-320px) scale(0.6);
  opacity: 0.4;
}

.stacked-image:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  z-index: 2;
}

.image-overlay h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.image-overlay p {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.nav-arrow {
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

.nav-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.nav-left {
  left: 20px;
}

.nav-right {
  right: 20px;
}

/* Did You Know */
.did-you-know {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.did-you-know:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08);
}

.knowledge-icon {
  font-size: 2rem;
  margin-top: 0.25rem;
  color: #3b82f6;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.did-you-know h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.did-you-know p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .outside-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .week-days {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .lets-get-outside {
    padding: 1.5rem;
  }
  
  .outside-title {
    font-size: 1.75rem;
  }
  
  .location-search-container {
    padding: 1.5rem;
  }
  
  .search-box {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .location-input {
    text-align: center;
    padding: 0.75rem;
  }
  
  .update-btn {
    width: 100%;
    justify-content: center;
  }
  
  .weather-info-summary {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  /* UV Range Display Mobile */
  .uv-range-values {
    flex-direction: column;
    gap: 0.5rem;
  }

  .uv-arrow {
    transform: rotate(90deg);
    font-size: 1.5rem;
  }

  .uv-value {
    font-size: 2rem;
  }

  .uv-current-indicator {
    flex-wrap: wrap;
  }
  
  .week-days {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .day-image {
    width: 50px;
    height: 50px;
  }
  
  .stacked-container {
    height: 300px;
  }
  
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
  
  .nav-arrow {
    width: 40px;
    height: 40px;
  }
  
  .nav-left {
    left: 15px;
  }
  
  .nav-right {
    right: 15px;
  }
  
  .did-you-know {
    flex-direction: column;
    text-align: center;
  }
  
  /* UV Chart responsive adjustments */
  .uv-curve-card {
    padding: 1rem;
  }
  
  .axis-title {
    font-size: 10px;
  }
  
  .tick-label {
    font-size: 9px;
  }
}

@media (max-width: 480px) {
  .lets-get-outside {
    padding: 1rem;
  }
  
  .outside-title {
    font-size: 1.5rem;
  }
  
  .location-search-container {
    padding: 1rem;
  }
  
  .week-days {
    grid-template-columns: repeat(2, 1fr);
  }
  
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
  
  .image-overlay h4 {
    font-size: 1.25rem;
  }
  
  .image-overlay {
    padding: 1.5rem 1rem 1rem;
  }
  
  .uv-curve-card {
    padding: 0.75rem;
  }
  
  .uv-curve-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>