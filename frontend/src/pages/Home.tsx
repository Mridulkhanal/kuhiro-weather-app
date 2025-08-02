import { useEffect, useState } from "react";
import { fetchWeather } from "../weatherService";

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Kathmandu");
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    const searchCity = inputValue.trim() || "Kathmandu";
    fetchWeather(searchCity).then(setWeather);
    setCity(searchCity);
  };

  useEffect(() => {
    fetchWeather(city).then(setWeather);
  }, [city]);

  return (
    <div className="container">
      <h2 className="title">Welcome to Kuhiro ☁️</h2>
      <p className="subtitle">Search and explore real-time weather updates.</p>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Enter city..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: "8px 12px", marginLeft: "8px", fontSize: "1rem" }}
        >
          Search
        </button>
      </div>

      {weather ? (
        <div style={{ marginTop: "30px" }}>
          <h3>Current Weather in {weather.name}</h3>
          <p>🌡️ Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
          <p>⛅ Condition: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default Home;
