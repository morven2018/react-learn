import '../assets/styles/app.scss';
import ErrorBoundary from '@/components/common/error-boundary';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/theme-provider';

export const metadata: Metadata = {
  title: 'Lord of the rings. Search',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
