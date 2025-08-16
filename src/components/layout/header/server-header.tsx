import ClientHeader from './client-header';
import LocaleSwitcher from '@/components/ui/locale/locale-switcher';
import styles from './header.module.scss';
import { getTranslations } from 'next-intl/server';
import { Logo } from './logo';
import { Link } from '@/i18n/navigation';

export default async function ServerHeader() {
  const t = await getTranslations('Header');
  const LOGO_SIZE = 48;

  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <div className={styles.linkWrapper}>
          <Link href="/">
            <Logo size={LOGO_SIZE} />
          </Link>
          <Link href="/about" className={styles.aboutLink}>
            {t('aboutLink')}
          </Link>
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
