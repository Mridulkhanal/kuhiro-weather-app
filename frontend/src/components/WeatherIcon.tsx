import React from "react";

import clearIcon from "../assets/weather-icons/clear.svg";
import cloudyIcon from "../assets/weather-icons/cloudy.svg";
import rainIcon from "../assets/weather-icons/rain.svg";
import snowIcon from "../assets/weather-icons/snow.svg";
import thunderIcon from "../assets/weather-icons/thunderstorm.svg";
import mistIcon from "../assets/weather-icons/mist.svg";
import hazeIcon from "../assets/weather-icons/haze.svg";
import fogIcon from "../assets/weather-icons/fog.svg";
import drizzleIcon from "../assets/weather-icons/drizzle.svg";
import tornadoIcon from "../assets/weather-icons/tornado.svg";

// Optional: Day/night variants
import clearNightIcon from "../assets/weather-icons/clear-night.svg";
import partlyCloudyDayIcon from "../assets/weather-icons/partly-cloudy-day.svg";
import partlyCloudyNightIcon from "../assets/weather-icons/partly-cloudy-night.svg";

interface Props {
  condition: string;
  isDayTime?: boolean; 
}

const WeatherIcon = ({ condition, isDayTime = true }: Props) => {
  const lower = condition.toLowerCase();
  let icon = clearIcon;

  if (lower.includes("clear")) {
    icon = isDayTime ? clearIcon : clearNightIcon;
  } else if (lower.includes("partly") && lower.includes("cloud")) {
    icon = isDayTime ? partlyCloudyDayIcon : partlyCloudyNightIcon;
  } else if (lower.includes("cloud")) {
    icon = cloudyIcon;
  } else if (lower.includes("rain")) {
    icon = rainIcon;
  } else if (lower.includes("drizzle")) {
    icon = drizzleIcon;
  } else if (lower.includes("snow")) {
    icon = snowIcon;
  } else if (lower.includes("thunder")) {
    icon = thunderIcon;
  } else if (lower.includes("mist")) {
    icon = mistIcon;
  } else if (lower.includes("haze")) {
    icon = hazeIcon;
  } else if (lower.includes("fog")) {
    icon = fogIcon;
  } else if (lower.includes("tornado")) {
    icon = tornadoIcon;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src={icon}
        alt={condition}
        style={{
          width: "100px",
          height: "100px",
          filter: "drop-shadow(0 0 4px rgba(0,0,0,0.2))",
        }}
      />
    </div>
  );
};

export default WeatherIcon;