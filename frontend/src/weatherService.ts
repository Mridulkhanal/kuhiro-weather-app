const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function getUnit() {
  return localStorage.getItem("kuhiro_unit") === "imperial" ? "imperial" : "metric";
}

export async function fetchWeather(city: string) {
  const unit = getUnit();
  try {
    const response = await fetch(`${API_URL}/api/weather/?city=${city}&unit=${unit}`);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

export async function fetchForecast(city: string) {
  const unit = getUnit();
  try {
    const response = await fetch(`${API_URL}/api/forecast/?city=${city}&unit=${unit}`);
    if (!response.ok) throw new Error("Failed to fetch forecast");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return null;
  }
}