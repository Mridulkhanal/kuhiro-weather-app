import "./HourlyForecast.css";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  day: { date: string; hourly: any[] };
  unitSymbol: string;
  onClose: () => void;
}

const HourlyForecast = ({ day, unitSymbol, onClose }: Props) => {
  const { lang } = useLanguage();

  return (
    <div className="hourly-overlay">
      <div className="hourly-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>
          {lang === "ne" ? "घण्टे विवरण" : "Hourly Forecast"} -{" "}
          {new Date(day.date).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </h3>
        <div className="hourly-scroll">
          {day.hourly.map((hour: any, idx: number) => (
            <div className="hour-card" key={idx}>
              <p>{new Date(hour.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
              />
              <p>{Math.round(hour.main.temp)}{unitSymbol}</p>
              <small>{hour.weather[0].description}</small>
              <small>{lang === "ne" ? `हावा: ${hour.wind.speed} मि/से` : `Wind: ${hour.wind.speed} m/s`}</small>
              <small>
                {lang === "ne" ? `आर्द्रता: ${hour.main.humidity}%` : `Humidity: ${hour.main.humidity}%`}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;