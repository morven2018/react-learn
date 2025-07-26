import LoadingOverlay from '@components/ui/loading-overlay/LoadingOverlay';
import style from './Search.module.scss';

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';

interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
  getCurrentValue: () => string;
}

interface SearchProps {
  onSearch: (term: string) => Promise<void>;
  initialSearchTerm?: string;
}

const Search = forwardRef<SearchHandle, SearchProps>(
  ({ onSearch, initialSearchTerm = '' }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
      setInputValue(initialSearchTerm || '');
    }, [initialSearchTerm]);

    const handleSearch = useCallback(
      async (term: string = inputValue) => {
        setIsSearching(true);
        try {
          await onSearch(term);
        } finally {
          setIsSearching(false);
        }
      },
      [onSearch, inputValue]
    );

    const getCurrentValue = useCallback(() => inputValue, [inputValue]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
    };

    useImperativeHandle(ref, () => ({
      handleSearch,
      getCurrentValue,
    }));

    return (
      <section className={style.searchComponent}>
        <div className={style.searchContainer}>
          <LoadingOverlay visible={isSearching} />
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
              disabled={isSearching}
              className={style.searchButton}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </section>
    );
  }
);

Search.displayName = 'Search';

export default Search;
