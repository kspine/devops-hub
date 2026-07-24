import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "./i18n";
import en from "./i18n/en.json";
import zh from "./i18n/zh.json";

export type Language = "en" | "zh";

const TRANSLATIONS: Record<Language, any> = {
  en,
  zh,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("devops_hub_lang") || localStorage.getItem("gameops_lang");
    if (saved === "en" || saved === "zh") return saved as Language;
    return (i18n.language && i18n.language.startsWith("zh")) ? "zh" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("devops_hub_lang", lang);
    localStorage.setItem("gameops_lang", lang);
    document.documentElement.lang = lang;
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang);
    }
  };

  useEffect(() => {
    if (i18n && i18n.changeLanguage && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleI18nChange = (lng: string) => {
      const normalized: Language = lng.startsWith("zh") ? "zh" : "en";
      if (normalized !== language) {
        setLanguageState(normalized);
        localStorage.setItem("devops_hub_lang", normalized);
      }
    };
    i18n.on("languageChanged", handleI18nChange);
    return () => {
      i18n.off("languageChanged", handleI18nChange);
    };
  }, [language]);

  // Safe translation resolver that supports nested objects like issues.iosSigning.title
  const t = (keyPath: string): any => {
    const keys = keyPath.split(".");
    let current: any = TRANSLATIONS[language];
    
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English if key doesn't exist in Chinese
        let fallback: any = TRANSLATIONS["en"];
        for (const fallbackKey of keys) {
          if (fallback && typeof fallback === "object" && fallbackKey in fallback) {
            fallback = fallback[fallbackKey];
          } else {
            if (i18n && i18n.exists && i18n.exists(keyPath)) {
              return i18n.t(keyPath);
            }
            return keyPath; // return key path as ultimate fallback
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
