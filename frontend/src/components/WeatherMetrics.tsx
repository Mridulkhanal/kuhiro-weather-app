import React from "react";
import "./WeatherMetrics.css";

interface WeatherMetricsProps {
  data: any;
  unit: string;
  exclude?: string[];
}

const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ data, unit, exclude = [] }) => {
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
    </div>
  );
};

export default WeatherMetrics;