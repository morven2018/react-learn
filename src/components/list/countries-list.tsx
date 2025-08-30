import CountryTable from '../table/table';
import formatValue from '../../shared/utils/format-value';
import styles from './countries-list.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { CO2Data, Country, DataColumn } from '../../shared/types/types';
import { hasChanged } from '../../shared/utils/compare-data';

import {
  selectShouldHighlight,
  selectPreviousYear,
  selectSelectedYear,
} from '../../redux/selectors/year-selectors';

const TIMEOUT = 100 * 30;

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
  selectedColumns: DataColumn[];
  selectedYear: number;
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries,
  onCountrySelect,
  selectedCountry,
  data,
  selectedColumns,
}) => {
  const countryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const shouldHighlight = useAppSelector(selectShouldHighlight);
  const previousYear = useAppSelector(selectPreviousYear);
  const currentYear = useAppSelector(selectSelectedYear);
  const [changedCountries, setChangedCountries] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (shouldHighlight && previousYear) {
      const changed = new Set<string>();

      countries.forEach((country) => {
        const countryData = data[country.name]?.data || [];
        if (hasChanged(countryData, currentYear, previousYear)) {
          changed.add(country.name);
        }
      });

      setChangedCountries(changed);

      const timer = setTimeout(() => {
        setChangedCountries(new Set());
      }, TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [shouldHighlight, previousYear, currentYear, countries, data]);

  const handleCountrySelect = (countryName: string) => {
    const isOpening = selectedCountry !== countryName;
    onCountrySelect(isOpening ? countryName : '');

    if (isOpening && countryRefs.current[countryName]) {
      setTimeout(() => {
        countryRefs.current[countryName]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, TIMEOUT);
    }
  };

  const handleHideTable = (countryName: string) => {
    onCountrySelect('');
    setTimeout(() => {
      countryRefs.current[countryName]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 10000);
  };

  const setCountryRef =
    (countryName: string) => (el: HTMLDivElement | null) => {
      countryRefs.current[countryName] = el;
    };

  const getPopulationForYear = (countryName: string, year: number): string => {
    const countryData = data[countryName]?.data || [];
    const yearData = countryData.find((d) => d.year === year);
    return formatValue(yearData?.population ?? 'N/A');
  };

  const isCountryDataChanged = (countryName: string): boolean => {
    return changedCountries.has(countryName);
  };

  return (
    <div className={styles.list}>
      {countries.map((country) => {
        const countryData = data[country.name]?.data || [];
        const sortedData = [...countryData].sort((a, b) => b.year - a.year);
        const previewData = sortedData.slice(0, 5);
        const hasMoreData = countryData.length > 5;
        const hasData = countryData.length > 0;
        const dataChanged = isCountryDataChanged(country.name);

        const currentPopulation = getPopulationForYear(
          country.name,
          currentYear
        );
        const previousPopulation = previousYear
          ? getPopulationForYear(country.name, previousYear)
          : null;

        return (
          <div
            key={country.name}
            className={`${styles.countryItem} ${
              dataChanged ? styles.highlight : ''
            }`}
            ref={setCountryRef(country.name)}
          >
            <div
              className={`${styles.accordionHeader} ${
                selectedCountry === country.name ? styles.selected : ''
              }`}
              onClick={() => handleCountrySelect(country.name)}
            >
              <div className={styles.countryInfo}>
                <div className={styles.countryName}>{country.name}</div>
                <div className={styles.countryDetails}>
                  {`ISO: ${country.iso_code}`}
                </div>
                <div
                  className={`${styles.countryDetails} ${dataChanged && styles.changed}`}
                >
                  {`Population: ${currentPopulation}`}
                  {dataChanged && previousPopulation && (
                    <span className={styles.populationChange}>
                      {` (was ${previousPopulation})`}
                    </span>
                  )}
                </div>
              </div>
              <span className={styles.accordionIcon}>
                {selectedCountry === country.name ? '-' : '+'}
              </span>
            </div>

            {selectedCountry !== country.name && hasData && (
              <div className={styles.previewContent}>
                <CountryTable data={previewData} columns={selectedColumns} />

                {hasMoreData && (
                  <div className={styles.moreButton}>
                    <button onClick={() => handleCountrySelect(country.name)}>
                      More
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedCountry === country.name && hasData && (
              <div className={styles.fullContent}>
                <CountryTable data={sortedData} columns={selectedColumns} />

                <div className={styles.hideButton}>
                  <button onClick={() => handleHideTable(country.name)}>
                    Hide
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CountriesList;
