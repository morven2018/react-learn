import Search from './Search';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
  getCurrentValue: () => string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
}

interface SearchWithRefProps {
  onSearch: (term: string) => Promise<void>;
  initialSearchTerm?: string;
  isLoading: boolean;
}

const SearchWithRef = forwardRef<SearchHandle, SearchWithRefProps>(
  ({ onSearch, initialSearchTerm, isLoading }, ref) => {
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
        return searchRef.current?.getCurrentValue() ?? '';
      },
      setInputValue: (value: string) => {
        if (searchRef.current) {
          searchRef.current.setInputValue(value);
        }
      },
      isLoading: isLoading,
    }));

    return (
      <Search
        ref={searchRef}
        onSearch={onSearch}
        initialSearchTerm={initialSearchTerm}
        isLoading={isLoading}
      />
    );
  }
);

SearchWithRef.displayName = 'SearchWithRef';

export default SearchWithRef;
