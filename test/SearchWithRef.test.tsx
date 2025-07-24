import * as LastTerm from '@services/localStorage/LastTerm';
import CharacterApiService from '@services/api/apiService';
import React from 'react';
import SearchWithRef from '@components/layout/search/SearchWithRef';
import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

interface SearchWithRefHandle {
  handleLoadPage: (page: number) => Promise<void>;
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
    vi.spyOn(CharacterApiService, 'loadPage').mockResolvedValue(
      mockApiResponse
    );

    vi.spyOn(LastTerm.Term, 'getTermFromLS').mockReturnValue('');
    vi.spyOn(LastTerm.Term, 'setTermToLS').mockImplementation(() => {});
  });

  it('provide the handleLoadPage method', async () => {
    const ref = React.createRef<SearchWithRefHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    // Clear initial loading calls from the initial render
    mockProps.onLoading.mockClear();

    const testPage = 2;
    await act(async () => {
      await ref.current?.handleLoadPage?.(testPage);
    });

    expect(CharacterApiService.loadPage).toHaveBeenCalledTimes(1);
    expect(CharacterApiService.loadPage).toHaveBeenCalledWith(testPage);

    await waitFor(() => {
      expect(mockProps.onSearchResults).toHaveBeenCalledWith([person], false);
    });

    // Now we only expect the loading calls from our manual handleLoadPage call
    const loadingCalls = mockProps.onLoading.mock.calls;
    expect(loadingCalls).toEqual([[true], [false]]);
  });
});
