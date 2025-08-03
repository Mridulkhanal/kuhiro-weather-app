import { useEffect, useState } from "react";
import { fetchWeather } from "../weatherService";

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const searchCity = inputValue.trim();
    if (searchCity) {
      localStorage.setItem("kuhiro_last_city", searchCity); // 🔒 Save to localStorage
      setCity(searchCity);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("kuhiro_last_city");

    if (savedCity) {
      setCity(savedCity);
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`
            );
            const data = await res.json();
            const geoCity = data?.[0]?.name || "Kathmandu";
            localStorage.setItem("kuhiro_last_city", geoCity); // 🔒 Save fallback city too
            setCity(geoCity);
          } catch (err) {
            setCity("Kathmandu");
          }
        },
        () => {
          setCity("Kathmandu");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError("");
      fetchWeather(city).then((data) => {
        setLoading(false);
        if (data && data.main) {
          setWeather(data);
        } else {
          setError("Weather data not found.");
        }
      });
    }
  }, [city]);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">Welcome to Kuhiro ☁️</h2>
      <p className="subtitle">Real-time weather based on your location or previous search.</p>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter city..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 12px",
            marginLeft: "10px",
            fontSize: "1rem",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading weather...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "40px" }}>
          <h3>Weather in {weather.name}</h3>
          <p>🌡️ Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
          <p>⛅ Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Home;