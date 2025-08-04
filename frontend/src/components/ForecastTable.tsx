import React from "react";
import "./ForecastTable.css";

type ForecastTableProps = {
  data: Record<string, any[]>;
  unitSymbol: string;
};

const ForecastTable: React.FC<ForecastTableProps> = ({ data, unitSymbol }) => {
  const getIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) return "🌧️";
    if (condition.toLowerCase().includes("snow")) return "❄️";
    if (condition.toLowerCase().includes("cloud")) return "☁️";
    if (condition.toLowerCase().includes("clear")) return "☀️";
    return "🌡️";
  };

  const getAvg = (arr: number[]) =>
    arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "-";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  return (
    <div className="forecast-table-container">
      <table className="forecast-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day Icons</th>
            <th>Min / Max</th>
            <th>Precip</th>
            <th>Wind</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([date, items]) => {
            const temps = items.map((i) => i.main.temp);
            const min = Math.min(...temps);
            const max = Math.max(...temps);
            const wind = getAvg(items.map((i) => i.wind.speed));
            const precip = getAvg(
              items.map((i) => i.rain?.["3h"] || 0)
            );
            const iconSample = [items[0], items[2], items[4], items[6]].map((item, idx) =>
              item ? getIcon(item.weather[0].main) : "–"
            );

            return (
              <tr key={date}>
                <td>{formatDate(date)}</td>
                <td>{iconSample.join(" ")}</td>
                <td>
                  {Math.round(min)}{unitSymbol} / {Math.round(max)}{unitSymbol}
                </td>
                <td>{precip} mm</td>
                <td>{wind} m/s</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastTable;