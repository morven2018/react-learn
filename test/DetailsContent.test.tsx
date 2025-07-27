import DetailsContent from '@components/layout/detail-view/DetailContent';
import type { Person } from '@shared/types/responseTypes';
import { render, screen } from '@testing-library/react';

describe('DetailsContent', () => {
  const mockCharacter: Person = {
    _id: '123',
    name: 'Aragorn',
    wikiUrl: 'https://lotr.fandom.com/wiki/Aragorn',
    race: 'Human',
    gender: 'Male',
    birth: 'TA 2931',
    death: 'FO 120',
    realm: 'Gondor, Arnor',
    height: '6\'6"',
    hair: 'Dark',
    spouse: 'Arwen',
  };

  it('render nothing if character == null.', () => {
    const { container } = render(
      <DetailsContent character={null} isLoading={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('show loading state', () => {
    render(<DetailsContent character={mockCharacter} isLoading={true} />);
    expect(screen.getByText('Loading details...')).toBeInTheDocument();
  });

  it('render character name and wiki link', () => {
    render(<DetailsContent character={mockCharacter} isLoading={false} />);

    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    const wikiLink = screen.getByText(/see more information/i);
    expect(wikiLink).toBeInTheDocument();
    expect(wikiLink).toHaveAttribute('href', mockCharacter.wikiUrl);
    expect(wikiLink).toHaveAttribute('target', '_blank');
    expect(wikiLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('disable wiki-link if no url', () => {
    const characterWithoutWiki = { ...mockCharacter, wikiUrl: '' };
    render(
      <DetailsContent character={characterWithoutWiki} isLoading={false} />
    );

    const link = screen.getByText(/see more information/i);
    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('render all characters values', () => {
    render(<DetailsContent character={mockCharacter} isLoading={false} />);

    expect(screen.getByText('Race:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.race!)).toBeInTheDocument();
    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.gender!)).toBeInTheDocument();
    expect(screen.getByText('Birth:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.birth!)).toBeInTheDocument();
    expect(screen.getByText('Death:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.death!)).toBeInTheDocument();
    expect(screen.getByText('Hair:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.hair!)).toBeInTheDocument();
    expect(screen.getByText('Height:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.height!)).toBeInTheDocument();
    expect(screen.getByText('Realm:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.realm!)).toBeInTheDocument();
    expect(screen.getByText('Spouse:')).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.spouse!)).toBeInTheDocument();
  });

  it('filter characteristic with no values', () => {
    const characterWithEmptyFields = {
      ...mockCharacter,
      hair: '',
      realm: 'NaN',
      spouse: null,
    };

    render(
      <DetailsContent character={characterWithEmptyFields} isLoading={false} />
    );

    expect(screen.queryByText('Hair:')).not.toBeInTheDocument();
    expect(screen.queryByText('Realm:')).not.toBeInTheDocument();
    expect(screen.queryByText('Spouse:')).not.toBeInTheDocument();
  });

  it('show "No details" if all field with no values', () => {
    const emptyCharacter = {
      _id: '123',
      name: 'Unknown',
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

    render(<DetailsContent character={emptyCharacter} isLoading={false} />);
    expect(
      screen.getByText('No additional details available')
    ).toBeInTheDocument();
  });
});
