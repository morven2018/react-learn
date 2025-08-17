'use client';
import DetailCard from '../detail-view/detail-card';
import Pagination from '@/components/ui/pagination/Pagination';
import Results from '../results/Results';
import SearchWithRef from '../search/search-with-ref';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Flyout } from '@/components/ui/flyout/Flyout';
import { RefreshButton } from '@/components/ui/refresh-button/refresh-button';
import { useSearchCharactersQuery } from '@/services/api/character-api';
import { COOKIE_LAST_SEARCH } from '@/shared/constants/cookies';
import type { Person } from '@/shared/types/response-types';

interface HomeClientProps {
  initialData: {
    characters: Person[];
    totalPages: number;
    currentPage: number;
  };
  initialSearchTerm?: string;
  characterId?: string;
}

export default function HomeClient({
  initialData,
  initialSearchTerm = '',
}: Readonly<HomeClientProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('search') || initialSearchTerm;
  const detailsParam = searchParams.get('details');

  const {
    data: charactersData,
    isLoading,
    isFetching,
    refetch,
  } = useSearchCharactersQuery(
    { name: searchTerm, page },
    {
      skip: !searchTerm,
      refetchOnMountOrArgChange: true,
    }
  );

  const characters = charactersData?.data?.docs || initialData.characters;
  const totalPages = charactersData?.data?.pages || initialData.totalPages;
  const currentPage = charactersData?.data?.page || page;

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleSearch = useCallback(
    async (term: string) => {
      setCookie(COOKIE_LAST_SEARCH, term, { maxAge: 60 * 60 * 24 * 30 });
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      if (detailsParam) params.set('details', detailsParam);
      router.push(`${pathname}?${params.toString()}`);
      await refetch();
    },
    [router, pathname, detailsParam, searchParams]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set('page', newPage.toString());
      params.delete('details');
      window.location.href = `${pathname}?${params.toString()}`;
    },
    [router, pathname]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (searchTerm) params.set('search', searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, page, searchTerm]);

  return (
    <div className="home-container">
      <div>
        <div>
          <SearchWithRef
            onSearch={handleSearch}
            initialSearchTerm={searchTerm}
            isLoading={isLoading || isFetching}
          />
        </div>

        {!isLoading && !isFetching && (
          <RefreshButton
            onRefresh={handleRefresh}
            isLoading={isLoading || isFetching}
          />
        )}

        <Results
          characters={characters}
          loadingState={isLoading || isFetching ? 'loading' : 'success'}
          isFetchingMore={false}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading || isFetching}
          />
        )}

        {detailsParam && (
          <DetailCard characterId={detailsParam} onClose={handleCloseDetails} />
        )}
      </div>
      <Flyout />
    </div>
  );
}
