import Results from '@components/layout/results/Results';
import type { Person } from '@shared/types/responseTypes';
import { act, render, screen, type RenderResult } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@components/ui/character-list/CardList', () => ({
  default: ({ characters }: { characters: Person[] }) => (
    <div data-testid="card-list">
      {characters.map((char) => (
        <div key={char.name}>{char.name}</div>
      ))}
    </div>
  ),
}));

const createMockPerson = (name: string): Person => ({
  _id: '',
  name,
  wikiUrl: '',
  race: '',
  gender: '',
  birth: '',
  death: '',
  realm: '',
  height: '',
  hair: '',
  spouse: '',
});

const mockCharacters = [
  createMockPerson('person1'),
  createMockPerson('person2'),
];

const renderResults = (props: {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
}): RenderResult => {
  return render(<Results {...props} />);
};

const rerenderResults = (
  rerender: (ui: React.ReactElement) => void,
  props: {
    characters: Person[];
    isLoading: boolean;
    isFetchingMore: boolean;
  }
): void => {
  act(() => {
    rerender(<Results {...props} />);
  });
};

const expectLoadingState = () => {
  expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
};

const expectEmptyState = () => {
  expect(screen.getByText('No data found')).toBeInTheDocument();
  expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
};

const expectCharactersVisible = () => {
  expect(screen.getByTestId('card-list')).toBeInTheDocument();
  expect(screen.getByText('person1')).toBeInTheDocument();
  expect(screen.getByText('person2')).toBeInTheDocument();
};

describe('Results Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    renderResults({ characters: [], isLoading: true, isFetchingMore: false });
    expectLoadingState();
  });

  it('show empty message after loading with no data', () => {
    const { rerender } = renderResults({
      characters: [],
      isLoading: true,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: [],
      isLoading: false,
      isFetchingMore: false,
    });
    expectEmptyState();
  });

  it('display characters after loading finish', () => {
    const { rerender } = renderResults({
      characters: [],
      isLoading: true,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: mockCharacters,
      isLoading: false,
      isFetchingMore: false,
    });
    expectCharactersVisible();
  });

  it('reset content on new search start', () => {
    const { rerender } = renderResults({
      characters: mockCharacters,
      isLoading: false,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: mockCharacters,
      isLoading: true,
      isFetchingMore: false,
    });
    expectLoadingState();
  });

  it('show empty state on API error. Return no data', () => {
    const { rerender } = renderResults({
      characters: [],
      isLoading: true,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: [],
      isLoading: false,
      isFetchingMore: false,
    });
    expectEmptyState();
  });

  it('preserve data when subsequent loading fails', () => {
    const { rerender } = renderResults({
      characters: mockCharacters,
      isLoading: false,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: mockCharacters,
      isLoading: true,
      isFetchingMore: false,
    });
    rerenderResults(rerender, {
      characters: mockCharacters,
      isLoading: false,
      isFetchingMore: false,
    });
    expectCharactersVisible();
  });
});
