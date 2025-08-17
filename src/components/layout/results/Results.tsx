import CardList from '@components/ui/character-list/card-list';
import LoadingOverlay from '@/components/ui/loading-overlay/loading-overlay';
import React from 'react';
import style from './Results.module.scss';
import type { Person } from '@shared/types/response-types';
import { useTranslations } from 'next-intl';

interface ResultsProps {
  characters: Person[];
  loadingState: 'loading' | 'success' | 'error';
}
export default function Results({
  characters,
  loadingState,
}: Readonly<ResultsProps>) {
  const t = useTranslations('Results');
  return (
    <div className={style.resultsContainer}>
      {loadingState === 'loading' && (
        <div className={style.messageIndicator}>
          <LoadingOverlay visible={true} />
          {t('loading')}
        </div>
      )}

      {loadingState === 'success' && !!characters.length && (
        <CardList characters={characters} />
      )}

      {loadingState === 'success' && !characters.length && (
        <div className={style.messageIndicator}>{t('noData')}</div>
      )}
    </div>
  );
}
