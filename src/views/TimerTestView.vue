<template>
  <div class="timer-test">
    <h1>Timer Test Page</h1>
    <div class="timer-info">
      <p>Current Status: {{ timerState.isRunning ? 'Running' : 'Paused' }}</p>
      <p>Remaining Time: {{ formatTime(timerState.remainingTime) }}</p>
      <p>Selected Skin Type: {{ timerState.selectedSkinType }}</p>
      <p>Selected Duration: {{ timerState.selectedDuration }} minutes</p>
      <p>Progress: {{ timerState.progressPercentage }}%</p>
      <p>Status: {{ timerState.timerStatus }}</p>
    </div>
    
    <div class="controls">
      <button @click="goToSunExposure">Back to Sun Exposure</button>
    </div>
  </div>
</template>

<script>
import timerService from '@/services/timerService'

export default {
  name: 'TimerTestView',
  data() {
    return {
      timerState: {
        isRunning: false,
        remainingTime: 0,
        selectedDuration: null,
        selectedSkinType: null,
        progressPercentage: 0,
        timerStatus: 'Stopped'
      },
      timerUnsubscribe: null
    }
  },
  mounted() {
    // Subscribe to timer service updates
    this.timerUnsubscribe = timerService.subscribe((state) => {
      this.timerState = { ...state }
    })
  },
  beforeUnmount() {
    // Unsubscribe from timer service
    if (this.timerUnsubscribe) {
      this.timerUnsubscribe()
    }
  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    },
    goToSunExposure() {
      this.$router.push('/sun-exposure')
    }
  }
}
</script>

<style scoped>
.timer-test {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.timer-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.timer-info p {
  margin: 10px 0;
  font-size: 16px;
}

.controls {
  text-align: center;
  margin: 20px 0;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #0056b3;
}
</style>