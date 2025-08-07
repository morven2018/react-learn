import DetailsContent from '@components/layout/detailView/DetailContent';
import userEvent from '@testing-library/user-event';
import { useCharacterDetails } from '@components/hooks/useCharacterDetails';
import { DetailCard } from '@components/layout/detailView/DetailCard';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@components/hooks/useCharacterDetails', () => ({
  useCharacterDetails: vi.fn(),
}));

vi.mock('@components/layout/detailView/DetailContent', () => ({
  default: vi.fn(() => <div>DetailsContent Mock</div>),
}));

describe('DetailCard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCharacterDetails).mockReturnValue({
      data: null,
      isLoading: false,
    });
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
    expect(useCharacterDetails).toHaveBeenCalledWith('123');
  });

  it('handle empty id', () => {
    render(<DetailCard id="" onClose={mockOnClose} />);
    expect(useCharacterDetails).toHaveBeenCalledWith('');
  });
});
