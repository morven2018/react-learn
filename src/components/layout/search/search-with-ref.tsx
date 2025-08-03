import Search from './Search';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
  getCurrentValue: () => string;
  setInputValue: (value: string) => void;
}

interface SearchWithRefProps {
  onSearch: (term: string) => Promise<void>;
  initialSearchTerm?: string;
}

const SearchWithRef = forwardRef<SearchHandle, SearchWithRefProps>(
  ({ onSearch, initialSearchTerm }, ref) => {
    const searchRef = useRef<SearchHandle>(null);

    useEffect(() => {
      if (searchRef.current && initialSearchTerm !== undefined) {
        searchRef.current.setInputValue(initialSearchTerm);
      }
    }, [initialSearchTerm]);

    useImperativeHandle(ref, () => ({
      handleSearch: async (term?: string) => {
        if (searchRef.current) {
          await searchRef.current.handleSearch(term);
        }
      },
      getCurrentValue: () => {
        return searchRef.current?.getCurrentValue() || '';
      },
      setInputValue: (value: string) => {
        if (searchRef.current) {
          searchRef.current.setInputValue(value);
        }
      },
    }));

    return (
      <Search
        ref={searchRef}
        onSearch={onSearch}
        initialSearchTerm={initialSearchTerm}
      />
    );
  }
);

SearchWithRef.displayName = 'SearchWithRef';

export default SearchWithRef;
