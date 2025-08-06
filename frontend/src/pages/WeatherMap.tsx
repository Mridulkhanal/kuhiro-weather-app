import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// Fix default icon issue in Leaflet
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WeatherMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      () => {
        // Default to Kathmandu if denied
        setPosition([27.7172, 85.324]);
      }
    );
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {lang === "ne" ? "मौसम नक्शा" : "Weather Map"}
      </h2>

      {position && (
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%", marginTop: "20px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {lang === "ne"
                ? "तपाईंको वर्तमान स्थान"
                : "Your current location"}
            </Popup>
          </Marker>
        </MapContainer>
      )}

      {!position && (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          {lang === "ne" ? "स्थान लोड हुँदैछ..." : "Loading location..."}
        </p>
      )}
    </div>
  );
};

export default WeatherMap;