import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./About.css";

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at?: string;
}

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
    {
      name: "React",
      role: lang === "ne" ? "फ्रेमवर्क" : "Framework",
      github: "https://reactjs.org",
    },
    {
      name: "TypeScript",
      role: lang === "ne" ? "प्रोग्रामिङ भाषा" : "Programming Language",
      github: "https://www.typescriptlang.org",
    },
    {
      name: "Vite",
      role: lang === "ne" ? "बिल्ड उपकरण" : "Build Tool",
      github: "https://vitejs.dev",
    },
  ];

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", message: "" };

    // Name validation
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = lang === "ne" ? "नाममा अक्षर र स्पेस मात्र हुन सक्छ।" : "Name can only contain letters and spaces.";
      valid = false;
    }

    // Email validation
    if (!/^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z]+\.[a-zA-Z]+$/.test(formData.email.trim())) {
      newErrors.email =
        lang === "ne"
          ? "इमेल अक्षरले सुरु हुनुपर्छ र सही ढाँचामा हुनुपर्छ (e.g., john@domain.com)"
          : "Email must start with a letter, contain one @, and have a valid domain (e.g., john@domain.com).";
      valid = false;
    }

    // Message validation
    if (formData.message.trim().length < 5) {
      newErrors.message =
        lang === "ne"
          ? "सन्देश कम्तीमा ५ अक्षरको हुनुपर्छ।"
          : "Message must be at least 5 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error while typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/api/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newFeedback: Feedback = await res.json();
        setFeedbackList((prev) => [newFeedback, ...prev]);
        setToastMessage(lang === "ne" ? "प्रतिक्रिया पठाइयो!" : "Feedback submitted!");
        setFormData({ name: "", email: "", message: "" });
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
        const data: Feedback[] = await res.json();
        const sorted = [...data].sort(
          (a, b) => new Date(b.submitted_at || "").getTime() - new Date(a.submitted_at || "").getTime()
        );
        setFeedbackList(sorted);
      }
    } catch {
      console.warn("Failed to fetch feedback");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const loadMoreFeedback = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="about-container">
      <h2>{lang === "ne" ? "हाम्रोबारे" : "About Kuhiro"}</h2>

      <p className="about-description">
        {lang === "ne"
          ? "Kuhiro एक रियल-टाइम मौसम पूर्वानुमान एप हो जुन तपाईंलाई तपाईंको स्थान अनुसार मौसम जानकारी उपलब्ध गराउँछ।"
          : "Kuhiro is a real-time weather forecast application that delivers weather updates based on your location."}
      </p>

      {/* Features */}
      <h3 className="section-title">{lang === "ne" ? "विशेषताहरू" : "Features"}</h3>
      <ul className="features-list">
        <p>{lang === "ne" ? "रियल-टाइम मौसम अपडेट" : "Real-time Weather Updates"}</p>
        <p>{lang === "ne" ? "स्थान-आधारित पूर्वानुमान" : "Location-based Forecasting"}</p>
        <p>{lang === "ne" ? "बहुभाषिक समर्थन" : "Multilingual Support"}</p>
        <p>{lang === "ne" ? "उपयोगकर्ता-मित्रता" : "User-friendly Interface"}</p>
      </ul>

      {/* Feedback Form */}
      <h3 className="section-title">{lang === "ne" ? "प्रतिक्रिया पठाउनुहोस्" : "Send Feedback"}</h3>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{lang === "ne" ? "नाम" : "Name"}</label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            placeholder={lang === "ne" ? "तपाईंको नाम" : "Your name"}
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">{lang === "ne" ? "इमेल" : "Email"}</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="message">{lang === "ne" ? "सन्देश" : "Message"}</label>
          <textarea
            id="message"
            name="message"
            autoComplete="off"
            rows={4}
            placeholder={lang === "ne" ? "तपाईंको सन्देश..." : "Your message..."}
            value={formData.message}
            onChange={handleChange}
            required
          />
          {errors.message && <small className="error-text">{errors.message}</small>}
        </div>

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? (lang === "ne" ? "पठाइँदै..." : "Sending...") : (lang === "ne" ? "पठाउनुहोस्" : "Send")}
        </button>
      </form>

      {toastMessage && <div className="toast-message">{toastMessage}</div>}

     {/* Display Feedback */}
<h3 className="section-title">
  {lang === "ne" ? "प्रयोगकर्ता प्रतिक्रिया" : "User Feedback"}
</h3>
{feedbackList.length === 0 ? (
  <p>{lang === "ne" ? "अहिलेसम्म प्रतिक्रिया छैन।" : "No feedback yet."}</p>
) : (
  <>
    <div className="feedback-list">
      {feedbackList.slice(0, visibleCount).map((fb) => (
        <div key={fb.id} className="feedback-item">
          <p>
            <strong>{fb.name}</strong>: {fb.message}
          </p>
        </div>
      ))}
    </div>
    {visibleCount < feedbackList.length && (
      <button className="load-more-btn" onClick={loadMoreFeedback}>
        {lang === "ne" ? "थप लोड गर्नुहोस्" : "Load More"}
      </button>
    )}
  </>
)}

      {/* Contributors */}
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