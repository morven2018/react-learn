import { YearlyData } from '../types/types';

export const hasChanged = (
  countryData: YearlyData[],
  currentYear: number,
  previousYear: number
): boolean => {
  const current = countryData.find((d) => d.year === currentYear);
  const previous = countryData.find((d) => d.year === previousYear);

  if (!current || !previous) return false;

  return current.population !== previous.population;
};
