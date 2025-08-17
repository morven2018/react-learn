import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiResponse, Person } from '@/shared/types/response-types';

export const clientApi = createApi({
  reducerPath: 'clientApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    searchCharacters: builder.query<
      ApiResponse,
      { name?: string; page?: number }
    >({
      query: ({ name, page }) => `characters?name=${name}&page=${page}`,
    }),
    getCharacterById: builder.query<Person, string>({
      query: (id) => `characters/${id}`,
    }),
  }),
});

export const { useSearchCharactersQuery, useGetCharacterByIdQuery } = clientApi;
