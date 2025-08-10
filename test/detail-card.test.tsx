import DetailsContent from '@components/layout/detail-view/detail-content';
import userEvent from '@testing-library/user-event';
import { DetailCard } from '@components/layout/detail-view/detail-card';
import { useGetCharacterByIdQuery } from '@services/api/characterApi';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@services/api/characterApi', () => ({
  useGetCharacterByIdQuery: vi.fn().mockReturnValue({
    data: null,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('@components/hooks/use-character-details', () => ({
  useCharacterDetails: vi.fn(),
}));

vi.mock('@components/layout/detail-view/detail-content', () => ({
  default: vi.fn(() => <div>DetailsContent Mock</div>),
}));

describe('DetailCard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(DetailsContent).mockClear();
  });
  it('render with title and close button', () => {
    render(<DetailCard id="123" onClose={mockOnClose} />);

    expect(screen.getByText('Character Details')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /close details/i })
    ).toBeInTheDocument();
  });

  it('call onClose on close button is click', async () => {
    render(<DetailCard id="123" onClose={mockOnClose} />);

    await userEvent.click(
      screen.getByRole('button', { name: /close details/i })
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('pass correct id to useCharacterDetails', () => {
    render(<DetailCard id="123" onClose={mockOnClose} />);
    expect(useGetCharacterByIdQuery).toHaveBeenCalledWith('123', {
      skip: false,
    });
  });

  it('handle empty id', () => {
    render(<DetailCard id="" onClose={mockOnClose} />);
    expect(useGetCharacterByIdQuery).toHaveBeenCalledWith('', {
      skip: true,
    });
  });
});
