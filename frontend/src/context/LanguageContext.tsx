import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ne";

const defaultLang = (): Lang => {
  const saved = localStorage.getItem("kuhiro_lang");
  if (saved === "ne" || saved === "en") return saved as Lang;
  return navigator.language.startsWith("ne") ? "ne" : "en";
};

const LanguageContext = createContext<{
  lang: Lang;
  toggleLang: () => void;
}>({
  lang: "en",
  toggleLang: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>(defaultLang);

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
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};