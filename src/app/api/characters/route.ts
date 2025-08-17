import { NextResponse } from 'next/server';

import {
  getCharacterById,
  searchCharacters,
} from '@/services/api/character-api.server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const id = searchParams.get('id');

  try {
    if (id) {
      const data = await getCharacterById(id);
      return NextResponse.json(data);
    } else {
      const searchTerm = request.headers.get('x-search-term') || '';
      const decodedTerm = decodeURIComponent(searchTerm);

      const data = await searchCharacters({ name: decodedTerm, page });
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
