import Pagination from '@components/ui/pagination/Pagination';
import Results from '@components/layout/results/Results';
import SearchWithRef from '@components/layout/search/search-with-ref';
import style from './Home.module.scss';
import { useRestoreSearchTerm } from '@components/hooks/use-restore-searchTerm';
import type { SearchHandle } from '@components/layout/search/search-with-ref';
import { Flyout } from '@components/ui/flyout/Flyout';
import { useAppSelector } from '@redux/store';
import { useSearchCharactersQuery } from '@services/api/characterApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {
  const searchRef = useRef<SearchHandle>(null);
  const { termValue: currentSearch, updateTermValue } = useRestoreSearchTerm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const initialSearchTerm = currentSearch ?? '';

  const {
    data: characters,
    isLoading,
    isError,
    isFetching,
  } = useSearchCharactersQuery(
    { name: currentSearch ?? '', page: currentPage },
    { refetchOnMountOrArgChange: true }
  );

  const [prevSearch, setPrevSearch] = useState(currentSearch);
  const isNewSearch = prevSearch !== currentSearch;

  const getLoadingState = (
    isLoading: boolean,
    isError: boolean
  ): 'loading' | 'success' | 'error' => {
    if (isLoading) return 'loading';
    if (isError) return 'error';
    return 'success';
  };

  const selectedCharacters = useAppSelector(
    (state) => state.characters.selectedCharacters
  );

  const handleSearch = useCallback(
    async (term: string) => {
      const searchTerm = term.trim();
      updateTermValue(searchTerm);
      setPrevSearch(currentSearch);
      navigate(`?page=1`);
    },
    [navigate, updateTermValue]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      navigate(`?page=${page}`);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (characters?.pages && currentPage > characters.pages) {
      navigate(`?page=1`, { replace: true });
    }
  }, [characters, currentPage, currentSearch, navigate]);

  return (
    <main className={style.mainSection}>
      <div className={style.mainContent}>
        <SearchWithRef
          ref={searchRef}
          onSearch={handleSearch}
          initialSearchTerm={initialSearchTerm}
        />

        <Results
          characters={characters?.docs ?? []}
          loadingState={getLoadingState(
            isLoading || (isFetching && isNewSearch),
            isError
          )}
          isFetchingMore={isFetching}
        />

        {!!characters?.pages && (
          <Pagination
            currentPage={currentPage}
            totalPages={characters?.pages}
            onPageChange={handlePageChange}
            isLoading={isFetching}
          />
        )}

        {!!selectedCharacters.length && <Flyout />}
      </div>
    </main>
  );
};

export default Home;
