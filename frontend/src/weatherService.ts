const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getUnit() {
  return localStorage.getItem("kuhiro_unit") === "imperial" ? "imperial" : "metric";
}

function getCacheKey(type: "weather" | "forecast", city: string, unit: string = "") {
  return `kuhiro_${type}_${city}_${unit}`;
}

export async function fetchWeather(city: string) {
  const unit = getUnit();
  const cacheKey = getCacheKey("weather", city, unit);

  console.log(`Fetching weather for ${city}, unit: ${unit}`);

  try {
    const response = await fetch(`${API_URL}/api/weather/?city=${city}&unit=${unit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `HTTP error ${response.status}`;
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check WEATHER_API_KEY in your backend configuration.");
      }
      throw new Error(`Failed to fetch weather: ${message}`);
    }
    const data = await response.json();
    console.log(`Weather data for ${city}:`, data);
    const cache = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    return { ...data, _cached: false, _updated: cache.timestamp };
  } catch (error) {
    console.warn(`Weather fetch failed for ${city}:`, error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log(`Using cached weather for ${city}`);
      return { ...parsed.data, _cached: true, _updated: parsed.timestamp };
    }
    throw error;
  }
}

export async function fetchForecast(city: string) {
  const unit = getUnit();
  const cacheKey = getCacheKey("forecast", city, unit);

  console.log(`Fetching forecast for ${city}, unit: ${unit}`);

  try {
    const response = await fetch(`${API_URL}/api/forecast/?city=${city}&unit=${unit}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || `HTTP error ${response.status}`;
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check WEATHER_API_KEY in your backend configuration.");
      }
      throw new Error(`Failed to fetch forecast: ${message}`);
    }
    const data = await response.json();
    console.log(`Forecast data for ${city}:`, data);
    if (!data.list || !Array.isArray(data.list)) {
      throw new Error("Invalid forecast data format: 'list' property missing or not an array");
    }
    const cache = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    return { ...data, _cached: false, _updated: cache.timestamp };
  } catch (error) {
    console.warn(`Forecast fetch failed for ${city}:`, error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log(`Using cached forecast for ${city}`);
      return { ...parsed.data, _cached: true, _updated: parsed.timestamp };
    }
    throw error;
  }
}