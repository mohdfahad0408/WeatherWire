/* ==========================================================================
   WEATHER DASHBOARD UI RENDERING ENGINE (weatherUi.js)
   ========================================================================== */

import { getIcon, getWeatherIconByWmoCode } from "./weatherIcons.js";
import { drawTemperatureChart } from "./weatherChart.js";

// Callbacks holder
let uiCallbacks = {
  onSearchInput: () => {},
  onCitySelect: () => {},
  onThemeToggle: () => {},
  onAddCity: () => {},
  onDeleteCity: () => {}
};

/**
 * Formats Celsius values to Fahrenheit if preferred
 * @param {number} celsius 
 * @returns {number}
 */
function formatTemp(celsius) {
  const unit = localStorage.getItem('temp_unit') || 'C';
  if (unit === 'F') {
    return Math.round((celsius * 9/5) + 32);
  }
  return celsius;
}

/**
 * Initializes the UI Engine with callbacks (attaches to static DOM)
 * @param {Object} callbacks Event handler callbacks
 */
export function initUI(callbacks) {
  uiCallbacks = { ...uiCallbacks, ...callbacks };
  setupGlobalEvents();
}

/**
 * Binds global non-dynamic DOM listeners
 */
function setupGlobalEvents() {
  // Search input handler
  const searchInput = document.getElementById("city-search-input");
  const dropdown = document.getElementById("search-results-dropdown");

  if (searchInput && dropdown) {
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

  // Dashboard Tab Search Input (if present)
  const dbSearchInput = document.getElementById("dashboard-city-search-input");
  const dbDropdown = document.getElementById("dashboard-search-results-dropdown");

  if (dbSearchInput && dbDropdown) {
    dbSearchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.trim().length >= 2) {
        uiCallbacks.onSearchInput(val.trim());
      } else {
        dbDropdown.classList.remove("active");
        dbDropdown.innerHTML = "";
      }
    });

    document.addEventListener("click", (e) => {
      if (!dbSearchInput.contains(e.target) && !dbDropdown.contains(e.target)) {
        dbDropdown.classList.remove("active");
      }
    });

    dbSearchInput.addEventListener("focus", () => {
      if (dbDropdown.children.length > 0) {
        dbDropdown.classList.add("active");
      }
    });
  }
}

/**
 * Updates the theme toggle icon based on current theme
 * @param {string} theme 
 */
export function updateThemeUI(theme) {
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.innerHTML = theme === "light" 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  }
}

/**
 * Renders the search dropdown suggestions for either search box
 * @param {Array} cities 
 */
export function renderSearchSuggestions(cities) {
  const dropdown = document.getElementById("search-results-dropdown");
  const dbDropdown = document.getElementById("dashboard-search-results-dropdown");

  const updateDropdown = (el) => {
    if (!el) return;
    if (cities.length === 0) {
      el.classList.remove("active");
      el.innerHTML = "";
      return;
    }

    el.innerHTML = cities.map(city => `
      <div class="search-item" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}" data-country="${city.country_code || 'US'}" data-timezone="${city.timezone || 'GMT'}">
        <span class="search-item-pin">${getIcon("map-pin")}</span>
        <div class="search-item-details">
          <span class="search-item-name">${city.name}${city.admin1 ? ', ' + city.admin1 : ''}</span>
          <span class="search-item-country">${city.country || city.country_code || 'United States'}</span>
        </div>
      </div>
    `).join("");

    el.classList.add("active");

    // Add click handlers on suggestion items
    el.querySelectorAll(".search-item").forEach(item => {
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
        const dbSearchInput = document.getElementById("dashboard-city-search-input");
        if (searchInput) searchInput.value = "";
        if (dbSearchInput) dbSearchInput.value = "";

        dropdown.classList.remove("active");
        if (dbDropdown) dbDropdown.classList.remove("active");

        uiCallbacks.onCitySelect(cityData);
      });
    });
  };

  updateDropdown(dropdown);
  updateDropdown(dbDropdown);
}

