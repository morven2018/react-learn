import CharacterApiService from '@services/api/apiService';
import LoadingOverlay from '@components/ui/loading-overlay/LoadingOverlay';
import style from './Search.module.scss';
import { Term } from '@services/localStorage/LastTerm';
import type { Person } from '@shared/types/responseTypes';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
}

export interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
}

const Search = forwardRef<SearchHandle, SearchProps>(
  ({ onSearchResults, onLoading }, ref) => {
    const [termValue, setTermValue] = useState(Term.getTermFromLS() ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    const clearDebounceTimer = () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };

    const handleSearch = useCallback(
      async (term: string = '', page?: number) => {
        if (!isMounted.current) return;

        setIsLoading(true);
        onLoading(true);

        if (page === undefined) {
          Term.setTermToLS(term);
        }

        try {
          const response = await CharacterApiService.searchCharacters(
            term,
            page
          );

          if (isMounted.current) {
            onSearchResults(response?.docs || [], page === undefined);
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Unknown error'
          );
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
            onLoading(false);
          }
        }
      },
      [onLoading, onSearchResults]
    );

    useImperativeHandle(ref, () => ({
      handleSearch,
    }));

    useEffect(() => {
      isMounted.current = true;
      const recentSearch = Term.getTermFromLS();

      if (recentSearch) {
        setTermValue(recentSearch);
        handleSearch(recentSearch);
      }

      handleSearch(recentSearch);

      return () => {
        isMounted.current = false;
        clearDebounceTimer();
      };
    }, [handleSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTermValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      clearDebounceTimer();
      handleSearch(termValue);
    };

    return (
      <section className={style.searchComponent}>
        <LoadingOverlay visible={isLoading} />
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="text"
            value={termValue}
            onChange={handleInputChange}
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
);

Search.displayName = 'Search';

export default Search;
