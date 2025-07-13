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
      Term.setTemToLS(name);
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
    if (
      !this.lastResponse ||
      this.lastResponse.page >= this.lastResponse.pages
    ) {
      return null;
    }

    const nextPage = this.lastResponse.page + 1;
    return this.searchCharacters(this.lastQuery, nextPage);
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
}

export default CharacterApiService;
