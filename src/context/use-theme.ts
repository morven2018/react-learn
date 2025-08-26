import { useContext } from 'react';
import { ThemeContext } from './theme-context';
import { Themes } from '@/shared/types/response-types';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: Themes.dark };
  }
  return context;
};
