enum term {
  LastSearch = 'lastSearchTerm',
}
export class Term {
  public static getTermFromLS(): string | undefined {
    return localStorage.getItem(term.LastSearch) ?? undefined;
  }

  public static setTermToLS(newTerm: string): void {
    localStorage.setItem(term.LastSearch, newTerm);
  }
}
