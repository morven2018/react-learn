import styles from './Spinner.module.scss';
import { useTranslations } from 'next-intl';

const Spinner = () => {
  const t = useTranslations('Results');
  return <div className={styles.spinner} aria-label={t('spinner')} />;
};
export default Spinner;
