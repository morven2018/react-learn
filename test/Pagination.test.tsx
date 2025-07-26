import Pagination from '@components/ui/pagination/Pagination';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  const baseProps = {
    currentPage: 3,
    totalPages: 10,
    isLoading: false,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination {...baseProps} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('render correct page buttons with maxVisiblePages', () => {
    render(<Pagination {...baseProps} maxVisiblePages={5} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('renders ellipsis when needed', () => {
    render(<Pagination {...baseProps} currentPage={5} maxVisiblePages={3} />);
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('call onPageChange with correct page number', () => {
    render(<Pagination {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: '4' }));

    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('disable prev button on first page', () => {
    render(<Pagination {...baseProps} currentPage={1} />);
    expect(screen.getByRole('button', { name: '<' })).toBeDisabled();
  });

  it('disable next button on last page', () => {
    render(<Pagination {...baseProps} currentPage={10} />);
    expect(screen.getByRole('button', { name: '>' })).toBeDisabled();
  });
});
