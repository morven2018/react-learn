import Main from '@components/layout/main/Main';
import type { Person } from '@shared/types/responseTypes';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@components/layout/search/Search', () => ({
  default: vi.fn().mockImplementation(({ onSearchResults }) => {
    window.__TEST_SEARCH_PROPS__ = { onSearchResults };
    return <div>Search Component</div>;
  }),
}));

vi.mock('@components/layout/results/Results', () => ({
  default: vi.fn().mockImplementation(({ characters }) => (
    <div>
      Results Component - <span>{characters.length} characters</span>
    </div>
  )),
}));

vi.mock('@components/ui/error-button/ErrorTestButton', () => ({
  default: vi.fn().mockReturnValue(<button>Test Error Button</button>),
}));

declare global {
  interface Window {
    __TEST_SEARCH_PROPS__?: {
      onSearchResults: (results: Person[], isNewSearch: boolean) => void;
    };
  }
}

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.__TEST_SEARCH_PROPS__;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('render correctly all child components', () => {
    render(<Main />);

    expect(screen.getByText('Search Component')).toBeInTheDocument();
    expect(screen.getByText(/Results Component/)).toBeInTheDocument();
    expect(screen.getByText('Test Error Button')).toBeInTheDocument();
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('update state on receive search results', () => {
    render(<Main />);

    const searchProps = window.__TEST_SEARCH_PROPS__;
    if (!searchProps) {
      throw new Error('Search props not found');
    }

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

    act(() => {
      searchProps.onSearchResults(testResults, true);
    });

    expect(screen.getByText('2 characters')).toBeInTheDocument();
  });
});
