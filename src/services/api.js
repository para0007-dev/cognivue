// src/services/api.js
import axios from "axios";

// Normalize base: add scheme if missing, strip trailing slashes
const raw = import.meta.env.VITE_API_BASE || "";
// assume `raw` is your env var, e.g. import.meta.env.VITE_API_BASE?.trim() ?? ""
const scheme = raw && !raw.includes("localhost") ? "https" : "http";

export const API_BASE_URL = (
  raw.startsWith("http")
    ? raw
    : `${scheme}://${raw || "localhost:8000"}`
).replace(/\/+$/, "");

// Central endpoints (leading slash only)
const API_ENDPOINTS = {
  weather: "/vitamin-d-helper/api/weather/",
  skinTypes: "/vitamin-d-helper/api/skin-types/",
  recommendation: "/vitamin-d-helper/api/recommendation/",
  timer: "/timer/api/timer/",
  news: "/brain-health-news/",
  insights: "/insights/",
  forecast: "/vitamin-d-helper/api/weather/forecast/",
};

// Safe join
function joinUrl(endpoint) {
  const p = `${endpoint}`.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${p}`;
}

function getCookie(name) {
  return document.cookie.split("; ").find(r => r.startsWith(name + "="))?.split("=")[1] || "";
}

// Generic fetch wrapper with strong error surfacing
async function apiRequest(endpoint, options = {}) {
  const url = joinUrl(endpoint);
  const hasBody = !!options.body;
  const headers = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    "X-CSRFToken": getCookie("csrftoken"),
    ...(options.headers || {}),
  };
  
  try {
    const res = await fetch(url, { ...defaultOptions, ...options });
    const ct = res.headers.get("content-type") || "";
    
    // Try to parse JSON response
    let payload = null;
    try {
      if (ct.includes("application/json")) {
        payload = await res.json();
      } else {
        payload = await res.text();
      }
    } catch (parseError) {
      console.warn("Failed to parse response:", parseError);
      payload = null;
    }
    
    return { 
      ok: res.ok, 
      status: res.status, 
      json: ct.includes("json") ? payload : null, 
      text: ct.includes("json") ? null : payload 
    };
  } catch (error) {
    console.error("API Request failed:", error);
    throw new Error(`Network error: ${error.message}`);
  }
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

// Normalizer so the view can rely on a stable shape
function normalizeForecast(json) {
  // Handle different response formats
  const days = Array.isArray(json?.days) 
    ? json.days 
    : Array.isArray(json) 
    ? json 
    : [];

  if (!days || days.length === 0) {
    console.warn("No days data in forecast response:", json);
    return { success: true, days: [] };
  }

  const normalized = {
    success: true,
    days: days.map(d => {
      const dateISO = d.dateISO ?? d.date ?? d.day ?? null;
      const hoursRaw = d.hours ?? d.hourly ?? [];
      
      return {
        dateISO: dateISO,
        hours: hoursRaw.map(h => {
          // Handle time parsing
          let timeISO = h.timeISO ?? h.time ?? h.datetime ?? null;
          
          // Ensure proper ISO format for Date parsing
          if (timeISO && !timeISO.includes('T')) {
            timeISO = `${timeISO}T00:00:00`;
          }
          
          // Parse UV value safely
          let uvValue = 0;
          const uvRaw = h.uv ?? h.uvi ?? 0;
          try {
            uvValue = parseFloat(uvRaw) || 0;
            // Round to 1 decimal place
            uvValue = Math.round(uvValue * 10) / 10;
          } catch (e) {
            console.warn("Failed to parse UV value:", uvRaw);
          }
          
          // Parse temperature safely
          let tempValue = null;
          const tempRaw = h.tempC ?? h.temp_c ?? h.temp ?? h.temperature;
          if (tempRaw !== null && tempRaw !== undefined) {
            try {
              tempValue = parseFloat(tempRaw);
              tempValue = Math.round(tempValue * 10) / 10;
            } catch (e) {
              console.warn("Failed to parse temperature:", tempRaw);
            }
          }
          
          return {
            timeISO: timeISO,
            uv: uvValue,
            condition: h.condition ?? h.weather ?? h.summary ?? "Unknown",
            tempC: tempValue,
          };
        }).filter(h => h.timeISO !== null), // Remove entries without valid time
      };
    }).filter(d => d.dateISO !== null && d.hours.length > 0), // Remove days without data
  };

  console.log(`Normalized forecast: ${normalized.days.length} days with data`);
  
  return normalized;
}

export const skinTypesAPI = {
  getAll: async () => {
    const { ok, json, status } = await apiRequest(API_ENDPOINTS.skinTypes);
    if (!ok) throw new Error(`Skin types failed (HTTP ${status})`);
    return json;
  },
};

export const recommendationAPI = {
  getRecommendation: async (skinTypeId) => {
    const params = new URLSearchParams({ skin_type_id: skinTypeId });
    const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.recommendation}?${params}`);
    if (!ok) throw new Error(`Recommendation failed (HTTP ${status})`);
    return json;
  },
};

export const timerAPI = {
  getTimerData: async (minutes) => {
    const { ok, json, status } = await apiRequest(`${API_ENDPOINTS.timer}${minutes}/`);
    if (!ok) throw new Error(`Timer failed (HTTP ${status})`);
    return json;
  },
};

export const newsAPI = {
  getBrainHealthNews: async () => {
    const { ok, json, status } = await apiRequest(API_ENDPOINTS.news);
    if (!ok) throw new Error(`News failed (HTTP ${status})`);
    return json;
  },
};

export const insightsAPI = {
  getFactoids: async () => {
    const { ok, json, status } = await apiRequest("/insights/api/factoids/");
    if (!ok) throw new Error(`Factoids failed (HTTP ${status})`);
    return json;
  },
  getTips: async () => {
    const { ok, json, status } = await apiRequest("/insights/api/tips/");
    if (!ok) throw new Error(`Tips failed (HTTP ${status})`);
    return json;
  },
  getHub: async () => {
    const [factoids, tips] = await Promise.all([
      insightsAPI.getFactoids(),
      insightsAPI.getTips(),
    ]);
    return { factoids, tips };
  },
};

// Export base if needed elsewhere
export const API_BASE_URL = BASE;

// Axios instance for components that use axios (if you still need it)
export const mealAI = {
  generate: (payload) =>
    apiRequest("/mealplanner/api/meal-plan/ai-generate/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const mealImages = {
  get: async (q, dietArr = []) =>
    apiRequest(
      `/mealplanner/api/photo/?q=${encodeURIComponent(q)}&diet=${encodeURIComponent(
        (dietArr || []).join(",")
      )}`
    ),
};

// Axios instance for optional axios users
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export default api;