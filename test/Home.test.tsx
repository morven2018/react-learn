import Home from '@pages/home/Home';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  characterApi,
  useSearchCharactersQuery,
} from '@services/api/character-api';

const mockApiResponse = {
  data: {
    docs: Array(10).fill({ id: '1', name: 'Character' }),
    total: 10,
    limit: 10,
    page: 1,
    pages: 5,
  },
  state: 'success',
};

vi.mock('@services/api/characterApi', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@services/api/character-api')>();
  return {
    ...actual,
    useSearchCharactersQuery: vi.fn(() => ({
      data: mockApiResponse.data,
      state: mockApiResponse.state,
      isLoading: false,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    })),
  };
});

vi.mock('@components/layout/search/search-with-ref', () => ({
  default: ({
    onSearch,
    initialSearchTerm,
  }: {
    onSearch: (term: string) => void;
    initialSearchTerm: string;
  }) => (
    <div>
      <span>Initial search: {initialSearchTerm}</span>
      <button onClick={() => onSearch('test')}>Search</button>
    </div>
  ),
}));

vi.mock('@components/layout/results/Results', () => ({
  default: () => <div>Results</div>,
}));

vi.mock('@components/ui/pagination/Pagination', () => ({
  default: ({
    onPageChange,
    currentPage,
    totalPages,
  }: {
    onPageChange: (page: number) => void;
    currentPage: number;
    totalPages: number;
  }) => (
    <div data-testid="pagination">
      <button
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={`Page ${currentPage + 1} of ${totalPages}`}
      >
        Page {currentPage + 1} of {totalPages}
      </button>
    </div>
  ),
}));

vi.mock('@components/hooks/use-restore-search-term', () => ({
  useRestoreSearchTerm: () => ({
    termValue: '',
    updateTermValue: vi.fn(),
  }),
}));

vi.mock('@components/ui/loading-overlay/loading-overlay', () => ({
  default: ({ visible }: { visible: boolean }) =>
    visible ? <div>Loading...</div> : null,
}));

vi.mock('@components/ui/flyout/Flyout', () => ({
  Flyout: () => <div>Flyout</div>,
}));

describe('Home Component', () => {
  const mockStore = configureStore({
    reducer: {
      characters: () => ({
        selectedCharacters: [],
      }),
      [characterApi.reducerPath]: characterApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(characterApi.middleware),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={initialEntries}>
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
      expect(screen.getByText('Initial search:')).toBeInTheDocument();
    });
  });

  it('handle search', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
      expect(screen.getByText('Results')).toBeInTheDocument();
    });
  });

  it('show loading overlay on loading', async () => {
    vi.doMock('@services/api/characterApi', () => ({
      useSearchCharactersQuery: vi.fn().mockReturnValue({
        data: undefined,
        isFetching: true,
      }),
    }));
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('show flyout if the character selected', async () => {
    const storeWithSelectedChars = configureStore({
      reducer: {
        characters: () => ({
          selectedCharacters: [{ id: '1', name: 'Character 1' }],
        }),
        [characterApi.reducerPath]: characterApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false,
        }).concat(characterApi.middleware),
    });

    render(
      <Provider store={storeWithSelectedChars}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="*" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Flyout')).toBeInTheDocument();
    });
  });
});
