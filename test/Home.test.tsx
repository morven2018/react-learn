import Home, { getLoadingState } from '@pages/home/home';
import { configureStore } from '@reduxjs/toolkit';
import type { ApiResponse } from '@shared/types/response-types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiResponse: ApiResponse = {
  docs: [],
  total: 0,
  limit: 10,
  page: 1,
  pages: 1,
};

vi.mock('@services/api/characterApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@services/api/characterApi')>();
  return {
    ...actual,
    useSearchCharactersQuery: vi.fn(() => ({
      data: mockApiResponse,
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    })),
    useLazySearchCharactersQuery: () => [
      vi.fn().mockResolvedValue({ data: mockApiResponse }),
      { isFetching: false, data: mockApiResponse },
    ],
  };
});

vi.mock('@components/layout/search/search-with-ref', () => ({
  default: ({ onSearch }: { onSearch: (term: string) => void }) => (
    <button onClick={() => onSearch('test')}>Search</button>
  ),
}));

vi.mock('@components/layout/results/Results', () => ({
  default: () => <div>Results</div>,
}));

vi.mock('@components/ui/pagination/Pagination', () => ({
  default: ({ onPageChange }: { onPageChange: (page: number) => void }) => (
    <button onClick={() => onPageChange(1)}>Page 1</button>
  ),
}));

vi.mock('@components/hooks/use-restore-search-term', () => ({
  useRestoreSearchTerm: () => ({
    termValue: '',
    updateTermValue: vi.fn(),
  }),
}));

describe('Home Component', () => {
  const mockStore = configureStore({
    reducer: {
      characters: () => ({
        selectedCharacters: [],
      }),
      characterApi: () => ({}),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('render search component', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  it('handle search', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
    });
  });

  it('should handle pagination', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Page 1'));
    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
    });
  });
});

describe('getLoadingState', () => {
  it('return "loading" when isLoading is true', () => {
    const result = getLoadingState(true, false);
    expect(result).toBe('loading');
  });

  it('return "error" when isError is true', () => {
    const result1 = getLoadingState(false, true);
    expect(result1).toBe('error');
  });

  it('return "success" when neither isLoading nor isError is true', () => {
    const result = getLoadingState(false, false);
    expect(result).toBe('success');
  });
});
