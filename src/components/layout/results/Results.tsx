import CardList from '@components/ui/character-list/CardList';
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

        {characters.length > 0 ? (
          <CardList characters={characters} isFetchingMore={isFetchingMore} />
        ) : (
          !isLoading && <div>No data found</div>
        )}
      </div>
    );
  }
}

export default Results;
