import CardList from '@components/ui/character-list/card-list';
import LoadingOverlay from '@/components/ui/loading-overlay/loading-overlay';
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
        <div className={style.messageIndicator}>
          <LoadingOverlay visible={true} />
          loading
        </div>
      )}

      {loadingState === 'success' && !!characters.length && (
        <CardList characters={characters} isFetchingMore={isFetchingMore} />
      )}

      {loadingState === 'success' && !characters.length && (
        <div className={style.messageIndicator}>No data found</div>
      )}
    </div>
  );
}
