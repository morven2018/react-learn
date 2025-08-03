import CardList from '@components/ui/character-list/card-list';
import { configureStore } from '@reduxjs/toolkit';
import type { Person } from '@shared/types/response-types';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: {
    characters: () => ({
      selectedCharacters: [],
    }),
  },
});

describe('CardList Component', () => {
  const mockCharacters: Person[] = [
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

  const renderCardList = (characters: Person[], isFetchingMore = false) => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <CardList characters={characters} isFetchingMore={isFetchingMore} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('render a list of characters (counts by h3)', () => {
    renderCardList(mockCharacters, false);

    const cardHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(cardHeadings).toHaveLength(mockCharacters.length);

    mockCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  it('render empty list if no characters', () => {
    render(<CardList characters={[]} isFetchingMore={false} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('show loading message when isFetchingMore is true', () => {
    renderCardList(mockCharacters, true);

    expect(screen.getByText('Loading more characters...')).toBeInTheDocument();
  });

  it('does not show loading message when isFetchingMore is false', () => {
    renderCardList(mockCharacters, false);

    expect(
      screen.queryByText('Loading more characters...')
    ).not.toBeInTheDocument();
  });
});
