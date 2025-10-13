// src/services/api.js
import axios from "axios";

// Normalize base: add scheme if missing, strip trailing slashes
const raw = import.meta.env.VITE_API_BASE || "";
const BASE = (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/+$/, "");
// Use a stable, module-scoped default so builds/merges don’t drop it
const DEFAULT_FETCH_OPTIONS = Object.freeze({
  headers: { "Content-Type": "application/json" },
  credentials: "include",
});

// Central endpoints (leading slash only)
const API_ENDPOINTS = {
  weather: "/vitamin-d-helper/api/weather/",
  skinTypes: "/vitamin-d-helper/api/skin-types/",
  recommendation: "/vitamin-d-helper/api/recommendation/",
  timer: "/timer/api/timer/",
  news: "/brain-health-news/",
  insights: "/insights/",
  nutrition: "/nutrition/",
};

// Safe join
function joinUrl(endpoint) {
  const p = `${endpoint}`.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${BASE}${p}`;
}

// Generic fetch wrapper
// Generic fetch wrapper (robust against stale/minified bundles)
async function apiRequest(endpoint, options = {}) {
  const url = joinUrl(endpoint);
  const merged = { ...DEFAULT_FETCH_OPTIONS, ...options };
  const res = await fetch(url, merged);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


// ---- Feature APIs ----
export const weatherAPI = {
  // NOW - Current weather
  getWeather: async () => {
    try {
      const { ok, json, status } = await apiRequest(API_ENDPOINTS.weather);
      if (!ok) {
        const errorMsg = json?.error || `Weather request failed (HTTP ${status})`;
        throw new Error(errorMsg);
      }
      return {
        success: true,
        weather: {
          location: json.location || "Unknown",
          condition: json.condition || "Unknown",
          temp: json.temp || 0,
          uv_index: json.uv_index || 0,
        },
      };
    } catch (error) {
      console.error("getWeather error:", error);
      throw error;
    }
  },

  getWeatherByCoords: async (lat, lon) => {
    try {
      const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
      const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.weather}?${params}`);
      if (!ok) {
        const errorMsg = json?.error || `Weather request failed (HTTP ${status})`;
        throw new Error(errorMsg);
      }
      return {
        success: true,
        weather: {
          location: json.location || "Unknown",
          condition: json.condition || "Unknown",
          temp: json.temp || 0,
          uv_index: json.uv_index || 0,
        },
      };
    } catch (error) {
      console.error("getWeatherByCoords error:", error);
      throw error;
    }
  },

  getWeatherByCity: async (city) => {
    try {
      const params = new URLSearchParams({ city: city.trim() });
      const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.weather}?${params}`);
      if (!ok) {
        const errorMsg = json?.error || json?.suggestion || `City not found (HTTP ${status})`;
        const err = new Error(errorMsg);
        err.code = status;
        err.suggestion = json?.suggestion;
        throw err;
      }
      return {
        success: true,
        weather: {
          location: json.location || city,
          condition: json.condition || "Unknown",
          temp: json.temp || 0,
          uv_index: json.uv_index || 0,
        },
      };
    } catch (error) {
      console.error("getWeatherByCity error:", error);
      throw error;
    }
  },

  // 7-day hourly forecast
  getForecast: async () => {
    try {
      const { ok, json, status } = await apiRequest(API_ENDPOINTS.forecast);
      if (!ok) {
        const errorMsg = json?.error || `Forecast request failed (HTTP ${status})`;
        throw new Error(errorMsg);
      }
      return normalizeForecast(json);
    } catch (error) {
      console.error("getForecast error:", error);
      throw error;
    }
  },

  getForecastByCoords: async (lat, lon) => {
    try {
      const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
      const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.forecast}?${params}`);
      if (!ok) {
        const errorMsg = json?.error || json?.suggestion || `Forecast request failed (HTTP ${status})`;
        const err = new Error(errorMsg);
        err.suggestion = json?.suggestion;
        throw err;
      }
      return normalizeForecast(json);
    } catch (error) {
      console.error("getForecastByCoords error:", error);
      throw error;
    }
  },

  getForecastByCity: async (city) => {
    try {
      const params = new URLSearchParams({ city: city.trim() });
      const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.forecast}?${params}`);
      
      if (!ok) {
        const errorMsg = json?.error || json?.suggestion || `City not found (HTTP ${status})`;
        const err = new Error(errorMsg);
        err.code = status;
        err.suggestion = json?.suggestion;
        throw err;
      }
      
      // Validate that we got forecast data
      const normalized = normalizeForecast(json);
      if (!normalized.days || normalized.days.length === 0) {
        throw new Error(`No forecast data available for ${city}. Try a larger nearby city.`);
      }
      
      // Check if we have hourly data
      const hasHourlyData = normalized.days.some(day => day.hours && day.hours.length > 0);
      if (!hasHourlyData) {
        throw new Error(`Limited forecast data for ${city}. Try a major city for detailed UV forecasts.`);
      }
      
      return normalized;
    } catch (error) {
      console.error("getForecastByCity error:", error);
      throw error;
    }
  },
};

export const skinTypesAPI = {
  getAll: async () => apiRequest(API_ENDPOINTS.skinTypes),
};

export const recommendationAPI = {
  getRecommendation: async (skinTypeId) => {
    const params = new URLSearchParams({ skin_type_id: skinTypeId });
    return apiRequest(`${API_ENDPOINTS.recommendation}?${params}`);
  },
};

export const timerAPI = {
  getTimerData: async (minutes) => apiRequest(`${API_ENDPOINTS.timer}${minutes}/`),
};

export const newsAPI = {
  getBrainHealthNews: async () => apiRequest(API_ENDPOINTS.news),
};

export const insightsAPI = {
  getFactoids: async () => apiRequest("/insights/api/factoids/"),
  getTips: async () => apiRequest("/insights/api/tips/"),
  getHub: async () => {
    const [factoids, tips] = await Promise.all([
      apiRequest("/insights/api/factoids/"),
      apiRequest("/insights/api/tips/"),
    ]);
    return { factoids, tips };
  },
};

export const nutritionAPI = {
  getMealPlan: async () => apiRequest(`${API_ENDPOINTS.nutrition}meal-plan/`),
  getFoods: async () => apiRequest(`${API_ENDPOINTS.nutrition}foods/`),
  swapMeal: async (day, mealType, newFoodId) => {
    return apiRequest(`${API_ENDPOINTS.nutrition}meal-plan/swap/`, {
      method: 'POST',
      body: JSON.stringify({
        day: day,
        meal_type: mealType,
        new_food_id: newFoodId
      })
    });
  },
};
// --- Back-compat adapter so MealPlannerView.vue keeps working ---
// POST payload (days, budgetAud, max_prep_minutes, dietary, etc.)
export const mealAI = {
  generate: async (payload = {}) => {
    const qs = new URLSearchParams({
      // map your view’s fields to the API’s expected names:
      budget_aud: payload.budgetAud ?? payload.budget_aud ?? 20,
      max_prep_minutes:
        payload.max_prep_minutes ?? payload.maxPrepMinutes ?? 40,
      dietary: Array.isArray(payload.dietary) ? payload.dietary.join(",") : (payload.dietary || ""),
      days: payload.days ?? 1,
    });
    return apiRequest(`${API_ENDPOINTS.nutrition}meal-plan/?${qs.toString()}`);
  },
  swap: nutritionAPI.swapMeal,
};


// Tiny image helper; returns a plausible food photo URL so the UI shows something.
// (Swap to your real image service anytime.)
export const mealImages = {
  get: async (name, dietary = []) => {
    const q = encodeURIComponent(`${name} ${dietary.join(" ")}`.trim() || "food");
    return { url: `https://source.unsplash.com/featured/?${q},dish` };
  },
};


// Export base if needed elsewhere
export const API_BASE_URL = BASE;

// Axios instance for components that use axios
const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  withCredentials: true,
});
export default api;
