import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ne";

interface Translations {
  title: string;
  highScores: string;
  enterName: string;
  namePlaceholder: string;
  selectLevel: string;
  levelEasy: string;
  levelMedium: string;
  levelHard: string;
  nameError: string;
  gameOver: string;
  wizard: string;
  greatJob: string;
  goodEffort: string;
  keepLearning: string;
  finalScore: string;
  percentage: string;
  highScorePrefix: string;
  playAgain: string;
  player: string;
  score: string;
  question: string;
  timeLeft: string;
  seconds: string;
  loading: string;
  loadingMessage: string;
  correct: string;
  wrong: string;
  playerHeader: string;
  scoreHeader: string;
  level: string;
}

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  translations: Translations;
}

const defaultLang = (): Lang => {
  const saved = localStorage.getItem("kuhiro_lang");
  if (saved === "ne" || saved === "en") return saved as Lang;
  return navigator.language.startsWith("ne") ? "ne" : "en";
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  translations: {
    title: "Weather Quiz",
    highScores: "High Scores",
    enterName: "Enter your name:",
    namePlaceholder: "Your name",
    selectLevel: "Select a level to begin:",
    levelEasy: "Easy",
    levelMedium: "Medium",
    levelHard: "Hard",
    nameError: "Please enter your name to start!",
    gameOver: "Game Over!",
    wizard: "Weather Wizard! 🌟",
    greatJob: "Great Job! 👍",
    goodEffort: "Good Effort! 😊",
    keepLearning: "Keep Learning! 📚",
    finalScore: "Your final score",
    percentage: "Percentage",
    highScorePrefix: "High Score for",
    playAgain: "Play Again",
    player: "Player",
    score: "Score",
    question: "Question",
    timeLeft: "Time Left for Level",
    seconds: "s",
    loading: "Loading...",
    loadingMessage: "Please wait while the quiz is being prepared.",
    correct: "Correct!",
    wrong: "Wrong!",
    playerHeader: "Player",
    scoreHeader: "Score",
    level: "Level",
  },
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(defaultLang());

  const translations: Translations = {
    title: lang === "en" ? "Weather Quiz" : "मौसम क्विज",
    highScores: lang === "en" ? "High Scores" : "उच्च अंकहरू",
    enterName: lang === "en" ? "Enter your name:" : "आफ्नो नाम प्रविष्ट गर्नुहोस्:",
    namePlaceholder: lang === "en" ? "Your name" : "तपाईंको नाम",
    selectLevel: lang === "en" ? "Select a level to begin:" : "स्तर छान्नुहोस्:",
    levelEasy: lang === "en" ? "Easy" : "सजिलो",
    levelMedium: lang === "en" ? "Medium" : "मध्यम",
    levelHard: lang === "en" ? "Hard" : "कठिन",
    nameError: lang === "en" ? "Please enter your name to start!" : "कृपया सुरु गर्न आफ्नो नाम प्रविष्ट गर्नुहोस्!",
    gameOver: lang === "en" ? "Game Over!" : "खेल समाप्त!",
    wizard: lang === "en" ? "Weather Wizard! 🌟" : "मौसम जादुगर! 🌟",
    greatJob: lang === "en" ? "Great Job! 👍" : "उत्कृष्ट काम! 👍",
    goodEffort: lang === "en" ? "Good Effort! 😊" : "राम्रो प्रयास! 😊",
    keepLearning: lang === "en" ? "Keep Learning! 📚" : "सिक्न जारी राख्नुहोस्! 📚",
    finalScore: lang === "en" ? "Your final score" : "तपाईंको अन्तिम अंक",
    percentage: lang === "en" ? "Percentage" : "प्रतिशत",
    highScorePrefix: lang === "en" ? "High Score for" : "को लागि उच्च अंक",
    playAgain: lang === "en" ? "Play Again" : "फेरि खेल्नुहोस्",
    player: lang === "en" ? "Player" : "खेलाडी",
    score: lang === "en" ? "Score" : "अंक",
    question: lang === "en" ? "Question" : "प्रश्न",
    timeLeft: lang === "en" ? "Time Left for Level" : "स्तरको लागि बाँकी समय",
    seconds: lang === "en" ? "s" : "सेकेन्ड",
    loading: lang === "en" ? "Loading..." : "लोड हुँदै...",
    loadingMessage: lang === "en" ? "Please wait while the quiz is being prepared." : "कृपया क्विज तयार हुँदासम्म पर्खनुहोस्।",
    correct: lang === "en" ? "Correct!" : "सही!",
    wrong: lang === "en" ? "Wrong!" : "गलत!",
    playerHeader: lang === "en" ? "Player" : "खेलाडी",
    scoreHeader: lang === "en" ? "Score" : "अंक",
    level: lang === "en" ? "Level" : "स्तर",
  };

  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === "en" ? "ne" : "en";
      localStorage.setItem("kuhiro_lang", newLang);
      return newLang;
    });
  };

  useEffect(() => {
    localStorage.setItem("kuhiro_lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};