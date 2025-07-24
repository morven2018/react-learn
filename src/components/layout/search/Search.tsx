import CharacterApiService from '@services/api/apiService';
import LoadingOverlay from '@components/ui/loading-overlay/LoadingOverlay';
import style from './Search.module.scss';
import { useRestoreSearchTerm } from '@components/hooks/useRestoreSearchTerm';
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
    const { termValue, updateTermValue } = useRestoreSearchTerm();
    const [inputValue, setInputValue] = useState(termValue);
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);

    const performSearch = useCallback(
      async (term: string) => {
        if (!isMounted.current) return;

        setIsLoading(true);
        onLoading(true);

        try {
          const response = await CharacterApiService.searchCharacters(term);
          if (isMounted.current) {
            onSearchResults(response?.docs || [], true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
            onLoading(false);
          }
        }
      },
      [onLoading, onSearchResults]
    );

    const handleSearch = useCallback(
      async (term: string = '') => {
        await performSearch(term);
        updateTermValue(term);
      },
      [performSearch, updateTermValue]
    );

    useEffect(() => {
      isMounted.current = true;

      handleSearch(termValue);

      return () => {
        isMounted.current = false;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      handleSearch,
    }));

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      handleSearch(inputValue);
    };

    return (
      <section className={style.searchComponent}>
        <LoadingOverlay visible={isLoading} />
        <form onSubmit={handleSubmit} className={style.form}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search characters..."
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
