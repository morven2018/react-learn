import Card from './Card';
import React from 'react';
import type { Person } from '@shared/types/responseTypes';

interface CardListProps {
  characters: Person[];
  isFetchingMore: boolean;
}

const CardList: React.FC<CardListProps> = ({ characters, isFetchingMore }) => {
  return (
    <>
      {characters.length !== 0 ? (
        <>
          <ul>
            {characters.map((character) => (
              <Card key={character.name} character={character} />
            ))}
          </ul>
          {isFetchingMore && (
            <div className="loading-more">Loading more characters...</div>
          )}
        </>
      ) : (
        <div>Not data is found</div>
      )}

      {isFetchingMore && (
        <div className="loading-more">Loading more characters...</div>
      )}
    </>
  );
};

export default CardList;
