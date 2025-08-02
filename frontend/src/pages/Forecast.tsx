import { useEffect, useState } from "react";
import { fetchForecast } from "../weatherService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Convert 3-hour data to daily average
const getDailyAverageData = (data: any[]) => {
  const dailyMap: { [date: string]: { temps: number[]; humidities: number[] } } = {};

  data.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { temps: [], humidities: [] };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].humidities.push(item.main.humidity);
  });

  return Object.keys(dailyMap).map((date) => {
    const temps = dailyMap[date].temps;
    const humidities = dailyMap[date].humidities;
    return {
      dt_txt: date,
      main: {
        temp: temps.reduce((a, b) => a + b, 0) / temps.length,
        humidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
      },
    };
  });
};

const Forecast = () => {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [city, setCity] = useState("Kathmandu");
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchForecast(city).then((data) => {
      setLoading(false);
      if (data && data.list) {
        setForecastData(data.list);
      } else {
        setError("Could not fetch forecast data. Please try again.");
      }
    });
  }, [city]);

  const handleSearch = () => {
    const searchCity = inputValue.trim() || "Kathmandu";
    setCity(searchCity);
  };

  const chartData =
    viewMode === "hourly" ? forecastData.slice(0, 8) : getDailyAverageData(forecastData);

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">Weather Forecast 🌦️</h2>

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

        <button
          onClick={() => setViewMode((prev) => (prev === "hourly" ? "daily" : "hourly"))}
          style={{
            padding: "8px 16px",
            marginLeft: "20px",
            fontSize: "0.9rem",
            backgroundColor: "#eee",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View: {viewMode === "hourly" ? "Hourly (Next 24h)" : "Daily (5 Days)"}
        </button>
      </div>

      {loading && <p>Loading forecast data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🌡️ Temperature Chart */}
      <h3 style={{ marginTop: "40px" }}>
        🌡️ Temperature Trend ({viewMode === "hourly" ? "Next 24 Hours" : "Next 5 Days"})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="main.temp" stroke="#1a73e8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <ul style={{ fontSize: "0.9rem", marginTop: "10px", color: "#555" }}>
        <li>🌡️ Shows temperature forecast in °C (hourly or averaged daily)</li>
        <li>🔁 Toggle to see either detailed 3-hour data or a clean 5-day trend</li>
        <li>📅 Great for travel planning, agriculture, or clothing choices</li>
      </ul>

      {/* 💧 Humidity Chart */}
      <h3 style={{ marginTop: "40px" }}>
        💧 Humidity Trend ({viewMode === "hourly" ? "Next 24 Hours" : "Next 5 Days"})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="main.humidity" stroke="#00b894" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <ul style={{ fontSize: "0.9rem", marginTop: "10px", color: "#555" }}>
        <li>💧 Humidity levels in % to understand air moisture</li>
        <li>🌿 Helpful for allergies, agriculture, or comfort planning</li>
        <li>🔁 Switch between detailed hourly view or daily average</li>
      </ul>
    </div>
  );
};

export default Forecast;