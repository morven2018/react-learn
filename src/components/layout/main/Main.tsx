import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import React from 'react';
import Results from '@components/layout/results/Results';
import SearchWithRef from '../search/SearchWithRef';
import style from './Main.module.scss';
import type { Person } from '@shared/types/responseTypes';

const SCROLL_LOAD_THRESHOLD = 100;

interface MainState {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMoreItems: boolean;
}

interface SearchComponentMethods {
  handleLoadMore: () => Promise<void>;
}

class Main extends React.Component<Record<string, never>, MainState> {
  private readonly searchRef: React.RefObject<SearchComponentMethods | null>;

  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      characters: [],
      isLoading: false,
      isFetchingMore: false,
      hasMoreItems: false,
    };
    this.searchRef = React.createRef();
  }

  handleSearchResults = (results: Person[], isNewSearch: boolean) => {
    this.setState((prevState) => ({
      characters: isNewSearch ? results : [...prevState.characters, ...results],
      hasMoreItems: CharacterApiService.hasMore(),
    }));
  };

  handleScroll = () => {
    if (this.shouldLoadMore()) {
      this.loadMore();
    }
  };

  shouldLoadMore = (): boolean => {
    const { isFetchingMore, hasMoreItems } = this.state;
    return (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - SCROLL_LOAD_THRESHOLD &&
      !isFetchingMore &&
      hasMoreItems
    );
  };

  loadMore = async () => {
    this.setState({ isFetchingMore: true });
    try {
      if (this.searchRef.current) {
        await this.searchRef.current.handleLoadMore();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    } finally {
      this.setState({ isFetchingMore: false });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { characters, isLoading, isFetchingMore } = this.state;

    return (
      <main className={style.mainSection}>
        <div className={style.mainContent}>
          <SearchWithRef
            ref={this.searchRef}
            onSearchResults={this.handleSearchResults}
            onLoading={(loading) => this.setState({ isLoading: loading })}
            onHasMore={(hasMore) => this.setState({ hasMoreItems: hasMore })}
          />

          <Results
            characters={characters}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
          />

          <ErrorTestButton />
        </div>
      </main>
    );
  }
}

export default Main;
