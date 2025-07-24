import * as CharacterApiService from '@services/api/apiService';
import * as LastTerm from '@services/localStorage/LastTerm';
import Search from '@components/layout/search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

const person = [
  {
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
  },
];

const apiResponse = { docs: person, total: 1, limit: 20, page: 1, pages: 1 };

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

    vi.spyOn(CharacterApiService.default, 'searchCharacters').mockResolvedValue(
      apiResponse
    );

    vi.spyOn(CharacterApiService.default, 'loadMore').mockResolvedValue(
      apiResponse
    );

    vi.spyOn(CharacterApiService.default, 'hasMore').mockReturnValue(true);

    vi.spyOn(LastTerm.Term, 'getTermFromLS').mockReturnValue('');
  });

  it('renders correctly', async () => {
    await act(async () => {
      render(<Search {...mockProps} />);
    });

    expect(
      screen.getByRole('textbox', { name: 'Search characters' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('load initial data on mount', async () => {
    vi.spyOn(LastTerm.Term, 'getTermFromLS').mockReturnValue('test');

    render(<Search {...mockProps} />);

    await waitFor(() => {
      expect(CharacterApiService.default.searchCharacters).toHaveBeenCalledWith(
        'test'
      );
      expect(mockProps.onSearchResults).toHaveBeenCalledWith(person, true);
    });
  });

  it('handle search on form submit', async () => {
    const { container } = render(<Search {...mockProps} />);

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Form is mot found');
    }

    const input = screen.getByRole('textbox', { name: 'Search characters' });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(CharacterApiService.default.searchCharacters).toHaveBeenCalledWith(
        'test'
      );
    });
  });

  it('show loading state', async () => {
    vi.spyOn(
      CharacterApiService.default,
      'searchCharacters'
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
});
