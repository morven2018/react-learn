import ThemeProvider from '@context/theme-provider';
import { ThemeContext } from '@context/theme-context';
import { useTheme } from '@context/use-theme';
import { Term } from '@services/localStorage/LSService';
import { Themes } from '@shared/types/responseTypes';
import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('ThemeContext', () => {
  const TestComponent = () => {
    const context = useContext(ThemeContext);
    return <div>{context.theme}</div>;
  };

  it('provide default values', () => {
    const mockTheme = Themes.light;
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
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue(Themes.dark);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe(Themes.dark);
  });

  it('should provide light theme if set in LS', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue(Themes.light);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe(Themes.light);
  });

  it('toggle theme on toggleTheme call', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue(Themes.light);
    const setThemeMock = vi.spyOn(Term, 'setThemeToLS');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe(Themes.light);

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(screen.getByTestId('theme').textContent).toBe(Themes.dark);
    expect(setThemeMock).toHaveBeenCalledWith(Themes.dark);

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(screen.getByTestId('theme').textContent).toBe(Themes.light);
    expect(setThemeMock).toHaveBeenCalledWith(Themes.light);
  });

  it('update attribute on theme change', () => {
    vi.spyOn(Term, 'getThemeFromLS').mockReturnValue(Themes.light);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      Themes.light
    );

    fireEvent.click(screen.getByText('Toggle Theme'));

    expect(document.documentElement.getAttribute('data-theme')).toBe(
      Themes.dark
    );
  });
});
