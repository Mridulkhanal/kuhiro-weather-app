import React, { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/api/feedback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setToastMessage(lang === "ne" ? "प्रतिक्रिया पठाइयो!" : "Feedback submitted!");
        setFormData({ name: "", email: "", message: "" });
        fetchFeedback(); // reload updated list
      } else {
        setToastMessage(lang === "ne" ? "त्रुटि भयो!" : "Something went wrong.");
      }
    } catch {
      setToastMessage(lang === "ne" ? "सर्भर समस्या!" : "Server error.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/feedback/");
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data);
      }
    } catch {
      console.warn("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="about-container">
      <h2>{lang === "ne" ? "हाम्रोबारे" : "About Kuhiro"}</h2>

      <p className="about-description">
        {lang === "ne"
          ? "Kuhiro एक रियल-टाइम मौसम पूर्वानुमान एप हो जुन तपाईंलाई तपाईंको स्थान अनुसार मौसम जानकारी उपलब्ध गराउँछ।"
          : "Kuhiro is a real-time weather forecast application that delivers weather updates based on your location."}
      </p>

      <h3 className="section-title">{lang === "ne" ? "विशेषताहरू" : "Features"}</h3>
      <ul className="features-list">
        <li>{lang === "ne" ? "रियल-टाइम मौसम अपडेट" : "Real-time Weather Updates"}</li>
        <li>{lang === "ne" ? "बहुभाषिक समर्थन" : "Multilingual Support"}</li>
        <li>{lang === "ne" ? "उपयोगकर्ता-मित्रता" : "User-friendly Interface"}</li>
      </ul>

      <h3 className="section-title">{lang === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Send Feedback"}</h3>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{lang === "ne" ? "नाम" : "Name"}</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={lang === "ne" ? "तपाईंको नाम" : "Your name"}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{lang === "ne" ? "इमेल" : "Email"}</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">{lang === "ne" ? "सन्देश" : "Message"}</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder={lang === "ne" ? "तपाईंको सन्देश..." : "Your message..."}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? (lang === "ne" ? "पठाइँदै..." : "Sending...") : (lang === "ne" ? "पठाउनुहोस्" : "Send")}
        </button>
      </form>

      {toastMessage && (
        <div className="toast-message">
          {toastMessage}
        </div>
      )}

      <h3 className="section-title">{lang === "ne" ? "प्रयोगकर्ता प्रतिक्रिया" : "User Feedback"}</h3>
      {feedbackList.length === 0 ? (
        <p>{lang === "ne" ? "अहिलेसम्म प्रतिक्रिया छैन।" : "No feedback yet."}</p>
      ) : (
        <ul className="feedback-list">
          {feedbackList.map((fb, idx) => (
            <li key={idx} className="feedback-item">
              <p><strong>{fb.name}</strong>: {fb.message}</p>
            </li>
          ))}
        </ul>
      )}

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