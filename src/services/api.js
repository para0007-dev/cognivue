// src/services/api.js
import axios from "axios";

// Normalize base: add scheme if missing, strip trailing slashes
const raw = import.meta.env.VITE_API_BASE || "";
export const API_BASE_URL = (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/+$/, "");

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

  const res = await fetch(url, {
    credentials: "include",
    redirect: "follow",
    ...options,
    headers,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Non-JSON response from", url, "status", res.status, "body:", text?.slice(0, 800));
  }

  if (!res.ok || (json && json.success === false)) {
    const msg = (json && (json.error || json.detail)) || `HTTP ${res.status}`;
    throw new Error(msg);
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
