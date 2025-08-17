import HomeClient from '@/components/layout/home/home-client';
import { cookies } from 'next/headers';
import { COOKIE_LAST_SEARCH } from '@/shared/constants/cookies';
import type { Person } from '@/shared/types/response-types';

import {
  getCharacterById,
  searchCharacters,
} from '@/services/api/character-api.server';

export default async function HomePage({
  searchParams,
}: Readonly<{
  params: { locale: string };
  searchParams: { page?: string; details?: string; search?: string };
}>) {
  // Деструктурируем после await
  const { page = '1', details, search } = searchParams;
  const currentPage = Number(page) || 1;
  const characterId = details;

  // Получаем куки
  const cookieStore = await cookies();
  const lastSearch = cookieStore.get(COOKIE_LAST_SEARCH)?.value;
  const searchTerm = search || lastSearch || '';

  const charactersData = await searchCharacters({
    name: searchTerm,
    page: currentPage,
  });

  let characterDetails: Person | null = null;
  if (characterId) {
    try {
      characterDetails = await getCharacterById(characterId);
    } catch (error) {
      console.error('Error fetching character details:', error);
    }
  }

  return (
    <HomeClient
      initialData={{
        characters: charactersData.docs,
        totalPages: charactersData.pages,
        currentPage: currentPage,
      }}
      initialSearchTerm={searchTerm}
      characterDetails={characterDetails}
      characterId={characterId}
    />
  );
}
