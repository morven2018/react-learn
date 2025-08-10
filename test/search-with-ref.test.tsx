import React from 'react';
import SearchWithRef, {
  type SearchHandle,
} from '@components/layout/search/search-with-ref';
import { act, render } from '@testing-library/react';
import { vi } from 'vitest';

const DEFAULT_INITIAL_VALUE = '';

vi.mock('@components/layout/search/Search', () => {
  return {
    default: vi
      .fn()
      .mockImplementation(
        ({
          ref,
          onSearch,
          initialSearchTerm,
        }: {
          ref: React.RefObject<SearchHandle>;
          onSearch: (term: string) => void;
          initialSearchTerm?: string;
        }) => {
          let currentValue = initialSearchTerm ?? DEFAULT_INITIAL_VALUE;

          const mockHandle: SearchHandle = {
            handleSearch: vi.fn((term?: string) => {
              onSearch(term ?? currentValue);
              return Promise.resolve();
            }),
            getCurrentValue: vi.fn(() => currentValue),
            setInputValue: vi.fn((value: string) => {
              currentValue = value;
            }),
            isLoading: false,
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
    initialSearchTerm: DEFAULT_INITIAL_VALUE,
    isLoading: false,
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
    expect(value).toBe(DEFAULT_INITIAL_VALUE);
  });

  it('forwards setInputValue call to Search component', async () => {
    const ref = React.createRef<SearchHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    const newValue = 'new value';
    await act(async () => {
      ref.current?.setInputValue(newValue);
    });

    const value = ref.current?.getCurrentValue();
    expect(value).toBe(newValue);
  });

  it('handles undefined term in handleSearch', async () => {
    const ref = React.createRef<SearchHandle>();

    await act(async () => {
      render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    await act(async () => {
      await ref.current?.handleSearch();
    });

    expect(mockProps.onSearch).toHaveBeenCalledWith(DEFAULT_INITIAL_VALUE);
  });

  it('updates input value when initialSearchTerm changes', async () => {
    const ref = React.createRef<SearchHandle>();
    const { rerender } = await act(async () => {
      return render(<SearchWithRef {...mockProps} ref={ref} />);
    });

    const newInitialValue = 'updated initial';
    await act(async () => {
      rerender(
        <SearchWithRef
          {...mockProps}
          initialSearchTerm={newInitialValue}
          ref={ref}
        />
      );
    });

    const value = ref.current?.getCurrentValue();
    expect(value).toBe(newInitialValue);
  });
});
