import { useEffect, useState } from "react";
import { fetchForecast } from "../weatherService";
import { useLanguage } from "../context/LanguageContext";
import ForecastTable from "../components/ForecastTable";
import ClipLoader from "react-spinners/ClipLoader";

const Forecast = () => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
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
        if (data && data.grouped) {
          setForecastData(data);
        } else {
          setError(lang === "ne" ? "पूर्वानुमान लोड गर्न सकिएन।" : "Failed to fetch forecast.");
        }
      });
    }
  }, [city, lang]);

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

        <button
          onClick={handleSearch}
          style={{
            padding: "8px 12px",
            marginTop: "10px",
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
      </div>

      {loading && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <ClipLoader size={50} color="#1a73e8" />
          <p>{lang === "ne" ? "लोड हुँदैछ..." : "Loading forecast..."}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecastData && forecastData.grouped && (
        <>
          <ForecastTable data={forecastData.grouped} unitSymbol={unitSymbol} />

          {forecastData._cached && (
            <p style={{ fontSize: "0.85rem", color: "orange", marginTop: "10px" }}>
              ⚠️ {lang === "ne" ? "क्यास गरिएको डाटा" : "Cached data"} –{" "}
              {new Date(forecastData._updated).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Forecast;