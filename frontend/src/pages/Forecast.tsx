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
import { useLanguage } from "../context/LanguageContext";

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
  const [history, setHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"hourly" | "daily">("hourly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { lang } = useLanguage();
  const unit = localStorage.getItem("kuhiro_unit") === "imperial" ? "imperial" : "metric";
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  const handleSearch = () => {
    const searchCity = inputValue.trim();
    if (searchCity) {
      setCity(searchCity);
      localStorage.setItem("kuhiro_last_city", searchCity);

      const updatedHistory = [searchCity, ...history.filter((c) => c !== searchCity)].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("kuhiro_history", JSON.stringify(updatedHistory));
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("kuhiro_history") || "[]");
    setHistory(saved);
  }, []);

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
            localStorage.setItem("kuhiro_last_city", geoCity);
            setCity(geoCity);
          } catch {
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
      fetchForecast(city).then((data) => {
        setLoading(false);
        if (data && data.list) {
          setForecastData(data.list);
        } else {
          setError(lang === "ne" ? "पूर्वानुमान लोड गर्न सकिएन।" : "Failed to fetch forecast.");
        }
      });
    }
  }, [city, lang]);

  const chartData =
    viewMode === "hourly" ? forecastData.slice(0, 8) : getDailyAverageData(forecastData);

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">
        {lang === "ne" ? "पूर्वानुमान" : "Forecast"}: {city}
      </h2>

      <div style={{ position: "relative", margin: "20px 0" }}>
        <input
          type="text"
          placeholder={lang === "ne" ? "सहर टाइप गर्नुहोस्..." : "Enter city..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          list="city-history"
          style={{ padding: "8px", fontSize: "1rem", width: "100%" }}
        />
        <datalist id="city-history">
          {history.map((city, index) => (
            <option value={city} key={index} />
          ))}
        </datalist>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={handleSearch}
            style={{
              padding: "8px 12px",
              fontSize: "1rem",
              backgroundColor: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {lang === "ne" ? "खोज्नुहोस्" : "Search"}
          </button>

          <button
            onClick={() => setViewMode((prev) => (prev === "hourly" ? "daily" : "hourly"))}
            style={{
              padding: "8px 16px",
              fontSize: "0.9rem",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {lang === "ne"
              ? viewMode === "hourly"
                ? "दैनिक हेर्नुहोस्"
                : "प्रति घण्टा हेर्नुहोस्"
              : viewMode === "hourly"
              ? "View Daily"
              : "View Hourly"}
          </button>
        </div>
      </div>

      {loading && <p>{lang === "ne" ? "लोड हुँदैछ..." : "Loading forecast..."}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecastData.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px" }}>
            🌡️ {lang === "ne" ? "तापक्रम" : "Temperature"} ({viewMode === "hourly" ? "Next 24h" : "Next 5 Days"}) – {unitSymbol}
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
            💧 {lang === "ne" ? "आर्द्रता" : "Humidity"} ({viewMode === "hourly" ? "Next 24h" : "Next 5 Days"})
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
        </>
      )}
    </div>
  );
};

export default Forecast;