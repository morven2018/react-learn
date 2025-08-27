export interface YearlyData {
  year: number;
  population: number | null;
  co2: number | null;
  co2_per_capita: number | null;
}

export interface CountryData {
  iso_code: string | null;
  data: YearlyData[];
}

export interface CO2Data {
  [country: string]: CountryData;
}
