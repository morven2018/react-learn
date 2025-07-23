import CardList from '@components/ui/character-list/CardList';
import React, { useEffect, useState } from 'react';
import style from './Results.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface ResultsProps {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
}

const Results: React.FC<ResultsProps> = ({
  characters,
  isLoading,
  isFetchingMore,
}) => {
  const [shouldResetList, setShouldResetList] = useState(true);

  useEffect(() => {
    if (isLoading && !isFetchingMore) {
      setShouldResetList(true);
    }
  }, [isLoading, isFetchingMore]);

  useEffect(() => {
    if (!isLoading && !isFetchingMore) {
      setShouldResetList(false);
    }
  }, [isLoading, isFetchingMore]);

  const displayCharacters = shouldResetList ? [] : characters;

  return (
    <div className={style.resultsContainer}>
      {isLoading && !isFetchingMore && (
        <div className={style.messageIndicator}>Loading characters...</div>
      )}

      {displayCharacters.length > 0 && (
        <CardList
          characters={displayCharacters}
          isFetchingMore={isFetchingMore}
        />
      )}

      {!isLoading && displayCharacters.length === 0 && !shouldResetList && (
        <div className={style.messageIndicator}>No data found</div>
      )}
    </div>
  );
};

export default Results;
