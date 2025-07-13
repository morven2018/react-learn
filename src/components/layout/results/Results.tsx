import React from 'react';
import type { Person } from '@shared/types/responseTypes';

interface ResultsProps {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: Error | null;
  onDismissError: () => void;
}

class Results extends React.Component<ResultsProps> {
  renderCharacter = (character: Person) => (
    <li key={character.name}>
      <h3>{character.name}</h3>
      <p>Race: {character.race ?? 'unknown'}</p>
      <p>Gender: {character.gender ?? 'unknown'}</p>
      <p>Birth: {character.birth ?? 'unknown'}</p>
      <p>Death: {character.death ?? 'unknown'}</p>
      <p>Realm: {character.realm ?? 'unknown'}</p>
      <a
        href={character.wikiUrl ?? ''}
        aria-disabled={!character.wikiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wiki-link"
      >
        See More Info
      </a>
    </li>
  );

  render() {
    const { characters, isLoading, error, isFetchingMore, onDismissError } =
      this.props;

    return (
      <div>
        {isLoading && !isFetchingMore && (
          <div className="loading-indicator">Loading characters...</div>
        )}

        {error && (
          <div>
            Error: {error.message}
            <button onClick={onDismissError}>Dismiss</button>
          </div>
        )}

        {characters.length !== 0 ? (
          <>
            <ul>{characters.map(this.renderCharacter)}</ul>
            {isFetchingMore && (
              <div className="loading-more">Loading more characters...</div>
            )}
          </>
        ) : (
          <div>Not data is found</div>
        )}
      </div>
    );
  }
}

export default Results;
