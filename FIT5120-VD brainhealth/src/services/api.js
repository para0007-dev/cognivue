// API configuration and service functions
const API_BASE_URL = 'http://localhost:8000';

// API endpoints
const API_ENDPOINTS = {
  weather: '/vitamin-d-helper/api/weather/',
  skinTypes: '/vitamin-d-helper/api/skin-types/',
  recommendation: '/vitamin-d-helper/api/recommendation/',
  timer: '/timer/api/timer/',
  news: '/brain-health-news/',
  insights: '/insights/'
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Weather API
export const weatherAPI = {
  // Get weather data by coordinates
  getWeatherByCoords: async (lat, lon) => {
    const params = new URLSearchParams({ lat, lon });
    return apiRequest(`${API_ENDPOINTS.weather}?${params}`);
  },
  
  // Get weather data by city
  getWeatherByCity: async (city) => {
    const params = new URLSearchParams({ city });
    return apiRequest(`${API_ENDPOINTS.weather}?${params}`);
  }
};

// Skin types API
export const skinTypesAPI = {
  // Get all skin types
  getAll: async () => {
    return apiRequest(API_ENDPOINTS.skinTypes);
  }
};

// Recommendation API
export const recommendationAPI = {
  // Get recommendation by skin type ID
  getRecommendation: async (skinTypeId) => {
    const params = new URLSearchParams({ skin_type_id: skinTypeId });
    return apiRequest(`${API_ENDPOINTS.recommendation}?${params}`);
  }
};

// Timer API
export const timerAPI = {
  // Get timer data
  getTimerData: async (minutes) => {
    return apiRequest(`${API_ENDPOINTS.timer}${minutes}/`);
  }
};

// News API
export const newsAPI = {
  // Get brain health news
  getBrainHealthNews: async () => {
    return apiRequest(API_ENDPOINTS.news);
  }
};

// Insights API
export const insightsAPI = {
  // Get insights hub
  getHub: async () => {
    return apiRequest(API_ENDPOINTS.insights);
  }
};

// Export API base URL for other components
export { API_BASE_URL };
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // e.g. http://127.0.0.1:8000
  timeout: 10000,
});

export default api;
