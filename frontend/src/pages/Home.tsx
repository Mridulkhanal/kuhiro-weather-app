import { useEffect, useState } from "react";
import { fetchWeather, fetchForecast } from "../weatherService";
import { useLanguage } from "../context/LanguageContext";
import ClipLoader from "react-spinners/ClipLoader";
import WeatherIcon from "../components/WeatherIcon";
import WeatherMetrics from "../components/WeatherMetrics";
import "./Home.css";

const nepalCities = [
  "Kathmandu",
  "Pokhara",
  "Biratnagar",
  "Lalitpur",
  "Bhaktapur",
  "Nepalgunj",
  "Butwal",
  "Dharan",
  "Hetauda",
  "Janakpur",
  "Birendranagar",
  "Dhangadhi",
  "Tansen",
  "Bharatpur",
  "Rajbiraj",
  "Tikapur",
  "Kirtipur",
  "Damak"
];

const getWeatherTip = (condition: string, lang: string): string => {
  const lower = condition.toLowerCase();
  if (lang === "ne") {
    if (lower.includes("rain")) return "☔ वर्षा भइरहेको छ, छाता ल्याउन नबिर्सनुहोस्!";
    if (lower.includes("snow")) return "❄️ हिउँ परिरहेको छ, न्यानो लुगा लगाउनुहोस्!";
    if (lower.includes("clear")) return "😎 मौसम सफा छ, बाहिर घुम्न जान सक्छिन्छ!";
    if (lower.includes("cloud")) return "⛅ बादल लागेको छ, आरामदायी मौसम!";
    if (lower.includes("storm")) return "⚡ आंधी सम्भावना छ, सतर्क रहनुहोस्!";
    return "ℹ️ मौसम हेरेर योजना बनाउनुहोस्।";
  } else {
    if (lower.includes("rain")) return "☔ It's rainy — carry an umbrella!";
    if (lower.includes("snow")) return "❄️ Snowy — stay warm and safe!";
    if (lower.includes("clear")) return "😎 Clear skies — great day for a walk!";
    if (lower.includes("cloud")) return "⛅ Cloudy — enjoy the cool weather!";
    if (lower.includes("storm")) return "⚡ Stormy — stay indoors if possible!";
    return "ℹ️ Plan your day based on the weather.";
  }
};

const quotes = [
  {
    en: "☀️ The sun always shines above the clouds.",
    ne: "☀️ बादलमाथि सधैं घाम चम्किन्छ।"
  },
  {
    en: "🌧️ Rain is just confetti from the sky.",
    ne: "🌧️ वर्षा आकाशबाट झरेको रंगीन कागज हो।"
  },
  {
    en: "🌈 After rain comes the rainbow.",
    ne: "🌈 वर्षापछि इन्द्रेणी आउँछ।"
  },
  {
    en: "❄️ Snowflakes are kisses from heaven.",
    ne: "❄️ हिउँका टुक्राहरू स्वर्गबाट आएका चुम्बन हुन्।"
  },
  {
    en: "🌬️ Let the wind carry your worries away.",
    ne: "🌬️ हावालाई तिम्रा चिन्ताहरू उडाउन देऊ।"
  },
  {
    en: "☁️ Clouds come floating into my life, no longer to carry rain, but to add color.",
    ne: "☁️ बादलहरू मेरो जीवनमा तैरिएर आउँछन्, वर्षा बोक्न होइन, रंग थप्न।"
  },
  {
    en: "☀️ A sunny day brings a warm heart.",
    ne: "☀️ घाम लागेको दिनले मन तातो बनाउँछ।"
  },
  {
    en: "🌧️ Every raindrop tells a story.",
    ne: "🌧️ प्रत्येक थोपा वर्षाले कथा सुनाउँछ।"
  },
  {
    en: "🌈 Rainbows paint the sky with hope.",
    ne: "🌈 इन्द्रेणीले आकाशलाई आशाले रंगाउँछ।"
  },
  {
    en: "❄️ Snow turns the world into a quiet dream.",
    ne: "❄️ हिउँले संसारलाई शान्त सपना बनाउँछ।"
  },
  {
    en: "🌬️ The breeze whispers secrets of the sky.",
    ne: "🌬️ हावाले आकाशका रहस्यहरू फुसफुसाउँछ।"
  },
  {
    en: "☁️ Clouds dance to the rhythm of the wind.",
    ne: "☁️ बादलहरू हावाको तालमा नाच्छन्।"
  }
];

