import App from 'src/App';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@components/layout/header/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@pages/home/Home', () => ({
  default: vi.fn().mockImplementation(() => {
    return <main data-testid="main-content">Main Content</main>;
  }),
}));

vi.mock('@pages/about/about', () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('@pages/not-found/not-found', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock('@services/api/apiService', () => ({
  default: {
    searchCharacters: vi.fn().mockResolvedValue({ docs: [] }),
  },
}));

vi.mock('@services/localStorage/LSService', () => ({
  Term: {
    getTermFromLS: vi.fn(),
    setTermToLS: vi.fn(),
    getThemeFromLS: vi.fn().mockReturnValue('dark'),
    setThemeToLS: vi.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render successfully', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('contain Header and Main components on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('render About page on /about route', () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('render Not Found page on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
