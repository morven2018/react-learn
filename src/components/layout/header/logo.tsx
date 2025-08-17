'use client';
import Image from 'next/image';
import logoDark from '@assets/images/image.png';
import logoLight from '@assets/images/imageL.png';
import styles from './Header.module.scss';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/use-theme';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 48 }: Readonly<LogoProps>) {
  const { theme } = useTheme();
  const t = useTranslations('Header');

  return (
    <Image
      src={theme === 'dark' ? logoDark : logoLight}
      height={size}
      alt={t('whiteTree')}
      className={styles.logo}
      priority
    />
  );
}
