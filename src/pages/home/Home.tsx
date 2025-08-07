import CharacterApiService from '@services/api/apiService';
import Pagination from '@components/ui/pagination/Pagination';
import Results from '@components/layout/results/Results';
import style from './Home.module.scss';
import { useRestoreSearchTerm } from '@components/hooks/useRestoreSearchTerm';
import type { Person } from '@shared/types/responseTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchWithRef, {
  type SearchHandle,
} from '@components/layout/search/SearchWithRef';

const Home = () => {
  const [characters, setCharacters] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const searchRef = useRef<SearchHandle>(null);
  const { termValue: currentSearch, updateTermValue } = useRestoreSearchTerm();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const initialSearchTerm = currentSearch ?? '';

  const loadData = useCallback(
    async (page: number, term: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        const response = await CharacterApiService.searchCharacters(
          term,
          page,
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          setCharacters(response.docs);
          setTotalPages(response.pages ?? 1);
          updateTermValue(term);
          const pages = response.pages ?? 1;

          if (page > pages) {
            navigate(`?page=1`, {
              replace: true,
            });
          }
        }
      } catch (error) {
        if (!controller.signal.aborted && error instanceof Error) {
          console.error('Search error:', error);
        }
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    },
    [updateTermValue, navigate]
  );

  const handleSearch = useCallback(
    async (term: string) => {
      const searchTerm = term.trim();
      navigate(`?page=1`);
      await loadData(1, searchTerm);
    },
    [navigate, loadData]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      const searchTerm = currentSearch ?? '';
      navigate(`?page=${page}`);
      await loadData(page, searchTerm);
    },
    [navigate, currentSearch, loadData]
  );

  useEffect(() => {
    const searchTerm = currentSearch;
    loadData(currentPage, searchTerm);
  }, [currentPage, currentSearch, loadData]);

  return (
    <main className={style.mainSection}>
      <div className={style.mainContent}>
        <SearchWithRef
          ref={searchRef}
          onSearch={handleSearch}
          initialSearchTerm={initialSearchTerm}
        />

        <Results
          characters={characters}
          isLoading={isLoading}
          isFetchingMore={isFetchingMore}
        />

        {!!totalPages && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading || isFetchingMore}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
