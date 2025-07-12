const term = 'lastSearchTerm';

export class Term {
  public static getTermFromLS(): string | undefined {
    return localStorage.getItem(term) ?? undefined;
  }

  public static setTemToLS(newTerm: string): void {
    localStorage.setItem(term, newTerm);
  }
}
