import { SortDirection, SortOption } from '../../redux/slice/sort-slice';
import { CO2Data, Country } from '../../shared/types/types';

export const sortCountries = (
  countries: Country[],
  data: CO2Data,
  currentYear: number,
  sortBy: SortOption,
  sortDirection: SortDirection
): Country[] => {
  const sorted = [...countries].sort((a, b) => {
    let valueA: string | number = 0;
    let valueB: string | number = 0;

    switch (sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;

      case 'population':
        valueA = getCountryPopulation(data, a.name, currentYear);
        valueB = getCountryPopulation(data, b.name, currentYear);
        break;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  return sorted;
};

export const getCountryPopulation = (
  data: CO2Data,
  countryName: string,
  year: number
): number => {
  const countryData = data[countryName]?.data || [];
  const yearData = countryData.find((d) => d.year === year);
  return yearData?.population ?? 0;
};
