import { Themes } from '@shared/types/response-types';
import { createContext } from 'react';

type ThemeContextType = {
  theme: Themes;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: Themes.dark,
  toggleTheme: () => {},
});
