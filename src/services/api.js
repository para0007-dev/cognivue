import axios from "axios";

const raw = import.meta.env.VITE_API_BASE || "";
const BASE = (raw.startsWith("http") ? raw : `http://${raw || "localhost:8000"}`).replace(/\/+$/, "");
// Export base if needed elsewhere
const API_BASE_URL = BASE;
// --- Default fetch options
const defaultOptions = {
  method: "GET",
  credentials: "include",
  mode: "cors",
  cache: "no-store",
};

// Central endpoints (leading slash only)
const API_ENDPOINTS = {
  weather: "/vitamin-d-helper/api/weather/",
  skinTypes: "/vitamin-d-helper/api/skin-types/",
  recommendation: "/vitamin-d-helper/api/recommendation/",
  timer: "/timer/api/timer/",
  news: "/brain-health-news/",
  insights: "/insights/",
};

// --- Join base + endpoint
function joinUrl(endpoint) {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith("http")) return endpoint;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
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
    const res = await fetch(url, { ...defaultOptions, ...options, headers });
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
  return json ?? {};
}

// ---- Feature APIs ----
export const weatherAPI = {
  getWeather: async () => {
    const json = await apiRequest(API_ENDPOINTS.weather);
    return {
      success: true,
      weather: {
        location: json.location,
        condition: json.condition,
        temp: json.temp,
        uv_index: json.uv_index,
      },
    };
  },
  getWeatherByCoords: async (lat, lon) => {
    const params = new URLSearchParams({ lat, lon });
    const json = await apiRequest(`${API_ENDPOINTS.weather}?${params}`);
    return {
      success: true,
      weather: {
        location: json.location,
        condition: json.condition,
        temp: json.temp,
        uv_index: json.uv_index,
      },
    };
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
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken"
});
export default api;
