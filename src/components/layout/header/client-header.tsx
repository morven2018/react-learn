'use client';
import Image from 'next/image';
import darkModeIcon from '@assets/logo/darkMode.svg';
import lightModeIcon from '@assets/logo/lightMode.svg';
import styles from './header.module.scss';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/use-theme';
import { Themes } from '@/shared/types/response-types';

export default function ClientHeader() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Header');
  const isDarkTheme = theme === Themes.dark;

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeButton}
      aria-label={isDarkTheme ? t('toggleLight') : t('toggleDark')}
    >
      <Image
        src={isDarkTheme ? lightModeIcon : darkModeIcon}
        width={24}
        height={24}
        alt={isDarkTheme ? t('toggleLight') : t('toggleDark')}
      />
    </button>
  );
}
