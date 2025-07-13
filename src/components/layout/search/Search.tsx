import CharacterApiService from '@services/api/apiService';
import React from 'react';
import { Term } from '@services/localStorage/LastTerm';
import type { Person } from '@shared/types/responseTypes';

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onError: (error: Error | null) => void;
  onHasMore: (hasMore: boolean) => void;
}

interface SearchState {
  termValue: string;
  isInitialLoad: boolean;
  isLoading: boolean;
}

class Search extends React.Component<SearchProps, SearchState> {
  private isMounted = false;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(props: SearchProps) {
    super(props);
    this.state = {
      termValue: Term.getTermFromLS() || '-1',
      isInitialLoad: true,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.isMounted = true;
    this.loadInitialData();
  }

  componentWillUnmount() {
    this.isMounted = false;
    this.clearDebounceTimer();
  }

  private clearDebounceTimer() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private async loadInitialData() {
    const recentSearch = Term.getTermFromLS();
    if (recentSearch) {
      this.setState({ termValue: recentSearch }, () => {
        this.handleSearch(recentSearch);
      });
    } else {
      await this.handleSearch('');
    }
    this.setState({ isInitialLoad: false });
  }

  handleSearch = async (term: string = '') => {
    if (!this.isMounted) return;

    this.setState({ isLoading: true });
    this.props.onLoading(true);
    this.props.onError(null);
    Term.setTemToLS(term);

    try {
      const response = await CharacterApiService.searchCharacters(term);

      if (this.isMounted) {
        this.props.onSearchResults(response?.docs || [], true);
        this.props.onHasMore(CharacterApiService.hasMore());
      }
    } catch (error) {
      if (this.isMounted) {
        this.props.onError(
          error instanceof Error ? error : new Error('Search failed')
        );
      }
    } finally {
      if (this.isMounted) {
        this.setState({ isLoading: false });
        this.props.onLoading(false);
      }
    }
  };

  handleLoadMore = async () => {
    if (!this.isMounted || !CharacterApiService.hasMore()) return;

    this.setState({ isLoading: true });
    this.props.onLoading(true);
    try {
      const response = await CharacterApiService.loadMore();

      if (response && this.isMounted) {
        this.props.onSearchResults(response.docs, false);
        this.props.onHasMore(CharacterApiService.hasMore());
      }
    } catch (error) {
      if (this.isMounted) {
        this.props.onError(
          error instanceof Error ? error : new Error('Load more failed')
        );
      }
    } finally {
      if (this.isMounted) {
        this.setState({ isLoading: false });
        this.props.onLoading(false);
      }
    }
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({ termValue: value });
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.clearDebounceTimer();
    this.handleSearch(this.state.termValue);
  };

  render() {
    const { termValue, isLoading } = this.state;

    return (
      <section className="search-container">
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={termValue}
            onChange={this.handleInputChange}
            placeholder="Search characters by name..."
            aria-label="Search characters"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>
    );
  }
}

export default Search;
