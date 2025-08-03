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
      setCity(searchCity);
    }
  };

  useEffect(() => {
    // Geolocation on first load
    if (!city) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`
            );
            const data = await res.json();
            if (data && data[0] && data[0].name) {
              setCity(data[0].name);
            } else {
              setCity("Kathmandu"); // fallback
            }
          } catch (err) {
            console.error("Geolocation API error:", err);
            setCity("Kathmandu");
          }
        },
        () => {
          // If user blocks location
          setCity("Kathmandu");
        }
      );
    }
  }, [city]);

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
      <p className="subtitle">Real-time weather based on your location.</p>

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