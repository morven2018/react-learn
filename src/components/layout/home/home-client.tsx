'use client';
import Pagination from '@/components/ui/pagination/Pagination';
import Results from '../results/Results';
import SearchWithRef from '../search/search-with-ref';
import style from './home.module.scss';
import { setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Flyout } from '@/components/ui/flyout/Flyout';
import { CustomNotification } from '@/components/ui/notification/notification';
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
  const t = useTranslations('Home');

  const page = Number(searchParams.get('page')) || 1;
  const searchTerm = searchParams.get('search') || initialSearchTerm;
  const detailsParam = searchParams.get('details');
  const [notification, setNotification] = useState<{
    message: string;
  } | null>(null);

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
      const newTerm = term.trim().toLocaleLowerCase();

      if (newTerm === searchTerm) {
        setNotification({
          message: t('msg'),
        });
        return;
      }

      setCookie(COOKIE_LAST_SEARCH, term, { maxAge: 60 * 60 * 24 * 30 });

      if (newTerm !== searchTerm || detailsParam) {
        router.push(pathname);
        await refetch();
      }
      setNotification(null);
    },
    [router, pathname, refetch, searchTerm, detailsParam, t]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      const params = new URLSearchParams();
      params.set('page', newPage.toString());

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  return (
    <div className={style.home}>
      <div>
        <div className={style.search}>
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
        <div className={style.data}>
          <div>
            <Results
              characters={characters}
              loadingState={isLoading || isFetching ? 'loading' : 'success'}
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
        </div>
      </div>
      <div className={style.flyout}>
        <Flyout />
      </div>
      {notification && (
        <CustomNotification
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
