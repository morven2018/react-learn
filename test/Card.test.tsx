import Card from '@components/ui/character-list/Card';
import type { Person } from '@shared/types/responseTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { vi } from 'vitest';

describe('Card Component', () => {
  const mockCharacter: Person = {
    _id: '123',
    name: 'Aragorn',
    wikiUrl: 'https://lotr.fandom.com/wiki/Aragorn',
    race: '',
    gender: '',
    birth: '',
    death: '',
    realm: '',
    height: '',
    hair: '',
    spouse: '',
  };

  const mockCharacterNoWikiUrl: Person = {
    _id: '',
    name: 'Gothmog',
    wikiUrl: '',
    race: '',
    gender: '',
    birth: '',
    death: '',
    realm: '',
    height: '',
    hair: '',
    spouse: '',
  };

  beforeAll(() => {
    vi.mock('@components/ui/character-list/CharacterCharacteristics', () => ({
      default: vi.fn(() => <div data-testid="characteristics" />),
    }));
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  const renderCard = (character: Person) => {
    return render(
      <MemoryRouter>
        <Card character={character} />
      </MemoryRouter>
    );
  };

  it('renders character name', () => {
    renderCard(mockCharacter);
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
  });

  it('renders an active wiki link if wikiUrl exists', () => {
    renderCard(mockCharacter);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockCharacter.wikiUrl);
    expect(link).toHaveAttribute('aria-disabled', 'false');
    expect(link).toHaveTextContent('See More Info');
  });

  it('renders a disabled link if wikiUrl is missing', () => {
    renderCard(mockCharacterNoWikiUrl);

    const link = screen.getByText('See More Info').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call preventDefault when wikiUrl is empty', () => {
    renderCard(mockCharacterNoWikiUrl);

    const link = screen.getByText('See More Info');
    const preventDefault = vi.fn();

    fireEvent.click(link, { preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(0);
  });

  it('should not call preventDefault when wikiUrl exists', () => {
    renderCard(mockCharacter);

    const link = screen.getByRole('link', { name: /see more info/i });
    const preventDefault = vi.fn();

    fireEvent.click(link, { preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });
  it('navigates to character details when card is clicked', () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <Card character={mockCharacter} />
      </Router>
    );

    const cardButton = screen.getByRole('button');
    fireEvent.click(cardButton);

    expect(history.location.search).toContain('details=123');
  });
});
