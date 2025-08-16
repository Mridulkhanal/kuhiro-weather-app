import { useEffect, useState } from "react";
import { fetchForecast } from "../weatherService";
import { useLanguage } from "../context/LanguageContext";
import ForecastTable from "../components/ForecastTable";
import ClipLoader from "react-spinners/ClipLoader";
import "./Forecast.css";

// Import weather icons
import clearIcon from "../assets/weather-icons/clear.svg";
import rainIcon from "../assets/weather-icons/rain.svg";
import cloudIcon from "../assets/weather-icons/cloudy.svg";
import snowIcon from "../assets/weather-icons/snow.svg";
import stormIcon from "../assets/weather-icons/thunderstorm.svg";
import mistIcon from "../assets/weather-icons/mist.svg";

const Forecast = () => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Multi-City Comparison
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);

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

  const addCompareCity = () => {
    if (inputValue.trim() && !compareCities.includes(inputValue.trim()) && compareCities.length < 3) {
      setCompareCities([...compareCities, inputValue.trim()]);
      setInputValue("");
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
          setAlerts(data.alerts || []);
        } else {
          setError(lang === "ne" ? "पूर्वानुमान लोड गर्न सकिएन।" : "Failed to fetch forecast.");
        }
      });
    }
  }, [city, lang]);

  useEffect(() => {
    if (compareCities.length > 0) {
      Promise.all(compareCities.map((c) => fetchForecast(c))).then((results) => {
        const validData = results.filter((d) => d && d.grouped);
        setCompareData(validData);
      });
    } else {
      setCompareData([]);
    }
  }, [compareCities, lang]);

  const getAvg = (arr: number[]) =>
    arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "-";

  // Map weather condition to icon
  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes("clear")) return clearIcon;
    if (lower.includes("rain")) return rainIcon;
    if (lower.includes("cloud")) return cloudIcon;
    if (lower.includes("snow")) return snowIcon;
    if (lower.includes("thunder")) return stormIcon;
    if (lower.includes("storm")) return stormIcon;
    if (lower.includes("mist") || lower.includes("fog") || lower.includes("haze")) return mistIcon;
    return clearIcon;
  };

  // Generate Forecast Insights
  const getForecastInsights = () => {
    if (!forecastData?.grouped) return null;

    const days = Object.values(forecastData.grouped).flat() as any[];
    const temps = days.map((d) => d.main.temp);
    const conditions = days.map((d) => d.weather[0].description.toLowerCase());
    const winds = days.map((d) => d.wind.speed);
    const precipitations = days.map((d) => d.rain?.["3h"] || 0);

    // Dominant condition
    const conditionCounts = conditions.reduce((acc, cond) => {
      acc[cond] = (acc[cond] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
      conditionCounts[a] > conditionCounts[b] ? a : b
    );

    // Warmest and coldest days
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const warmestDay = days.find((d) => d.main.temp === maxTemp)?.dt_txt.split(" ")[0];
    const coldestDay = days.find((d) => d.main.temp === minTemp)?.dt_txt.split(" ")[0];

    // Rain chances
    const rainyDays = precipitations.filter((p) => p > 0).length;
    const rainChance = ((rainyDays / days.length) * 100).toFixed(0);

    // Windiest day
    const maxWind = Math.max(...winds);
    const windiestDay = days.find((d) => d.wind.speed === maxWind)?.dt_txt.split(" ")[0];

    // Format date for display
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return {
      dominantCondition,
      warmestDay: formatDate(warmestDay),
      coldestDay: formatDate(coldestDay),
      rainChance,
      windiestDay: formatDate(windiestDay),
      tempRange: `${Math.round(minTemp)}${unitSymbol} - ${Math.round(maxTemp)}${unitSymbol}`,
    };
  };

  const insights = getForecastInsights();

  return (
    <div className="forecast-container">
      <h2 className="title">
        {lang === "ne" ? "पूर्वानुमान" : "Forecast"}: {city}
      </h2>

      {/* Search & Compare Controls */}
      <div className="search-compare-container">
        <input
          id="city-search"
          type="text"
          placeholder={lang === "ne" ? "सहर टाइप गर्नुहोस्..." : "Enter city..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          list="city-history"
          className="city-input"
        />
        <datalist id="city-history">
          {history.map((city, index) => (
            <option value={city} key={index} />
          ))}
        </datalist>
        <button onClick={handleSearch} className="search-button">
          {lang === "ne" ? "खोज्नुहोस्" : "Search"}
        </button>
        <button onClick={addCompareCity} className="compare-button">
          {lang === "ne" ? "थप्नुहोस्" : "+ Compare"}
        </button>
      </div>

      {/* Forecast Insights */}
      {insights && (
        <div className="insights-container">
          <h3>{lang === "ne" ? "पूर्वानुमान संक्षेप" : "Forecast Insights"}</h3>
          <table className="insights-table">
            <thead>
              <tr>
                <th>{lang === "ne" ? "विवरण" : "Metric"}</th>
                <th>{lang === "ne" ? "मान" : "Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{lang === "ne" ? "प्रमुख अवस्था" : "Dominant Condition"}</td>
                <td>
                  <div className="insight-value">
                    <img
                      src={getWeatherIcon(insights.dominantCondition)}
                      alt={insights.dominantCondition}
                      className="weather-icon-small"
                    />
                    {insights.dominantCondition}
                  </div>
                </td>
              </tr>
              <tr>
                <td>{lang === "ne" ? "न्यानो दिन" : "Warmest Day"}</td>
                <td>{insights.warmestDay}</td>
              </tr>
              <tr>
                <td>{lang === "ne" ? "चिसो दिन" : "Coldest Day"}</td>
                <td>{insights.coldestDay}</td>
              </tr>
              <tr>
                <td>{lang === "ne" ? "वर्षाको सम्भावना" : "Rain Chance"}</td>
                <td>{insights.rainChance}%</td>
              </tr>
              <tr>
                <td>{lang === "ne" ? "हावाहुरी दिन" : "Windiest Day"}</td>
                <td>{insights.windiestDay}</td>
              </tr>
              <tr>
                <td>{lang === "ne" ? "तापमान दायरा" : "Temp Range"}</td>
                <td>{insights.tempRange}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Main Forecast Table */}
      {loading && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <ClipLoader size={50} color="var(--accent-color)" />
          <p>{lang === "ne" ? "लोड हुँदैछ..." : "Loading forecast..."}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {forecastData && forecastData.grouped && (
        <ForecastTable data={forecastData.grouped} unitSymbol={unitSymbol} alerts={alerts} />
      )}

      {/* Multi-City Comparison Section */}
      {compareData.length > 0 && (
        <div className="comparison-container">
          <h3>{lang === "ne" ? "सहर तुलना" : "City Comparison"}</h3>
          <div className="comparison-grid">
            {compareData.map((cityData, idx) => {
              const temps = Object.values(cityData.grouped).flat().map((i: any) => i.main.temp);
              const minTemp = Math.min(...temps);
              const maxTemp = Math.max(...temps);
              const precip = getAvg(Object.values(cityData.grouped).flat().map((i: any) => i.rain?.["3h"] || 0));
              const wind = getAvg(Object.values(cityData.grouped).flat().map((i: any) => i.wind.speed));
              const condition = cityData.grouped[Object.keys(cityData.grouped)[0]][0].weather[0].description;
              const cityName = cityData.city?.name || compareCities[idx];
              const icon = getWeatherIcon(condition);

              return (
                <div
                  key={idx}
                  className="comparison-card"
                  onClick={() => setCity(cityName)}
                  title={lang === "ne" ? "थप विवरण हेर्न क्लिक गर्नुहोस्" : "Click to view details"}
                >
                  <h4>{cityName}</h4>
                  <img src={icon} alt={condition} className="weather-icon-small" />
                  <p className="condition">{condition}</p>
                  <div className="temp-range">
                    <span>Min: {Math.round(minTemp)}{unitSymbol}</span>
                    <span>Max: {Math.round(maxTemp)}{unitSymbol}</span>
                  </div>
                  <p>{lang === "ne" ? "वर्षा" : "Precip"}: {precip} mm</p>
                  <p>{lang === "ne" ? "हावा" : "Wind"}: {wind} m/s</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;