'use client';
import DetailCard from '../detail-view/detail-card';
import Pagination from '@/components/ui/pagination/Pagination';
import Results from '../results/Results';
import SearchWithRef from '../search/search-with-ref';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { setLastSearchTerm } from '@/redux/slices/search-slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
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
  const dispatch = useAppDispatch();

  const lastSearchTerm = useAppSelector((state) => state.search.lastSearchTerm);
  const currentSearch = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    if (lastSearchTerm && !currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', lastSearchTerm);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [lastSearchTerm, currentSearch, searchParams, pathname, router]);

  const handleSearch = useCallback(
    async (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', term);
      params.set('page', '1');
      dispatch(setLastSearchTerm(term));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname, dispatch]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams, pathname]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="home-container">
      <SearchWithRef
        onSearch={handleSearch}
        initialSearchTerm={initialSearchTerm}
        isLoading={false}
      />

      <Results
        characters={initialData.characters}
        loadingState="success"
        isFetchingMore={false}
      />

      {initialData.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={initialData.totalPages}
          onPageChange={handlePageChange}
          isLoading={false}
        />
      )}

      {characterId && characterDetails && (
        <DetailCard character={characterDetails} onClose={handleCloseDetails} />
      )}
    </div>
  );
}
