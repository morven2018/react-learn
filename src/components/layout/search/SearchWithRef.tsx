import Search from './Search';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
  getCurrentValue: () => string;
}

interface SearchWithRefProps {
  onSearch: (term: string) => Promise<void>;
  initialSearchTerm?: string;
}

const SearchWithRef = forwardRef<SearchHandle, SearchWithRefProps>(
  ({ onSearch, initialSearchTerm }, ref) => {
    const searchRef = useRef<SearchHandle>(null);

    useImperativeHandle(ref, () => ({
      handleSearch: async (term?: string) => {
        if (searchRef.current) {
          await searchRef.current.handleSearch(term);
        }
      },
      getCurrentValue: () => {
        return searchRef.current?.getCurrentValue() || '';
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
