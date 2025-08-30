export interface YearlyData {
  year: number;
  population?: number | null;
  co2?: number | null;
  co2_per_capita?: number | null;
  methane?: number | null;
  oil_co2?: number | null;
  temperature_change_from_co2?: number | null;
  cement_co2?: number | null;
  coal_co2?: number | null;
  gas_co2?: number | null;
  flaring_co2?: number | null;
  land_use_change_co2?: number | null;
  nitrous_oxide?: number | null;
  total_ghg?: number | null;
  [key: string]: number | null | undefined;
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

export enum DataColumn {
  YEAR = 'year',
  POPULATION = 'population',
  CO2 = 'co2',
  CO2_PER_CAPITA = 'co2_per_capita',
  METHANE = 'methane',
  OIL_CO2 = 'oil_co2',
  TEMPERATURE_CHANGE_FROM_CO2 = 'temperature_change_from_co2',
  CEMENT_CO2 = 'cement_co2',
  COAL_CO2 = 'coal_co2',
  GAS_CO2 = 'gas_co2',
  FLARING_CO2 = 'flaring_co2',
  LAND_USE_CHANGE_CO2 = 'land_use_change_co2',
  NITROUS_OXIDE = 'nitrous_oxide',
  TOTAL_GHG = 'total_ghg',
}
