import { Term } from '@services/localStorage/LS-service';
import { Themes } from '@shared/types/response-types';
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react';
import { ThemeContext } from './theme-context';

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(Term.getThemeFromLS());

  const toggleTheme = useCallback(() => {
    const newTheme = theme === Themes.light ? Themes.dark : Themes.light;
    Term.setThemeToLS(newTheme);
    setTheme(newTheme);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return (
    <ThemeContext.Provider value={value}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
