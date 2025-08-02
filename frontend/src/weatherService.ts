const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function fetchWeather(city: string) {
  try {
    const response = await fetch(`${API_URL}/api/weather/?city=${city}`);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
