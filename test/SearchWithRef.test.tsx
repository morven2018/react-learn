import React from 'react';
import SearchWithRef from '@components/layout/search/SearchWithRef';
import { act, render } from '@testing-library/react';
import { vi } from 'vitest';

interface SearchHandle {
  handleSearch: (term?: string) => Promise<void>;
  getCurrentValue: () => string;
}

vi.mock('@components/layout/search/Search', () => {
  return {
    default: vi
      .fn()
      .mockImplementation(
        ({
          ref,
          onSearch,
        }: {
          ref: React.RefObject<SearchHandle>;
          onSearch: (term: string) => void;
        }) => {
          const mockHandle: SearchHandle = {
            handleSearch: vi.fn((term?: string) => {
              onSearch(term || '');
              return Promise.resolve();
            }),
            getCurrentValue: vi.fn(() => 'initial'),
          };

          Object.defineProperty(ref, 'current', {
            value: mockHandle,
            writable: true,
          });

          return <div data-testid="mock-search" />;
        }
      ),
  };
});

describe('SearchWithRef', () => {
  const mockProps = {
    onSearch: vi.fn(),
    initialSearchTerm: 'initial',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forward handleSearch call to Search component', async () => {
    const ref = React.createRef<SearchHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    const testTerm = 'test';
    await act(async () => {
      await ref.current?.handleSearch(testTerm);
    });

    expect(mockProps.onSearch).toHaveBeenCalledWith(testTerm);
  });

  it('forwards getCurrentValue call to Search component', async () => {
    const ref = React.createRef<SearchHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    const value = ref.current?.getCurrentValue();
    expect(value).toBe('initial');
  });

  it('handle term', async () => {
    const ref = React.createRef<SearchHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    await act(async () => {
      await ref.current?.handleSearch();
    });

    expect(mockProps.onSearch).toHaveBeenCalledWith('');
  });
});
