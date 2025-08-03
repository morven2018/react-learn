import { Term } from '@services/localStorage/LS-service';
import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: Term.getThemeFromLS(),
  toggleTheme: () => {},
});
