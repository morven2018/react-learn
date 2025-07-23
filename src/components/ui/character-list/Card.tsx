import CharacterCharacteristics from './CharacterCharacteristics';
import React from 'react';
import style from './CharacterLst.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface CardItemProps {
  character: Person;
}

const emptyLink = '#';

const Card: React.FC<CardItemProps> = ({ character }) => {
  return (
    <li key={character.name} className={style.card}>
      <h3 className={style.name}>{character.name}</h3>
      <CharacterCharacteristics character={character} />
      <a
        href={character.wikiUrl ?? emptyLink}
        aria-disabled={!character.wikiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={character.wikiUrl ? style.wikiLink : style.disableLink}
        onClick={(e) => !character.wikiUrl && e.preventDefault()}
      >
        See More Info
      </a>
    </li>
  );
};

export default Card;
