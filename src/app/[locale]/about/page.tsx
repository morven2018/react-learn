import Image from 'next/image';
import git from '@assets/logo/git.svg';
import rss from '@assets/logo/rss.svg';
import style from './about.module.scss';
import { getTranslations } from 'next-intl/server';
import { ExternalLink } from '@/components/ui/link/external-link';

const ICON_SIZE = 36;

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <main>
      <div className={style.aboutPage}>
        <h2 className={style.header}>{t('header')}</h2>
        <p className={style.data}>
          <span>{t('done')}</span>

          <ExternalLink
            href="https://github.com/morven2018"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('gitAria')}
            className={style.link}
          >
            <Image
              src={git}
              width={ICON_SIZE}
              height={ICON_SIZE}
              alt={t('altGit')}
            />
          </ExternalLink>
        </p>
        <div className={style.data}>
          {t('course')}
          <ExternalLink
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
          </ExternalLink>
        </div>
      </div>
    </main>
  );
}
