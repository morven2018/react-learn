import LoadingOverlay from '@components/ui/loading-overlay/loading-overlay';
import Pagination from '@components/ui/pagination/Pagination';
import Results from '@components/layout/results/Results';
import SearchWithRef from '@components/layout/search/search-with-ref';
import style from './Home.module.scss';
import { useRestoreSearchTerm } from '@components/hooks/use-restore-searchTerm';
import type { SearchHandle } from '@components/layout/search/search-with-ref';
import { ErrorMessage } from '@components/ui/error-message/error-message';
import { Flyout } from '@components/ui/flyout/Flyout';
import { RefreshButton } from '@components/ui/refresh-button/refresh-button';
import { triggerRefresh } from '@redux/refresh-slice';
import { useAppDispatch, useAppSelector } from '@redux/store';
import { useSearchCharactersQuery } from '@services/api/character-api';
import { getErrorMessage } from '@services/api/error-handler';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {
  const searchRef = useRef<SearchHandle>(null);
  const { termValue: currentSearch, updateTermValue } = useRestoreSearchTerm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const initialSearchTerm = currentSearch ?? '';
  const dispatch = useAppDispatch();

  const {
    data: apiResponse,
    isFetching,
    error,
    refetch,
  } = useSearchCharactersQuery(
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

  const handleForceRefresh = useCallback(() => {
    refetch();
    dispatch(triggerRefresh());
  }, [refetch, dispatch]);

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

        {(apiResponse?.state === 'error' || (!apiResponse && !isFetching)) && (
          <ErrorMessage
            message={getErrorMessage(error)}
            onRetry={handleForceRefresh}
            isLoading={isFetching}
          />
        )}

        <div className={style.headerControls}>
          <SearchWithRef
            ref={searchRef}
            onSearch={handleSearch}
            initialSearchTerm={initialSearchTerm}
            isLoading={apiResponse?.state === 'loading' || isFetching}
          />
          <RefreshButton
            onRefresh={handleForceRefresh}
            isLoading={isFetching}
          />
        </div>

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
