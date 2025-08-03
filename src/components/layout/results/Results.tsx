import CardList from '@components/ui/character-list/CardList';
import React from 'react';
import style from './Results.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface ResultsProps {
  characters: Person[];
  loadingState: 'initial' | 'loading' | 'success' | 'error';
  isFetchingMore: boolean;
}

const Results: React.FC<ResultsProps> = ({
  characters,
  loadingState,
  isFetchingMore,
}) => {
  return (
    <div className={style.resultsContainer}>
      {loadingState === 'loading' && (
        <div className={style.messageIndicator}>Loading characters...</div>
      )}

      {loadingState === 'success' && !!characters.length && (
        <CardList characters={characters} isFetchingMore={isFetchingMore} />
      )}

      {((loadingState === 'success' && !characters.length) ||
        loadingState === 'error') && (
        <div className={style.messageIndicator}>No data found</div>
      )}
    </div>
  );
};

export default Results;
