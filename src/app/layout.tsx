import ErrorBoundary from '@/components/common/error-boundary';
import { ThemeProvider } from '@/context/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <div className="themeWrapper dark">{children}</div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
