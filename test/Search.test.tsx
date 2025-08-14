import Search from '@components/layout/search/Search';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@components/ui/loading-overlay/loading-overlay', () => ({
  default: vi.fn(() => <div data-testid="loading-overlay" />),
}));

describe('Search Component', () => {
  const mockOnSearch = vi.fn();
  const initialSearchTerm = 'initial value';

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSearch.mockResolvedValue(undefined);
  });

  it('render correctly', () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);

    expect(
      screen.getByPlaceholderText('Search characters...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('initializes with provided search term', () => {
    render(
      <Search
        onSearch={mockOnSearch}
        initialSearchTerm={initialSearchTerm}
        isLoading={false}
      />
    );

    expect(screen.getByDisplayValue(initialSearchTerm)).toBeInTheDocument();
  });

  it('update input value when typing', () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Search characters...');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');
  });

  it('trigger search on form submission', async () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Search characters...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('show loading state during search', async () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Search characters...');
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Searching...' })
      ).not.toBeInTheDocument();
    });
  });

  it('handle search with empty term', async () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  it('maintain button disabled state during search', async () => {
    render(<Search onSearch={mockOnSearch} isLoading={false} />);
    const button = screen.getByRole('button', { name: 'Search' });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
