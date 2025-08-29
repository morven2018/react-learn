export interface YearlyData {
  year: number;
  population?: number | null;
  co2?: number | null;
  co2_per_capita?: number | null;
  methane?: number | null;
  oil_co2?: number | null;
  temperature_change_from_co2?: number | null;
}

export interface CountryData {
  country: string;
  iso_code?: string;
  data: YearlyData[];
}

export interface CO2Data {
  [key: string]: CountryData;
}

export interface Country {
  name: string;
  iso_code: string;
  population: number | string;
}
