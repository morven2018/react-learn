import { API_BASE, ERROR_MESSAGES, getApiKeys } from './config';

import {
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query';

export const dynamicBaseQuery: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  const { primary, secondary } = getApiKeys();
  let apiKey = primary;
  let attempt = 0;
  const maxRetries = secondary ? 2 : 1;

  console.log('API_BASE:', API_BASE);
  console.log('API Key available:', !!apiKey);

  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      if (apiKey) {
        headers.set('Authorization', `Bearer ${apiKey}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  });

  while (attempt < maxRetries) {
    attempt++;

    try {
      const result = await baseQuery(args, api, extraOptions);

      if (!result.error) return result;

      const status = result.error.status;
      console.log('API Error Status:', status);

      if (status !== 401 && status !== 429) {
        return {
          ...result,
          error: {
            ...result.error,
            message: ERROR_MESSAGES[Number(status)] || ERROR_MESSAGES[9999],
          },
        };
      }

      if (attempt < maxRetries && secondary) {
        apiKey = secondary;
        continue;
      }

      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      if (attempt < maxRetries && secondary) {
        apiKey = secondary;
        continue;
      }
      throw error;
    }
  }

  return {
    error: {
      status: 9999,
      error: ERROR_MESSAGES[9999],
    },
  };
};

export const staggeredBaseQuery = retry(dynamicBaseQuery, {
  maxRetries: 1,
});
