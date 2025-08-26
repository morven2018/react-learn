import CharacterCharacteristics from './character-characteristics';
import style from './character-list.module.scss';
import { toggleCharacterSelection } from '@redux/slices/characters-slice';
import type { RootState } from '@redux/store';
import type { Person } from '@shared/types/response-types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalLink } from '../link/external-link';

interface CardItemProps {
  character: Person;
}

const Card: React.FC<CardItemProps> = ({ character }) => {
  const t = useTranslations('Card');
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
          <label htmlFor={character._id}>{t('label')}</label>
          <input
            type="checkbox"
            title={t('inboxTitle')}
            checked={isChecked}
            id={character._id}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            className={style.customCheckbox}
          />
        </div>
        <h3 className={style.name}>{character.name}</h3>
        <CharacterCharacteristics character={character} />
        <ExternalLink
          href={character.wikiUrl ?? '#'}
          aria-disabled={!character.wikiUrl}
          title={t('linkTitle')}
          target="_blank"
          rel="noopener noreferrer"
          className={character.wikiUrl ? style.wikiLink : style.disableLink}
          onClick={handleWikiClick}
        >
          {t('link')}
        </ExternalLink>
      </button>
    </li>
  );
};

export default Card;
