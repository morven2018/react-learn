import CharacterApiService from '@services/api/apiService';
import Search from './Search';
import type { Person } from '@shared/types/responseTypes';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface SearchRefMethods {
  handleLoadMore: () => Promise<void>;
}

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onHasMore: (hasMore: boolean) => void;
}

const SearchWithRef = forwardRef<SearchRefMethods, SearchProps>(
  (props, ref) => {
    const searchRef = useRef<{
      handleSearch: (term?: string) => Promise<void>;
    }>(null);

    const handleLoadMore = async () => {
      if (!searchRef.current) return;

      const { onLoading, onSearchResults, onHasMore } = props;

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
        onLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      handleLoadMore,
    }));

    return <Search ref={searchRef} {...props} />;
  }
);

SearchWithRef.displayName = 'SearchWithRef';

export default SearchWithRef;
