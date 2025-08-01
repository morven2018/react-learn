import CharacterCharacteristics from './CharacterCharacteristics';
import React from 'react';
import style from './CharacterList.module.scss';
import type { Person } from '@shared/types/responseTypes';
import { useNavigate } from 'react-router-dom';

interface CardItemProps {
  character: Person;
}

const emptyLink = '#';

const Card: React.FC<CardItemProps> = ({ character }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('details', character._id);
    navigate(`?${searchParams.toString()}`);
  };

  const handleWikiClick = (e: React.MouseEvent) => {
    if (!character.wikiUrl) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  return (
    <li key={character.name} className={style.cardWrapper}>
      <button onClick={handleCardClick} className={style.card}>
        <h3 className={style.name}>{character.name}</h3>
        <CharacterCharacteristics character={character} />
        <a
          href={character.wikiUrl ?? emptyLink}
          aria-disabled={!character.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={character.wikiUrl ? style.wikiLink : style.disableLink}
          onClick={handleWikiClick}
        >
          See More Info
        </a>{' '}
      </button>
    </li>
  );
};

export default Card;
