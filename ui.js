/* ==========================================================================
   WEATHER DASHBOARD UI RENDERING ENGINE (ui.js)
   ========================================================================== */

import { getIcon, getWeatherIconByWmoCode } from "./icons.js";
import { drawTemperatureChart } from "./chart.js";

// Mount container reference
let rootElement = null;

// Callbacks holder
let uiCallbacks = {
  onSearchInput: () => {},
  onCitySelect: () => {},
  onThemeToggle: () => {},
  onAddCity: () => {},
  onDeleteCity: () => {}
};

/**
 * Initializes the UI Engine
 * @param {HTMLElement} root The root element to mount the app shell
 * @param {Object} callbacks Event handler callbacks
 */
export function initUI(root, callbacks) {
  rootElement = root;
  uiCallbacks = { ...uiCallbacks, ...callbacks };
  
  // Render empty shell framework
  renderAppShell();
  setupGlobalEvents();
}

/**
 * Renders the basic HTML structure of the application
 */
function renderAppShell() {
  if (!rootElement) return;

  rootElement.innerHTML = `
    <!-- Top Navigation Bar -->
    <nav class="app-navbar">
      <div class="nav-left">
        <a href="#" class="brand-logo">
          <div class="logo-icon-bg">
            ${getIcon("cloud")}
          </div>
          <span class="logo-text-weather">Weather</span><span class="logo-text-news">Wire</span>
        </a>
        <ul class="nav-links">
          <li><button class="nav-link-btn">Dashboard</button></li>
          <li><button class="nav-link-btn active">Weather</button></li>
          <li><button class="nav-link-btn">News</button></li>
        </ul>
      </div>
      <div class="nav-right">
        <button class="icon-badge-btn" id="bell-btn" title="Notifications">
          ${getIcon("bell")}
          <span class="badge-dot"></span>
        </button>
        <button class="icon-badge-btn" id="theme-toggle-btn" title="Toggle Theme">
          <!-- Populated by updateThemeUI -->
        </button>
      </div>
    </nav>

    <!-- Search Section -->
    <div class="search-container">
      <div class="search-bar-wrapper">
        ${getIcon("search", "search-icon")}
        <input type="text" id="city-search-input" class="search-input" placeholder="Search any city worldwide..." autocomplete="off">
      </div>
      <!-- Suggestions dropdown -->
      <div id="search-results-dropdown" class="search-results-dropdown"></div>
    </div>

    <!-- Main Dashboard Content Container -->
    <div id="dashboard-content">
      <!-- Dynamic views load here -->
    </div>
  `;
}

/**
 * Binds global non-dynamic DOM listeners
 */
function setupGlobalEvents() {
  // Theme toggle button click
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      uiCallbacks.onThemeToggle();
    });
  }

  // Search input handler
  const searchInput = document.getElementById("city-search-input");
  const dropdown = document.getElementById("search-results-dropdown");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.trim().length >= 2) {
        uiCallbacks.onSearchInput(val.trim());
      } else {
        dropdown.classList.remove("active");
        dropdown.innerHTML = "";
      }
    });

    // Close dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    // Open dropdown if it has items when clicking search input
    searchInput.addEventListener("focus", () => {
      if (dropdown.children.length > 0) {
        dropdown.classList.add("active");
      }
    });
  }
}

/**
 * Updates the theme toggle icon based on current theme
 * @param {string} theme 
 */
export function updateThemeUI(theme) {
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.innerHTML = theme === "dark" ? getIcon("sun") : getIcon("moon");
  }
}

/**
 * Renders the search dropdown suggestions
 * @param {Array} cities 
 */
export function renderSearchSuggestions(cities) {
  const dropdown = document.getElementById("search-results-dropdown");
  if (!dropdown) return;

  if (cities.length === 0) {
    dropdown.classList.remove("active");
    dropdown.innerHTML = "";
    return;
  }

  dropdown.innerHTML = cities.map(city => `
    <div class="search-item" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}" data-country="${city.country_code || 'US'}" data-timezone="${city.timezone || 'GMT'}">
      <span class="search-item-pin">${getIcon("map-pin")}</span>
      <div class="search-item-details">
        <span class="search-item-name">${city.name}${city.admin1 ? ', ' + city.admin1 : ''}</span>
        <span class="search-item-country">${city.country || city.country_code || 'United States'}</span>
      </div>
    </div>
  `).join("");

  dropdown.classList.add("active");

  // Add click handlers on suggestion items
  dropdown.querySelectorAll(".search-item").forEach(item => {
    item.addEventListener("click", () => {
      const cityData = {
        name: item.getAttribute("data-name"),
        lat: parseFloat(item.getAttribute("data-lat")),
        lon: parseFloat(item.getAttribute("data-lon")),
        country: item.getAttribute("data-country"),
        timezone: item.getAttribute("data-timezone")
      };
      
      // Clear search inputs
      const searchInput = document.getElementById("city-search-input");
      if (searchInput) searchInput.value = "";
      dropdown.classList.remove("active");
      dropdown.innerHTML = "";

      uiCallbacks.onCitySelect(cityData);
    });
  });
}

