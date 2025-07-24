import CharacterApiService from '@services/api/apiService';
import React from 'react';
import Search from './Search';
import type { Person } from '@shared/types/responseTypes';

interface SearchRefMethods {
  handleLoadMore: () => Promise<void>;
}

interface SearchProps {
  onSearchResults: (results: Person[], isNewSearch: boolean) => void;
  onLoading: (isLoading: boolean) => void;
  onHasMore: (hasMore: boolean) => void;
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

SearchWithRef.displayName = 'SearchWithRef';

export default SearchWithRef;
