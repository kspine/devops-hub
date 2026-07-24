import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, Language } from "../LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface LanguageSelectorProps {
  variant?: string;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();
  const { mode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = mode === "dark";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { id: Language; label: string; native: string; subtitle: string }[] = [
    { id: "zh", label: "中文", native: "简体中文", subtitle: "Simplified Chinese" },
    { id: "en", label: "English", native: "English", subtitle: "US International" },
  ];

  const current = languages.find((l) => l.id === language) || languages[0];

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer select-none shadow-sm active:scale-95 ${
          isDark
            ? "bg-gray-950/80 hover:bg-gray-900 text-gray-200 border border-white/10 hover:border-indigo-500/50 shadow-black/40"
            : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 hover:border-indigo-400/50 shadow-gray-200/50"
        }`}
        aria-expanded={isOpen}
      >
        <div className={`p-1 rounded-lg transition-transform duration-300 group-hover:rotate-12 ${
          isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
        }`}>
          <Globe className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-bold tracking-tight">{current.native}</span>
          <span className={`text-[10px] font-mono opacity-60 px-1 py-0.2 rounded font-bold ${
            isDark ? "bg-white/10 text-indigo-300" : "bg-black/5 text-indigo-600"
          }`}>
            {current.id.toUpperCase()}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ml-0.5 ${
            isOpen ? "rotate-180 text-indigo-400" : "group-hover:text-gray-200"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`absolute right-0 mt-2 w-52 rounded-2xl p-1.5 shadow-2xl backdrop-blur-2xl z-50 border ${
              isDark
                ? "bg-gray-950/95 border-gray-800/90 text-white shadow-black/80"
                : "bg-white/98 border-gray-200/90 text-gray-900 shadow-xl"
            }`}
          >
            <div className={`px-3 py-2 mb-1 rounded-xl flex items-center justify-between text-[11px] font-mono font-medium ${
              isDark ? "bg-gray-900/60 text-gray-400" : "bg-gray-50 text-gray-500"
            }`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{language === "zh" ? "界面语言" : "Language"}</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase">i18n</span>
            </div>

            <div className="space-y-1">
              {languages.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer group ${
                      isSelected
                        ? isDark
                          ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                          : "bg-indigo-50 text-indigo-900 border border-indigo-200/80 font-bold"
                        : isDark
                        ? "hover:bg-gray-900/80 text-gray-300 hover:text-white"
                        : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold uppercase transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-sm"
                          : isDark ? "bg-gray-900 text-gray-400 group-hover:bg-gray-800 group-hover:text-gray-200" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }`}>
                        {lang.id}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-xs leading-tight">{lang.native}</div>
                        <div className="text-[10px] text-gray-400 font-sans mt-0.5">{lang.subtitle}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
