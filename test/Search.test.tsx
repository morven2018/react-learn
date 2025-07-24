import * as CharacterApiService from '@services/api/apiService';
import * as LastTerm from '@services/localStorage/LastTerm';
import Search from '@components/layout/search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const person = [
  {
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
  },
];

const apiResponse = { docs: person, total: 1, limit: 20, page: 1, pages: 1 };

vi.mock('@services/api/apiService', () => {
  return {
    default: {
      searchCharacters: vi.fn(),
    },
  };
});

vi.mock('@services/localStorage/LastTerm', () => {
  return {
    Term: {
      getTermFromLS: vi.fn(),
      setTermToLS: vi.fn(),
    },
  };
});

vi.mock('@components/hooks/useRestoreSearchTerm', () => {
  return {
    useRestoreSearchTerm: () => ({
      termValue: '',
      updateTermValue: vi.fn(),
    }),
  };
});

describe('Search Component', () => {
  const mockProps = {
    onSearchResults: vi.fn(),
    onLoading: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(CharacterApiService.default, 'searchCharacters').mockResolvedValue(
      apiResponse
    );
    vi.spyOn(LastTerm.Term, 'getTermFromLS').mockReturnValue('');
  });

  it('renders correctly', () => {
    render(<Search {...mockProps} />);
    const input = screen.getByPlaceholderText('Search characters...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');

    const button = screen.getByRole('button', { name: /Search/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Search');
  });

  it('load initial data on mount', async () => {
    const searchSpy = vi.spyOn(CharacterApiService.default, 'searchCharacters');
    render(<Search {...mockProps} />);

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('');
    });

    await waitFor(() => {
      expect(mockProps.onSearchResults).toHaveBeenCalledWith(person, true);
    });
  });

  it('shows loading state', async () => {
    vi.spyOn(
      CharacterApiService.default,
      'searchCharacters'
    ).mockImplementation(() => new Promise(() => {}));

    render(<Search {...mockProps} />);

    const input = screen.getByPlaceholderText('Search characters...');
    fireEvent.change(input, { target: { value: 'test' } });

    const formElement = screen
      .getByRole('button', { name: /Searching/i })
      .closest('form');
    if (!formElement) {
      throw new Error('Form not found');
    }
    fireEvent.submit(formElement);

    const loadingButton = await screen.findByRole('button', {
      name: /Searching/i,
    });

    expect(loadingButton).toBeDisabled();
    expect(loadingButton.textContent).toMatch(/Searching/i);
    expect(mockProps.onLoading).toHaveBeenCalledWith(true);
  });

  it('update input value on typing', () => {
    render(<Search {...mockProps} />);
    const input = screen.getByPlaceholderText('Search characters...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('handle search on form submit', async () => {
    const searchSpy = vi.spyOn(CharacterApiService.default, 'searchCharacters');
    const { container } = render(<Search {...mockProps} />);

    const input = screen.getByPlaceholderText('Search characters...');
    fireEvent.change(input, { target: { value: 'test' } });

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Form is mot found');
    }
    fireEvent.submit(form);

    await waitFor(() => {
      expect(searchSpy).toHaveBeenCalledWith('test');
    });
  });
});
