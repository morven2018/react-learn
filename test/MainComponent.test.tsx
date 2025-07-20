import Main from '@components/layout/main/Main';
import type { Person } from '@shared/types/responseTypes';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

let mockOnSearchResults: (results: Person[], isNewSearch: boolean) => void;

vi.mock('@components/layout/search/Search', () => ({
  default: vi.fn().mockImplementation(({ onSearchResults }) => {
    mockOnSearchResults = onSearchResults;
    return <div>Search Component</div>;
  }),
}));

vi.mock('@components/layout/results/Results', () => ({
  default: vi.fn().mockImplementation(({ characters }) => (
    <div data-testid="results-mock">
      Results Component -{' '}
      <span data-testid="characters-count">{characters.length} characters</span>
    </div>
  )),
}));

vi.mock('@components/ui/error-button/ErrorTestButton', () => ({
  default: vi.fn().mockReturnValue(<button>Test Error Button</button>),
}));

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render all child components properly', () => {
    render(<Main />);

    expect(screen.getByText('Search Component')).toBeInTheDocument();
    expect(screen.getByTestId('results-mock')).toBeInTheDocument();
    expect(screen.getByText('Test Error Button')).toBeInTheDocument();
    expect(screen.getByTestId('characters-count')).toHaveTextContent(
      '0 characters'
    );
  });

  it('update state on receive search results', async () => {
    render(<Main />);

    const testResults: Person[] = [
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
      {
        name: 'person2',
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

    await act(async () => {
      mockOnSearchResults(testResults, true);
    });

    expect(screen.getByTestId('characters-count')).toHaveTextContent(
      '2 characters'
    );
  });

  it('handle lazy loading', async () => {
    render(<Main />);

    const initialResults: Person[] = Array(10)
      .fill(0)
      .map((_, i) => ({
        name: `person${i}`,
        wikiUrl: '',
        race: '',
        gender: '',
        birth: '',
        death: '',
        realm: '',
        height: '',
        hair: '',
        spouse: '',
      }));

    await act(async () => {
      mockOnSearchResults(initialResults, true);
    });

    expect(screen.getByTestId('characters-count')).toHaveTextContent(
      '10 characters'
    );

    Object.defineProperty(window, 'innerHeight', { value: 1000 });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 900,
    });
    Object.defineProperty(document.documentElement, 'offsetHeight', {
      value: 2000,
    });

    const newResults: Person[] = Array(10)
      .fill(0)
      .map((_, i) => ({
        name: `person${i + 10}`,
        wikiUrl: '',
        race: '',
        gender: '',
        birth: '',
        death: '',
        realm: '',
        height: '',
        hair: '',
        spouse: '',
      }));

    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      mockOnSearchResults(newResults, false);
    });

    expect(screen.getByTestId('characters-count')).toHaveTextContent(
      '20 characters'
    );
  });
});
