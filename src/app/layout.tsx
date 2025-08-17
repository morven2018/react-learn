import { ThemeProvider } from '@/context/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="themeWrapper dark">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
