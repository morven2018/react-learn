import LoadingOverlay from '@components/ui/loading-overlay/loading-overlay';
import Pagination from '@components/ui/pagination/Pagination';
import Results from '@components/layout/results/Results';
import SearchWithRef from '@components/layout/search/search-with-ref';
import style from './Home.module.scss';
import { useRestoreSearchTerm } from '@components/hooks/use-restore-searchTerm';
import type { SearchHandle } from '@components/layout/search/search-with-ref';
import { Flyout } from '@components/ui/flyout/Flyout';
import { useAppSelector } from '@redux/store';
import { useSearchCharactersQuery } from '@services/api/characterApi';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {
  const searchRef = useRef<SearchHandle>(null);
  const { termValue: currentSearch, updateTermValue } = useRestoreSearchTerm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const initialSearchTerm = currentSearch ?? '';

  const { data: apiResponse, isFetching } = useSearchCharactersQuery(
    { name: currentSearch ?? '', page: currentPage },
    { refetchOnMountOrArgChange: true }
  );

  const selectedCharacters = useAppSelector(
    (state) => state.characters.selectedCharacters
  );

  const handleSearch = useCallback(
    async (term: string) => {
      const searchTerm = term.trim();
      updateTermValue(searchTerm);
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
    if (apiResponse?.data?.pages && currentPage > apiResponse.data.pages) {
      navigate(`?page=1`, { replace: true });
    }
  }, [apiResponse, currentPage, currentSearch, navigate]);

  return (
    <main className={style.mainSection}>
      <div className={style.mainContent}>
        <LoadingOverlay
          visible={apiResponse?.state === 'loading' || isFetching}
        />
        <SearchWithRef
          ref={searchRef}
          onSearch={handleSearch}
          initialSearchTerm={initialSearchTerm}
          isLoading={apiResponse?.state === 'loading' || isFetching}
        />

        <Results
          characters={apiResponse?.data?.docs ?? []}
          loadingState={
            (apiResponse?.state === 'error' && 'error') ||
            (isFetching && 'loading') ||
            'success'
          }
          isFetchingMore={isFetching}
        />

        {!!apiResponse?.data?.pages && (
          <Pagination
            currentPage={currentPage}
            totalPages={apiResponse?.data?.pages}
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
