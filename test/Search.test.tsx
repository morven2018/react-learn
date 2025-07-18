import * as CharacterApiService from '@services/api/apiService';
import * as LastTerm from '@services/localStorage/LastTerm';
import React from 'react';
import Search from '@components/layout/search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, vi } from 'vitest';

vi.mock('@services/api/apiService', () => {
  const mockApi = {
    searchCharacters: vi.fn(),
    loadMore: vi.fn(),
    hasMore: vi.fn(),
  };
  return {
    __esModule: true,
    default: mockApi,
  };
});

vi.mock('@services/localStorage/LastTerm', () => {
  const mockTerm = {
    getTermFromLS: vi.fn(),
    setTermToLS: vi.fn(),
  };
  return {
    __esModule: true,
    Term: mockTerm,
  };
});

describe('Search Component', () => {
  const mockProps = {
    onSearchResults: vi.fn(),
    onLoading: vi.fn(),
    onHasMore: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (CharacterApiService.default.searchCharacters as Mock).mockResolvedValue({
      docs: [{ id: '1', name: 'Character 1' }],
    });

    (CharacterApiService.default.loadMore as Mock).mockResolvedValue({
      docs: [{ id: '2', name: 'Character 2' }],
    });

    (CharacterApiService.default.hasMore as Mock).mockReturnValue(true);

    (LastTerm.Term.getTermFromLS as Mock).mockReturnValue('');
  });

  it('renders correctly', () => {
    render(<Search {...mockProps} />);

    expect(
      screen.getByRole('textbox', { name: 'Search characters' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('load initial data on mount', async () => {
    (LastTerm.Term.getTermFromLS as Mock).mockReturnValue('test');

    render(<Search {...mockProps} />);

    await waitFor(() => {
      expect(CharacterApiService.default.searchCharacters).toHaveBeenCalledWith(
        'test'
      );
      expect(mockProps.onSearchResults).toHaveBeenCalledWith(
        [{ id: '1', name: 'Character 1' }],
        true
      );
    });
  });

  it('handle search on form submit', async () => {
    const { container } = render(<Search {...mockProps} />);

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Form is mot found');
    }

    const input = screen.getByRole('textbox', { name: 'Search characters' });
    fireEvent.change(input, { target: { value: 'test' } });

    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(CharacterApiService.default.searchCharacters).toHaveBeenCalledWith(
        'test'
      );
    });
  });

  it('show loading state', async () => {
    (
      CharacterApiService.default.searchCharacters as jest.Mock
    ).mockImplementation(() => new Promise(() => {}));

    render(<Search {...mockProps} />);

    const formElement = document.querySelector('form');
    if (!formElement) {
      throw new Error('Form is mot found');
    }
    fireEvent.submit(formElement);

    const loadingButton = await screen.findByRole('button', {
      name: /Searching/i,
    });

    expect(loadingButton).toBeDisabled();
    expect(loadingButton.textContent).toMatch(/Searching/i);

    expect(mockProps.onLoading).toHaveBeenCalledWith(true);
  });

  describe('SearchWithRef', () => {
    interface SearchRefMethods {
      handleLoadMore: () => Promise<void>;
    }

    it('provide the handleLoadMore method', async () => {
      const ref = React.createRef<SearchRefMethods>();
      render(<Search {...mockProps} ref={ref} />);

      await ref.current?.handleLoadMore?.();

      expect(CharacterApiService.default.loadMore).toHaveBeenCalled();
      expect(mockProps.onSearchResults).toHaveBeenCalledWith(
        [{ id: '2', name: 'Character 2' }],
        false
      );
    });
  });
});
