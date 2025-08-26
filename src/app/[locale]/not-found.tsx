import Link from 'next/link';
import styles from '../not-found.module.scss';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className={styles.notFoundPage}>
      <h2 className={styles.header}>{t('title')}</h2>
      <Link href="/" className={styles.homeButton}>
        {t('homeButton')}
      </Link>
    </div>
  );
}
