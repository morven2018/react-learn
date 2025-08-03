import CharacterCharacteristics from './character-characteristics';
import React from 'react';
import style from './character-list.module.scss';
import type { RootState } from '@redux/store';
import { toggleCharacterSelection } from '@shared/features/charactersSlice';
import type { Person } from '@shared/types/responseTypes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface CardItemProps {
  character: Person;
}

const emptyLink = '#';

const Card: React.FC<CardItemProps> = ({ character }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const selectedCharacters = useSelector(
    (state: RootState) => state.characters.selectedCharacters
  );
  const isChecked = selectedCharacters.includes(character._id);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleCharacterSelection(character._id));
  };

  return (
    <li key={character.name} className={style.cardWrapper}>
      <button onClick={handleCardClick} className={style.card}>
        <div className={style.checkboxWrapper}>
          <label htmlFor={character._id}>Choose character:</label>
          <input
            type="checkbox"
            title="Select character"
            checked={isChecked}
            id={character._id}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className={style.customCheckbox}
          />
        </div>
        <h3 className={style.name}>{character.name}</h3>
        <CharacterCharacteristics character={character} />
        <a
          href={character.wikiUrl ?? emptyLink}
          aria-disabled={!character.wikiUrl}
          title="More info"
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
