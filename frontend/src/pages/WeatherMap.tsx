import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const { Overlay } = LayersControl;

// 📍 Marker Icon Setup
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WeatherMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [points, setPoints] = useState<any[]>([]);
  const { lang } = useLanguage();

  const weatherApiKey = process.env.REACT_APP_WEATHER_KEY;

  // ✅ Callback for fetching nearby weather points
  const fetchNearbyWeather = useCallback(async (lat: number, lon: number) => {
    if (!weatherApiKey) {
      console.warn("Weather API Key is missing!");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${weatherApiKey}`
      );
      const data = await res.json();
      if (data?.list?.length > 0) {
        const formatted = data.list.map((item: any) => ({
          lat: item.coord.lat,
          lon: item.coord.lon,
          name: item.name,
          temp: item.main.temp,
          condition: item.weather[0].main,
        }));
        setPoints(formatted);
      }
    } catch (err) {
      console.error("Error fetching nearby weather:", err);
    }
  }, [weatherApiKey]);

  // 🌍 Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchNearbyWeather(latitude, longitude);
      },
      () => {
        const fallback: [number, number] = [27.7172, 85.324]; // Kathmandu
        setPosition(fallback);
        fetchNearbyWeather(fallback[0], fallback[1]);
      }
    );
  }, [fetchNearbyWeather]);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {lang === "ne" ? "मौसम नक्शा" : "Weather Map"}
      </h2>

      {position ? (
        <MapContainer
          center={position}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%", marginTop: "20px" }}
        >
          <LayersControl position="topright">
            {/* 🗺️ Base Map */}
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 🌥️ Weather Overlays */}
            <Overlay checked name="Clouds">
              <TileLayer
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
                attribution="&copy; OpenWeatherMap"
              />
            </Overlay>

            <Overlay name="Precipitation">
              <TileLayer
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
                attribution="&copy; OpenWeatherMap"
              />
            </Overlay>

            <Overlay name="Temperature">
              <TileLayer
                url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
                attribution="&copy; OpenWeatherMap"
              />
            </Overlay>

            <Overlay name="Wind">
              <TileLayer
                url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
                attribution="&copy; OpenWeatherMap"
              />
            </Overlay>

            <Overlay name="Pressure">
              <TileLayer
                url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`}
                attribution="&copy; OpenWeatherMap"
              />
            </Overlay>
          </LayersControl>

          {/* 📍 Main Location Marker */}
          <Marker position={position}>
            <Popup>{lang === "ne" ? "तपाईंको स्थान" : "Your location"}</Popup>
          </Marker>

          {/* 📍 Weather Data Points */}
          {points.map((pt, idx) => (
            <Marker key={idx} position={[pt.lat, pt.lon]}>
              <Popup>
                <strong>{pt.name}</strong> <br />
                🌡️ {pt.temp}°C <br />
                ⛅ {pt.condition}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          {lang === "ne" ? "स्थान लोड हुँदैछ..." : "Loading location..."}
        </p>
      )}
    </div>
  );
};

export default WeatherMap;