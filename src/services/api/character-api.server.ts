import {
  API_BASE,
  API_KEY_PRIMARY,
  API_KEY_SECONDARY,
} from './dynamic-base-query';
import type {
  ApiResponse,
  Person,
  PersonWithUrl,
} from '@shared/types/response-types';

const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  attempt = 0
): Promise<Response> => {
  const maxRetries = API_KEY_SECONDARY ? 2 : 1;
  const apiKey = attempt === 0 ? API_KEY_PRIMARY : API_KEY_SECONDARY;

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (
      (response.status === 401 || response.status === 429) &&
      attempt < maxRetries - 1
    ) {
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw response;
  }

  return response;
};

export const getCharacterById = async (id: string): Promise<Person> => {
  try {
    const response = await fetchWithRetry(`character/${id}`);
    const data = await response.json();

    if (!data?.docs?.[0]) {
      throw new Error('Character not found');
    }

    return data.docs[0];
  } catch (error) {
    console.error('Error fetching character:', error);
    throw error;
  }
};

export const searchCharacters = async ({
  name = '',
  page = 1,
}: {
  name?: string;
  page?: number;
}): Promise<ApiResponse> => {
  try {
    const params = new URLSearchParams();
    if (name) params.append('name', `/${name}/i`);
    params.append('page', page.toString());
    params.append('limit', '12');

    const response = await fetchWithRetry(`character?${params.toString()}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching characters:', error);
    throw error;
  }
};

export const getCharactersByIds = async (
  ids: string[]
): Promise<PersonWithUrl[]> => {
  if (!ids || ids.length === 0) {
    return [];
  }

  try {
    const promises = ids.map((id) => getCharacterById(id));
    const characters = await Promise.all(promises);

    return characters.map((char) => ({
      ...char,
      url: `character/${char._id}`,
    }));
  } catch (error) {
    console.error('Error fetching multiple characters:', error);
    throw error;
  }
};
