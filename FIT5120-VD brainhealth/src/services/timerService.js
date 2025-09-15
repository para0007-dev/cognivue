// Global Timer Service for persistent timing across page navigation
class TimerService {
  constructor() {
    this.isRunning = false
    this.timerStartTime = null
    this.selectedDuration = 15 // minutes
    this.remainingTime = 900 // seconds
    this.selectedSkinType = null
    this.globalInterval = null
    this.callbacks = new Set()
    
    // Restore state on service initialization
    this.restoreTimerState()
    
    // Start global timer checker
    this.startGlobalChecker()
  }
  
  // Subscribe to timer updates
  subscribe(callback) {
    this.callbacks.add(callback)
    // Immediately call with current state
    callback(this.getState())
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback)
    }
  }
  
  // Initialize timer service (restore state)
  initialize() {
    this.restoreTimerState()
    this.startGlobalChecker()
  }

  // Select skin type
  selectSkinType(index, skinTypes) {
    this.selectedSkinType = index
    this.selectedDuration = skinTypes[index].recommendedTime
    this.remainingTime = this.selectedDuration * 60 // convert minutes to seconds
    this.timerStartTime = null // Reset start time when changing skin type
    this.resetTimer()
    
    // Save state after skin type selection
    this.saveTimerState()
    this.notifySubscribers()
  }
  
  // Notify all subscribers
  notifySubscribers() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.getState())
      } catch (error) {
        console.error('Error in timer subscriber:', error)
      }
    })
  }
  
  // Get current timer state
  getState() {
    return {
      isRunning: this.isRunning,
      remainingTime: this.remainingTime,
      selectedDuration: this.selectedDuration,
      selectedSkinType: this.selectedSkinType,
      timerStartTime: this.timerStartTime,
      progressPercentage: this.getProgressPercentage(),
      timerStatus: this.getTimerStatus()
    }
  }
  
  // Calculate progress percentage
  getProgressPercentage() {
    if (this.selectedDuration === null) return 0
    const totalSeconds = this.selectedDuration * 60
    const elapsedSeconds = totalSeconds - this.remainingTime
    return Math.min((elapsedSeconds / totalSeconds) * 100, 100)
  }
  
  // Get timer status text
  getTimerStatus() {
    if (this.remainingTime === 0 && this.selectedDuration !== null) {
      return 'Session Complete!'
    } else if (this.isRunning) {
      return 'Timer Running'
    } else if (this.remainingTime > 0 && this.remainingTime < this.selectedDuration * 60) {
      return 'Timer Paused'
    } else {
      return 'Ready to Start'
    }
  }
  
  // Start global timer checker
  startGlobalChecker() {
    if (this.globalInterval) {
      clearInterval(this.globalInterval)
    }
    
    this.globalInterval = setInterval(() => {
      if (this.isRunning && this.timerStartTime) {
        this.updateTimerFromStartTime()
      }
    }, 1000)
  }
  
  // Update timer based on start time
  updateTimerFromStartTime() {
    if (!this.timerStartTime || !this.selectedDuration) return
    
    const now = Date.now()
    const elapsedSeconds = Math.floor((now - this.timerStartTime) / 1000)
    const totalSeconds = this.selectedDuration * 60
    this.remainingTime = Math.max(0, totalSeconds - elapsedSeconds)
    
    if (this.remainingTime === 0) {
      this.completeTimer()
    }
    
    // Save state and notify subscribers
    this.saveTimerState()
    this.notifySubscribers()
  }
  
  // Start timer
  startTimer() {
    if (this.remainingTime === 0 || this.selectedSkinType === null) return
    
    this.isRunning = true
    
    // Set start time if not already set
    if (!this.timerStartTime) {
      this.timerStartTime = Date.now() - (this.selectedDuration * 60 - this.remainingTime) * 1000
    }
    
    this.saveTimerState()
    this.notifySubscribers()
  }
  
  // Pause timer
  pauseTimer() {
    this.isRunning = false
    this.saveTimerState()
    this.notifySubscribers()
  }
  
  // Reset timer
  resetTimer() {
    this.isRunning = false
    this.timerStartTime = null
    if (this.selectedDuration) {
      this.remainingTime = this.selectedDuration * 60
    }
    this.clearTimerState()
    this.notifySubscribers()
  }
  
  // Complete timer
  completeTimer() {
    this.isRunning = false
    this.remainingTime = 0
    this.timerStartTime = null
    this.clearTimerState()
    this.notifySubscribers()
    
    // Trigger completion callback
    this.onTimerComplete()
  }
  
  // Timer completion handler
  onTimerComplete() {
    // This will be handled by the component that subscribes
    console.log('Timer completed!')
  }
  
  // Select skin type
  selectSkinType(index, skinTypes) {
    this.selectedSkinType = index
    this.selectedDuration = skinTypes[index].recommendedTime
    this.remainingTime = this.selectedDuration * 60
    this.timerStartTime = null
    this.isRunning = false
    
    this.saveTimerState()
    this.notifySubscribers()
  }
  
  // Save timer state to localStorage
  saveTimerState() {
    const timerState = {
      selectedSkinType: this.selectedSkinType,
      selectedDuration: this.selectedDuration,
      remainingTime: this.remainingTime,
      isRunning: this.isRunning,
      timerStartTime: this.timerStartTime,
      timestamp: Date.now()
    }
    localStorage.setItem('sunExposureTimer', JSON.stringify(timerState))
  }
  
  // Restore timer state from localStorage
  restoreTimerState() {
    const savedState = localStorage.getItem('sunExposureTimer')
    if (!savedState) return
    
    try {
      const timerState = JSON.parse(savedState)
      const now = Date.now()
      
      // Check if saved state is recent (within 24 hours)
      if (now - timerState.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('sunExposureTimer')
        return
      }
      
      // Restore state
      if (timerState.selectedSkinType !== null) {
        this.selectedSkinType = timerState.selectedSkinType
      }
      if (timerState.selectedDuration) {
        this.selectedDuration = timerState.selectedDuration
      }
      
      // Restore timer if it was running
      if (timerState.isRunning && timerState.timerStartTime && timerState.selectedDuration) {
        this.timerStartTime = timerState.timerStartTime
        const elapsedSeconds = Math.floor((now - this.timerStartTime) / 1000)
        const totalSeconds = timerState.selectedDuration * 60
        this.remainingTime = Math.max(0, totalSeconds - elapsedSeconds)
        
        if (this.remainingTime > 0) {
          this.isRunning = true
        } else {
          // Timer has completed while away
          this.completeTimer()
        }
      } else if (timerState.remainingTime > 0) {
        // Timer was paused
        this.remainingTime = timerState.remainingTime
        this.isRunning = false
        this.timerStartTime = timerState.timerStartTime
      }
    } catch (error) {
      console.error('Error restoring timer state:', error)
      localStorage.removeItem('sunExposureTimer')
    }
  }
  
  // Clear timer state
  clearTimerState() {
    localStorage.removeItem('sunExposureTimer')
  }
  
  // Format time for display
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Cleanup
  destroy() {
    if (this.globalInterval) {
      clearInterval(this.globalInterval)
      this.globalInterval = null
    }
    this.callbacks.clear()
  }
}

// Create singleton instance
const timerService = new TimerService()

export default timerService