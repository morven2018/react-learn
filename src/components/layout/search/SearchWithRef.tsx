import CharacterApiService from '@services/api/apiService';
import Search from './Search';
import type { Person } from '@shared/types/responseTypes';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface SearchRefMethods {
  handleLoadPage: (page: number) => Promise<void>;
}

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  // onHasMore: (hasMore: boolean) => void;
}

const SearchWithRef = forwardRef<SearchRefMethods, SearchProps>(
  (props, ref) => {
    const searchRef = useRef<{
      handleSearch: (term?: string) => Promise<void>;
    }>(null);

    const handleLoadPage = async (page: number) => {
      if (!searchRef.current) return;

      const { onLoading, onSearchResults } = props;

      onLoading(true);

      try {
        const response = await CharacterApiService.loadPage(page);
        if (searchRef.current) {
          onSearchResults(response?.docs || [], false);
        }
      } catch {
        throw new Error('Load page failed');
      } finally {
        onLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      handleLoadPage,
    }));

    return <Search ref={searchRef} {...props} />;
  }
);

SearchWithRef.displayName = 'SearchWithRef';

export default SearchWithRef;
