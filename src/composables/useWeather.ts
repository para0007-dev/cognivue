import { ref } from 'vue'
import { weatherAPI } from '@/services/api'

export function useWeather(){
  const loading = ref(false), error = ref<string|null>(null), data = ref<any>(null)

  const loadPreferGeoloc = async () => {
    loading.value = true
    error.value = null
    try {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!('geolocation' in navigator)) return reject(new Error('no geo'))
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 })
        })
        data.value = await weatherAPI.getWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
      } catch {
        data.value = await weatherAPI.getWeather()
      }
    } catch (e:any) {
      error.value = e?.message || 'Failed to load weather'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, loadPreferGeoloc }
}
