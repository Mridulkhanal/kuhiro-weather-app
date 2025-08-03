const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getUnit() {
  return localStorage.getItem("kuhiro_unit") === "imperial" ? "imperial" : "metric";
}

function getCacheKey(type: "weather" | "forecast", city: string, unit: string) {
  return `kuhiro_${type}_${city}_${unit}`;
}

export async function fetchWeather(city: string) {
  const unit = getUnit();
  const cacheKey = getCacheKey("weather", city, unit);

  try {
    const response = await fetch(`${API_URL}/api/weather/?city=${city}&unit=${unit}`);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    const cache = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    return { ...data, _cached: false, _updated: cache.timestamp };
  } catch (error) {
    console.warn("Using cached weather:", error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed.data, _cached: true, _updated: parsed.timestamp };
    }
    return null;
  }
}

export async function fetchForecast(city: string) {
  const unit = getUnit();
  const cacheKey = getCacheKey("forecast", city, unit);

  try {
    const response = await fetch(`${API_URL}/api/forecast/?city=${city}&unit=${unit}`);
    if (!response.ok) throw new Error("Failed to fetch forecast");
    const data = await response.json();
    const cache = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(cacheKey, JSON.stringify(cache));
    return { ...data, _cached: false, _updated: cache.timestamp };
  } catch (error) {
    console.warn("Using cached forecast:", error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed.data, _cached: true, _updated: parsed.timestamp };
    }
    return null;
  }
}