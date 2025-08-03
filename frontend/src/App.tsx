import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext"; 
import "./index.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forecast" element={<Forecast />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;