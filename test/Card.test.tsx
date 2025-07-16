import Card from '@components/ui/character-list/Card';
import type { Person } from '@shared/types/responseTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('Card Component', () => {
  const mockCharacter: Person = {
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

  it('renders character name', () => {
    render(<Card character={mockCharacter} />);
    expect(screen.getByText('Aragorn')).toBeInTheDocument();
  });

  it('renders an active wiki link if wikiUrl exists', () => {
    render(<Card character={mockCharacter} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockCharacter.wikiUrl);
    expect(link).toHaveAttribute('aria-disabled', 'false');
    expect(link).toHaveTextContent('See More Info');
  });

  it('renders a disabled link if wikiUrl is missing', () => {
    render(<Card character={mockCharacterNoWikiUrl} />);

    screen.debug();

    const link = screen.getByText('See More Info').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call preventDefault when wikiUrl is empty', () => {
    render(<Card character={mockCharacterNoWikiUrl} />);

    const link = screen.getByText('See More Info');
    const preventDefault = vi.fn();

    fireEvent.click(link, { preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(0);
  });

  it('should not call preventDefault when wikiUrl exists', () => {
    render(<Card character={mockCharacter} />);

    const link = screen.getByRole('link', { name: /see more info/i });
    const preventDefault = vi.fn();

    fireEvent.click(link, { preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });
});
