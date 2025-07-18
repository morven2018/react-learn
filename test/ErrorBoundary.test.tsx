import ErrorBoundary from '@components/common/ErrorBoundary';
import apiService from '@services/api/apiService';
import { vi } from 'vitest';

import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';

const ErrorThrowingComponent = () => {
  throw new Error('Test error');
};

const PromiseRejectingComponent = () => {
  (async () => {
    try {
      await apiService.triggerTestError();
    } catch (e) {
      if (e instanceof Error) console.error('API error caught:', e.message);
    }
  })();

  return <div>Child component</div>;
};

const GoodComponent = () => <div>Good content</div>;

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.mock('@services/api/apiService', () => ({
    default: {
      triggerTestError: vi.fn(() => Promise.reject(new Error('API error'))),
    },
  }));
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render child components if no error has appear', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Good content')).toBeInTheDocument();
  });

  it('catch errors in child components and display fallback UI', () => {
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('handle API errors and log them', async () => {
    render(
      <ErrorBoundary>
        <PromiseRejectingComponent />
      </ErrorBoundary>
    );
    await waitFor(() => {
      expect(apiService.triggerTestError).toHaveBeenCalled();
    });
  });

  it('use custom fallback, if it exists', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
  });

  describe('retry button', () => {
    it('recover from error on click Retry button', async () => {
      const Component = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
        if (shouldThrow) throw new Error('Test error');
        return <div>Recovered content</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <Component shouldThrow={true} />
        </ErrorBoundary>
      );

      await act(async () => {
        fireEvent.click(screen.getByText('Retry'));
        rerender(
          <ErrorBoundary>
            <Component shouldThrow={false} />
          </ErrorBoundary>
        );
      });

      expect(await screen.findByText('Recovered content')).toBeInTheDocument();
    });
  });
});
