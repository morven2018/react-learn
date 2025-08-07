import CharacterCharacteristics from '@components/ui/character-list/CharacterCharacteristics';
import type { Person } from '@shared/types/responseTypes';
import { render, screen } from '@testing-library/react';

describe('CharacterCharacteristics', () => {
  const mockCharacter: Person = {
    _id: '',
    name: '',
    wikiUrl: '',
    race: 'Elf',
    gender: 'Male',
    birth: 'TA 100',
    death: 'TA 300',
    realm: 'Rivendell',
    height: '',
    hair: '',
    spouse: '',
  };

  it('renders all available characteristics', () => {
    render(<CharacterCharacteristics character={mockCharacter} />);

    expect(screen.getByText('Race:')).toBeInTheDocument();
    expect(screen.getByText('Elf')).toBeInTheDocument();

    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();

    expect(screen.getByText('Birth:')).toBeInTheDocument();
    expect(screen.getByText('TA 100')).toBeInTheDocument();

    expect(screen.getByText('Death:')).toBeInTheDocument();
    expect(screen.getByText('TA 300')).toBeInTheDocument();

    expect(screen.getByText('Realm:')).toBeInTheDocument();
    expect(screen.getByText('Rivendell')).toBeInTheDocument();
  });

  it('shows "unknown" for missing fields', () => {
    const incompleteCharacter: Person = {
      _id: '',
      name: '',
      wikiUrl: '',
      race: 'Human',
      gender: null,
      birth: ' ',
      death: 'TA 500',
      realm: ' ',
      height: '',
      hair: '',
      spouse: '',
    };

    render(<CharacterCharacteristics character={incompleteCharacter} />);

    expect(screen.getByText('Race:')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();

    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});
