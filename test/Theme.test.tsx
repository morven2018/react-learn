import ThemeProvider from 'src/context/ThemeProvider';
import { Term } from '@services/localStorage/LSService';
import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { ThemeContext } from 'src/context/ThemeContext';
import { useTheme } from 'src/context/useTheme';
import { describe, expect, it, vi } from 'vitest';

describe('ThemeContext', () => {
  const TestComponent = () => {
    const context = useContext(ThemeContext);
    return <div>{context.theme}</div>;
  };

  it('provide default values', () => {
    const mockTheme = 'light';
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue(mockTheme);

    const { container } = render(
      <ThemeContext.Provider
        value={{ theme: mockTheme, toggleTheme: () => {} }}
      >
        <TestComponent />
      </ThemeContext.Provider>
    );

    expect(container.textContent).toBe(mockTheme);
  });
});

describe('ThemeProvider', () => {
  const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
      <div>
        <span data-testid="theme">{theme}</span>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provide dark theme by default', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('should provide light theme if set in LS', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('toggle theme on toggleTheme call', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue('light');
    const setThemeMock = vi.spyOn(Term, 'setThemeToLS');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('light');

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(setThemeMock).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('update attribute on theme change', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
