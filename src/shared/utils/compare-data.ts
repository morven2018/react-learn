import { DataColumn, YearlyData } from '../types/types';

export const hasChanged = (
  countryData: YearlyData[],
  currentYear: number,
  previousYear: number,
  field: DataColumn
): boolean => {
  const current = countryData.find((d) => d.year === currentYear)?.[field];
  const previous = countryData.find((d) => d.year === previousYear)?.[field];

  return current !== previous;
};

export const getChangedFields = (
  countryData: YearlyData[],
  currentYear: number,
  previousYear: number,
  fieldsToCheck: DataColumn[]
): Set<DataColumn> => {
  const changed = new Set<DataColumn>();

  fieldsToCheck.forEach((column) => {
    if (hasChanged(countryData, currentYear, previousYear, column)) {
      changed.add(column);
    }
  });

  return changed;
};

export const getPreviousValue = (
  countryData: YearlyData[],
  previousYear: number,
  field: DataColumn
): string | number => {
  const previous = countryData.find((d) => d.year === previousYear)?.[field];
  return previous ?? 'N/A';
};
