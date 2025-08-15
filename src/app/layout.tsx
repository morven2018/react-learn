import ErrorBoundary from '@components/common/error-boundary.tsx';
import logo from '@assets/logo.svg';
import { ReduxProvider } from 'src/providers/redux-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href={logo} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Lord of the rings. Search</title>
        <meta name="description" content="Lord of the rings. Search on Next" />
      </head>
      <body>
        <ReduxProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ReduxProvider>
      </body>
    </html>
  );
}
