import { RefreshButton } from '@components/ui/refresh-button/refresh-button';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('RefreshButton', () => {
  it('render correctly', () => {
    const mockRefresh = vi.fn();
    render(<RefreshButton onRefresh={mockRefresh} isLoading={false} />);

    expect(
      screen.getByRole('button', { name: /refresh/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('call onRefresh on click', async () => {
    const mockRefresh = vi.fn();
    render(<RefreshButton onRefresh={mockRefresh} isLoading={false} />);

    fireEvent.click(screen.getByText('Refresh'));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