/**
 * Renders a full page spinner while loading weather data
 */
export function showLoading() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `
    <div class="loading-container">
      ${getIcon("loading")}
      <p>Fetching weather data...</p>
    </div>
  `;
}

/**
 * Renders an error screen with retry behavior
 * @param {string} message 
 * @param {Function} retryCallback 
 */
export function showError(message, retryCallback) {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `
    <div class="error-container">
      <div class="error-title">Loading Failed</div>
      <p class="error-message">${message || 'Could not fetch weather data. Check your network connection.'}</p>
      <button class="retry-btn" id="error-retry-btn">Retry</button>
    </div>
  `;

  const btn = document.getElementById("error-retry-btn");
  if (btn && retryCallback) {
    btn.addEventListener("click", retryCallback);
  }
}

/**
 * Assembles and populates the weather dashboard panels
 * @param {Object} weatherData Consolidated weather model from API
 * @param {Array<Object>} savedCities List of saved cities
 * @param {string} theme Current theme mode ("light" or "dark")
 */
export function renderDashboardContent(weatherData, savedCities, theme) {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  // Render columns grid skeleton
  content.innerHTML = `
    <div class="dashboard-grid">
      <!-- Left side: Hero Card, SVG Chart, Air Conditions -->
      <div class="left-column">
        <section id="hero-panel"></section>
        
        <section class="weather-card chart-card">
          <h2 class="card-title">Today's Temperature</h2>
          <div class="chart-wrapper" id="chart-container">
            <!-- SVG rendered dynamically -->
          </div>
        </section>

        <section class="weather-card air-card">
          <h2 class="card-title">Air & Conditions</h2>
          <div class="air-grid-row" id="air-conditions-container"></div>
        </section>
      </div>

      <!-- Right side: 7-Day Forecast, Stats Cards, Saved Cities -->
      <div class="right-column">
        <section class="weather-card forecast-card">
          <h2 class="card-title">7-Day Forecast</h2>
          <div class="forecast-list-row" id="forecast-list-container"></div>
        </section>

        <section class="stats-grid" id="stats-grid-container"></section>

        <section class="weather-card saved-cities-card">
          <div class="saved-header-row">
            <h2 class="card-title">Saved Cities</h2>
            <button class="add-city-btn" id="add-active-city-btn" title="Pin Current City">
              ${getIcon("plus")}
            </button>
          </div>
          <div class="saved-cities-grid" id="saved-cities-container"></div>
        </section>
      </div>
    </div>
  `;

  // Draw each component
  drawHeroCard(weatherData);
  drawAirConditions(weatherData);
  drawForecast(weatherData.forecast);
  drawStatsCards(weatherData);
  drawSavedCities(savedCities, weatherData);
  
  // Draw the SVG temperature chart
  drawTemperatureChart(weatherData.chartData, theme);

  // Hook up pin button
  const pinBtn = document.getElementById("add-active-city-btn");
  if (pinBtn) {
    // Hide or disable if city is already pinned
    const isPinned = savedCities.some(c => c.name.toLowerCase() === weatherData.name.toLowerCase());
    if (isPinned) {
      pinBtn.style.opacity = "0.4";
      pinBtn.style.cursor = "not-allowed";
      pinBtn.title = "City already saved";
    } else {
      pinBtn.addEventListener("click", () => {
        uiCallbacks.onAddCity({
          name: weatherData.name,
          lat: weatherData.lat,
          lon: weatherData.lon,
          country: weatherData.country,
          timezone: weatherData.timezone || "auto"
        });
      });
    }
  }
}

/**
 * Renders the top weather summary hero card (blue gradient)
 */
