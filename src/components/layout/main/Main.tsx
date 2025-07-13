import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/buttons/ErrorTestButton';
import React from 'react';
import Results from '@components/layout/results/Results';
import Search from '@components/layout/search/Search';
import type { Person } from '@shared/types/responseTypes';

interface MainState {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: Error | null;
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
      error: null,
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
        document.documentElement.offsetHeight - 100 &&
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
      this.setState({ error: error as Error });
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
    const { characters, isLoading, isFetchingMore, error } = this.state;

    return (
      <main>
        <div>
          <Search
            ref={this.searchRef}
            onSearchResults={this.handleSearchResults}
            onLoading={(loading) => this.setState({ isLoading: loading })}
            onError={(err) => this.setState({ error: err })}
            onHasMore={(hasMore) => this.setState({ hasMoreItems: hasMore })}
          />

          <Results
            characters={characters}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            error={error}
            onDismissError={() => this.setState({ error: null })}
          />
        </div>
        <ErrorTestButton />
      </main>
    );
  }
}

export default Main;
