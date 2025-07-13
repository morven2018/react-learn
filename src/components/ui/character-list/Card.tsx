import React from 'react';
import type { Person } from '@shared/types/responseTypes';

interface CardItemProps {
  character: Person;
}

class Card extends React.Component<CardItemProps> {
  render() {
    const { character } = this.props;

    return (
      <li key={character.name}>
        <h3>{character.name}</h3>
        <p>Race: {character.race ?? 'unknown'}</p>
        <p>Gender: {character.gender ?? 'unknown'}</p>
        <p>Birth: {character.birth ?? 'unknown'}</p>
        <p>Death: {character.death ?? 'unknown'}</p>
        <p>Realm: {character.realm ?? 'unknown'}</p>
        <a
          href={character.wikiUrl ?? '#'}
          aria-disabled={!character.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`wiki-link ${!character.wikiUrl ? 'disabled' : ''}`}
          onClick={(e) => !character.wikiUrl && e.preventDefault()}
        >
          See More Info
        </a>
      </li>
    );
  }
}

export default Card;