const weatherFacts = [
  {
    en: {
      title: "🌡️ Highest Temperature in Nepal",
      description: "The highest temperature recorded in Nepal was 46.4°C in Dhangadhi on June 16, 1995."
    },
    ne: {
      title: "🌡️ नेपालमा उच्च तापमान",
      description: "नेपालमा रेकर्ड गरिएको उच्च तापमान ४६.४ डिग्री सेल्सियस धनगढीमा जुन १६, १९९५ मा थियो।"
    }
  },
  {
    en: {
      title: "🌫️ How Fog Forms",
      description: "Fog forms when the temperature drops to the dew point, causing water vapor to condense into tiny droplets."
    },
    ne: {
      title: "🌫️ कुहिरो कसरी बन्छ",
      description: "कुहिरो तब बन्छ जब तापमान ओस बिन्दुमा झर्छ, जसले पानीको वाफलाई साना थोपाहरूमा संघनन गर्छ।"
    }
  },
  {
    en: {
      title: "🌧️ Monsoon Magic",
      description: "Nepal’s monsoon season (June–September) brings 80% of the annual rainfall, vital for agriculture."
    },
    ne: {
      title: "🌧️ मनसुनको जादु",
      description: "नेपालको मनसुन सिजन (जुन–सेप्टेम्बर) मा वार्षिक वर्षाको ८०% हुन्छ, जुन कृषिका लागि महत्त्वपूर्ण छ।"
    }
  },
  {
    en: {
      title: "🏔️ Himalayan Weather",
      description: "The Himalayas create diverse microclimates, from tropical valleys to arctic peaks."
    },
    ne: {
      title: "🏔️ हिमालयको मौसम",
      description: "हिमालयले उष्ण उपत्यकादेखि आर्कटिक चुचुरासम्म विविध सूक्ष्म जलवायु सिर्जना गर्छ।"
    }
  },
  {
    en: {
      title: "❄️ Snow in Nepal",
      description: "Snowfall is common above 3,000 meters in Nepal, especially in winter (December–February)."
    },
    ne: {
      title: "❄️ नेपालमा हिउँ",
      description: "नेपालमा ३,००० मिटरभन्दा माथि हिउँ पर्ने गर्छ, विशेषगरी हिउँदमा (डिसेम्बर–फेब्रुअरी)।"
    }
  },
  {
    en: {
      title: "🌬️ Wind Patterns",
      description: "Winds in Nepal are influenced by the monsoon and jet streams, shaping local weather."
    },
    ne: {
      title: "🌬️ हावाको ढाँचा",
      description: "नेपालमा हावाहरू मनसुन र जेट स्ट्रिमद्वारा प्रभावित हुन्छन्, जसले स्थानीय मौसमलाई आकार दिन्छ।"
    }
  }
];

