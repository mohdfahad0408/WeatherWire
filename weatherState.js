/* ==========================================================================
   WEATHER DASHBOARD STATE MANAGEMENT (weatherState.js)
   ========================================================================== */

const THEME_KEY = "weather_dashboard_theme";
const SAVED_CITIES_KEY = "weather_dashboard_saved_cities";
const ACTIVE_CITY_KEY = "weather_dashboard_active_city";

// Default cities list when none is in storage
const DEFAULT_SAVED_CITIES = [
  { name: "San Francisco", lat: 37.7749, lon: -122.4194, country: "US" },
  { name: "New York", lat: 40.7128, lon: -74.0060, country: "US" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "GB" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "JP" }
];

const DEFAULT_ACTIVE_CITY = {
  name: "San Francisco",
  lat: 37.7749,
  lon: -122.4194,
  country: "US"
};

// Weather data cache (in-memory) to improve layout snappiness
const weatherDataCache = {};

export function getTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) return storedTheme;
  
  // Detect system theme fallback
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  }
  return "light";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function getActiveCity() {
  const stored = localStorage.getItem(ACTIVE_CITY_KEY);
  try {
    return stored ? JSON.parse(stored) : DEFAULT_ACTIVE_CITY;
  } catch (e) {
    return DEFAULT_ACTIVE_CITY;
  }
}

export function setActiveCity(cityObj) {
  if (!cityObj || !cityObj.name) return;
  localStorage.setItem(ACTIVE_CITY_KEY, JSON.stringify(cityObj));
}

export function getSavedCities() {
  const stored = localStorage.getItem(SAVED_CITIES_KEY);
  try {
    return stored ? JSON.parse(stored) : DEFAULT_SAVED_CITIES;
  } catch (e) {
    return DEFAULT_SAVED_CITIES;
  }
}

export function saveCitiesList(citiesList) {
  localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(citiesList));
}

export function addSavedCity(cityObj) {
  if (!cityObj || !cityObj.name) return;
  const list = getSavedCities();
  // Check duplicate by name + country
  const exists = list.some(c => c.name.toLowerCase() === cityObj.name.toLowerCase() && c.country.toLowerCase() === cityObj.country.toLowerCase());
  if (!exists) {
    list.push(cityObj);
    saveCitiesList(list);
  }
}

export function removeSavedCity(cityName, countryCode) {
  let list = getSavedCities();
  list = list.filter(c => !(c.name.toLowerCase() === cityName.toLowerCase() && c.country.toLowerCase() === countryCode.toLowerCase()));
  saveCitiesList(list);
}

export function cacheWeatherData(cityName, data) {
  weatherDataCache[cityName.toLowerCase()] = {
    timestamp: Date.now(),
    data: data
  };
}

export function getCachedWeatherData(cityName) {
  const cache = weatherDataCache[cityName.toLowerCase()];
  if (!cache) return null;
  // Cache expiry 15 minutes
  if (Date.now() - cache.timestamp > 15 * 60 * 1000) {
    delete weatherDataCache[cityName.toLowerCase()];
    return null;
  }
  return cache.data;
}
