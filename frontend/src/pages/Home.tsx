import { useEffect, useState } from "react";
import { fetchWeather } from "../weatherService";
import { useLanguage } from "../context/LanguageContext";
import ClipLoader from "react-spinners/ClipLoader";

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { lang } = useLanguage();
  const unit = localStorage.getItem("kuhiro_unit") === "imperial" ? "imperial" : "metric";
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("kuhiro_history") || "[]");
    setHistory(saved);
  }, []);

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
            setCity(geoCity);
            localStorage.setItem("kuhiro_last_city", geoCity);
          } catch {
            setCity("Kathmandu");
          }
        },
        () => setCity("Kathmandu")
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
          setError(lang === "ne" ? "मौसम जानकारी लोड गर्न सकिएन।" : "Failed to load weather data.");
        }
      });
    }
  }, [city, lang]);

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">{lang === "ne" ? "Kuhiro मा स्वागत छ ☁️" : "Welcome to Kuhiro ☁️"}</h2>
      <p className="subtitle">
        {lang === "ne"
          ? "तपाईंको स्थान अनुसार रियल-टाइम मौसम जानकारी।"
          : "Real-time weather based on your location."}
      </p>

      <div style={{ position: "relative", marginTop: "20px" }}>
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
          <p>{lang === "ne" ? "लोड हुँदैछ..." : "Loading weather..."}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "40px" }}>
          <h3>
            {lang === "ne" ? "मौसम:" : "Weather in"} {weather.name}
          </h3>
          <p>🌡️ {lang === "ne" ? "तापक्रम" : "Temperature"}: {weather.main.temp}{unitSymbol}</p>
          <p>💧 {lang === "ne" ? "आर्द्रता" : "Humidity"}: {weather.main.humidity}%</p>
          <p>🌬️ {lang === "ne" ? "हावा" : "Wind"}: {weather.wind.speed} m/s</p>
          <p>⛅ {lang === "ne" ? "स्थिति" : "Condition"}: {weather.weather[0].description}</p>

          {weather._cached && (
            <p style={{ color: "orange", fontSize: "0.85rem" }}>
              ⚠️ {lang === "ne" ? "क्यास गरिएको डाटा" : "Cached data"} –{" "}
              {new Date(weather._updated).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;