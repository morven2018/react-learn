'use client';
import styles from './locale.module.scss';
import { usePathname, useRouter } from 'next/navigation';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale =
    pathname.startsWith('/ru/') || pathname === '/ru' ? 'ru' : 'en';

  const toggleLocale = () => {
    const newLocale = currentLocale === 'en' ? 'ru' : 'en';
    const newPath = pathname.replace(/^\/(en|ru)(\/|$)/, `/${newLocale}$2`);
    router.replace(newPath);
  };

  return (
    <button
      onClick={toggleLocale}
      className={styles.localeButton}
      aria-label={
        currentLocale === 'en' ? 'Switch to Russian' : 'Switch to English'
      }
      title={currentLocale === 'en' ? 'Русский' : 'English'}
    >
      {currentLocale === 'en' ? 'RU' : 'EN'}
    </button>
  );
}
