import Header from '@components/layout/header/Header';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Header Component', () => {
  it('renders image, title and subtitle', () => {
    render(<Header />);

    const image = screen.getByAltText('White tree');
    expect(image).toBeInTheDocument();

    expect(screen.getByText('Middle Earth')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });
});