const Home = () => {
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tomorrowForecast, setTomorrowForecast] = useState<{ max: number; min: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [isFactAutoRotating, setIsFactAutoRotating] = useState(true);
  const [nepalWeather, setNepalWeather] = useState<any[]>([]);
  const [loadingNepal, setLoadingNepal] = useState(false);

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

  const handlePrevFact = () => {
    setIsFactAutoRotating(false);
    setFactIndex((prev) => (prev - 1 + weatherFacts.length) % weatherFacts.length);
  };

  const handleNextFact = () => {
    setIsFactAutoRotating(false);
    setFactIndex((prev) => (prev + 1) % weatherFacts.length);
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("kuhiro_history") || "[]");
    setHistory(saved);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000); // every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFactAutoRotating) {
      interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % weatherFacts.length);
      }, 10000); // every 10s
    }
    return () => clearInterval(interval);
  }, [isFactAutoRotating]);

  useEffect(() => {
    if (!isFactAutoRotating) {
      const timeout = setTimeout(() => {
        setIsFactAutoRotating(true);
      }, 20000); // resume auto-rotation after 20s
      return () => clearTimeout(timeout);
    }
  }, [isFactAutoRotating]);

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
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
            );
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(errorData.message || `Geolocation API error: ${res.status}`);
            }
            const data = await res.json();
            if (data?.[0]?.name) {
              const geoCity = data[0].name;
              setCity(geoCity);
              localStorage.setItem("kuhiro_last_city", geoCity);
            } else {
              setCity("Kathmandu");
              setError(lang === "ne" ? "स्थान पत्ता लगाउन सकिएन। काठमाडौं प्रयोग गरियो।" : "Could not detect location. Using Kathmandu.");
            }
          } catch (error: any) {
            console.error(`Geolocation error: ${error.message}`);
            setCity("Kathmandu");
            setError(lang === "ne" ? `स्थान पत्ता लगाउन सकिएन: ${error.message}` : `Could not detect location: ${error.message}`);
          }
        },
        (err) => {
          console.error(`Geolocation error: ${err.message}`);
          setCity("Kathmandu");
          setError(lang === "ne" ? "जियोलोकेसन अस्वीकृत। काठमाडौं प्रयोग गरियो।" : "Geolocation denied. Using Kathmandu.");
        }
      );
    }
  }, [lang]);

  useEffect(() => {
    if (city) {
      setLoading(true);
      setError("");

      fetchWeather(city).then((data) => {
        setLoading(false);
        if (data && data.main) {
          setWeather(data);
        } else {
          setError(
            lang === "ne"
              ? "मौसम जानकारी लोड गर्न सकिएन। कृपया API कुञ्जी जाँच गर्नुहोस्।"
              : "Failed to load weather data. Please check API key."
          );
        }
      }).catch((error: any) => {
        setLoading(false);
        setError(
          lang === "ne"
            ? `मौसम जानकारी लोड गर्न सकिएन: ${error.message}`
            : `Failed to load weather data: ${error.message}`
        );
        console.error(`Weather error for ${city}: ${error.message}`);
      });

      fetchForecast(city).then((forecastData) => {
        console.log(`Forecast data for ${city}:`, forecastData);
        if (forecastData && forecastData.list?.length > 0) {
          const now = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowDate = tomorrow.toISOString().split("T")[0];

          const tomorrowItems = forecastData.list.filter((item: any) =>
            item.dt_txt.startsWith(tomorrowDate)
          );

          console.log(`Tomorrow items for ${tomorrowDate}:`, tomorrowItems);

          if (tomorrowItems.length > 0) {
            const temps = tomorrowItems.map((item: any) => item.main.temp);
            const max = Math.max(...temps);
            const min = Math.min(...temps);
            setTomorrowForecast({ max, min });
          } else {
            setError(
              lang === "ne"
                ? "भोलिको पूर्वानुमान उपलब्ध छैन।"
                : "Tomorrow's forecast is not available."
            );
          }
        } else {
          setError(
            lang === "ne"
              ? "पूर्वानुमान डाटा लोड गर्न सकिएन।"
              : "Failed to load forecast data."
          );
        }
      }).catch((error: any) => {
        setError(
          lang === "ne"
            ? `पूर्वानुमान लोड गर्न सकिएन: ${error.message}`
            : `Failed to load forecast: ${error.message}`
        );
        console.error(`Forecast error for ${city}: ${error.message}`);
      });
    }
  }, [city, lang, unit]);

  useEffect(() => {
    setLoadingNepal(true);
    Promise.all(
      nepalCities.map((c) =>
        fetchWeather(c).then((data) => ({ city: c, ...data })).catch((error: any) => {
          console.error(`Weather fetch failed for Nepal city ${c}: ${error.message}`);
          return null;
        })
      )
    )
      .then((results) => {
        const validResults = results.filter((r) => r && r.main);
        setNepalWeather(validResults);
        setLoadingNepal(false);
        if (validResults.length === 0) {
          setError(
            lang === "ne"
              ? "नेपालको मौसम जानकारी लोड गर्न सकिएन।"
              : "Failed to load Nepal weather data."
          );
        }
      })
      .catch((error: any) => {
        setLoadingNepal(false);
        setError(
          lang === "ne"
            ? `नेपालको मौसम जानकारी लोड गर्न सकिएन: ${error.message}`
            : `Failed to load Nepal weather data: ${error.message}`
        );
        console.error(`Nepal weather error: ${error.message}`);
      });
  }, [unit, lang]);

  const handleCityClick = (clickedCity: string) => {
    setInputValue(clickedCity);
    setCity(clickedCity);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "0 20px" }}>
      <h2 className="title">{lang === "ne" ? `Kuhiro मा स्वागत छ ☁️` : `Welcome to Kuhiro ☁️`}</h2>
      <p className="subtitle">
        {lang === "ne"
          ? "तपाईंको स्थान अनुसार रियल-टाइम मौसम जानकारी।"
          : "Real-time weather based on your location."}
      </p>
      <div className="weather-quote">
        <p>{quotes[quoteIndex][lang]}</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", margin: "20px 0" }}>
        <input
          id="city-search"
          type="text"
          name="city"
          placeholder={lang === "ne" ? "सहर टाइप गर्नुहोस्..." : "Enter city..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          list="city-history"
          className="city-input"
          aria-label="City Search"
        />
        <datalist id="city-history">
          {history.map((city, index) => (
            <option value={city} key={index} />
          ))}
        </datalist>
        <button onClick={handleSearch} className="search-button">
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

      {weather && (() => {
        let isDayTime = true;
        if (weather.sys?.sunrise && weather.sys?.sunset && weather.dt) {
          const nowUTC = weather.dt;
          isDayTime = nowUTC >= weather.sys.sunrise && nowUTC < weather.sys.sunset;
        }

        const localDate = new Date(currentTime.getTime() + (weather.timezone * 1000));

        const dateFormatter = new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-US", {
          timeZone: "UTC",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const timeFormatter = new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-US", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const formattedDate = dateFormatter.format(localDate);
        const formattedTime = timeFormatter.format(localDate);

        return (
          <div id="main-weather" style={{ marginTop: "30px" }}>
            <h3 style={{ textAlign: "center", fontSize: "1.5rem" }}>
              {isDayTime ? "☀️" : "🌙"} {lang === "ne" ? `${weather.name} को मौसम` : `Weather in ${weather.name}`}
            </h3>
            <h5 style={{ marginTop: "10px" }}>{formattedDate}</h5>
            <h5 style={{ marginTop: "-10px" }}>{formattedTime}</h5>
            <p style={{ textAlign: "center", marginTop: "-8px" }}>
              {isDayTime
                ? lang === "ne"
                  ? "अहिले दिनको समय हो"
                  : "It's daytime"
                : lang === "ne"
                ? "अहिले रातको समय हो"
                : "It's nighttime"}
            </p>
            <div className="weather-panel" style={{ display: "flex", gap: "40px" }}>
              <div className="weather-left" style={{ flex: 1, textAlign: "center" }}>
                <WeatherIcon condition={weather.weather[0].main} isDayTime={isDayTime} />
                <p style={{ textTransform: "capitalize" }}>{weather.weather[0].description}</p>
                <p className="temp" style={{ fontSize: "2.5rem", margin: "10px 0" }}>
                  {Math.round(weather.main.temp)}
                  {unitSymbol}
                </p>
                {tomorrowForecast ? (
                  <p>
                    {lang === "ne" ? "भोलिको तापक्रम" : "Tomorrow Forecast"}: <br />{Math.round(tomorrowForecast.min)}
                    {unitSymbol} / {Math.round(tomorrowForecast.max)}
                    {unitSymbol}
                  </p>
                ) : (
                  <p style={{ color: "#555" }}>
                    {lang === "ne" ? "भोलिको पूर्वानुमान उपलब्ध छैन।" : "Tomorrow's forecast is not available."}
                  </p>
                )}
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontStyle: "italic", color: "#444" }}>
                    {getWeatherTip(weather.weather[0].main, lang)}
                  </p>
                  {weather._cached && (
                    <p style={{ color: "orange", fontSize: "0.85rem" }}>
                      ⚠️ {lang === "ne" ? "क्यास गरिएको डाटा" : "Cached data"} –{" "}
                      {new Date(weather._updated).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="weather-right" style={{ flex: 2 }}>
                <WeatherMetrics data={weather} unit={unit} />
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ marginTop: "50px" }}>
        <h3 style={{ textAlign: "center", fontSize: "1.4rem", marginBottom: "20px" }}>
          {lang === "ne" ? "मौसम ज्ञान कुनो" : "Weather Knowledge Corner"}
        </h3>
        <div className="weather-facts-container">
          <button onClick={handlePrevFact} className="fact-nav-button" aria-label={lang === "ne" ? "पछिल्लो तथ्य" : "Previous fact"}>
            ←
          </button>
          <div className="weather-facts-card">
            <h4>{weatherFacts[factIndex][lang].title}</h4>
            <p>{weatherFacts[factIndex][lang].description}</p>
          </div>
          <button onClick={handleNextFact} className="fact-nav-button" aria-label={lang === "ne" ? "अर्को तथ्य" : "Next fact"}>
            →
          </button>
        </div>
      </div>

      <div style={{ marginTop: "50px" }}>
        <h3 style={{ textAlign: "center", fontSize: "1.4rem", marginBottom: "20px" }}>
          {lang === "ne" ? "नेपालका प्रमुख शहरहरूको मौसम" : "Nepal Weather Overview"}
        </h3>
        {loadingNepal ? (
          <div style={{ textAlign: "center" }}>
            <ClipLoader size={30} color="#1a73e8" />
            <p>{lang === "ne" ? "नेपालको मौसम लोड हुँदैछ..." : "Loading Nepal weather..."}</p>
          </div>
        ) : nepalWeather.length > 0 ? (
          <div className="nepal-weather-grid">
            {nepalWeather.map((w) => (
              <div
                className="nepal-weather-card"
                key={w.city}
                onClick={() => handleCityClick(w.city)}
                style={{ cursor: "pointer" }}
              >
                <h4>{w.city}</h4>
                <WeatherIcon condition={w.weather[0].main} isDayTime={true} />
                <p className="temp">
                  {Math.round(w.main.temp)}
                  {unitSymbol}
                </p>
                <p className="desc">{w.weather[0].description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#555" }}>
            {lang === "ne" ? "नेपालको मौसम जानकारी उपलब्ध छैन।" : "No Nepal weather data available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;