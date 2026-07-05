// Main app coordination and initialization
import { initUI as initWeatherUI, renderDashboardContent, showLoading as showWeatherLoading, showError as showWeatherError, renderSearchSuggestions, updateThemeUI } from "./weatherUi.js";
import { searchCities, fetchWeatherData } from "./weatherApi.js";
import { 
  getTheme as getWeatherTheme, 
  setTheme as setWeatherTheme, 
  getActiveCity, 
  setActiveCity, 
  getSavedCities, 
  addSavedCity, 
  removeSavedCity, 
  cacheWeatherData, 
  getCachedWeatherData 
} from "./weatherState.js";

const DEBUG_MODE = true;

let currentCategory = 'All';
let currentCity = '';
let currentArticles = [];
let lastUpdatedTimestamp = null;
let updateInterval = null;
let currentRequestId = 0;

let searchDebounceTimer = null;
let currentWeatherData = null;

// ==========================================================================
// NEWS COORDINATION LOGIC
// ==========================================================================

function updateNewsMeta(count) {
    const countEl = document.getElementById('article-count');
    if (countEl) {
        countEl.textContent = `${count} article${count !== 1 ? 's' : ''}`;
    }

    lastUpdatedTimestamp = new Date();
    updateLastUpdatedText();

    if (updateInterval) {
        clearInterval(updateInterval);
    }

    updateInterval = setInterval(updateLastUpdatedText, 60000);
}

function updateLastUpdatedText() {
    const updatedEl = document.getElementById('last-updated');
    if (updatedEl && lastUpdatedTimestamp) {
        const seconds = Math.floor((new Date() - lastUpdatedTimestamp) / 1000);
        if (seconds < 60) {
            updatedEl.textContent = 'Updated just now';
        } else {
            updatedEl.textContent = `Updated ${window.timeAgo ? window.timeAgo(lastUpdatedTimestamp.toISOString()) : 'recently'}`;
        }
    }
}

function sortArticles(articles, sortBy) {
    if (!articles || articles.length === 0) return;

    articles.sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
        } else if (sortBy === 'oldest') {
            return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0);
        } else if (sortBy === 'popular') {
            const popA = a.popularity || (a.title ? a.title.length : 0);
            const popB = b.popularity || (b.title ? b.title.length : 0);
            return popB - popA;
        }
        return 0;
    });
}

