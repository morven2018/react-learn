import type { FC, ReactNode } from 'react';
import { ThemeProvider } from '@/context/theme-provider';

export const ServerThemeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
