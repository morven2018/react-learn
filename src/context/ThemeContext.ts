import { Term } from '@services/localStorage/LSService';
import { createContext } from 'react';

export type Themes = 'light' | 'dark';

export const ThemeContext = createContext({
  theme: Term.getThemeFromLS(),
  toggleTheme: () => {},
});
