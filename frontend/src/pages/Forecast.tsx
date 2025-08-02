import { useEffect, useState } from "react";
import { fetchForecast } from "../weatherService";

const Forecast = () => {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [city, setCity] = useState("Kathmandu");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchForecast(city).then((data) => {
      if (data && data.list) {
        setForecastData(data.list);
        console.log("Forecast data:", data.list); // Preview in dev tools
      }
    });
  }, [city]);

  const handleSearch = () => {
    const searchCity = inputValue.trim() || "Kathmandu";
    setCity(searchCity);
  };

  return (
    <div className="container">
      <h2 className="title">5-Day / 3-Hour Forecast 🌦️</h2>

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

      <ul style={{ textAlign: "left", marginTop: "20px" }}>
        {forecastData.slice(0, 6).map((item, index) => (
          <li key={index}>
            {item.dt_txt}: {item.main.temp}°C, {item.weather[0].description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Forecast;