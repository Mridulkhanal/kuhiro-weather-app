import React from "react";

import clearIcon from "../assets/weather-icons/clear.svg";
import cloudyIcon from "../assets/weather-icons/cloudy.svg";
import rainIcon from "../assets/weather-icons/rain.svg";
import snowIcon from "../assets/weather-icons/snow.svg";

interface Props {
  condition: string;
}

const WeatherIcon = ({ condition }: Props) => {
  const lower = condition.toLowerCase();
  let icon = clearIcon;

  if (lower.includes("cloud")) icon = cloudyIcon;
  else if (lower.includes("rain")) icon = rainIcon;
  else if (lower.includes("snow")) icon = snowIcon;

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