import Card from './card';
import React from 'react';
import style from './character-list.module.scss';
import type { Person } from '@shared/types/response-types';

interface CardListProps {
  characters: Person[];
  isFetchingMore: boolean;
}

const CardList: React.FC<CardListProps> = ({ characters, isFetchingMore }) => {
  return (
    <>
      <ul className={style.list}>
        {characters.map((character) => (
          <Card key={character.name} character={character} />
        ))}
      </ul>
      {isFetchingMore && (
        <div className={style.loadMore}>Loading more characters...</div>
      )}
    </>
  );
};

export default CardList;
