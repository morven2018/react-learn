import getRandomInt from '@shared/lib/randomNumber';
import { Term } from '@services/localStorage/LastTerm';
import type { ApiResponse } from '@shared/types/responseTypes';

const API_BASE = import.meta.env.VITE_API_URL;
const API_KEY_PRIMARY = import.meta.env.VITE_API_KEY;
const API_KEY_SECONDARY = import.meta.env.VITE_API_KEY2;
const BASE_LIMIT = 20;
const unauthorized = 401;

class CharacterApiService {
  private static lastQuery: string = '';
  private static lastResponse: ApiResponse | null = null;
  private static currentApiKey = API_KEY_PRIMARY;

  private static async authorizedFetch(
    url: string,
    retry = true
  ): Promise<Response> {
    try {
      const headers = new Headers({
        Authorization: `Bearer ${this.currentApiKey}`,
        'Content-Type': 'application/json',
      });

      const response = await fetch(url, { headers });

      if (response.status === unauthorized && retry && API_KEY_SECONDARY) {
        this.currentApiKey = API_KEY_SECONDARY;
        return this.authorizedFetch(url, false);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error('Network request failed');
    }
  }

  static async searchCharacters(
    name: string = '',
    page: number = 1
  ): Promise<ApiResponse | null> {
    const queryParams = new URLSearchParams();

    if (name) {
      queryParams.append('name', `/${name}/i`);
      Term.setTermToLS(name);
      this.lastQuery = name;
    }

    queryParams.append('limit', BASE_LIMIT.toString());
    queryParams.append('page', page.toString());

    const url = `${API_BASE}character?${queryParams.toString()}`;
    const response = await this.authorizedFetch(url);
    this.lastResponse = await response.json();

    return this.lastResponse;
  }

  static async loadMore(): Promise<ApiResponse | null> {
    if (!this.lastResponse) return null;

    const nextPage = this.lastResponse.page + 1;
    if (nextPage > this.lastResponse.pages) return null;

    try {
      const response = await this.searchCharacters(this.lastQuery, nextPage);
      return response;
    } catch (error) {
      console.error('Load more failed:', error);
      throw error;
    }
  }

  static hasMore(): boolean {
    return this.lastResponse
      ? this.lastResponse.page < this.lastResponse.pages
      : false;
  }

  static getLoadedCount(): number {
    return this.lastResponse
      ? this.lastResponse.page * this.lastResponse.limit
      : 0;
  }

  static async triggerTestError(): Promise<never> {
    const errorType = getRandomInt(1, 3);
    const timestamp = Date.now();

    const generateErrors: Record<number, () => Promise<never>> = {
      1: async (): Promise<never> => {
        throw new Error(`Network Error: Failed to fetch (test ${timestamp})`);
      },
      2: async (): Promise<never> => {
        const url = `${API_BASE}invalid-endpoint-test-${timestamp}`;
        try {
          const response = await this.authorizedFetch(url);
          throw new Error(`API returned unexpected status: ${response.status}`);
        } catch (err) {
          throw new Error(
            `API Error: ${err instanceof Error ? err.message : 'Unknown error'}`
          );
        }
      },
      3: async (): Promise<never> => {
        const url = `${API_BASE}character?force_error=true&test_id=${timestamp}`;
        try {
          const response = await this.authorizedFetch(url);
          const data = await response.json();

          throw new Error(
            data.message || `Invalid data format (test ${timestamp})`
          );
        } catch (err) {
          throw new Error(
            `Data Error: ${err instanceof Error ? err.message : 'Invalid response'}`
          );
        }
      },
    };

    return generateErrors[errorType]();
  }
}

export default CharacterApiService;
