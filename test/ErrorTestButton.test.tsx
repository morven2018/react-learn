import CharacterApiService from '@services/api/apiService';
import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import { render, screen } from '@testing-library/react';
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

  it('call Api method on click', async () => {
    await expect(CharacterApiService.triggerTestError()).rejects.toThrow(
      'Test error'
    );

    try {
      await CharacterApiService.triggerTestError();
      fail('Error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
