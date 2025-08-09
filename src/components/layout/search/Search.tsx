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
  setInputValue: (value: string) => void;
  isLoading: boolean;
}

interface SearchProps {
  onSearch: (term: string) => Promise<void>;
  initialSearchTerm?: string;
  isLoading: boolean;
}

const Search = forwardRef<SearchHandle, SearchProps>(
  ({ onSearch, initialSearchTerm = '', isLoading }, ref) => {
    const [inputValue, setInputValue] = useState(initialSearchTerm);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
      setInputValue(initialSearchTerm ?? '');
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
      setInputValue: (value: string) => {
        setInputValue(value);
      },
      isLoading: isLoading || isSearching,
    }));

    return (
      <section className={style.searchComponent}>
        <div className={style.searchContainer}>
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
              disabled={isLoading || isSearching}
              className={style.searchButton}
            >
              {isLoading || isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </section>
    );
  }
);

Search.displayName = 'Search';

export default Search;
