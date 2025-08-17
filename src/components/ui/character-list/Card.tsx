'use client';
import CharacterCharacteristics from './character-characteristics';
import style from './character-list.module.scss';
import { toggleCharacterSelection } from '@redux/slices/characters-slice';
import type { RootState } from '@redux/store';
import type { Person } from '@shared/types/response-types';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

interface CardItemProps {
  character: Person;
}

const Card: React.FC<CardItemProps> = ({ character }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCharacters = useSelector(
    (state: RootState) => state.characters.selectedCharacters
  );
  const isChecked = selectedCharacters.includes(character._id);

  const handleCardClick = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('details', character._id);
    router.push(`?${params.toString()}`);
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
          href={character.wikiUrl ?? '#'}
          aria-disabled={!character.wikiUrl}
          title="More info"
          target="_blank"
          rel="noopener noreferrer"
          className={character.wikiUrl ? style.wikiLink : style.disableLink}
          onClick={handleWikiClick}
        >
          See More Info
        </a>
      </button>
    </li>
  );
};

export default Card;
