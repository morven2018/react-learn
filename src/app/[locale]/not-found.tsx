import Link from 'next/link';
import styles from '../not-found.module.scss';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className={styles.notFoundPage}>
      <h2 className={styles.header}>{t('title')}</h2>
      <Link href="/" className={styles.homeButton}>
        {t('homeButton')}
      </Link>
    </div>
  );
}
