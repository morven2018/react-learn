'use client';
import { Themes } from '@shared/types/response-types';
import { useCallback, useState } from 'react';
import { ThemeContext } from './theme-context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(Themes.dark);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === Themes.dark ? Themes.light : Themes.dark));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`themeWrapper ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
