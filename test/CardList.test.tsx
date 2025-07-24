import CardList from '@components/ui/character-list/CardList';
import type { Person } from '@shared/types/responseTypes';
import { render, screen } from '@testing-library/react';

describe('CardList Component', () => {
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

  it('renders a list of characters (counts by h3)', () => {
    render(<CardList characters={mockCharacters} isFetchingMore={false} />);

    const cardHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(cardHeadings).toHaveLength(mockCharacters.length);

    mockCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  it('renders empty list if no characters', () => {
    render(<CardList characters={[]} isFetchingMore={false} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('shows loading message when isFetchingMore is true', () => {
    render(<CardList characters={mockCharacters} isFetchingMore={true} />);

    expect(screen.getByText('Loading more characters...')).toBeInTheDocument();
  });

  it('does not show loading message when isFetchingMore is false', () => {
    render(<CardList characters={mockCharacters} isFetchingMore={false} />);

    expect(
      screen.queryByText('Loading more characters...')
    ).not.toBeInTheDocument();
  });
});
