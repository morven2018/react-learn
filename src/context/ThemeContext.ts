import { Term } from '@services/localStorage/LSService';
import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: Term.getThemeFromLS(),
  toggleTheme: () => {},
});
