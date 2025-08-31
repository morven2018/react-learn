import CountryTable from '../table/table';
import RegionFilter from '../filter/region-filter';
import SearchBar from '../search/search-bar';
import SortControls from '../sort/sort-controls';
import formatValue from '../../shared/utils/format-value';
import getColumnLabel from '../../shared/utils/column-labels';
import getRegion from '../../shared/utils/get-region';
import styles from './countries-list.module.scss';
import { useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { getPreviousValue, hasChanged } from '../../shared/utils/compare-data';
import { sortCountries } from '../sort/sort-utils';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';

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
const INITIAL_YEAR = 2023;

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
}

const CountriesList: React.FC<CountriesListProps> = React.memo(
  ({
    countries,
    onCountrySelect,
    selectedCountry,
    data,
  }: CountriesListProps) => {
    const countryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const shouldHighlight = useAppSelector(selectShouldHighlight);
    const previousYear = useAppSelector(selectPreviousYear);
    const currentYear = useAppSelector(selectSelectedYear);
    const selectedColumns = useAppSelector(selectSelectedColumns);
    const sortBy = useAppSelector(selectSortBy);
    const sortDirection = useAppSelector(selectSortDirection);

    const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
    const [selectedRegion, setSelectedRegion] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

    const displayColumns = useMemo(() => {
      const baseColumns = [
        DataColumn.POPULATION,
        DataColumn.CO2,
        DataColumn.CO2_PER_CAPITA,
      ];

      const additionalColumns = selectedColumns.filter(
        (col) => !baseColumns.includes(col) && col !== DataColumn.YEAR
      );

      return [...baseColumns, ...additionalColumns];
    }, [selectedColumns]);

    const filteredCountries = useMemo(() => {
      const regionFiltered =
        selectedRegion === 'All'
          ? countries
          : countries.filter(
              (country) => getRegion(country.name) === selectedRegion
            );

      return regionFiltered.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [countries, selectedRegion, searchTerm]);

    const sortedCountries = useMemo(
      () =>
        sortCountries(
          filteredCountries,
          data,
          currentYear,
          sortBy,
          sortDirection
        ),
      [filteredCountries, data, currentYear, sortBy, sortDirection]
    );

    const handleRegionChange = useCallback((region: string) => {
      setSelectedRegion(region);
    }, []);

    const handleSearchChange = useCallback((term: string) => {
      setSearchTerm(term);
    }, []);

    const handleCountrySelect = useCallback(
      (countryName: string) => {
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
      },
      [selectedCountry, onCountrySelect]
    );

    const handleHideTable = useCallback(
      (countryName: string) => {
        onCountrySelect('');
        setTimeout(() => {
          countryRefs.current[countryName]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, OPEN_CLOSE_TIMEOUT);
      },
      [onCountrySelect]
    );

    const getCountryData = useCallback(
      (countryName: string): YearlyData[] => {
        return data[countryName]?.data || [];
      },
      [data]
    );

    const getFieldValue = useCallback(
      (countryName: string, field: DataColumn): string | number => {
        const countryData = getCountryData(countryName);
        const currentData = countryData.find((d) => d.year === currentYear);
        return currentData?.[field] ?? 'N/A';
      },
      [getCountryData, currentYear]
    );

    const getPreviousFieldValue = useCallback(
      (countryName: string, field: DataColumn): string | number => {
        const countryData = getCountryData(countryName);
        return getPreviousValue(
          countryData,
          previousYear ?? INITIAL_YEAR,
          field
        );
      },
      [getCountryData, previousYear]
    );

    const isFieldChanged = useCallback(
      (countryName: string, field: DataColumn): boolean => {
        if (!previousYear || !changedFields.has(countryName)) return false;
        const countryData = getCountryData(countryName);
        return hasChanged(countryData, currentYear, previousYear, field);
      },
      [previousYear, changedFields, getCountryData, currentYear]
    );

    const setCountryRef = useCallback(
      (countryName: string) => (el: HTMLDivElement | null) => {
        countryRefs.current[countryName] = el;
      },
      []
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

      filteredCountries.forEach((country) => {
        const countryData = data[country.name]?.data || [];

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
    }, [
      shouldHighlight,
      previousYear,
      currentYear,
      filteredCountries,
      data,
      displayColumns,
    ]);

    useEffect(() => {
      setChangedFields(new Set());
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
    }, [selectedCountry, selectedRegion]);

    const renderedCountries = useMemo(
      () =>
        sortedCountries.map((country) => {
          const countryData = getCountryData(country.name);
          const sortedData = [...countryData].sort((a, b) => b.year - a.year);
          const previewData = sortedData.slice(0, 5);
          const hasMoreData = countryData.length > 5;
          const hasData = countryData.length > 0;

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
                  <div className={styles.detailsWrapper}>
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
                          className={`${styles.countryDetails} ${changed ? styles.changed : ''}`}
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
        }),
      [
        sortedCountries,
        selectedCountry,
        changedFields,
        displayColumns,
        getCountryData,
        getFieldValue,
        isFieldChanged,
        getPreviousFieldValue,
        handleCountrySelect,
        handleHideTable,
        selectedColumns,
        setCountryRef,
      ]
    );

    return (
      <div className={styles.list}>
        <div className={styles.controlsWrapper}>
          <RegionFilter
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
        <SortControls />
        {!sortedCountries.length && (
          <p>{`No countries found. Please change region selection and/or searching term`}</p>
        )}
        {renderedCountries}
      </div>
    );
  }
);

CountriesList.displayName = 'CountriesList';

export default CountriesList;