/**
 * Renders a spinner while loading weather data
 */
export function showLoading() {
  const content = document.getElementById("weather-dashboard-content");
  if (content) {
    content.innerHTML = `
      <div class="weather-loading-container">
        ${getIcon("loading")}
        <p>Fetching weather data...</p>
      </div>
    `;
  }

  const dbWidget = document.getElementById("dashboard-weather-widget");
  if (dbWidget) {
    dbWidget.innerHTML = `
      <div class="weather-loading-container" style="min-height: 200px;">
        ${getIcon("loading")}
        <p>Updating weather...</p>
      </div>
    `;
  }
}

/**
 * Renders an error screen with retry behavior
 * @param {string} message 
 * @param {Function} retryCallback 
 */
export function showError(message, retryCallback) {
  const content = document.getElementById("weather-dashboard-content");
  if (content) {
    content.innerHTML = `
      <div class="weather-error-container">
        <div class="weather-error-title">Loading Failed</div>
        <p class="weather-error-message">${message || 'Could not fetch weather data. Check your network connection.'}</p>
        <button class="weather-retry-btn" id="error-retry-btn">Retry</button>
      </div>
    `;

    const btn = document.getElementById("error-retry-btn");
    if (btn && retryCallback) {
      btn.addEventListener("click", retryCallback);
    }
  }

  const dbWidget = document.getElementById("dashboard-weather-widget");
  if (dbWidget) {
    dbWidget.innerHTML = `
      <div class="weather-error-container" style="min-height: 200px;">
        <p class="weather-error-message">${message || 'Could not fetch weather.'}</p>
        <button class="weather-retry-btn" id="db-error-retry-btn" style="padding: 6px 14px; font-size: 12px;">Retry</button>
      </div>
    `;
    const dbBtn = document.getElementById("db-error-retry-btn");
    if (dbBtn && retryCallback) {
      dbBtn.addEventListener("click", retryCallback);
    }
  }
}

/**
 * Assembles and populates the weather dashboard panels
 * @param {Object} weatherData Consolidated weather model from API
 * @param {Array<Object>} savedCities List of saved cities
 * @param {string} theme Current theme mode ("light" or "dark")
 */
