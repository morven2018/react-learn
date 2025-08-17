import HomeClient from '@/components/layout/home/home-client';
import type { Person } from '@/shared/types/response-types';

import {
  getCharacterById,
  searchCharacters,
} from '@/services/api/character-api.server';

export default async function HomePage({
  searchParams,
}: Readonly<{
  searchParams: { page?: string; details?: string; search?: string };
}>) {
  const page = Number(searchParams.page) || 1;
  const characterId = searchParams.details;
  const searchTerm = searchParams.search || '';
  const charactersData = await searchCharacters({
    name: searchTerm,
    page,
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
        currentPage: page,
      }}
      initialSearchTerm={searchTerm}
      characterDetails={characterDetails}
      characterId={characterId}
    />
  );
}
