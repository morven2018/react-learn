import * as LastTerm from '@services/localStorage/LastTerm';
import CharacterApiService from '@services/api/apiService';
import React from 'react';
import SearchWithRef from '@components/layout/search/SearchWithRef';
import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

interface SearchWithRefHandle {
  handleLoadMore: () => Promise<void>;
}

describe('SearchWithRef', () => {
  const person = {
    _id: '',
    name: 'person1',
    wikiUrl: '',
    race: '',
    gender: '',
    birth: '',
    death: '',
    realm: '',
    height: '',
    hair: '',
    spouse: '',
  };

  const mockApiResponse = {
    docs: [person],
    total: 1,
    limit: 20,
    page: 1,
    pages: 2,
  };

  const mockProps = {
    onSearchResults: vi.fn(),
    onLoading: vi.fn(),
    onHasMore: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(CharacterApiService, 'searchCharacters').mockResolvedValue(
      mockApiResponse
    );
    vi.spyOn(CharacterApiService, 'loadMore').mockResolvedValue(
      mockApiResponse
    );
    vi.spyOn(CharacterApiService, 'hasMore').mockReturnValue(true);

    vi.spyOn(LastTerm.Term, 'getTermFromLS').mockReturnValue('');
    vi.spyOn(LastTerm.Term, 'setTermToLS').mockImplementation(() => {});
  });

  it('provide the handleLoadMore method', async () => {
    const ref = React.createRef<SearchWithRefHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await act(async () => {
      await ref.current?.handleLoadMore?.();
    });

    expect(CharacterApiService.loadMore).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockProps.onSearchResults).toHaveBeenCalledWith([person], false);
      expect(mockProps.onHasMore).toHaveBeenCalledWith(true);
    });

    const loadMoreLoadingCalls = mockProps.onLoading.mock.calls.slice(-2);
    expect(loadMoreLoadingCalls).toEqual([[true], [false]]);
  });
});
