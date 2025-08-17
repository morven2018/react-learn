import CardList from '@components/ui/character-list/card-list';
import React from 'react';
import style from './Results.module.scss';
import type { Person } from '@shared/types/response-types';

//import { getTranslations } from 'next-intl/server';

interface ResultsProps {
  characters: Person[];
  loadingState: 'loading' | 'success' | 'error';
  isFetchingMore: boolean;
}
export default function Results({
  characters,
  loadingState,
  isFetchingMore,
}: Readonly<ResultsProps>) {
  //const t = await getTranslations('Results');
  return (
    <div className={style.resultsContainer}>
      {loadingState === 'loading' && (
        <div className={style.messageIndicator}>loading</div>
      )}

      {loadingState === 'success' && !!characters.length && (
        <CardList characters={characters} isFetchingMore={isFetchingMore} />
      )}

      {((loadingState === 'success' && !characters.length) ||
        loadingState === 'error') && (
        <div className={style.messageIndicator}>noData</div>
      )}
    </div>
  );
}
