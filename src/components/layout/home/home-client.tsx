'use client';
import DetailCard from '../detail-view/detail-card';
import Pagination from '@/components/ui/pagination/Pagination';
import Results from '../results/Results';
import SearchWithRef from '../search/search-with-ref';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Flyout } from '@/components/ui/flyout/Flyout';
import { setLastSearchTerm } from '@/redux/slices/search-slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import type { ApiResponse, Person } from '@/shared/types/response-types';

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

  const [characters, setCharacters] = useState(initialData.characters);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const lastSearchTerm = useAppSelector((state) => state.search.lastSearchTerm);
  const page = Number(searchParams.get('page')) || 1;
  const detailsParam = searchParams.get('details');
  const fetchCharacters = useCallback(
    async (searchTerm: string, pageNum: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/characters?page=${pageNum}`, {
          headers: {
            'X-Search-Term': encodeURIComponent(searchTerm),
          },
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const data: ApiResponse = await response.json();

        setCharacters(data.docs || []);
        setTotalPages(data.pages || 1);
        setCurrentPage(data.page || 1);

        dispatch(setLastSearchTerm(searchTerm));

        const params = new URLSearchParams();
        params.set('page', pageNum.toString());
        if (detailsParam) params.set('details', detailsParam);
        router.replace(`${pathname}?${params.toString()}`);
      } catch (error) {
        console.error('Fetch error:', error);
        setCharacters([]);
      } finally {
        setIsLoading(false);
      }
    },
    [router, pathname, detailsParam, dispatch]
  );

  const handleSearch = useCallback(
    async (term: string) => {
      await fetchCharacters(term, 1);
    },
    [fetchCharacters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchCharacters(lastSearchTerm, newPage);
    },
    [fetchCharacters, lastSearchTerm]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, page]);

  useEffect(() => {
    if (initialSearchTerm) {
      fetchCharacters(initialSearchTerm, page);
    }
  }, []);

  return (
    <div className="home-container">
      <div>
        <div>
          <SearchWithRef
            onSearch={handleSearch}
            initialSearchTerm={lastSearchTerm || initialSearchTerm}
            isLoading={isLoading}
          />

          <Results
            characters={characters}
            loadingState={isLoading ? 'loading' : 'success'}
            isFetchingMore={false}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
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
