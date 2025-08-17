import ClientHeader from './client-header';
import LocaleSwitcher from '@/components/ui/locale/locale-switcher';
import NavigationLink from '@/components/ui/link/navigation-link';
import styles from './Header.module.scss';
import { getTranslations } from 'next-intl/server';
import { Logo } from './logo';

export default async function ServerHeader() {
  const t = await getTranslations('Header');
  const LOGO_SIZE = 48;

  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <div className={styles.linkWrapper}>
          <NavigationLink href="/">
            <Logo size={LOGO_SIZE} />
          </NavigationLink>
          <NavigationLink href="/about" className={styles.aboutLink}>
            {t('aboutLink')}
          </NavigationLink>
          <LocaleSwitcher />
        </div>
        <ClientHeader />
      </div>
      <div className={styles.titles}>
        <h1>{t('title')}</h1>
        <h2>{t('subtitle')}</h2>
      </div>
    </header>
  );
}
