import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import React, { useEffect, useRef, useState } from 'react';
import Results from '@components/layout/results/Results';
import SearchWithRef from '@components/layout/search/SearchWithRef';
import style from './Home.module.scss';
import type { Person } from '@shared/types/responseTypes';

const SCROLL_LOAD_THRESHOLD = 100;

interface SearchComponentMethods {
  handleLoadMore: () => Promise<void>;
}

const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(false);

  const searchRef = useRef<SearchComponentMethods | null>(null);

  const handleSearchResults = (results: Person[], isNewSearch: boolean) => {
    setCharacters((prev) => (isNewSearch ? results : [...prev, ...results]));
    setHasMoreItems(CharacterApiService.hasMore());
  };

  const shouldLoadMore = (): boolean => {
    return (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - SCROLL_LOAD_THRESHOLD &&
      !isFetchingMore &&
      hasMoreItems
    );
  };

  const loadMore = async () => {
    setIsFetchingMore(true);
    try {
      if (searchRef.current) {
        await searchRef.current.handleLoadMore();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Unknown error');
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleScroll = () => {
    if (shouldLoadMore()) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFetchingMore, hasMoreItems]);

  return (
    <main className={style.mainSection}>
      <div className={style.mainContent}>
        <SearchWithRef
          ref={searchRef}
          onSearchResults={handleSearchResults}
          onLoading={setIsLoading}
          onHasMore={setHasMoreItems}
        />

        <Results
          characters={characters}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
        />

        <ErrorTestButton />
      </div>
    </main>
  );
};

export default Home;
