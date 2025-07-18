import App from 'src/App';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('App Component', () => {
  it('renders  successfully', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('contains Header and Main components', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
