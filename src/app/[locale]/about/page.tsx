import Image from 'next/image';
import git from '@assets/logo/git.svg';
import rss from '@assets/logo/rss.svg';
import style from './about.module.scss';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const ICON_SIZE = 36;
export default function AboutPage() {
  const t = useTranslations('About');
  return (
    <main>
      <div className={style.aboutPage}>
        <h2 className={style.header}>{t('header')}</h2>
        <p className={style.data}>
          <span>{t('done')}</span>
          <a
            href="https://github.com/morven2018"
            target="_blank"
            rel="noreferrer"
            aria-label={t('gitAria')}
            className={style.link}
          >
            <Image
              src={git}
              width={ICON_SIZE}
              height={ICON_SIZE}
              alt={t('altGit')}
            />
          </a>
        </p>
        <div className={style.data}>
          {t('course')}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
            className={style.link}
          >
            {t('linkText')}
            <Image
              src={rss}
              width={ICON_SIZE}
              height={ICON_SIZE}
              alt={t('altRss')}
            />
          </a>
        </div>
      </div>
    </main>
  );
}
