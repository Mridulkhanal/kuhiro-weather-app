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
      value: `${data.visibility / 1000} km`,
      icon: "📈",
      key: "visibility",
    },
    {
      label: "Indoor Humidity",
      value: `95% (Extremely Humid)`,
      icon: "💥",
      key: "indoor_humidity",
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

export default WeatherMetrics;