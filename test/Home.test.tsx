import Main from 'src/pages/home/Home';
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
      {
        _id: '',
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
});
