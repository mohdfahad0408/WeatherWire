// News logic

// Reroute news requests to our server-side proxy
const BASE_URL = '/api/news';

/**
 * Fetches news from the local proxy server.
 * @param {Object} params
 * @param {string} [params.query] - Keyword search
 * @param {string} [params.category] - Category filter
 * @returns {Promise<Object>}
 */
async function fetchNews({ query = '', country = '', category = 'All' }) {
    try {
        const isSearch = query.trim() !== '';
        const url = new URL('/api/news', window.location.origin);
        
        if (isSearch) {
            url.searchParams.append('query', query.trim());
        }
        if (country && country.trim() !== '') {
            url.searchParams.append('country', country.trim());
        }
        if (category && category !== 'All') {
            url.searchParams.append('category', category);
        }

        console.log(`[News Proxy Fetch] URL: ${url.toString()}`);

        const response = await fetch(url.toString());
        console.log(`[Raw Response] status: ${response.status}`);

        if (!response.ok) {
            let errorMsg = `HTTP Error ${response.status}`;
            try {
                const errData = await response.json();
                if (errData && errData.error) {
                    errorMsg = errData.error;
                }
            } catch (jsonErr) {
                errorMsg = response.statusText || errorMsg;
            }

            if (response.status === 401) {
                throw new Error(`Invalid API key: ${errorMsg}`);
            } else if (response.status === 429) {
                throw new Error(`Rate limit exceeded: ${errorMsg}`);
            } else if (response.status === 403) {
                throw new Error(`CORS restriction: ${errorMsg}`);
            }
            throw new Error(errorMsg);
        }

        let data = await response.json();
        
        console.log(`[Parsed Data] totalArticles: ${data.totalArticles}, articles.length: ${data.articles ? data.articles.length : 0}`);

        if (data.errors) {
            const errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors));
            throw new Error(`API Error: ${errorMsg}`);
        }

        if (!data.articles || data.articles.length === 0) {
            throw new Error('No results: We could not find any news matching your criteria.');
        }

        // Apply client side category filter if it's a search
        if (isSearch && category && category !== 'All') {
            const catLower = category.toLowerCase();
            const filteredArticles = data.articles.filter(article => {
                if (article.category) {
                    return article.category.toLowerCase() === catLower;
                }
                const text = ((article.title || '') + ' ' + (article.description || '') + ' ' + (article.content || '')).toLowerCase();
                return text.includes(catLower);
            });
            
            if (filteredArticles.length === 0) {
                throw new Error('No results: We could not find any news matching your criteria after category filtering.');
            }
            data.articles = filteredArticles;
            data.totalArticles = filteredArticles.length;
        }

        return data;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Network error: Unable to connect to the news server. Please check your internet connection.');
        }
        throw error; // Re-throw custom errors
    }
}

const clientNewsCache = new Map();
const CLIENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime
const activeRequests = new Map();

/**
 * Main function to get news. Tries client-side cache and request pool,
 * then tries fetchNews (proxy).
 * @param {Object} params
 * @param {string} [params.query]
 * @param {string} [params.category]
 * @returns {Promise<Object>}
 */
async function getNews({ query = '', country = '', category = 'All' } = {}) {
    const q = (query || '').trim();
    const co = (country || '').trim();
    const cat = (category || 'All').trim();
    const cacheKey = `${q.toLowerCase()}:${co.toLowerCase()}:${cat.toLowerCase()}`;

    console.log(`[Flow 4/5] getNews called with: { query: '${q}', country: '${co}', category: '${cat}' }`);

    // 1. Check client-side cache
    const cached = clientNewsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CLIENT_CACHE_TTL)) {
        console.log(`[Client Cache Hit] Returning cached data for key: "${cacheKey}"`);
        return cached.data;
    }

    // 2. Check in-flight pool to collapse duplicate requests
    if (activeRequests.has(cacheKey)) {
        console.log(`[Request Collapsed] Sharing in-flight request for key: "${cacheKey}"`);
        return activeRequests.get(cacheKey);
    }

    // 3. Perform fetch
    const promise = (async () => {
        try {
            const data = await fetchNews({ query: q, country: co, category: cat });
            console.log(`[Flow 4/5] fetchNews succeeded.`);
            data._source = 'live';
            
            // Cache successful result
            clientNewsCache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`[Flow 4/5] fetchNews failed:`, error.message);
            throw error;
        } finally {
            activeRequests.delete(cacheKey);
        }
    })();

    activeRequests.set(cacheKey, promise);
    return promise;
}
window.getNews = getNews;