import App from 'src/App';
import apiService from '@services/api/apiService';
import { Term } from '@services/localStorage/LastTerm';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@components/layout/header/Header', () => ({
  default: () => <header>Header</header>,
}));

vi.mock('@components/layout/main/Main', () => ({
  default: vi.fn().mockImplementation(() => {
    const savedTerm = Term.getTermFromLS();
    if (savedTerm) {
      apiService.searchCharacters(savedTerm);
    }
    return <main>Main</main>;
  }),
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
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains Header and Main components', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('load search term from localStorage and trigger search on mount', async () => {
    const mockSearchTerm = 'elf';
    vi.spyOn(Term, 'getTermFromLS').mockReturnValue(mockSearchTerm);
    const apiSpy = vi.spyOn(apiService, 'searchCharacters');

    render(<App />);

    await waitFor(() => {
      expect(Term.getTermFromLS).toHaveBeenCalled();
      expect(apiSpy).toHaveBeenCalledWith(mockSearchTerm);
    });
  });
});
