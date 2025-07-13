import CharacterCharacteristics from './CharacterCharacteristics';
import React from 'react';
import style from './CharacterLst.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface CardItemProps {
  character: Person;
}

class Card extends React.Component<CardItemProps> {
  render() {
    const { character } = this.props;

    return (
      <li key={character.name} className={style.card}>
        <h3 className={style.name}>{character.name}</h3>
        <CharacterCharacteristics character={character} />
        <a
          href={character.wikiUrl ?? '#'}
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
  }
}

export default Card;
