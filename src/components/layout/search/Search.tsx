import CharacterApiService from '@services/api/apiService';
import LoadingOverlay from '@components/ui/loading-overlay/LoadingOverlay';
import React from 'react';
import style from './Search.module.scss';
import { Term } from '@services/localStorage/LastTerm';
import type { Person } from '@shared/types/responseTypes';

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onHasMore: (hasMore: boolean) => void;
}

interface SearchRefMethods {
  handleLoadMore: () => Promise<void>;
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
      termValue: Term.getTermFromLS() ?? '',
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
    Term.setTermToLS(term);

    try {
      const response = await CharacterApiService.searchCharacters(term);

      if (this.isMounted) {
        this.props.onSearchResults(response?.docs || [], true);
        this.props.onHasMore(CharacterApiService.hasMore());
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
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
      <section className={style.searchComponent}>
        <LoadingOverlay visible={isLoading} />
        <form onSubmit={this.handleSubmit} className={style.form}>
          <input
            type="text"
            value={termValue}
            onChange={this.handleInputChange}
            placeholder="Search characters by name..."
            aria-label="Search characters"
            className={style.input}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={style.searchButton}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>
    );
  }
}

const SearchWithRef = React.forwardRef<SearchRefMethods, SearchProps>(
  (props, ref) => {
    const searchRef = React.useRef<Search>(null);

    const handleLoadMore = async () => {
      if (!searchRef.current) return;

      const { onLoading, onSearchResults, onHasMore } = props;

      searchRef.current.setState({ isLoading: true });
      onLoading(true);

      try {
        const response = await CharacterApiService.loadMore();
        if (searchRef.current) {
          onSearchResults(response?.docs || [], false);
          onHasMore(CharacterApiService.hasMore());
        }
      } catch {
        throw new Error('Load more failed');
      } finally {
        if (searchRef.current) {
          searchRef.current.setState({ isLoading: false });
          onLoading(false);
        }
      }
    };

    React.useImperativeHandle(ref, () => ({
      handleLoadMore,
    }));

    return <Search ref={searchRef} {...props} />;
  }
);

export default SearchWithRef;
