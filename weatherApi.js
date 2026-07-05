import { getWeatherDescByWmoCode, getWeatherIconByWmoCode } from "./weatherIcons.js";

// Helper to convert wind degrees to direction string
function getWindDirectionText(deg) {
  if (deg === undefined || deg === null) return "SW direction";
  const val = Math.floor((deg / 45) + 0.5);
  const arr = [
    "N direction",
    "NE direction",
    "E direction",
    "SE direction",
    "S direction",
    "SW direction",
    "W direction",
    "NW direction"
  ];
  return arr[(val % 8)];
}

// Helper to evaluate AQI status
function getAqiStatus(aqi) {
  if (aqi <= 50) return { text: "GOOD", class: "text-good", bgClass: "status-good-bg" };
  if (aqi <= 100) return { text: "MODERATE", class: "text-moderate", bgClass: "status-moderate-bg" };
  if (aqi <= 150) return { text: "UNHEALTHY (SG)", class: "text-unhealthy", bgClass: "status-unhealthy-bg" };
  return { text: "UNHEALTHY", class: "text-unhealthy", bgClass: "status-unhealthy-bg" };
}

// Helper to evaluate UV status
function getUvStatus(uv) {
  if (uv <= 2) return { text: "LOW", class: "text-good", bgClass: "status-good-bg" };
  if (uv <= 5) return { text: "MODERATE", class: "text-moderate", bgClass: "status-moderate-bg" };
  if (uv <= 7) return { text: "HIGH", class: "text-high", bgClass: "status-high-bg" };
  return { text: "VERY HIGH", class: "text-extreme", bgClass: "status-extreme-bg" };
}

// Helper to evaluate pressure status
function getPressureStatus(pressure) {
  if (pressure < 1009) return { text: "LOW", class: "text-low", bgClass: "status-low-bg" };
  if (pressure > 1020) return { text: "HIGH", class: "text-high", bgClass: "status-high-bg" };
  return { text: "NORMAL", class: "text-normal", bgClass: "status-normal-bg" };
}

/**
 * Searches for a city by name using Open-Meteo Geocoding API
 * @param {string} query 
 * @returns {Promise<Array>} List of city results
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Geocoding API error:", error);
    return [];
  }
}

/**
 * Fetches combined weather data from Forecast and Air Quality APIs
 * @param {number} lat 
 * @param {number} lon 
 * @param {string} cityName 
 * @param {string} countryCode 
 * @param {string} timezone 
 * @returns {Promise<Object>} Formatted weather data
 */
export async function fetchWeatherData(lat, lon, cityName, countryCode = "US", timezone = "auto") {
  const tzone = encodeURIComponent(timezone);
  
  // Construct endpoints
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${tzone}`;
  
  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,uv_index&timezone=${tzone}`;

  try {
    // Run fetches concurrently
    const [weatherRes, airRes] = await Promise.allSettled([
      fetch(forecastUrl).then(res => res.json()),
      fetch(airQualityUrl).then(res => res.json())
    ]);

    if (weatherRes.status === "rejected") {
      throw new Error("Failed to fetch core weather data: " + weatherRes.reason);
    }

    const weatherData = weatherRes.value;
    const airData = airRes.status === "fulfilled" ? airRes.value : null;

    const current = weatherData.current;
    const hourly = weatherData.hourly;
    const daily = weatherData.daily;

    // Parse current values
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const humidity = Math.round(current.relative_humidity_2m);
    const windSpeed = Math.round(current.wind_speed_10m);
    const windDirection = getWindDirectionText(current.wind_direction_10m);
    // Visibility: Open-Meteo reports in meters, convert to km
    const visibility = current.visibility ? Math.round(current.visibility / 1000) : 16;
    const pressure = Math.round(current.surface_pressure);
    const weatherCode = current.weather_code;
    const condition = getWeatherDescByWmoCode(weatherCode);

    // High and Low for the day
    const high = daily && daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[0]) : temp + 3;
    const low = daily && daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[0]) : temp - 4;

    // Parse Air Quality data (with failover estimation)
    let aqi = 42;
    let uv = 5;

    if (airData && airData.current) {
      aqi = Math.round(airData.current.us_aqi || 42);
      uv = Math.round(airData.current.uv_index || 5);
    } else {
      // Fallback estimations based on weather code and temp
      if (weatherCode === 0) { // Clear sky
        uv = temp > 25 ? 8 : 5;
        aqi = 35;
      } else if ([1, 2, 3].includes(weatherCode)) { // Partly cloudy
        uv = temp > 25 ? 6 : 4;
        aqi = 40;
      } else { // Rainy or cloudy
        uv = 2;
        aqi = 20;
      }
    }

    const aqiMeta = getAqiStatus(aqi);
    const uvMeta = getUvStatus(uv);
    const pressureMeta = getPressureStatus(pressure);

    // Extract Today's Temperature curve (9 points: 6 AM, 8 AM, 10 AM, 12 PM, 2 PM, 4 PM, 6 PM, 8 PM, 10 PM)
    // The hourly arrays have 168 entries. The index corresponding to today's hourly starts at 0.
    // 6 AM -> index 6, 8 AM -> index 8, 10 AM -> 10, etc.
    const chartIndices = [6, 8, 10, 12, 14, 16, 18, 20, 22];
    const chartData = chartIndices.map(idx => {
      if (hourly && hourly.temperature_2m && hourly.temperature_2m[idx] !== undefined) {
        return Math.round(hourly.temperature_2m[idx]);
      }
      // Fallback interpolations
      return Math.round(temp + Math.sin((idx - 14) / 4) * 4);
    });

    // Extract 7-Day Forecast
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const forecast = [];
    
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
        const date = new Date(daily.time[i]);
        const dayName = daysOfWeek[date.getDay()];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const wCode = daily.weather_code[i];

        forecast.push({
          day: dayName,
          desc: getWeatherDescByWmoCode(wCode),
          icon: getWeatherIconByWmoCode(wCode),
          max: maxTemp,
          min: minTemp
        });
      }
    } else {
      // Fallback mockup forecast if data unavailable
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = daysOfWeek[date.getDay()];
        forecast.push({
          day: dayName,
          desc: "Partly Cloudy",
          icon: "cloud",
          max: temp + 2,
          min: temp - 3
        });
      }
    }

    return {
      name: cityName,
      country: countryCode.toUpperCase(),
      lat,
      lon,
      temp,
      condition,
      feelsLike,
      high,
      low,
      humidity,
      windSpeed,
      windDirection,
      visibility,
      aqi,
      aqiStatus: aqiMeta.text,
      aqiClass: aqiMeta.class,
      aqiBg: aqiMeta.bgClass,
      uv,
      uvStatus: uvMeta.text,
      uvClass: uvMeta.class,
      uvBg: uvMeta.bgClass,
      pressure,
      pressureStatus: pressureMeta.text,
      pressureClass: pressureMeta.class,
      pressureBg: pressureMeta.bgClass,
      chartData,
      forecast,
      weatherCode // Preserve weatherCode to render icons correctly in UI
    };
  } catch (error) {
    console.error("fetchWeatherData orchestration error:", error);
    throw error;
  }
}
