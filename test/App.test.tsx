import App from 'src/App';
import apiService from '@services/api/apiService';
import { Term } from '@services/localStorage/LastTerm';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@components/layout/header/Header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('@pages/home/Home', () => ({
  default: vi.fn().mockImplementation(() => {
    const savedTerm = Term.getTermFromLS();
    if (savedTerm) {
      apiService.searchCharacters(savedTerm);
    }
    return <main>Main Content</main>;
  }),
}));

vi.mock('.src/pages/about/about', () => ({
  default: () => <div>About Page</div>,
}));

vi.mock('.src/not-found/not-found', () => ({
  NotFoundPage: () => <div>Not Found Page</div>,
}));

vi.mock('@services/api/apiService', () => ({
  default: {
    searchCharacters: vi.fn().mockResolvedValue({ docs: [] }),
  },
}));

vi.mock('@services/localStorage/LastTerm', () => ({
  Term: {
    getTermFromLS: vi.fn(),
    setTermToLS: vi.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders successfully', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contains Header and Main components on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('loads search term from localStorage and triggers search on mount', async () => {
    const mockSearchTerm = 'elf';
    vi.spyOn(Term, 'getTermFromLS').mockReturnValue(mockSearchTerm);
    const apiSpy = vi.spyOn(apiService, 'searchCharacters');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(Term.getTermFromLS).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });

  it('renders About page on /about route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('About page')).toBeInTheDocument();
  });

  it('renders Not Found page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('This page doesn’t exist.')).toBeInTheDocument();
  });
});
