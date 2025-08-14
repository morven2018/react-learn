import { Themes } from '@shared/types/response-types';

enum StoredTerm {
  LastSearch = 'lastSearchTerm',
  Theme = 'userTheme',
  SelectedCharacters = 'selectedCharacters',
}

export class Term {
  public static getTermFromLS(): string | undefined {
    return localStorage.getItem(StoredTerm.LastSearch) ?? undefined;
  }

  public static setTermToLS(newTerm: string): void {
    localStorage.setItem(StoredTerm.LastSearch, newTerm);
  }

  public static getThemeFromLS(): keyof typeof Themes {
    return localStorage.getItem(StoredTerm.Theme) === Themes.light
      ? Themes.light
      : Themes.dark;
  }

  public static setThemeToLS(theme: keyof typeof Themes = Themes.dark): void {
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
