import Results from '@components/layout/results/Results';
import type { Person } from '@shared/types/responseTypes';
import { act, render, screen } from '@testing-library/react';
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

const mockCharacters: Person[] = [
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

const renderResults = (props: {
  characters: Person[];
  isLoading: boolean;
  isFetchingMore: boolean;
}) => render(<Results {...props} />);

const rerenderResults = (
  rerender: (element: React.ReactElement) => void,
  props: {
    characters: Person[];
    isLoading: boolean;
    isFetchingMore: boolean;
  }
) => {
  act(() => {
    rerender(<Results {...props} />);
  });
};

describe('Results Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render loading state', () => {
    renderResults({ characters: [], isLoading: true, isFetchingMore: false });
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('show empty message after loading with no data', async () => {
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

    expect(screen.getByText('No data found')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('display characters after loading finish', async () => {
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

    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByText('person1')).toBeInTheDocument();
    expect(screen.getByText('person2')).toBeInTheDocument();
  });

  it('reset content on new search start', async () => {
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

    expect(screen.queryByText('person1')).not.toBeInTheDocument();
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  it('show empty state on API error. Return no data', async () => {
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

    expect(screen.getByText('No data found')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('preserve data when subsequent loading fails', async () => {
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

    expect(screen.getByText('person1')).toBeInTheDocument();
  });
});
