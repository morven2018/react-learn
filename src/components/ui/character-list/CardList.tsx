import Card from './Card';
import React from 'react';
import style from './CharacterLst.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface CardListProps {
  characters: Person[];
  isFetchingMore: boolean;
}

const CardList: React.FC<CardListProps> = ({ characters, isFetchingMore }) => {
  return (
    <>
      <ul className={style.list}>
        {characters.map((character) => (
          <Card key={character._id} character={character} />
        ))}
      </ul>
      {isFetchingMore && (
        <div className={style.loadMore}>Loading more characters...</div>
      )}
    </>
  );
};

export default CardList;
