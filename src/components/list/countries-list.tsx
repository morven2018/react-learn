import CountryTable from '../table/table';
import formatValue from '../../shared/utils/format-value';
import getAvailableColumns from '../../shared/utils/get-columns';
import getColumnLabel from '../../shared/utils/column-labels';
import styles from './countries-list.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectSelectedColumns } from '../../redux/selectors/column-selectors';
import { getChangedFields } from '../../shared/utils/compare-data';

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

const TIMEOUT = 100 * 15;

interface CountriesListProps {
  countries: Country[];
  onCountrySelect: (countryName: string) => void;
  selectedCountry: string | null;
  data: CO2Data;
  selectedYear: number;
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries,
  onCountrySelect,
  selectedCountry,
  data,
  selectedYear,
}) => {
  const countryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const shouldHighlight = useAppSelector(selectShouldHighlight);
  const previousYear = useAppSelector(selectPreviousYear);
  const currentYear = useAppSelector(selectSelectedYear);
  const selectedColumns = useAppSelector(selectSelectedColumns);
  const [changedFields, setChangedFields] = useState<
    Map<string, Set<DataColumn>>
  >(new Map());

  useEffect(() => {
    if (shouldHighlight && previousYear) {
      const changedMap = new Map<string, Set<DataColumn>>();
      const fieldsToCheck = getAvailableColumns();

      countries.forEach((country) => {
        const countryData = data[country.name]?.data || [];
        const changed = getChangedFields(
          countryData,
          currentYear,
          previousYear,
          fieldsToCheck
        );

        if (changed.size > 0) {
          changedMap.set(country.name, changed);
        }
      });

      setChangedFields(changedMap);

      const timer = setTimeout(() => {
        setChangedFields(new Map());
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
    }, TIMEOUT);
  };

  const setCountryRef =
    (countryName: string) => (el: HTMLDivElement | null) => {
      countryRefs.current[countryName] = el;
    };

  const getYearData = (countryName: string): YearlyData[] => {
    const countryData = data[countryName]?.data || [];
    return countryData.filter((d) => d.year === selectedYear);
  };

  const getFieldValue = (
    countryName: string,
    field: DataColumn
  ): string | number => {
    const yearData = getYearData(countryName)[0];
    return yearData?.[field] ?? 'N/A';
  };

  const isFieldChanged = (countryName: string, field: DataColumn): boolean => {
    return changedFields.get(countryName)?.has(field) || false;
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
      {countries.map((country) => {
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
              }`}
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

                  return (
                    <div
                      key={column}
                      className={`${styles.countryDetail} ${changed ? styles.changed : ''}`}
                    >
                      {`${getColumnLabel(column)}: ${formatValue(value)}`}
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

            {selectedCountry === country.name && (
              <div className={styles.fullContent}>
                <CountryTable
                  data={data[country.name]?.data || []}
                  columns={selectedColumns}
                />
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
