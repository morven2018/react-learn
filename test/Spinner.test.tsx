import Spinner from '@components/ui/loading-overlay/spinner/spinner';
import { render, screen } from '@testing-library/react';

describe('Spinner', () => {
  it('renders correctly', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<Spinner />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
