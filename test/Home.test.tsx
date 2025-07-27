import Home from '@pages/home/Home';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockSearchCharacters: ReturnType<typeof vi.fn>;
let mockUpdateTermValue: ReturnType<typeof vi.fn>;

vi.mock('@services/api/apiService', () => ({
  default: {
    searchCharacters: (term: string, page: number) =>
      mockSearchCharacters(term, page),
  },
}));

vi.mock('@components/hooks/useRestoreSearchTerm', () => ({
  useRestoreSearchTerm: () => ({
    termValue: '',
    updateTermValue: () => mockUpdateTermValue(),
  }),
}));

interface SearchWithRefProps {
  onSearch: (term: string) => void;
  initialSearchTerm?: string;
}

interface ResultsProps {
  characters?: { name: string }[];
}

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

vi.mock('@components/ui/search/SearchWithRef', () => ({
  default: ({ onSearch, initialSearchTerm }: SearchWithRefProps) => (
    <form data-testid="search-form">
      <input data-testid="search-input" defaultValue={initialSearchTerm} />
      <button onClick={() => onSearch('test')} data-testid="search-button">
        Search
      </button>
    </form>
  ),
}));

vi.mock('@components/layout/results/Results', () => ({
  default: ({ characters }: ResultsProps) => (
    <div data-testid="results-component">
      {characters?.length
        ? `Found ${characters.length} characters`
        : 'No characters found'}
    </div>
  ),
}));

vi.mock('@components/ui/pagination/Pagination', () => ({
  default: ({ currentPage, onPageChange }: PaginationProps) => (
    <div data-testid="pagination-component">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        data-testid="prev-button"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  ),
}));

describe('Home Component', () => {
  beforeEach(() => {
    mockSearchCharacters = vi.fn().mockResolvedValue({ docs: [], pages: 1 });
    mockUpdateTermValue = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = (initialRoute = '/') => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('render component Search', () => {
    setup();
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('load data from URL', async () => {
    mockSearchCharacters.mockImplementation((term: string, page: number) => {
      if (term === 'initialSearchTerm' && page === 2) {
        return Promise.resolve({
          docs: [{ name: 'Test Character' }],
          pages: 1,
        });
      }
      return Promise.resolve({ docs: [], pages: 1 });
    });
    setup('/?page=2');
  });

  it('should render Pagination component when there are pages', async () => {
    mockSearchCharacters.mockResolvedValue({
      docs: [{ name: 'Character 1' }, { name: 'Character 2' }],
      pages: 3,
    });

    setup('/?page=1');

    await waitFor(() => {
      expect(screen.getByTestId('pagination-component')).toBeInTheDocument();
      expect(screen.getByTestId('prev-button')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });
  });

  it('should pass correct page number to Pagination', async () => {
    mockSearchCharacters.mockResolvedValue({
      docs: [],
      pages: 5,
    });

    setup('/?page=3');

    await waitFor(() => {
      const prevButton = screen.getByTestId('prev-button');
      const nextButton = screen.getByTestId('next-button');

      fireEvent.click(prevButton);
      fireEvent.click(nextButton);

      expect(mockSearchCharacters).toHaveBeenCalledWith(expect.anything(), 3);
    });
  });
});
