import userEvent from '@testing-library/user-event';
import { ErrorMessage } from '@components/ui/error-message/error-message';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@components/ui/refresh-button/refresh-button', () => ({
  RefreshButton: vi.fn(({ onRefresh, isLoading }) => (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      data-testid="refresh-button"
    >
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </button>
  )),
}));

describe('ErrorMessage component', () => {
  it('render error message', () => {
    const testMessage = 'Test error message';
    render(<ErrorMessage message={testMessage} />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('refresh-button')).not.toBeInTheDocument();
  });

  it('render RefreshButton when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={mockRetry} />);

    const refreshButton = screen.getByTestId('refresh-button');
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveTextContent('Refresh');
  });

  it('pass isLoading prop to RefreshButton', () => {
    const mockRetry = vi.fn();
    render(
      <ErrorMessage message="Error" onRetry={mockRetry} isLoading={true} />
    );

    const refreshButton = screen.getByTestId('refresh-button');
    expect(refreshButton).toBeDisabled();
    expect(refreshButton).toHaveTextContent('Refreshing...');
  });

  it('call onRetry on RefreshButton click', async () => {
    const mockRetry = vi.fn();
    const { user } = setup(
      <ErrorMessage message="Error" onRetry={mockRetry} />
    );

    const refreshButton = screen.getByTestId('refresh-button');
    await user.click(refreshButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});

function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
