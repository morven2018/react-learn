import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@services/api/apiService', () => ({
  default: {
    triggerTestError: vi.fn(() => Promise.reject(new Error('Test error'))),
  },
}));

describe('ErrorTestButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ErrorTestButton />);
    expect(screen.getByText('Generate Error')).toBeInTheDocument();
  });

  it('call Aoi method on click', async () => {
    render(<ErrorTestButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Generate Error' }));

    await waitFor(() => {
      expect(CharacterApiService.triggerTestError).toHaveBeenCalledTimes(1);
    });
  });
});