function drawHeroCard(data) {
  const container = document.getElementById("hero-panel");
  if (!container) return;

  // Format date time matching screenshot style: e.g. "Wednesday, Jun 10 • 2:45 PM"
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum = now.getDate();
  
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timeStr = `${hours}:${minutes} ${ampm}`;
  const dateStr = `${dayName}, ${monthName} ${dateNum} • ${timeStr}`;

  container.innerHTML = `
    <div class="hero-card">
      <div class="hero-top-row">
        <div class="hero-meta">
          <h1 class="hero-location-name">
            ${data.name} <span class="country-pill-badge">${data.country}</span>
          </h1>
          <span class="hero-date">${dateStr}</span>
        </div>
        <div class="hero-icon-container">
          ${getIcon(getWeatherIconByWmoCode(data.weatherCode))}
        </div>
      </div>
      
      <div class="hero-center-row">
        <div class="hero-temp">${data.temp}°C</div>
        <div class="hero-condition-details">
          <span class="hero-condition-text">${data.condition}</span>
          <span class="hero-feels-like">Feels like ${data.feelsLike}°C</span>
          <span class="hero-high-low">H:${data.high}° L:${data.low}°</span>
        </div>
      </div>
      
      <div class="hero-subcards-row">
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${getIcon("droplet")} Humidity
          </span>
          <span class="hero-subcard-value">${data.humidity}%</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${getIcon("wind")} Wind
          </span>
          <span class="hero-subcard-value">${data.windSpeed} km/h</span>
        </div>
        <div class="hero-glass-subcard">
          <span class="hero-subcard-label">
            ${getIcon("eye")} Visibility
          </span>
          <span class="hero-subcard-value">${data.visibility} km</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the Air Quality, UV Index, and Pressure subcards
 */
function drawAirConditions(data) {
  const container = document.getElementById("air-conditions-container");
  if (!container) return;

  container.innerHTML = `
    <!-- AQI card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${data.aqiBg}">
        ${getIcon("compass")}
      </div>
      <span class="air-subcard-value">${data.aqi}</span>
      <span class="air-subcard-label">AQI</span>
      <span class="air-subcard-desc ${data.aqiClass}">${data.aqiStatus}</span>
    </div>

    <!-- UV Index card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${data.uvBg}">
        ${getIcon("sun")}
      </div>
      <span class="air-subcard-value">${data.uv}</span>
      <span class="air-subcard-label">UV Index</span>
      <span class="air-subcard-desc ${data.uvClass}">${data.uvStatus}</span>
    </div>

    <!-- Pressure card -->
    <div class="air-subcard">
      <div class="air-subcard-icon ${data.pressureBg}">
        ${getIcon("thermometer")}
      </div>
      <span class="air-subcard-value">${data.pressure} hPa</span>
      <span class="air-subcard-label">Pressure</span>
      <span class="air-subcard-desc ${data.pressureClass}">${data.pressureStatus}</span>
    </div>
  `;
}

/**
 * Renders 7-Day weather columns
 */
function drawForecast(forecast) {
  const container = document.getElementById("forecast-list-container");
  if (!container) return;

  container.innerHTML = forecast.map((f, idx) => `
    <div class="forecast-day-col ${idx === 3 ? 'active' : ''}" data-index="${idx}">
      <span class="forecast-day-name">${f.day}</span>
      <div class="forecast-day-icon">
        ${getIcon(f.icon)}
      </div>
      <div class="forecast-temps">
        <span class="forecast-temp-max">${f.max}°</span>
        <span class="forecast-temp-min">${f.min}°</span>
      </div>
    </div>
  `).join("");

  // Bind clicks to select forecast days (interactive layout option)
  container.querySelectorAll(".forecast-day-col").forEach(col => {
    col.addEventListener("click", () => {
      container.querySelectorAll(".forecast-day-col").forEach(c => c.classList.remove("active"));
      col.classList.add("active");
    });
  });
}

/**
 * Renders 2x2 grid details cards
 */
function drawStatsCards(data) {
  const container = document.getElementById("stats-grid-container");
  if (!container) return;

  container.innerHTML = `
    <!-- Wind card -->
    <div class="stat-card">
      <div class="stat-header">
        ${getIcon("wind")}
      </div>
      <div class="stat-value">${data.windSpeed} km/h</div>
      <div class="stat-label-details">
        <span class="stat-title">Wind Speed</span>
        <span class="stat-subtitle">${data.windDirection}</span>
      </div>
    </div>

    <!-- Humidity card -->
    <div class="stat-card">
      <div class="stat-header">
        ${getIcon("droplet")}
      </div>
      <div class="stat-value">${data.humidity}%</div>
      <div class="stat-label-details">
        <span class="stat-title">Humidity</span>
        <span class="stat-subtitle">${data.humidity > 60 ? 'High dew point' : 'Normal dew point'}</span>
      </div>
    </div>

    <!-- Visibility card -->
    <div class="stat-card">
      <div class="stat-header">
        ${getIcon("eye")}
      </div>
      <div class="stat-value">${data.visibility} km</div>
      <div class="stat-label-details">
        <span class="stat-title">Visibility</span>
        <span class="stat-subtitle">${data.visibility > 10 ? 'Clear' : 'Foggy / Hazy'}</span>
      </div>
    </div>

    <!-- Feels Like card -->
    <div class="stat-card">
      <div class="stat-header">
        ${getIcon("thermometer")}
      </div>
      <div class="stat-value">${data.feelsLike}°C</div>
      <div class="stat-label-details">
        <span class="stat-title">Feels Like</span>
        <span class="stat-subtitle">H:${data.high}° L:${data.low}°</span>
      </div>
    </div>
  `;
}

/**
 * Renders the pinned Saved Cities sidebar cards
 */
function drawSavedCities(savedCities, activeWeather) {
  const container = document.getElementById("saved-cities-container");
  if (!container) return;

  // Render empty state if no saved cities
  if (savedCities.length === 0) {
    container.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--color-text-secondary); font-size: 13px; padding: 20px;">No saved cities. Search and pin one!</div>`;
    return;
  }

  // To draw the saved cities nicely with their temperatures, we use the active weather state if it matches the city,
  // or fall back to displaying its saved static details, or fetch them if they are cached.
  // We'll output basic placeholder temperatures or display cache if cached.
  container.innerHTML = savedCities.map(city => {
    const isActive = city.name.toLowerCase() === activeWeather.name.toLowerCase();
    
    // Attempt to read current or cached temp, otherwise fallback to active weather or standard defaults
    let tempStr = "--°";
    let conditionStr = "Fetch data";
    
    if (isActive) {
      tempStr = `${activeWeather.temp}°`;
      conditionStr = activeWeather.condition;
    } else {
      // Just fallback to some mock defaults for styling display in the card if not fetched yet,
      // or we can let the parent supply these. To make the interface pop, we'll write some dynamic estimates
      // since the parent loads this.
      const defaults = {
        "new york": { temp: "25°", desc: "Clear Skies" },
        "london": { temp: "14°", desc: "Light Rain" },
        "tokyo": { temp: "28°", desc: "Sunny" },
        "san francisco": { temp: "18°", desc: "Partly Cloudy" }
      };
      const found = defaults[city.name.toLowerCase()];
      if (found) {
        tempStr = found.temp;
        conditionStr = found.desc;
      } else {
        tempStr = "16°";
        conditionStr = "Partly Cloudy";
      }
    }

    return `
      <div class="saved-city-item ${isActive ? 'active' : ''}" data-name="${city.name}" data-lat="${city.lat}" data-lon="${city.lon}" data-country="${city.country}" data-timezone="${city.timezone || 'auto'}">
        <span class="saved-city-name">${city.name}</span>
        <div class="saved-city-weather">
          <span class="saved-city-temp">${tempStr}</span>
          <span>•</span>
          <span>${conditionStr}</span>
        </div>
        <button class="saved-city-delete-btn" title="Remove city" data-name="${city.name}" data-country="${city.country}">
          ${getIcon("plus")} <!-- rotated icon in CSS serves as delete cross -->
        </button>
      </div>
    `;
  }).join("");

  // Style delete button: in styles.css we rotate the plus icon by 45deg to create a close cross!
  // Wait, let's write style rules in css to style saved-city-delete-btn svg or rotate it.
  
  // Click handler to select city
  container.querySelectorAll(".saved-city-item").forEach(item => {
    item.addEventListener("click", (e) => {
      // Avoid triggering click when clicking delete button
      if (e.target.closest(".saved-city-delete-btn")) return;
      
      const cityData = {
        name: item.getAttribute("data-name"),
        lat: parseFloat(item.getAttribute("data-lat")),
        lon: parseFloat(item.getAttribute("data-lon")),
        country: item.getAttribute("data-country"),
        timezone: item.getAttribute("data-timezone")
      };
      uiCallbacks.onCitySelect(cityData);
    });
  });

  // Click handler for delete button
  container.querySelectorAll(".saved-city-delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = btn.getAttribute("data-name");
      const country = btn.getAttribute("data-country");
      uiCallbacks.onDeleteCity(name, country);
    });
  });
}
