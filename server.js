// express-server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// apiHandler.js
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();
var newsCache = /* @__PURE__ */ new Map();
var CACHE_TTL = 15 * 60 * 1e3;
async function handleNewsRequest(query = "", country = "", category = "All") {
  const normalizedQuery = (query || "").trim();
  const normalizedCountry = (country || "").trim().toLowerCase();
  const normalizedCategory = (category || "All").trim();
  const cacheKey = `${normalizedQuery.toLowerCase()}:${normalizedCountry}:${normalizedCategory.toLowerCase()}`;
  const cached = newsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Proxy Cache Hit] Key: "${cacheKey}"`);
    return cached.data;
  }
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    const err = new Error("API Key configuration error: NEWS_API_KEY is not defined in the environment variables.");
    err.status = 500;
    throw err;
  }
  const isSearch = normalizedQuery !== "";
  const endpoint = isSearch ? "https://gnews.io/api/v4/search" : "https://gnews.io/api/v4/top-headlines";
  const url = new URL(endpoint);
  url.searchParams.append("apikey", apiKey);
  url.searchParams.append("lang", "en");
  url.searchParams.append("max", "10");
  if (isSearch) {
    url.searchParams.append("q", normalizedQuery);
  }
  if (normalizedCountry) {
    url.searchParams.append("country", normalizedCountry);
  }
  if (!isSearch && normalizedCategory && normalizedCategory !== "All") {
    const topicMap = {
      "Technology": "technology",
      "World": "world",
      "Science": "science",
      "Business": "business",
      "Health": "health",
      "Sports": "sports",
      "Entertainment": "entertainment"
    };
    const topic = topicMap[normalizedCategory] || "general";
    url.searchParams.append("category", topic);
  }
  console.log(`[Proxy Outbound Request] Fetching: ${url.pathname}${url.search.replace(apiKey, "REDACTED_API_KEY")}`);
  let response;
  try {
    response = await fetch(url.toString());
  } catch (err) {
    const networkErr = new Error("Network error: Unable to connect to the news server. Please check your internet connection.");
    networkErr.status = 503;
    throw networkErr;
  }
  if (!response.ok) {
    if (response.status === 401) {
      const err2 = new Error("Invalid API key: Please check your environment variables configurations.");
      err2.status = 401;
      throw err2;
    } else if (response.status === 429) {
      const err2 = new Error("Rate limit exceeded: Too many requests to the News API. Please try again later.");
      err2.status = 429;
      throw err2;
    }
    const err = new Error(`News server responded with status code ${response.status}: ${response.statusText}`);
    err.status = response.status;
    throw err;
  }
  const data = await response.json();
  if (data.errors) {
    const errorMsg = Array.isArray(data.errors) ? data.errors.join(", ") : typeof data.errors === "string" ? data.errors : JSON.stringify(data.errors);
    const err = new Error(`API Error: ${errorMsg}`);
    err.status = 400;
    throw err;
  }
  newsCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  return data;
}

// express-server.js
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/api/news", async (req, res) => {
  const query = req.query.query || "";
  const country = req.query.country || "";
  const category = req.query.category || "All";
  try {
    const data = await handleNewsRequest(query, country, category);
    res.json(data);
  } catch (err) {
    console.error(`[API Proxy Error] Fetch failed for query "${query}", country "${country}", category "${category}":`, err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Production Server] WeatherWire is listening at http://localhost:${PORT}`);
});
