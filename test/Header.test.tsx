import Header from '@components/layout/header/header';
import { useTheme } from '@context/use-theme';
import { Themes } from '@shared/types/responseTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('src/context/use-theme', () => ({
  useTheme: vi.fn(() => ({
    theme: Themes.dark,
    toggleTheme: vi.fn(),
  })),
}));

vi.mock('@assets/logo/darkMode.svg', () => ({
  default: 'dark-mode-icon',
}));

vi.mock('@assets/logo/lightMode.svg', () => ({
  default: 'light-mode-icon',
}));

vi.mock('@assets/images/image.png', () => ({
  default: 'logo-dark',
}));

vi.mock('@assets/images/imageL.png', () => ({
  default: 'logo-light',
}));

describe('Header Component', () => {
  it('renders image, title and subtitle', () => {
    render(<Header />);

    const image = screen.getByAltText('White tree');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'logo-dark');

    expect(screen.getByText('Middle Earth')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('render dark theme ин default', () => {
    render(<Header />);

    const themeToggle = screen.getByRole('button');
    const themeIcon = screen.getByAltText('Toggle to light theme');

    expect(themeToggle).toBeInTheDocument();
    expect(themeIcon).toHaveAttribute('src', 'light-mode-icon');
  });

  it('call toggleTheme on button click', () => {
    const mockToggleTheme = vi.fn();
    vi.mocked(useTheme).mockImplementation(() => ({
      theme: Themes.dark,
      toggleTheme: mockToggleTheme,
    }));

    render(<Header />);
    const themeButton = screen.getByRole('button');

    fireEvent.click(themeButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('display light theme icon when theme is light', () => {
    vi.mocked(useTheme).mockImplementation(() => ({
      theme: Themes.light,
      toggleTheme: vi.fn(),
    }));

    render(<Header />);

    const themeIcon = screen.getByAltText('Toggle to dark theme');
    expect(themeIcon).toHaveAttribute('src', 'dark-mode-icon');

    const logo = screen.getByAltText('White tree');
    expect(logo).toHaveAttribute('src', 'logo-light');
  });
});
