# 🌤️ कुहिरो (Kuhiro) — Real-Time Global Weather Forecast Web Application

> **"Weather at your fingertips, anywhere in the world."**  
> _A modern, responsive, multilingual weather app built with React.js, TypeScript, and Django REST Framework._

---

## 📊 Badges

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React.js%20%2B%20TypeScript-blue?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-Django%20REST%20Framework-green?style=flat-square&logo=django)
![API](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=flat-square)
![Maintainer](https://img.shields.io/badge/Maintainer-Mridul%20Khanal-purple?style=flat-square)

---

## 📖 About the Project

**Kuhiro** (_कुहिरो_, meaning “fog” in Nepali) is a **real-time global weather forecast web application** designed to provide accurate weather data with an elegant and user-friendly interface.  
It supports **multilingual functionality**, **offline mode**, and **animated weather icons**, ensuring a seamless experience across devices.

**In Nepali:**  
कुहिरो एक आधुनिक मौसम एप हो जसले विश्वव्यापी मौसमको पूर्वानुमान र वास्तविक-समय अपडेटहरू प्रदान गर्दछ। यसमा बहुभाषिक समर्थन, आकर्षक UI, र प्रयोगकर्तामैत्री अनुभव उपलब्ध छ।

---

## ✨ Features

- 🌍 **Real-Time Global Weather Updates**
- 🌐 **Multilingual Support** (English, Nepali)
- 🌡 **Unit Toggle** — °C ↔ °F
- 📅 **Multi-Day Forecast** with clean table layout
- 📍 **Auto Location Detection** & Last Searched City Memory
- 📜 **Search History** with clickable past searches
- 🔍 **City Autocomplete Suggestions**
- 📶 **Offline Support** — Cached weather & forecast data
- 🗺 **Interactive Weather Map** with overlays (Clouds, Rain, Temperature, Pressure, Wind)
- 🎨 **Theme Friendly** (Light/Dark)
- 💬 **Feedback Form** connected to **custom Django API**
- ⚡ **Responsive & Accessible Design**

---

## 🛠 Tech Stack

### **Frontend**
- [React.js](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for blazing-fast builds
- [Leaflet.js](https://leafletjs.com/) for interactive maps
- CSS Modules for scoped styling

### **Backend**
- [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- Custom REST APIs for weather & feedback
- [SQLite](https://www.sqlite.org/) database (development) — can be upgraded to PostgreSQL/MySQL

### **APIs & Services**
- [OpenWeatherMap API](https://openweathermap.org/api) for weather data
- Custom Django endpoints for feedback storage & retrieval

---

## 📂 Project Structure

kuhiro-weather-app/
│
├── backend/ # Django backend
│ ├── backend_project/ # Main Django project settings
│ ├── weather_api/ # Weather & feedback API app
│ ├── manage.py
│ └── db.sqlite3
│
├── frontend/ # React + TypeScript frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── assets/
│ │ └── App.tsx
│ └── vite.config.ts
│
└── README.md

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (>= 18)
- Python (>= 3.10)
- pip & virtualenv

---

### **Backend Setup (Django API)**

cd backend
python -m venv env
env\Scripts\activate    # Windows
# source env/bin/activate   # Mac/Linux

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Backend will start at: http://localhost:8000/

Frontend Setup (React + Vite)

cd frontend
npm install
npm run dev
Frontend will start at: http://localhost:5173/

🔗 API Integration
Weather Data API: Uses OpenWeatherMap endpoints for:

Current weather

5-day forecast

Geocoding for location search suggestions

Feedback API:

POST /api/feedback/ — Submit feedback (name, email, message)

GET /api/feedback/ — Retrieve user feedback list

🎥 Preview

A quick look at Kuhiro’s interface and features.

📸 Screenshots
(Will add screenshots of the homepage, forecast table, weather map, and feedback leter)

👨‍💻 Contributors
Name	Role	Profile
Mridul Khanal	Lead Developer	GitHub
OpenWeatherMap	API Provider	Website

📜 License
This project is licensed under the MIT License — feel free to modify and distribute.

