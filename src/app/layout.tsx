import logo from '@assets/logo.svg';

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
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
