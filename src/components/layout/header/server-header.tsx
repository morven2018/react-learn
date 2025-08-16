import ClientHeader from './client-header';
import Image from 'next/image';
import logoLight from '@assets/images/imageL.png';
import styles from './header.module.scss';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function ServerHeader() {
  const t = await getTranslations('Header');
  const LOGO_SIZE = 48;

  return (
    <header className={styles.header}>
      <div className={styles.controls}>
        <div className={styles.linkWrapper}>
          <Link href="/">
            <Image
              src={logoLight}
              width={LOGO_SIZE}
              alt={t('logoAlt')}
              className={styles.logo}
              priority
            />
          </Link>
          <Link href="/about" className={styles.aboutLink}>
            {t('aboutLink')}
          </Link>
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
