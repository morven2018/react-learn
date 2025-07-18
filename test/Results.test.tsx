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
describe('Results Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render loading state', () => {
    render(<Results characters={[]} isLoading={true} isFetchingMore={false} />);
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('show empty message after loading with no data', async () => {
    const { rerender } = render(
      <Results characters={[]} isLoading={true} isFetchingMore={false} />
    );

    await act(async () => {
      rerender(
        <Results characters={[]} isLoading={false} isFetchingMore={false} />
      );
    });

    expect(screen.getByText('No data found')).toBeInTheDocument();
    expect(screen.queryByTestId('card-list')).not.toBeInTheDocument();
  });

  it('display characters after loading finish', async () => {
    const { rerender } = render(
      <Results characters={[]} isLoading={true} isFetchingMore={false} />
    );

    await act(async () => {
      rerender(
        <Results
          characters={mockCharacters}
          isLoading={false}
          isFetchingMore={false}
        />
      );
    });

    expect(screen.getByTestId('card-list')).toBeInTheDocument();
    expect(screen.getByText('person1')).toBeInTheDocument();
    expect(screen.getByText('person2')).toBeInTheDocument();
  });

  it('reset content on new search start', async () => {
    const { rerender } = render(
      <Results
        characters={mockCharacters}
        isLoading={false}
        isFetchingMore={false}
      />
    );

    await act(async () => {
      rerender(
        <Results
          characters={mockCharacters}
          isLoading={true}
          isFetchingMore={false}
        />
      );
    });

    expect(screen.queryByText('person1')).not.toBeInTheDocument();
    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });
});
