import CardList from '@components/ui/character-list/CardList';
import React from 'react';
import style from './Results.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface ResultsProps {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
}

interface ResultsState {
  shouldResetList: boolean;
}

class Results extends React.Component<ResultsProps, ResultsState> {
  constructor(props: ResultsProps) {
    super(props);
    this.state = {
      shouldResetList: true,
    };
  }

  componentDidUpdate(prevProps: ResultsProps) {
    if (
      prevProps.isLoading &&
      !this.props.isLoading &&
      !this.props.isFetchingMore
    ) {
      this.setState({ shouldResetList: false });
    }

    if (
      !prevProps.isLoading &&
      this.props.isLoading &&
      !this.props.isFetchingMore
    ) {
      this.setState({ shouldResetList: true });
    }
  }

  render() {
    const { characters, isLoading, isFetchingMore } = this.props;
    const { shouldResetList } = this.state;
    const displayCharacters = shouldResetList ? [] : characters;

    return (
      <div className={style.resultsContainer}>
        {isLoading && !isFetchingMore && (
          <div className={style.messageIndicator}>Loading characters...</div>
        )}

        {displayCharacters.length > 0 && (
          <CardList
            characters={displayCharacters}
            isFetchingMore={isFetchingMore}
          />
        )}

        {!isLoading && displayCharacters.length === 0 && !shouldResetList && (
          <div className={style.messageIndicator}>No data found</div>
        )}
      </div>
    );
  }
}

export default Results;
