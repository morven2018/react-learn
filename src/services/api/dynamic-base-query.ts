import {
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query';

export const API_BASE = 'https://the-one-api.dev/v2/';
export const API_KEY_PRIMARY =
  process.env.NEXT_PUBLIC_KEY ?? 'ksmnN0SYU1vcR69udsuY';
export const API_KEY_SECONDARY =
  process.env.NEXT_PUBLIC_KEY2 ?? 'oJHunt00vrX9Yile7Jny';

export enum HttpStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export enum CustomErrorCode {
  NetworkError = 1000,
  InvalidData = 1001,
  ApiError = 1002,
  UnknownError = 9999,
}

export const ERROR_MESSAGES: { [key: number]: string } = {
  [HttpStatus.BadRequest]:
    '400. Bad Request - The server cannot process the request',
  [HttpStatus.Unauthorized]: '401. Unauthorized - Authentication required',
  [HttpStatus.Forbidden]: '403. Forbidden - Insufficient permissions',
  [HttpStatus.NotFound]: '404. Not Found - Resource does not exist',
  [HttpStatus.TooManyRequests]: '429. Too Many Requests - Rate limit exceeded',
  [HttpStatus.InternalServerError]:
    '500. Internal Server Error - Server encountered an error',
  [HttpStatus.ServiceUnavailable]:
    '503. Service Unavailable - Temporary maintenance',
  [CustomErrorCode.NetworkError]:
    '1000. Network Error - Connection problem or timeout',
  [CustomErrorCode.InvalidData]: '1001. Invalid Data - Incorrect data format',
  [CustomErrorCode.ApiError]: '1002. API Error - External service failure',
  [CustomErrorCode.UnknownError]:
    '9999. Unknown Error - Unexpected situation occurred',
};

export const dynamicBaseQuery: BaseQueryFn = async (
  args,
  api,
  extraOptions
) => {
  let apiKey = API_KEY_PRIMARY;
  let attempt = 0;
  const maxRetries = API_KEY_SECONDARY ? 2 : 1;

  while (attempt < maxRetries) {
    attempt++;

    const baseQuery = fetchBaseQuery({
      baseUrl: API_BASE,
      prepareHeaders: (headers) => {
        headers.set('Authorization', `Bearer ${apiKey}`);
        headers.set('Content-Type', 'application/json');
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    if (!result.error) return result;
    const status = result.error.status;

    if (status !== 401 && status !== 429) {
      return {
        ...result,
        error: {
          ...result.error,
          message: ERROR_MESSAGES[Number(status)] || ERROR_MESSAGES[9999],
        },
      };
    }

    if (attempt < maxRetries && API_KEY_SECONDARY) {
      apiKey = API_KEY_SECONDARY;
      continue;
    }

    return result;
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
