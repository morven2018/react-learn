export interface Person {
  _id: string;
  name: string;
  wikiUrl: string;
  race: string | null;
  birth: string | null;
  gender: string | null;
  death: string | null;
  hair: string | null;
  height: string | null;
  realm: string | null;
  spouse: string | null;
}

export interface PersonWithUrl extends Person {
  url: string;
}

export interface ApiResponse {
  docs: Person[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