export function renderDashboardContent(weatherData, savedCities, theme) {
  // Render Weather Tab content
  const content = document.getElementById("weather-dashboard-content");
  if (content) {
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

    // Draw each component on Weather tab
    drawHeroCard(weatherData, "hero-panel");
    drawAirConditions(weatherData, "air-conditions-container");
    drawForecast(weatherData.forecast, "forecast-list-container");
    drawStatsCards(weatherData, "stats-grid-container");
    drawSavedCities(savedCities, weatherData, "saved-cities-container");
    
    // Draw the SVG temperature chart with converted data and unit
    const unit = localStorage.getItem('temp_unit') || 'C';
    const convertedChartData = weatherData.chartData.map(t => formatTemp(t));
    drawTemperatureChart(convertedChartData, theme, unit);

    // Hook up pin button
    const pinBtn = document.getElementById("add-active-city-btn");
    if (pinBtn) {
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

  // Render Dashboard Tab Widget (Hero Card + Air Quality + compact 3-day forecast)
  const dbWidget = document.getElementById("dashboard-weather-widget");
  if (dbWidget) {
    dbWidget.innerHTML = `
      <div id="db-hero-panel"></div>
      <div class="weather-card air-card" style="margin-top: 1rem;">
        <h2 class="card-title">Air & Conditions</h2>
        <div class="air-grid-row" id="db-air-conditions-container"></div>
      </div>
      <div class="weather-card forecast-card" style="margin-top: 1rem;">
        <h2 class="card-title">Upcoming Forecast</h2>
        <div class="forecast-list-row" id="db-forecast-list-container"></div>
      </div>
    `;
    drawHeroCard(weatherData, "db-hero-panel");
    drawAirConditions(weatherData, "db-air-conditions-container");
    // Show only first 4 days of forecast for dashboard layout to look compact
    drawForecast(weatherData.forecast.slice(0, 4), "db-forecast-list-container");
  }
}

/**
 * Renders the top weather summary hero card (blue gradient)
 */
function drawHeroCard(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

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
  hours = hours ? hours : 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;
  const dateStr = `${dayName}, ${monthName} ${dateNum} • ${timeStr}`;

  const unit = localStorage.getItem('temp_unit') || 'C';
  const temp = formatTemp(data.temp);
  const feelsLike = formatTemp(data.feelsLike);
  const high = formatTemp(data.high);
  const low = formatTemp(data.low);

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
        <div class="hero-temp">${temp}°${unit}</div>
        <div class="hero-condition-details">
          <span class="hero-condition-text">${data.condition}</span>
          <span class="hero-feels-like">Feels like ${feelsLike}°${unit}</span>
          <span class="hero-high-low">H:${high}° L:${low}°</span>
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
function drawAirConditions(data, containerId) {
  const container = document.getElementById(containerId);
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
 * Renders Forecast days
 */
function drawForecast(forecast, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = forecast.map((f, idx) => `
    <div class="forecast-day-col ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      <span class="forecast-day-name">${f.day}</span>
      <div class="forecast-day-icon">
        ${getIcon(f.icon)}
      </div>
      <div class="forecast-temps">
        <span class="forecast-temp-max">${formatTemp(f.max)}°</span>
        <span class="forecast-temp-min">${formatTemp(f.min)}°</span>
      </div>
    </div>
  `).join("");

  // Bind clicks to select forecast days
  container.querySelectorAll(".forecast-day-col").forEach(col => {
    col.addEventListener("click", () => {
      container.querySelectorAll(".forecast-day-col").forEach(c => c.classList.remove("active"));
      col.classList.add("active");
    });
  });
}

/**
 * Renders stats grid
 */
function drawStatsCards(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const unit = localStorage.getItem('temp_unit') || 'C';
  const feelsLike = formatTemp(data.feelsLike);
  const high = formatTemp(data.high);
  const low = formatTemp(data.low);

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
      <div class="stat-value">${feelsLike}°${unit}</div>
      <div class="stat-label-details">
        <span class="stat-title">Feels Like</span>
        <span class="stat-subtitle">H:${high}° L:${low}°</span>
      </div>
    </div>
  `;
}

/**
 * Renders pinned Saved Cities
 */
function drawSavedCities(savedCities, activeWeather, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (savedCities.length === 0) {
    container.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--color-text-secondary); font-size: 13px; padding: 20px;">No saved cities. Search and pin one!</div>`;
    return;
  }

  container.innerHTML = savedCities.map(city => {
    const isActive = city.name.toLowerCase() === activeWeather.name.toLowerCase();
    let tempStr = "--°";
    let conditionStr = "Fetch data";
    
    if (isActive) {
      tempStr = `${formatTemp(activeWeather.temp)}°`;
      conditionStr = activeWeather.condition;
    } else {
      const defaults = {
        "new york": { temp: 25, desc: "Clear Skies" },
        "london": { temp: 14, desc: "Light Rain" },
        "tokyo": { temp: 28, desc: "Sunny" },
        "san francisco": { temp: 18, desc: "Partly Cloudy" }
      };
      const found = defaults[city.name.toLowerCase()];
      if (found) {
        tempStr = `${formatTemp(found.temp)}°`;
        conditionStr = found.desc;
      } else {
        tempStr = `${formatTemp(16)}°`;
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
          ${getIcon("remove")}
        </button>
      </div>
    `;
  }).join("");

  // Click handler to select city
  container.querySelectorAll(".saved-city-item").forEach(item => {
    item.addEventListener("click", (e) => {
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
