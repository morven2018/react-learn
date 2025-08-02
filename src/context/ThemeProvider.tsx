import { Term } from '@services/localStorage/LSService';
import { Themes } from '@shared/types/responseTypes';
import { ThemeContext } from './ThemeContext';

import {
  type FC,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(Term.getThemeFromLS());

  const toggleTheme = useCallback(() => {
    const newTheme = theme === Themes.light ? Themes.dark : Themes.light;
    Term.setThemeToLS(newTheme);
    setTheme(newTheme);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
