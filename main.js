/* ==========================================================================
   WEATHER DASHBOARD MAIN ENTRY POINT (main.js)
   ========================================================================== */

import { initUI, updateThemeUI, showLoading, showError, renderDashboardContent, renderSearchSuggestions } from "./ui.js";
import { searchCities, fetchWeatherData } from "./api.js";
import { 
  getTheme, 
  setTheme, 
  getActiveCity, 
  setActiveCity, 
  getSavedCities, 
  addSavedCity, 
  removeSavedCity, 
  cacheWeatherData, 
  getCachedWeatherData 
} from "./state.js";

// Debounce timer for search input queries
let searchDebounceTimer = null;

// Track active weather data locally
let currentWeatherData = null;

/**
 * Loads weather data for a specific city and updates the interface
 * @param {Object} cityObj The city information containing lat, lon, name, country
 */
async function loadCityWeather(cityObj) {
  showLoading();
  
  try {
    const cached = getCachedWeatherData(cityObj.name);
    
    if (cached) {
      currentWeatherData = cached;
    } else {
      // Fetch fresh data from APIs
      const data = await fetchWeatherData(
        cityObj.lat, 
        cityObj.lon, 
        cityObj.name, 
        cityObj.country || "US", 
        cityObj.timezone || "auto"
      );
      
      // Cache data
      cacheWeatherData(cityObj.name, data);
      currentWeatherData = data;
    }
    
    // Save this city as the active city in state
    setActiveCity(cityObj);
    
    // Render the dashboard with active weather, saved list, and theme
    renderDashboardContent(currentWeatherData, getSavedCities(), getTheme());
  } catch (error) {
    console.error("Error loading weather data:", error);
    showError(
      `Could not retrieve weather data for ${cityObj.name}. Please check your connection and try again.`, 
      () => loadCityWeather(cityObj)
    );
  }
}

/**
 * Handles city searches with debounce limiters to prevent API flooding
 * @param {string} query The search string
 */
function handleCitySearch(query) {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  
  searchDebounceTimer = setTimeout(async () => {
    if (query.length < 2) return;
    const results = await searchCities(query);
    renderSearchSuggestions(results);
  }, 300);
}

/**
 * Toggles theme between Light and Dark mode
 */
function handleThemeToggle() {
  const currentTheme = getTheme();
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  
  // Set theme attributes on HTML element and persist
  setTheme(nextTheme);
  
  // Update header button icon
  updateThemeUI(nextTheme);
  
  // Redraw dashboard if weather data is loaded (theme colors affect SVG chart)
  if (currentWeatherData) {
    renderDashboardContent(currentWeatherData, getSavedCities(), nextTheme);
  }
}

/**
 * Pins the current city to Saved Cities
 * @param {Object} cityObj 
 */
function handleAddCity(cityObj) {
  addSavedCity(cityObj);
  // Re-render dashboard content to update list
  if (currentWeatherData) {
    renderDashboardContent(currentWeatherData, getSavedCities(), getTheme());
  }
}

/**
 * Unpins a city from Saved Cities
 * @param {string} name 
 * @param {string} country 
 */
function handleDeleteCity(name, country) {
  removeSavedCity(name, country);
  // Re-render dashboard content to update list
  if (currentWeatherData) {
    renderDashboardContent(currentWeatherData, getSavedCities(), getTheme());
  }
}

// Application startup
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (!root) return;

  // Initialize UI renderer and bind action callbacks
  initUI(root, {
    onSearchInput: handleCitySearch,
    onCitySelect: loadCityWeather,
    onThemeToggle: handleThemeToggle,
    onAddCity: handleAddCity,
    onDeleteCity: handleDeleteCity
  });

  // Apply saved theme preference or system default
  const theme = getTheme();
  setTheme(theme);
  updateThemeUI(theme);

  // Load initial city (San Francisco or saved active)
  const activeCity = getActiveCity();
  loadCityWeather(activeCity);

  // Responsive chart redraw on viewport resizing
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentWeatherData) {
        // Redraw content (including the SVG chart) to fit new container dimensions
        renderDashboardContent(currentWeatherData, getSavedCities(), getTheme());
      }
    }, 200);
  });
});
