// src/services/api.js
import axios from "axios";

// Normalize base: add scheme if missing, strip trailing slashes
const raw = import.meta.env.VITE_API_BASE || "";
const BASE = (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/+$/, "");

// Central endpoints (leading slash only)
const API_ENDPOINTS = {
  weather: "/vitamin-d-helper/api/weather/",
  skinTypes: "/vitamin-d-helper/api/skin-types/",
  recommendation: "/vitamin-d-helper/api/recommendation/",
  timer: "/timer/api/timer/",
  news: "/brain-health-news/",
  insights: "/insights/",
};

// Safe join
function joinUrl(endpoint) {
  const p = `${endpoint}`.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${BASE}${p}`;
}

// Generic fetch wrapper
async function apiRequest(endpoint, options = {}) {
  const url = joinUrl(endpoint);
  const defaultOptions = {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };
  const res = await fetch(url, { ...defaultOptions, ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
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
    const params = new URLSearchParams({ city });
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


// Export base if needed elsewhere
export const API_BASE_URL = BASE;

// Axios instance for components that use axios
const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  withCredentials: true,
});
export default api;
