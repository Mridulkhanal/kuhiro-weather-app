import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "./About.css"; 

const About = () => {
  const { lang } = useLanguage();

  const contributors = [
    {
      name: "Mridul Khanal",
      role: lang === "ne" ? "मुख्य विकासकर्ता" : "Lead Developer",
      github: "https://github.com/Mridulkhanal",
    },
    {
      name: "OpenWeatherMap",
      role: lang === "ne" ? "API प्रदायक" : "API Provider",
      github: "https://openweathermap.org",
    },
  ];

  return (
    <div className="about-container">
      <h2 >{lang === "ne" ? "हाम्रोबारे" : "About Kuhiro"}</h2>
      <p className="about-description">
        {lang === "ne"
          ? "Kuhiro एक रियल-टाइम मौसम पूर्वानुमान एप हो जुन तपाईंलाई तपाईंको स्थान अनुसार मौसम जानकारी उपलब्ध गराउँछ। हामीले यस एपलाई प्रयोगकर्ताको अनुभवलाई ध्यानमा राखेर बनाएका छौं, जसमा आधुनिक UI, बहुभाषिक समर्थन, र मौसम आधारित सुझावहरू छन्।"
          : "Kuhiro is a real-time weather forecast application that delivers weather updates based on your location. We’ve built this app with a focus on user experience, modern UI, multilingual support, and condition-based weather tips."}
      </p>
      <p>
        {lang === "ne"
          ? "हाम्रो लक्ष्य तपाईंलाई सजिलो र सटीक मौसम जानकारी प्रदान गर्नु हो। Kuhiro लाई प्रयोग गरेर तपाईंले आफ्नो दैनिक गतिविधिहरूलाई मौसम अनुसार योजना बनाउन सक्नुहुनेछ।"
          : "Our goal is to provide you with easy and accurate weather information. With Kuhiro, you can plan your daily activities based on the weather."}
      </p>
      <p>
        {lang === "ne"
          ? "हामी निरन्तर रुपमा Kuhiro लाई अझ प्रभावकारी र प्रयोगमैत्री बनाउन सुधार गर्दैछौं।"
          : "We are constantly improving Kuhiro to make it more efficient and user-friendly."}
      </p>

      <h3 className="section-title">{lang === "ne" ? "विशेषताहरू" : "Features"}</h3>
      <ul className="features-list">
        <li>{lang === "ne" ? "रियल-टाइम मौसम अपडेट" : "Real-time Weather Updates"}</li>
        <li>{lang === "ne" ? "बहुभाषिक समर्थन" : "Multilingual Support"}</li>
        <li>{lang === "ne" ? "उपयोगकर्ता-मित्रता" : "User-friendly Interface"}</li>
        </ul>

      <p className="about-description">
        {lang === "ne"
          ? "हामी निरन्तर रुपमा Kuhiro लाई अझ प्रभावकारी र प्रयोगमैत्री बनाउन सुधार गर्दैछौं।"
          : "We are constantly improving Kuhiro to make it more efficient and user-friendly."}
      </p>
      <h3 className="section-title">{lang === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Send Feedback"}</h3>
    <form className="feedback-form" onSubmit={(e) => e.preventDefault()}>
     <div className="form-group">
    <label htmlFor="name">{lang === "ne" ? "नाम" : "Name"}</label>
    <input type="text" id="name" name="name" placeholder={lang === "ne" ? "तपाईंको नाम" : "Your name"} required />
    </div>
    <div className="form-group">
    <label htmlFor="email">{lang === "ne" ? "इमेल" : "Email"}</label>
    <input type="email" id="email" name="email" placeholder="example@email.com" required />
     </div>
     <div className="form-group">
    <label htmlFor="message">{lang === "ne" ? "सन्देश" : "Message"}</label>
    <textarea id="message" name="message" rows={4} placeholder={lang === "ne" ? "तपाईंको सन्देश..." : "Your message..."} required />
    </div>
    <button type="submit" className="submit-button">
    {lang === "ne" ? "पठाउनुहोस्" : "Send"}
     </button>
    </form>

        <h3 className="section-title">{lang === "ne" ? "प्रयोगकर्ता प्रतिक्रिया" : "User Feedback"}</h3>
        <p>
          {lang === "ne"
            ? "हामी तपाईंको प्रतिक्रिया सुन्न चाहन्छौं। कृपया हामीलाई बताउनुहोस् कि तपाईंले Kuhiro को बारेमा के सोच्छन्।"
            : "We value your feedback. Please let us know what you think about Kuhiro."}
        </p>

      <h3 className="section-title">{lang === "ne" ? "योगदानकर्ताहरू" : "Contributors"}</h3>
      <ul className="contributors-list">
        {contributors.map((person, index) => (
          <li key={index} className="contributor">
            <p>
              <strong>{person.name}</strong> — {person.role}
            </p>
            <a href={person.github} target="_blank" rel="noopener noreferrer">
              🌐 {lang === "ne" ? "प्रोफाइल हेर्नुहोस्" : "View Profile"}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default About;