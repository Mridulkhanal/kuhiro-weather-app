import { useEffect, useState } from "react";
import { fetchForecast } from "../weatherService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const Forecast = () => {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [city, setCity] = useState("Kathmandu");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchForecast(city).then((data) => {
      if (data && data.list) {
        setForecastData(data.list);
        console.log("Forecast data:", data.list);
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

      <h3 style={{ marginTop: "40px" }}>📈 Temperature Trend (Next Hours)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forecastData.slice(0, 8)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="main.temp"
            stroke="#1a73e8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Forecast;