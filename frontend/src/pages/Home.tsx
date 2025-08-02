import { useEffect, useState } from "react";
import { fetchWeather } from "../weatherService";

const Home = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetchWeather("Kathmandu").then(setWeather);
  }, []);

  return (
    <div className="container">
      <h2 className="title">Welcome to Kuhiro ☁️</h2>
      <p className="subtitle">Search and explore real-time weather updates.</p>

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