function updateDebugBadge(source) {
    if (!DEBUG_MODE) return;
    const badge = document.getElementById('debug-badge');
    if (!badge) return;
    
    badge.style.display = 'inline-block';
    if (source === 'live') {
        badge.textContent = 'Live API';
        badge.style.backgroundColor = '#10b981';
    } else if (source === 'mock') {
        badge.textContent = 'Mock Data';
        badge.style.backgroundColor = '#f59e0b';
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Fetches and displays news for a given city and current category in the News Tab
 * @param {string} cityName 
 */
async function handleLocationNews(cityName = '') {
    window.currentView = 'news';
    const savedBtn = document.getElementById('saved-articles-btn');
    if (savedBtn) savedBtn.style.color = 'inherit';
    
    const titleEl = document.querySelector('#news-view .news-header-titles h2');
    if (titleEl) titleEl.textContent = 'News Feed';

    currentCity = cityName;
    console.log(`[News Flow] handleLocationNews started for: "${cityName}". Category: "${currentCategory}".`);
    
    window.showNewsLoading('news-grid');
    updateDebugBadge(null);
    
    const requestId = ++currentRequestId;
    
    try {
        const data = await window.getNews({ query: cityName, category: currentCategory });
        
        if (requestId !== currentRequestId) return;
        
        updateDebugBadge(data._source);
        
        if (data && data.articles && data.articles.length > 0) {
            currentArticles = data.articles;
            const sortSelect = document.getElementById('news-sort');
            const sortBy = sortSelect ? sortSelect.value : 'newest';
            sortArticles(currentArticles, sortBy);
            window.renderNewsCards(currentArticles, 'news-grid');
            updateNewsMeta(currentArticles.length);
        } else {
            currentArticles = [];
            window.showNoNewsFound(cityName, 'news-grid');
        }
    } catch (error) {
        if (requestId !== currentRequestId) return;
        currentArticles = [];
        
        if (error.message && error.message.includes('No results')) {
            window.showNoNewsFound(cityName, 'news-grid');
        } else {
            window.showNewsError(error.message || 'An error occurred while fetching news.', () => handleLocationNews(cityName), 'news-grid');
        }
    }
}

/**
 * Fetches and displays news specifically for the Dashboard Tab
 * @param {string} cityName 
 */
async function fetchDashboardNews(cityName = '') {
    const gridId = 'dashboard-news-grid';
    const countEl = document.getElementById('dashboard-article-count');
    const badgeEl = document.getElementById('dashboard-debug-badge');

    window.showNewsLoading(gridId);
    if (badgeEl) badgeEl.style.display = 'none';

    try {
        // Fetch raw news for city (Dashboard shows 'All' categories)
        const data = await window.getNews({ query: cityName, category: 'All' });
        
        if (data && data.articles && data.articles.length > 0) {
            // Display only a compact list of 4 items for the Dashboard column
            const compactArticles = data.articles.slice(0, 4);
            window.renderNewsCards(compactArticles, gridId);
            
            if (countEl) {
                countEl.textContent = `${data.articles.length} article${data.articles.length !== 1 ? 's' : ''}`;
            }

            if (badgeEl && DEBUG_MODE) {
                badgeEl.style.display = 'inline-block';
                if (data._source === 'live') {
                    badgeEl.textContent = 'Live API';
                    badgeEl.style.backgroundColor = '#10b981';
                } else {
                    badgeEl.textContent = 'Mock Data';
                    badgeEl.style.backgroundColor = '#f59e0b';
                }
            }
        } else {
            window.showNoNewsFound(cityName, gridId);
            if (countEl) countEl.textContent = '0 articles';
        }
    } catch (error) {
        window.showNoNewsFound(cityName, gridId);
        if (countEl) countEl.textContent = '0 articles';
    }
}

// ==========================================================================
// WEATHER COORDINATION LOGIC
// ==========================================================================

async function loadCityWeather(cityObj) {
  showWeatherLoading();
  
  try {
    const cached = getCachedWeatherData(cityObj.name);
    
    if (cached) {
      currentWeatherData = cached;
    } else {
      const data = await fetchWeatherData(
        cityObj.lat, 
        cityObj.lon, 
        cityObj.name, 
        cityObj.country || "US", 
        cityObj.timezone || "auto"
      );
      
      cacheWeatherData(cityObj.name, data);
      currentWeatherData = data;
    }
    
    setActiveCity(cityObj);
    
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    renderDashboardContent(currentWeatherData, getSavedCities(), theme);
    
    // Auto-sync: Update news for this city on both views
    fetchDashboardNews(cityObj.name);
    handleLocationNews(cityObj.name);
  } catch (error) {
    console.error("Error loading weather data:", error);
    showWeatherError(
      `Could not retrieve weather data for ${cityObj.name}. Please check your connection.`, 
      () => loadCityWeather(cityObj)
    );
  }
}

function handleCitySearch(query) {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  
  searchDebounceTimer = setTimeout(async () => {
    if (query.length < 2) return;
    const results = await searchCities(query);
    renderSearchSuggestions(results);
  }, 300);
}

function handleAddCity(cityObj) {
  addSavedCity(cityObj);
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  if (currentWeatherData) {
    renderDashboardContent(currentWeatherData, getSavedCities(), theme);
  }
}

function handleDeleteCity(name, country) {
  removeSavedCity(name, country);
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  if (currentWeatherData) {
    renderDashboardContent(currentWeatherData, getSavedCities(), theme);
  }
}

// ==========================================================================
// THEME SWITCHER LOGIC
// ==========================================================================

function handleThemeToggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    if (nextTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    updateThemeUI(nextTheme);
    
    // Redraw weather dashboard containing the chart (colors shift on theme toggle)
    if (currentWeatherData) {
        renderDashboardContent(currentWeatherData, getSavedCities(), nextTheme);
    }
}

// ==========================================================================
// SPA ROUTER / TAB LOGIC
// ==========================================================================

function initAppRouter() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetView = tab.dataset.tab;
            
            document.querySelectorAll('.tab-content').forEach(section => {
                section.classList.remove('active');
            });
            
            const activeSection = document.getElementById(`${targetView}-view`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            
            // Re-render chart on viewport display changes (sizes are 0 when hidden)
            if ((targetView === 'weather' || targetView === 'dashboard') && currentWeatherData) {
                setTimeout(() => {
                    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                    renderDashboardContent(currentWeatherData, getSavedCities(), theme);
                }, 50);
            }
        });
    });
}

