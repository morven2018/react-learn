enum term {
  LastSearch = 'lastSearchTerm',
  Theme = 'userTheme',
}

export type Themes = 'dark' | 'light';

export class Term {
  public static getTermFromLS(): string | undefined {
    return localStorage.getItem(term.LastSearch) ?? undefined;
  }

  public static setTermToLS(newTerm: string): void {
    localStorage.setItem(term.LastSearch, newTerm);
  }

  public static getThemeFromLS(): Themes {
    return localStorage.getItem(term.Theme) ? 'light' : 'dark';
  }

  public static setThemeToLS(theme: Themes = 'dark'): void {
    localStorage.setItem(term.Theme, theme);
  }
}
