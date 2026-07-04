// Main app initialization

const DEBUG_MODE = true;

let currentCategory = 'All';
let currentCity = '';
let currentArticles = [];
let lastUpdatedTimestamp = null;
let updateInterval = null;
let currentRequestId = 0;

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
            updatedEl.textContent = `Updated ${timeAgo(lastUpdatedTimestamp.toISOString())}`;
        }
    }
}

/**
 * Sorts articles in place based on the given sort type
 * @param {Array} articles
 * @param {string} sortBy
 */
function sortArticles(articles, sortBy) {
    if (!articles || articles.length === 0) return;

    articles.sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
        } else if (sortBy === 'oldest') {
            return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0);
        } else if (sortBy === 'popular') {
            // Mock popularity field (e.g. string length of title to make it somewhat stable)
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
        badge.style.backgroundColor = '#10b981'; // Green
    } else if (source === 'mock') {
        badge.textContent = 'Mock Data';
        badge.style.backgroundColor = '#f59e0b'; // Orange
    } else {
        badge.style.display = 'none';
    }
}

/**
 * Fetches and displays news for a given city and current category
 * @param {string} cityName 
 */
async function handleLocationNews(cityName = '') {
    window.currentView = 'news';
    const savedBtn = document.getElementById('saved-articles-btn');
    if (savedBtn) savedBtn.style.color = 'inherit';
    const titleEl = document.querySelector('.news-header-titles h2');
    if (titleEl) titleEl.textContent = 'News Feed';

    currentCity = cityName;
    console.log(`[Flow 3/5] handleLocationNews started for city: "${cityName}". Current category: "${currentCategory}". Calling getNews.`);
    
    showNewsLoading();
    updateDebugBadge(null);
    
    const requestId = ++currentRequestId;
    
    try {
        const data = await getNews({ query: cityName, category: currentCategory });
        
        if (requestId !== currentRequestId) return;
        
        updateDebugBadge(data._source);
        
        if (data && data.articles && data.articles.length > 0) {
            console.log(`[Flow 5/5 Success] getNews returned ${data.articles.length} articles. Rendering grid.`);
            currentArticles = data.articles;
            // Get current sort value
            const sortSelect = document.getElementById('news-sort');
            const sortBy = sortSelect ? sortSelect.value : 'newest';
            sortArticles(currentArticles, sortBy);
            renderNewsCards(currentArticles);
            updateNewsMeta(currentArticles.length);
        } else {
            console.log(`[Flow 5/5 Empty] getNews returned 0 articles. Showing 'No news found'.`);
            currentArticles = [];
            showNoNewsFound(cityName);
        }
    } catch (error) {
        if (requestId !== currentRequestId) return;
        currentArticles = [];
        
        if (error.message && error.message.includes('No results')) {
            console.log(`[Flow 5/5 Fallback Empty] getNews failed and fallback mock data had 0 results. Showing 'No news found'.`);
            showNoNewsFound(cityName);
        } else {
            console.log(`[Flow 5/5 Error] getNews threw an error: ${error.message}. Showing error UI.`);
            showNewsError(error.message || 'An error occurred while fetching news.', () => handleLocationNews(cityName));
        }
    }
}

// Listen for location changes from the weather module
document.addEventListener('locationChanged', (e) => {
    if (e.detail && typeof e.detail.city !== 'undefined') {
        console.log(`[Flow 2/5] 'locationChanged' event received for city: "${e.detail.city}". Calling handleLocationNews.`);
        handleLocationNews(e.detail.city);
    }
});

const locationInput = document.getElementById('location-input');
const locationSubmit = document.getElementById('location-submit');

function handleLocationSubmit() {
    if (locationInput) {
        const value = locationInput.value.trim();
        console.log(`[Flow 1/5] Location submitted: "${value}". Dispatching 'locationChanged' event.`);
        document.dispatchEvent(new CustomEvent('locationChanged', { detail: { city: value } }));
    }
}

if (locationSubmit) {
    locationSubmit.addEventListener('click', handleLocationSubmit);
}

if (locationInput) {
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLocationSubmit();
        }
    });
    locationInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
            handleLocationSubmit();
        }
    });
}

// Search input with debounce
let searchTimeout;
const newsSearch = document.getElementById('news-search');
if (newsSearch) {
    newsSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const inputValue = e.target.value.trim();
            handleLocationNews(inputValue);
        }, 300);
    });
}

// Category filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Toggle active class
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update current category
        currentCategory = e.target.dataset.category || 'All';
        
        // Re-run last search
        const queryToUse = newsSearch && newsSearch.value.trim() ? newsSearch.value.trim() : (currentCity || '');
        handleLocationNews(queryToUse);
    });
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    handleLocationNews('');
});

// Sort select
const newsSort = document.getElementById('news-sort');
if (newsSort) {
    newsSort.addEventListener('change', (e) => {
        if (currentArticles.length > 0) {
            sortArticles(currentArticles, e.target.value);
            renderNewsCards(currentArticles);
            updateNewsMeta(currentArticles.length);
        }
    });
}


// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Saved Articles View Toggle
window.currentView = 'news';
const savedBtn = document.getElementById('saved-articles-btn');
if (savedBtn) {
    savedBtn.addEventListener('click', () => {
        window.currentView = window.currentView === 'saved' ? 'news' : 'saved';
        if (window.currentView === 'saved') {
            savedBtn.style.color = 'var(--accent)';
            const savedArticles = JSON.parse(localStorage.getItem('saved_articles') || '[]');
            currentArticles = savedArticles;
            renderNewsCards(currentArticles);
            updateNewsMeta(currentArticles.length);
            
            const titleEl = document.querySelector('.news-header-titles h2');
            if(titleEl) titleEl.textContent = 'Saved Articles';
        } else {
            savedBtn.style.color = 'inherit';
            const queryToUse = newsSearch && newsSearch.value.trim() ? newsSearch.value.trim() : (currentCity || '');
            const titleEl = document.querySelector('.news-header-titles h2');
            if(titleEl) titleEl.textContent = 'News Feed';
            handleLocationNews(queryToUse);
        }
    });
}
