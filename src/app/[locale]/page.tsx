import DetailCardHome from '@/components/layout/detail-view/detail-card-home';
import HomeClient from '@/components/layout/home/home-client';
import { cookies } from 'next/headers';
import { searchCharacters } from '@/services/api/character-api.server';
import { COOKIE_LAST_SEARCH } from '@/shared/constants/cookies';

export default async function HomePage({
  searchParams,
}: Readonly<{
  params: { locale: string };
  searchParams: { page?: string; details?: string; search?: string };
}>) {
  const resolvedSearchParams = await searchParams;
  const { page = '1', details, search } = resolvedSearchParams;
  const currentPage = Number(page) || 1;

  const cookieStore = await cookies();
  const lastSearch = cookieStore.get(COOKIE_LAST_SEARCH)?.value;
  const searchTerm = search || lastSearch || '';

  const charactersData = await searchCharacters({
    name: searchTerm,
    page: currentPage,
  });

  return (
    <>
      <HomeClient
        initialData={{
          characters: charactersData.docs,
          totalPages: charactersData.pages,
          currentPage: currentPage,
        }}
        initialSearchTerm={searchTerm}
      />

      {details && <DetailCardHome characterId={details} />}
    </>
  );
}
