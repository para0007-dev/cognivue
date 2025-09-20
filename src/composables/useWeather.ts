import { ref } from 'vue'
export function useWeather(){
  const loading = ref(false), error = ref<string|null>(null), data = ref<any>(null)

  const loadFromDB = async () => {
    const r = await fetch('/vitamin-d-helper/api/weather/'); if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()
  }
  const loadFromCoords = async (lat:number, lon:number) => {
    const r = await fetch(`/vitamin-d-helper/api/weather/?lat=${lat}&lon=${lon}`)
    if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()
  }

  const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('no geo'))
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 })
  })

  async function loadPreferGeoloc(){
    loading.value = true; error.value = null
    try {
      try {
        const pos = await getPosition()
        data.value = await loadFromCoords(pos.coords.latitude, pos.coords.longitude)
      } catch {
        data.value = await loadFromDB()
      }
    } catch (e:any) {
      error.value = e?.message || 'Failed to load weather'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, data, loadPreferGeoloc }
}
