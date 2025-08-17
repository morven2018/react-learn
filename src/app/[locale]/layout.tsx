import './layout.scss';
import Header from '@/components/layout/header/Header';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ServerThemeProvider } from '@/components/theme/server-theme-provider';
import { ReduxProvider } from '@/providers/redux-provider';

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!['en', 'ru'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <ReduxProvider>
      <ServerThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </ServerThemeProvider>
    </ReduxProvider>
  );
}
