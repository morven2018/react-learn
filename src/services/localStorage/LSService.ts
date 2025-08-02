enum StoredTerm {
  LastSearch = 'lastSearchTerm',
  Theme = 'userTheme',
  SelectedCharacters = 'selectedCharacters',
}

export type Themes = 'dark' | 'light';

export class Term {
  public static getTermFromLS(): string | undefined {
    return localStorage.getItem(StoredTerm.LastSearch) ?? undefined;
  }

  public static setTermToLS(newTerm: string): void {
    localStorage.setItem(StoredTerm.LastSearch, newTerm);
  }

  public static getThemeFromLS(): Themes {
    return localStorage.getItem(StoredTerm.Theme) === 'light'
      ? 'light'
      : 'dark';
  }

  public static setThemeToLS(theme: Themes = 'dark'): void {
    localStorage.setItem(StoredTerm.Theme, theme);
  }

  public static setSelectedToLS(selected: string[]): void {
    localStorage.setItem(
      StoredTerm.SelectedCharacters,
      JSON.stringify(selected)
    );
  }

  public static getSelectedFromLS(): string[] {
    const saved = localStorage.getItem(StoredTerm.SelectedCharacters);
    return saved ? JSON.parse(saved) : [];
  }
}
