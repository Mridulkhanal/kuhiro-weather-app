import React from "react";
import "./WeatherMetrics.css";

interface WeatherMetricsProps {
  data: any;
  unit: string;
  exclude?: string[];
  tomorrowForecast?: {
    min: number;
    max: number;
  } | null;
}

const WeatherMetrics: React.FC<WeatherMetricsProps> = ({
  data,
  unit,
  exclude = [],
  tomorrowForecast,
}) => {
  const unitSymbol = unit === "imperial" ? "°F" : "°C";

  const metrics = [
    {
      label: "Current Temp",
      value: `${data.main.temp}${unitSymbol}`,
      icon: "🌡️",
      key: "temp",
    },
    {
      label: "Humidity",
      value: `${data.main.humidity}%`,
      icon: "💧",
      key: "humidity",
    },
    {
      label: "Pressure",
      value: `${data.main.pressure} mb`,
      icon: "↔️",
      key: "pressure",
    },
    {
      label: "Cloud Cover",
      value: `${data.clouds?.all ?? 0}%`,
      icon: "☁️",
      key: "cloud_cover",
    },
    {
      label: "Visibility",
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      icon: "📈",
      key: "visibility",
    },
    {
      label: "Indoor Humidity",
      value: `95% (Extremely Humid)`,
      icon: "💥",
      key: "indoor_humidity",
    },
    {
      label: "Sunrise",
      value: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      icon: "🌅",
      key: "sunrise",
    },
    {
      label: "Sunset",
      value: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      icon: "🌇",
      key: "sunset",
    },
  ];

  return (
    <div className="weather-metrics">
      {metrics
        .filter((metric) => !exclude.includes(metric.key))
        .map((metric) => (
          <div className="metric" key={metric.key}>
            <span className="icon">{metric.icon}</span>
            <span className="label">{metric.label}:</span>
            <span className="value">{metric.value}</span>
          </div>
        ))}

      {tomorrowForecast && (
        <div className="metric" key="tomorrow_forecast">
          <span className="icon">📅</span>
          <span className="label">Tomorrow:</span>
          <span className="value">
            {Math.round(tomorrowForecast.min)}{unitSymbol} / {Math.round(tomorrowForecast.max)}{unitSymbol}
          </span>
        </div>
      )}
    </div>
  );
};

export const fetchForecast = async (city: string) => {
  try {
    // Step 1: Get coordinates for city
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`
    );
    const geoData = await geoRes.json();
    if (!geoData[0]) return null;

    const { lat, lon } = geoData[0];

    // Step 2: Get forecast data (5-day grouped)
    const forecastRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/forecast_weather/?lat=${lat}&lon=${lon}`
    );
    const forecastData = await forecastRes.json();

    // Step 3: Get alerts from One Call API
    const alertsRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&exclude=minutely,hourly,daily`
    );
    const alertsData = await alertsRes.json();

    return {
      ...forecastData,
      alerts: alertsData.alerts || [],
    };
  } catch (error) {
    console.error("Error fetching forecast with alerts:", error);
    return null;
  }
};

export default WeatherMetrics;