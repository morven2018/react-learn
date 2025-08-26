import Card from './Card';
import React from 'react';
import style from './character-list.module.scss';
import type { Person } from '@shared/types/response-types';

interface CardListProps {
  characters: Person[];
}

const CardList: React.FC<CardListProps> = ({ characters }) => {
  return (
    <ul className={style.list}>
      {characters.map((character) => (
        <Card key={character._id} character={character} />
      ))}
    </ul>
  );
};

export default CardList;
