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

// Convert 3-hour forecast into daily average
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
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const searchCity = inputValue.trim();
    if (searchCity) {
      setCity(searchCity);
    }
  };

  // 🌍 Auto-detect city on first load
  useEffect(() => {
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
              setCity("Kathmandu");
            }
          } catch (err) {
            console.error("Geo lookup failed", err);
            setCity("Kathmandu");
          }
        },
        () => {
          setCity("Kathmandu");
        }
      );
    }
  }, [city]);

  // 🌦️ Fetch forecast data when city changes
  useEffect(() => {
    if (city) {
      setLoading(true);
      setError("");
      fetchForecast(city).then((data) => {
        setLoading(false);
        if (data && data.list) {
          setForecastData(data.list);
        } else {
          setError("Could not fetch forecast data.");
        }
      });
    }
  }, [city]);

  const chartData =
    viewMode === "hourly" ? forecastData.slice(0, 8) : getDailyAverageData(forecastData);

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">Forecast for {city || "..."}</h2>

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
          onClick={() =>
            setViewMode((prev) => (prev === "hourly" ? "daily" : "hourly"))
          }
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

      {loading && <p>Loading forecast...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3 style={{ marginTop: "40px" }}>
        🌡️ Temperature ({viewMode === "hourly" ? "Next 24 Hours" : "Next 5 Days"})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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

      <h3 style={{ marginTop: "40px" }}>
        💧 Humidity ({viewMode === "hourly" ? "Next 24 Hours" : "Next 5 Days"})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="main.humidity"
            stroke="#00b894"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Forecast;