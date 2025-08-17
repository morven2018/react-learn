'use client';
import DetailCard from '../detail-view/detail-card';
import Pagination from '@/components/ui/pagination/Pagination';
import Results from '../results/Results';
import SearchWithRef from '../search/search-with-ref';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Flyout } from '@/components/ui/flyout/Flyout';
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
  characterDetails?: Person | null;
  characterId?: string;
}

export default function HomeClient({
  initialData,
  initialSearchTerm = '',
  characterDetails,
  characterId,
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
  } = useSearchCharactersQuery(
    { name: searchTerm, page },
    {
      skip: !searchTerm,
    }
  );

  const characters = charactersData?.data?.docs || initialData.characters;
  const totalPages = charactersData?.data?.pages || initialData.totalPages;
  const currentPage = charactersData?.data?.page || page;

  const handleSearch = useCallback(
    async (term: string) => {
      setCookie(COOKIE_LAST_SEARCH, term, { maxAge: 60 * 60 * 24 * 30 });

      const params = new URLSearchParams();
      params.set('search', term);
      params.set('page', '1');
      if (detailsParam) params.set('details', detailsParam);
      await router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, detailsParam]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      params.set('page', newPage.toString());
      if (searchTerm) params.set('search', searchTerm);
      if (detailsParam) params.set('details', detailsParam);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchTerm, detailsParam]
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
        </div>

        {characterId && characterDetails && (
          <DetailCard
            character={characterDetails}
            onClose={handleCloseDetails}
          />
        )}
      </div>
      <Flyout />
    </div>
  );
}
