import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import Pagination from '@components/ui/pagination/pagination';
import React, { useCallback, useRef, useState } from 'react';
import Results from '@components/layout/results/Results';
import SearchWithRef from '@components/layout/search/SearchWithRef';
import style from './Home.module.scss';
import type { Person } from '@shared/types/responseTypes';

interface SearchComponentMethods {
  handleSearch: (term: string) => Promise<void>;
  handleLoadPage: (page: number) => Promise<void>;
}

const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchRef = useRef<SearchComponentMethods | null>(null);

  const handleSearchResults = useCallback(
    (results: Person[], isNewSearch: boolean) => {
      setCharacters(results);
      setCurrentPage(1);
      if (isNewSearch) {
        setTotalPages(CharacterApiService.getTotalPages());
      }
    },
    []
  );

  const handleLoadPage = useCallback(
    async (page: number) => {
      if (isLoading || page === currentPage || page < 1 || page > totalPages)
        return;

      setIsLoading(true);
      try {
        if (searchRef.current) {
          await searchRef.current.handleLoadPage(page);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, currentPage, totalPages]
  );

  return (
    <main className={style.mainSection}>
      <div className={style.mainContent}>
        <SearchWithRef
          ref={searchRef}
          onSearchResults={handleSearchResults}
          onLoading={setIsLoading}
          //   onHasMore={setHasMoreItems}
        />

        <Results
          characters={characters}
          isLoading={isLoading}
          isFetchingMore={false}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={handleLoadPage}
        />

        <ErrorTestButton />
      </div>
    </main>
  );
};

export default Home;
