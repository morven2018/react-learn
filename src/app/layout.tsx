import './[locale]/layout.scss';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/context/theme-provider';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
