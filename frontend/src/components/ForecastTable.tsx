import React, { useState } from "react";
import "./ForecastTable.css";
import HourlyForecast from "./HourlyForecast";
import { useLanguage } from "../context/LanguageContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

type ForecastTableProps = {
  data: Record<string, any[]>;
  unitSymbol: string;
  alerts?: any[];
};

const ForecastTable: React.FC<ForecastTableProps> = ({ data, unitSymbol, alerts = [] }) => {
  const { lang } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [forecastDays, setForecastDays] = useState(5);

  const getIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) return "🌧️";
    if (condition.toLowerCase().includes("snow")) return "❄️";
    if (condition.toLowerCase().includes("cloud")) return "☁️";
    if (condition.toLowerCase().includes("clear")) return "☀️";
    return "🌡️";
  };

  const getAnimatedIcon = (condition: string) => (
    <span className="animated-icon">{getIcon(condition)}</span>
  );

  const getAvg = (arr: number[]) =>
    arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "-";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const getTrendChartData = (temps: number[]) => ({
    labels: Array(temps.length).fill(""),
    datasets: [
      {
        data: temps,
        borderColor: "var(--accent-color)",
        backgroundColor: "rgba(26, 115, 232, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const filteredData = Object.entries(data).slice(0, forecastDays);

  return (
    <div className="forecast-table-container">
      {alerts.length > 0 && (
        <div className="weather-alerts">
          <h4>{lang === "ne" ? "मौसम चेतावनी" : "Weather Alerts"}</h4>
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert">
              <strong>{alert.event}</strong>: {alert.description} (
              {new Date(alert.start).toLocaleString()} - {new Date(alert.end).toLocaleString()})
            </div>
          ))}
        </div>
      )}

      <div className="forecast-toggle">
        <button
          className={forecastDays === 5 ? "active" : ""}
          onClick={() => setForecastDays(5)}
        >
          {lang === "ne" ? "५ दिन" : "5 Days"}
        </button>
        <button
          className={forecastDays === 7 ? "active" : ""}
          onClick={() => setForecastDays(7)}
        >
          {lang === "ne" ? "७ दिन" : "7 Days"}
        </button>
      </div>

      <table className="forecast-table">
        <thead>
          <tr>
            <th>{lang === "ne" ? "मिति" : "Date"}</th>
            <th>{lang === "ne" ? "दिनको अवस्था" : "Day Icons"}</th>
            <th>{lang === "ne" ? "न्यूनतम / अधिकतम" : "Min / Max"}</th>
            <th>{lang === "ne" ? "वर्षा" : "Precip"}</th>
            <th>{lang === "ne" ? "हावा" : "Wind"}</th>
            <th>{lang === "ne" ? "प्रवृत्ति" : "Trend"}</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(([date, items]) => {
            const temps = items.map((i) => i.main.temp);
            const min = Math.min(...temps);
            const max = Math.max(...temps);
            const wind = getAvg(items.map((i) => i.wind.speed));
            const precip = getAvg(items.map((i) => i.rain?.["3h"] || 0));
            const iconSample = [items[0], items[2], items[4], items[6]].map((item, idx) =>
              item ? (
                <span
                  key={idx}
                  className="tooltip"
                  title={`${item.weather[0].description} (${new Date(item.dt_txt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })})`}
                >
                  {getAnimatedIcon(item.weather[0].main)}
                </span>
              ) : (
                "–"
              )
            );

            return (
              <tr key={date} onClick={() => setSelectedDay(date)} className="clickable-row">
                <td>{formatDate(date)}</td>
                <td>{iconSample}</td>
                <td>
                  {Math.round(min)}{unitSymbol} / {Math.round(max)}{unitSymbol}
                </td>
                <td>{precip} mm</td>
                <td>{wind} m/s</td>
                <td>
                  <div className="trend-chart">
                    <Line data={getTrendChartData(temps)} options={chartOptions} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedDay && (
        <HourlyForecast
          day={{ date: selectedDay, hourly: data[selectedDay] }}
          unitSymbol={unitSymbol}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default ForecastTable;