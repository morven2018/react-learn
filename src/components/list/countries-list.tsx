import CountryTable from '../table/table';
import SortControls from '../sort/sort-controls';
import formatValue from '../../shared/utils/format-value';
import getColumnLabel from '../../shared/utils/column-labels';
import styles from './countries-list.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { getPreviousValue, hasChanged } from '../../shared/utils/compare-data';
import { sortCountries } from '../sort/sort-utils';

import {
  selectSortBy,
  selectSortDirection,
} from '../../redux/selectors/sort-selectors';

import {
  CO2Data,
  Country,
  DataColumn,
  YearlyData,
} from '../../shared/types/types';
import {
  selectShouldHighlight,
  selectPreviousYear,
  selectSelectedYear,
} from '../../redux/selectors/year-selectors';

const TIMEOUT = 3000;
const OPEN_CLOSE_TIMEOUT = 100;

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries,
  onCountrySelect,
  selectedCountry,
  data,
}) => {
  const countryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const shouldHighlight = useAppSelector(selectShouldHighlight);
  const previousYear = useAppSelector(selectPreviousYear);
  const currentYear = useAppSelector(selectSelectedYear);
  const selectedColumns = useAppSelector(selectSelectedColumns);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);

  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sortedCountries = sortCountries(
    countries,
    data,
    currentYear,
    sortBy,
    sortDirection
  );

  useEffect(() => {
    if (!shouldHighlight || !previousYear) {
      setChangedFields(new Set());
      return;
    }

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    const newChangedFields = new Set<string>();

    countries.forEach((country) => {
      const countryData = data[country.name]?.data || [];
      const displayColumns = getDisplayColumns();

      const hasAnyChange = displayColumns.some((column) =>
        hasChanged(countryData, currentYear, previousYear, column)
      );

      if (hasAnyChange) {
        newChangedFields.add(country.name);
      }
    });

    setChangedFields(newChangedFields);

    highlightTimerRef.current = setTimeout(() => {
      setChangedFields(new Set());
    }, TIMEOUT);

    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, [shouldHighlight, previousYear, currentYear, countries, data]);

  useEffect(() => {
    setChangedFields(new Set());
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
  }, [selectedCountry]);

  const handleCountrySelect = (countryName: string) => {
    const isOpening = selectedCountry !== countryName;
    onCountrySelect(isOpening ? countryName : '');

    if (isOpening && countryRefs.current[countryName]) {
      setTimeout(() => {
        countryRefs.current[countryName]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, OPEN_CLOSE_TIMEOUT);
    }
  };

  const handleHideTable = (countryName: string) => {
    onCountrySelect('');
    setTimeout(() => {
      countryRefs.current[countryName]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, OPEN_CLOSE_TIMEOUT);
  };

  const setCountryRef =
    (countryName: string) => (el: HTMLDivElement | null) => {
      countryRefs.current[countryName] = el;
    };

  const getCountryData = (countryName: string): YearlyData[] => {
    return data[countryName]?.data || [];
  };

  const getFieldValue = (
    countryName: string,
    field: DataColumn
  ): string | number => {
    const countryData = getCountryData(countryName);
    const currentData = countryData.find((d) => d.year === currentYear);
    return currentData?.[field] ?? 'N/A';
  };

  const getPreviousFieldValue = (
    countryName: string,
    field: DataColumn
  ): string | number => {
    const countryData = getCountryData(countryName);
    return getPreviousValue(countryData, previousYear!, field);
  };

  const isFieldChanged = (countryName: string, field: DataColumn): boolean => {
    if (!previousYear || !changedFields.has(countryName)) return false;

    const countryData = getCountryData(countryName);
    return hasChanged(countryData, currentYear, previousYear, field);
  };

  const getDisplayColumns = (): DataColumn[] => {
    const baseColumns = [
      DataColumn.POPULATION,
      DataColumn.CO2,
      DataColumn.CO2_PER_CAPITA,
    ];

    const additionalColumns = selectedColumns.filter(
      (col) => !baseColumns.includes(col) && col !== DataColumn.YEAR
    );

    return [...baseColumns, ...additionalColumns];
  };

  return (
    <div className={styles.list}>
      <SortControls />
      {sortedCountries.map((country) => {
        const countryData = getCountryData(country.name);
        const sortedData = [...countryData].sort((a, b) => b.year - a.year);
        const previewData = sortedData.slice(0, 5);
        const hasMoreData = countryData.length > 5;
        const hasData = countryData.length > 0;
        const displayColumns = getDisplayColumns();

        return (
          <div
            key={country.name}
            className={styles.countryItem}
            ref={setCountryRef(country.name)}
          >
            <div
              className={`${styles.accordionHeader} ${
                selectedCountry === country.name ? styles.selected : ''
              } ${changedFields.has(country.name) ? styles.countryChanged : ''}`}
              onClick={() => handleCountrySelect(country.name)}
            >
              <div className={styles.countryInfo}>
                <div className={styles.countryName}>{country.name}</div>
                <div className={styles.countryDetails}>
                  {`ISO: ${country.iso_code}`}
                </div>

                {displayColumns.map((column) => {
                  const value = getFieldValue(country.name, column);
                  const changed = isFieldChanged(country.name, column);
                  const previousValue = getPreviousFieldValue(
                    country.name,
                    column
                  );

                  return (
                    <div
                      key={column}
                      className={`${styles.countryDetail} ${changed ? styles.changed : ''}`}
                    >
                      {`${getColumnLabel(column)}: ${formatValue(value)}`}
                      {changed && (
                        <span className={styles.previousValue}>
                          {` (was ${formatValue(previousValue)})`}
                        </span>
                      )}
                      {changed && (
                        <span className={styles.changeIndicator}>*</span>
                      )}
                    </div>
                  );
                })}
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
