import React from "react";

// Import SVGs
import clearIcon from "../assets/weather-icons/clear.svg";
import cloudyIcon from "../assets/weather-icons/cloudy.svg";
import rainIcon from "../assets/weather-icons/rain.svg";
import snowIcon from "../assets/weather-icons/snow.svg";

// Props: condition string (e.g., "Clear", "Clouds", "Rain")
interface Props {
  condition: string;
}

const WeatherIcon = ({ condition }: Props) => {
  const lower = condition.toLowerCase();

  let icon = clearIcon; // default

  if (lower.includes("cloud")) icon = cloudyIcon;
  else if (lower.includes("rain")) icon = rainIcon;
  else if (lower.includes("snow")) icon = snowIcon;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img src={icon} alt={condition} style={{ width: "100px", height: "100px" }} />
    </div>
  );
};

export default WeatherIcon;