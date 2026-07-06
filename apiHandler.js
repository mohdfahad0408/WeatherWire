import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Fallback for older Node.js versions, although native fetch exists in Node 18+

dotenv.config();

const newsCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache lifetime

/**
 * Normalizes inputs and handles GNews API coordination, caching, and error forwarding.
 * @param {string} query 
 * @param {string} category 
 * @returns {Promise<Object>} News data payload
 */
export async function handleNewsRequest(query = '', category = 'All') {
  const normalizedQuery = (query || '').trim();
  const normalizedCategory = (category || 'All').trim();

  // Create unique cache key
  const cacheKey = `${normalizedQuery.toLowerCase()}:${normalizedCategory.toLowerCase()}`;
  const cached = newsCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[Proxy Cache Hit] Key: "${cacheKey}"`);
    return cached.data;
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    const err = new Error('API Key configuration error: NEWS_API_KEY is not defined in the environment variables.');
    err.status = 500;
    throw err;
  }

  const isSearch = normalizedQuery !== '';
  const endpoint = isSearch ? 'https://gnews.io/api/v4/search' : 'https://gnews.io/api/v4/top-headlines';
  const url = new URL(endpoint);

  url.searchParams.append('apikey', apiKey);
  url.searchParams.append('lang', 'en');
  url.searchParams.append('max', '10');

  if (isSearch) {
    url.searchParams.append('q', normalizedQuery);
  } else if (normalizedCategory && normalizedCategory !== 'All') {
    const topicMap = {
      'Technology': 'technology',
      'World': 'world',
      'Science': 'science',
      'Business': 'business',
      'Health': 'health',
      'Sports': 'sports',
      'Entertainment': 'entertainment'
    };
    const topic = topicMap[normalizedCategory] || 'general';
    url.searchParams.append('category', topic);
  }

  console.log(`[Proxy Outbound Request] Fetching: ${url.pathname}${url.search.replace(apiKey, 'REDACTED_API_KEY')}`);

  let response;
  try {
    response = await fetch(url.toString());
  } catch (err) {
    const networkErr = new Error('Network error: Unable to connect to the news server. Please check your internet connection.');
    networkErr.status = 503;
    throw networkErr;
  }

  if (!response.ok) {
    if (response.status === 401) {
      const err = new Error('Invalid API key: Please check your environment variables configurations.');
      err.status = 401;
      throw err;
    } else if (response.status === 429) {
      const err = new Error('Rate limit exceeded: Too many requests to the News API. Please try again later.');
      err.status = 429;
      throw err;
    }
    const err = new Error(`News server responded with status code ${response.status}: ${response.statusText}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();

  if (data.errors) {
    const errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : (typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors));
    const err = new Error(`API Error: ${errorMsg}`);
    err.status = 400;
    throw err;
  }

  // Cache successful response
  newsCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
}