// ==========================================================================
// INITIAL SETUP ON DOM CONTENT LOADED
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Weather UI callbacks
    initWeatherUI({
        onSearchInput: handleCitySearch,
        onCitySelect: loadCityWeather,
        onThemeToggle: handleThemeToggle,
        onAddCity: handleAddCity,
        onDeleteCity: handleDeleteCity
    });

    // 2. Set Up SPA tab swapping
    initAppRouter();

    // 3. Initialize Unified Theme from LocalStorage or system scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme === 'light' || (!savedTheme && prefersLight) ? 'light' : 'dark';
    
    if (initialTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    updateThemeUI(initialTheme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', handleThemeToggle);
    }

    // 4. Set Up Celsius / Fahrenheit Unit Switcher
    let currentUnit = localStorage.getItem('temp_unit') || 'C';
    const tempToggleBtn = document.getElementById('temp-toggle-btn');
    if (tempToggleBtn) {
        tempToggleBtn.textContent = `°${currentUnit}`;
        tempToggleBtn.addEventListener('click', () => {
            currentUnit = currentUnit === 'C' ? 'F' : 'C';
            localStorage.setItem('temp_unit', currentUnit);
            tempToggleBtn.textContent = `°${currentUnit}`;
            
            // Re-render UI content with the updated unit
            if (currentWeatherData) {
                const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                renderDashboardContent(currentWeatherData, getSavedCities(), theme);
            }
        });
    }

    // 5. Load Active City Weather & News Feed (With Geolocation request)
    const activeCity = getActiveCity();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                // Keyless reverse geocoding API to resolve coordinates to a city name
                const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                const response = await fetch(geoUrl);
                if (!response.ok) throw new Error("Reverse geocoding failed");
                const geoData = await response.json();
                
                const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || "My Location";
                const countryCode = geoData.countryCode || "US";
                
                loadCityWeather({
                    name: cityName,
                    lat: lat,
                    lon: lon,
                    country: countryCode,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "auto"
                });
            } catch (err) {
                console.warn("Reverse geocoding failed, falling back to default city:", err);
                loadCityWeather(activeCity);
            }
        }, (error) => {
            console.warn("Geolocation permission denied or failed, falling back to default city:", error);
            loadCityWeather(activeCity);
        }, { timeout: 10000 });
    } else {
        loadCityWeather(activeCity);
    }

    // 6. Connect standalone news elements in the News Tab
    const newsSearch = document.getElementById('news-search');
    let searchTimeout;
    if (newsSearch) {
        newsSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const inputValue = e.target.value.trim();
                handleLocationNews(inputValue || activeCity.name);
            }, 300);
        });
    }

    const filterButtons = document.querySelectorAll('.category-filters .filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentCategory = e.target.dataset.category || 'All';
            const queryToUse = newsSearch && newsSearch.value.trim() ? newsSearch.value.trim() : currentCity;
            handleLocationNews(queryToUse);
        });
    });

    const newsSort = document.getElementById('news-sort');
    if (newsSort) {
        newsSort.addEventListener('change', (e) => {
            if (currentArticles.length > 0) {
                sortArticles(currentArticles, e.target.value);
                window.renderNewsCards(currentArticles, 'news-grid');
                updateNewsMeta(currentArticles.length);
            }
        });
    }

    // 6. Connect Saved Articles Toggle
    const savedBtn = document.getElementById('saved-articles-btn');
    if (savedBtn) {
        savedBtn.addEventListener('click', () => {
            window.currentView = window.currentView === 'saved' ? 'news' : 'saved';
            if (window.currentView === 'saved') {
                // Route to the news tab to view bookmarks
                const newsTab = document.querySelector('.nav-tab[data-tab="news"]');
                if (newsTab) newsTab.click();

                savedBtn.style.color = 'var(--accent)';
                const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
                currentArticles = savedArticles;
                window.renderNewsCards(currentArticles, 'news-grid');
                updateNewsMeta(currentArticles.length);
                
                const titleEl = document.querySelector('#news-view .news-header-titles h2');
                if (titleEl) titleEl.textContent = 'Saved Articles';
            } else {
                savedBtn.style.color = 'inherit';
                const queryToUse = newsSearch && newsSearch.value.trim() ? newsSearch.value.trim() : currentCity;
                const titleEl = document.querySelector('#news-view .news-header-titles h2');
                if (titleEl) titleEl.textContent = 'News Feed';
                handleLocationNews(queryToUse);
            }
        });
    }

    // 7. Responsive chart redraw on viewport resizing
    let resizeTimer = null;
    window.addEventListener("resize", () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (currentWeatherData) {
                const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
                renderDashboardContent(currentWeatherData, getSavedCities(), theme);
            }
        }, 200);
    });
});