import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'indigo' | 'emerald' | 'rose';
type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-theme-color') as Theme) || 'indigo';
    }
    return 'indigo';
  });
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-theme-mode') as Mode) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('app-theme-color', theme);
    localStorage.setItem('app-theme-mode', mode);
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-dark', 'theme-light', 'theme-indigo', 'theme-emerald', 'theme-rose');
    if (mode === 'dark') {
      root.classList.add('dark', 'theme-dark');
    } else {
      root.classList.add('light', 'theme-light');
    }
    root.classList.add(`theme-${theme}`);
  }, [theme, mode]);

  const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
