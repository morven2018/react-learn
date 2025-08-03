import NotFoundPage from '@pages/not-found/not-found';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockUseNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockUseNavigate,
}));

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockUseNavigate.mockClear();
  });

  it('render heading', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('This page doesn’t exist.')).toBeInTheDocument();
  });

  it('render a Home button', () => {
    render(<NotFoundPage />);
    const button = screen.getByText('Home');
    expect(button).toBeInTheDocument();
  });

  it('navigate to home page on button is click', () => {
    render(<NotFoundPage />);

    const button = screen.getByText('Home');
    fireEvent.click(button);

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith('/');
  });
});
