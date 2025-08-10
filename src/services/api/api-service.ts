import { Term } from '@services/localStorage/LS-service';

import type {
  ApiResponse,
  Person,
  PersonWithUrl,
} from '@shared/types/response-types';

const API_BASE = 'https://the-one-api.dev/v2/';
const API_KEY_PRIMARY = import.meta.env.VITE_API_KEY ?? 'ksmnN0SYU1vcR69udsuY';
const API_KEY_SECONDARY =
  import.meta.env.VITE_API_KEY2 ?? 'oJHunt00vrX9Yile7Jny';
const BASE_LIMIT = 12;

enum HttpStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

enum CustomErrorCode {
  NetworkError = 1000,
  InvalidData = 1001,
  ApiError = 1002,
  UnknownError = 9999,
}

const ERROR_MESSAGES: { [key: number]: string } = {
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

class CharacterApiServices {
  private static currentApiKey = API_KEY_PRIMARY;

  private static createError(code: number): Error {
    const message =
      ERROR_MESSAGES[code] || ERROR_MESSAGES[CustomErrorCode.UnknownError];
    return new Error(message);
  }

  private static async authorizedFetch(
    url: string,
    options: RequestInit = {},
    retry = true
  ): Promise<Response> {
    try {
      const headers = new Headers({
        Authorization: `Bearer ${this.currentApiKey}`,
        'Content-Type': 'application/json',
      });

      if (options.headers) {
        const incomingHeaders = new Headers(options.headers);
        incomingHeaders.forEach((value, key) => {
          headers.append(key, value);
        });
      }

      const response = await fetch(url, { ...options, headers });

      if (
        (response.status === HttpStatus.Unauthorized ||
          response.status === HttpStatus.TooManyRequests) &&
        retry &&
        API_KEY_SECONDARY
      ) {
        this.currentApiKey = API_KEY_SECONDARY;
        return this.authorizedFetch(url, options, false);
      }

      if (!response.ok) {
        throw this.createError(response.status);
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      if (error instanceof Error) throw error;
      throw this.createError(CustomErrorCode.NetworkError);
    }
  }

  static async searchCharacters(
    name: string = '',
    page: number = 1,
    options: RequestInit = {}
  ): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();

    if (name) {
      queryParams.append('name', `/${name}/i`);
      Term.setTermToLS(name);
    }

    queryParams.append('limit', BASE_LIMIT.toString());
    queryParams.append('page', page.toString());

    const url = `${API_BASE}character?${queryParams.toString()}`;
    const response = await this.authorizedFetch(url, options);
    const data = await response.json();

    if (!data?.docs) {
      throw this.createError(CustomErrorCode.InvalidData);
    }

    return data;
  }

  static async getCharacterById(
    id: string,
    options: RequestInit = {}
  ): Promise<Person> {
    if (!id) {
      throw this.createError(HttpStatus.BadRequest);
    }

    const url = `${API_BASE}character/${id}`;
    const response = await this.authorizedFetch(url, options);
    const data = await response.json();

    if (!data?.docs?.[0]) {
      throw this.createError(HttpStatus.NotFound);
    }

    return data.docs[0];
  }

  static async getCharactersByIds(
    ids: string[],
    options: RequestInit = {}
  ): Promise<PersonWithUrl[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const characters = await Promise.all(
      ids.map(async (id) => {
        try {
          const character = await this.getCharacterById(id, options);
          return {
            ...character,
            url: `${API_BASE}character/${id}`,
          };
        } catch {
          return null;
        }
      })
    );
    return characters.filter(
      (char): char is PersonWithUrl => char !== undefined
    );
  }
}

export default CharacterApiServices;
